import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { DEMO_DATA } from '@/lib/demo/data'
import { DemoProvider, useDemo } from '@/lib/demo/store'

const STORAGE_KEY = 'bta-prototype3-demo-v1'

function Harness() {
  const demo = useDemo()

  return (
    <div>
      <span data-testid="hydrated">{demo.hydrated ? 'yes' : 'no'}</span>
      <span data-testid="member">{demo.currentMember?.name ?? 'none'}</span>
      <span data-testid="dues">{demo.currentMember?.duesStatus ?? 'none'}</span>
      <span data-testid="feedback-count">{demo.data.feedback.length}</span>
      <span data-testid="transaction-count">{demo.data.transactions.length}</span>

      <button type="button" onClick={() => demo.login()}>
        sign in
      </button>
      <button type="button" onClick={() => demo.login('mem-004')}>
        sign in as four
      </button>
      <button type="button" onClick={() => demo.logout()}>
        sign out
      </button>
      <button type="button" onClick={() => demo.updateProfile({ name: 'Ada Updated' })}>
        rename
      </button>
      <button type="button" onClick={() => demo.payDues('inv-002')}>
        pay
      </button>
      <button
        type="button"
        onClick={() =>
          demo.submitFeedback({
            kind: 'Suggestion',
            subject: 'Test suggestion',
            message: 'A demonstration entry.',
            submittedBy: 'Ada Nwosu',
          })
        }
      >
        feedback
      </button>
    </div>
  )
}

async function renderHarness() {
  const user = userEvent.setup()
  render(
    <DemoProvider>
      <Harness />
    </DemoProvider>,
  )

  await waitFor(() => expect(screen.getByTestId('hydrated').textContent).toBe('yes'))
  return user
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('demonstration store', () => {
  it('starts signed out and signs the demonstration member in and out', async () => {
    const user = await renderHarness()

    expect(screen.getByTestId('member').textContent).toBe('none')

    await user.click(screen.getByRole('button', { name: 'sign in' }))
    expect(screen.getByTestId('member').textContent).toBe('Ada Nwosu')

    await user.click(screen.getByRole('button', { name: 'sign out' }))
    expect(screen.getByTestId('member').textContent).toBe('none')
  })

  it('updates the signed-in profile and persists it to local storage', async () => {
    const user = await renderHarness()

    await user.click(screen.getByRole('button', { name: 'sign in' }))
    await user.click(screen.getByRole('button', { name: 'rename' }))

    expect(screen.getByTestId('member').textContent).toBe('Ada Updated')

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEY)).toContain('Ada Updated')
    })
  })

  it('records a simulated dues payment, receipt and updated statuses', async () => {
    const user = await renderHarness()

    const before = Number(screen.getByTestId('transaction-count').textContent)

    await user.click(screen.getByRole('button', { name: 'sign in as four' }))
    expect(screen.getByTestId('dues').textContent).toBe('Due')

    await user.click(screen.getByRole('button', { name: 'pay' }))

    expect(screen.getByTestId('dues').textContent).toBe('Paid')
    expect(Number(screen.getByTestId('transaction-count').textContent)).toBe(before + 1)
  })

  it('adds a submitted feedback entry to the admin queue', async () => {
    const user = await renderHarness()

    const before = Number(screen.getByTestId('feedback-count').textContent)
    expect(before).toBe(DEMO_DATA.feedback.length)

    await user.click(screen.getByRole('button', { name: 'feedback' }))

    expect(Number(screen.getByTestId('feedback-count').textContent)).toBe(before + 1)
  })
})
