import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { MembershipForm } from '@/components/membership-form'
import { MEMBERSHIP_DEMONSTRATION_SUCCESS_MESSAGE } from '@/lib/validation/membership'

const VALID = {
  name: 'Ada Lovelace',
  email: 'ada@example.org',
  message: 'I would like to join the association, please.',
}

function mockFetch(response: { status: number; body: unknown } | Error) {
  const fetchMock =
    response instanceof Error
      ? vi.fn().mockRejectedValue(response)
      : vi.fn().mockResolvedValue(
          new Response(JSON.stringify(response.body), {
            status: response.status,
            headers: { 'content-type': 'application/json' },
          }),
        )

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

async function fillForm(user: ReturnType<typeof userEvent.setup>, values = VALID) {
  await user.type(screen.getByLabelText('Your name'), values.name)
  await user.type(screen.getByLabelText('Email address'), values.email)
  await user.type(screen.getByLabelText('Your message'), values.message)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('MembershipForm', () => {
  it('labels every field and states that the form is a demonstration', () => {
    render(<MembershipForm />)

    expect(screen.getByLabelText('Your name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    expect(screen.getByLabelText('Your message')).toBeInTheDocument()
    expect(screen.getByText('Demonstration form.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Express interest' })).toBeEnabled()
  })

  it('validates locally and does not call the server when input is invalid', async () => {
    const user = userEvent.setup()
    const fetchMock = mockFetch({ status: 200, body: { ok: true } })

    render(<MembershipForm />)
    const nameInput = screen.getByLabelText('Your name')
    const emailInput = screen.getByLabelText('Email address')
    const messageInput = screen.getByLabelText('Your message')
    await user.type(nameInput, 'A')
    await user.type(emailInput, 'not-an-email')
    await user.type(messageInput, 'hi')
    await user.click(screen.getByRole('button', { name: 'Express interest' }))

    expect(fetchMock).not.toHaveBeenCalled()
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please correct the highlighted fields and submit again.',
    )
    expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('That does not look like a valid email address.')).toBeInTheDocument()
  })

  it('associates each error message with its input', async () => {
    const user = userEvent.setup()

    render(<MembershipForm />)
    const nameInput = screen.getByLabelText('Your name')
    const emailInput = screen.getByLabelText('Email address')
    const messageInput = screen.getByLabelText('Your message')
    await user.type(nameInput, 'Ada Lovelace')
    await user.type(messageInput, 'A long enough message for the form.')
    await user.click(screen.getByRole('button', { name: 'Express interest' }))

    const describedBy = emailInput.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      'Please enter an email address so we can reply.',
    )
  })

  it('posts the normalised values and reports the demonstration outcome on success', async () => {
    const user = userEvent.setup()
    const fetchMock = mockFetch({
      status: 200,
      body: {
        ok: true,
        demonstration: true,
        message: MEMBERSHIP_DEMONSTRATION_SUCCESS_MESSAGE,
      },
    })

    render(<MembershipForm />)
    await fillForm(user, { ...VALID, name: '  Ada Lovelace  ' })
    await user.click(screen.getByRole('button', { name: 'Express interest' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('/api/membership-inquiry')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body as string)).toEqual(VALID)

    expect(await screen.findByRole('status')).toHaveTextContent(
      MEMBERSHIP_DEMONSTRATION_SUCCESS_MESSAGE,
    )
    // The form is cleared so the same inquiry is not submitted twice.
    expect(screen.getByLabelText('Your name')).toHaveValue('')
  })

  it('surfaces per-field errors returned by the server', async () => {
    const user = userEvent.setup()
    mockFetch({
      status: 422,
      body: {
        ok: false,
        message: 'Some details need attention before this inquiry can be submitted.',
        errors: { email: 'That address is already on the register.' },
      },
    })

    render(<MembershipForm />)
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'Express interest' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Some details need attention before this inquiry can be submitted.',
    )
    expect(screen.getByText('That address is already on the register.')).toBeInTheDocument()
  })

  it('reports an unreachable server without claiming success', async () => {
    const user = userEvent.setup()
    mockFetch(new TypeError('Failed to fetch'))

    render(<MembershipForm />)
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'Express interest' }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('the server was unreachable')
    expect(alert).not.toHaveTextContent('nothing was stored')
  })

  it('disables the submit button while the request is in flight', async () => {
    const user = userEvent.setup()
    let resolveRequest: (value: Response) => void = () => {}
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(
        () => new Promise<Response>((resolve) => {
          resolveRequest = resolve
        }),
      ),
    )

    render(<MembershipForm />)
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: 'Express interest' }))

    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled()

    resolveRequest(
      new Response(JSON.stringify({ ok: true, demonstration: true, message: 'done' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )

    await waitFor(() => expect(screen.getByRole('button', { name: 'Express interest' })).toBeEnabled())
  })
})
