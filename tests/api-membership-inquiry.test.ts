// @vitest-environment node
/**
 * The membership inquiry endpoint is the only state-changing route in the
 * project. It validates input and reports honestly that nothing is persisted.
 */
import { describe, expect, it, vi } from 'vitest'

import { GET, POST } from '@/app/api/membership-inquiry/route'
import type { MembershipInquiryResponse } from '@/lib/validation/membership'

const ENDPOINT = 'http://localhost/api/membership-inquiry'

function post(body: string | undefined, contentType: string | null = 'application/json') {
  return new Request(ENDPOINT, {
    method: 'POST',
    headers: contentType ? { 'content-type': contentType } : undefined,
    body,
  })
}

async function readJson(response: Response): Promise<MembershipInquiryResponse> {
  return (await response.json()) as MembershipInquiryResponse
}

describe('POST /api/membership-inquiry', () => {
  it('accepts a valid inquiry and says plainly that nothing was delivered', async () => {
    const response = await POST(
      post(
        JSON.stringify({
          name: 'Ada Lovelace',
          email: 'ada@example.org',
          message: 'I would like to join the association, please.',
        }),
      ),
    )

    expect(response.status).toBe(200)

    const payload = await readJson(response)
    expect(payload.ok).toBe(true)
    if (payload.ok) {
      expect(payload.demonstration).toBe(true)
      expect(payload.message).toContain('nothing was stored')
      expect(payload.message).toContain('no email was sent')
    }
  })

  it('returns per-field validation errors with a 422', async () => {
    const response = await POST(
      post(JSON.stringify({ name: '', email: 'nope', message: 'x' })),
    )

    expect(response.status).toBe(422)

    const payload = await readJson(response)
    expect(payload.ok).toBe(false)
    if (!payload.ok) {
      expect(Object.keys(payload.errors ?? {}).sort()).toEqual(['email', 'message', 'name'])
    }
  })

  it('rejects a non-JSON content type with a 415', async () => {
    const response = await POST(post('name=Ada', 'application/x-www-form-urlencoded'))

    expect(response.status).toBe(415)
    expect((await readJson(response)).ok).toBe(false)
  })

  it('rejects a malformed JSON body with a 400', async () => {
    const response = await POST(post('{not json'))

    expect(response.status).toBe(400)
    expect((await readJson(response)).ok).toBe(false)
  })

  it('treats a non-object JSON body as empty input rather than crashing', async () => {
    const response = await POST(post('"just a string"'))

    expect(response.status).toBe(422)
    expect((await readJson(response)).ok).toBe(false)
  })

  it('does not log the submitted personal data', async () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

    await POST(
      post(
        JSON.stringify({
          name: 'Grace Hopper',
          email: 'grace@example.org',
          message: 'Please add me to the register of interested members.',
        }),
      ),
    )

    const logged = infoSpy.mock.calls.flat().join(' ')
    expect(logged).not.toContain('grace@example.org')
    expect(logged).not.toContain('Grace Hopper')
    expect(logged).toContain('nothing was stored')
  })
})

describe('GET /api/membership-inquiry', () => {
  it('is explicit that only POST is supported', async () => {
    const response = GET()

    expect(response.status).toBe(405)
    expect(response.headers.get('Allow')).toBe('POST')
  })
})
