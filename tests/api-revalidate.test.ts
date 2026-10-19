// @vitest-environment node
/**
 * The revalidation webhook is the mechanism that makes CMS edits appear
 * immediately instead of after the cache window expires. Its authentication and
 * tag mapping are therefore worth pinning down.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const cache = vi.hoisted(() => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}))

vi.mock('next/cache', () => cache)

const { GET, POST } = await import('@/app/api/revalidate/route')
const { CONTENT_TAGS } = await import('@/lib/sanity/queries')

const ENDPOINT = 'http://localhost/api/revalidate'
const SECRET = 'test-secret-value'

function post(body?: string, headers: Record<string, string> = { secret: SECRET }) {
  return new Request(`http://localhost/api/revalidate?secret=${headers.secret ?? ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  })
}

beforeEach(() => {
  cache.revalidateTag.mockReset()
  cache.revalidatePath.mockReset()
  vi.stubEnv('SANITY_REVALIDATE_SECRET', SECRET)
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('authentication', () => {
  it('refuses when the secret is not configured on the server', async () => {
    vi.stubEnv('SANITY_REVALIDATE_SECRET', '')

    const response = await POST(post())

    expect(response.status).toBe(503)
    expect(cache.revalidateTag).not.toHaveBeenCalled()
  })

  it('refuses a wrong secret', async () => {
    const response = await POST(post(undefined, { secret: 'wrong' }))

    expect(response.status).toBe(401)
    expect(cache.revalidateTag).not.toHaveBeenCalled()
  })

  it('accepts the secret from the x-sanity-webhook-secret header', async () => {
    const response = await POST(
      new Request(ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-sanity-webhook-secret': SECRET },
        body: JSON.stringify({ _type: 'event' }),
      }),
    )

    expect(response.status).toBe(200)
  })
})

describe('tag and path mapping', () => {
  it('revalidates the events tag for an event document', async () => {
    const response = await POST(post(JSON.stringify({ _type: 'event' })))
    const payload = (await response.json()) as { tags: string[] }

    expect(payload.tags).toEqual([CONTENT_TAGS.events])
    expect(cache.revalidateTag).toHaveBeenCalledWith(CONTENT_TAGS.events, { expire: 0 })
  })

  it('revalidates every tag it can when the document type is unknown', async () => {
    const response = await POST(post(JSON.stringify({ _type: 'mystery' })))
    const payload = (await response.json()) as { tags: string[] }

    expect(payload.tags.sort()).toEqual(Object.values(CONTENT_TAGS).sort())
  })

  it('treats a body-less ping as a full revalidation', async () => {
    const response = await POST(post())

    expect(response.status).toBe(200)
    expect(cache.revalidateTag).toHaveBeenCalledTimes(Object.values(CONTENT_TAGS).length)
  })

  it('revalidates the public paths, including the event detail segment', async () => {
    await POST(post(JSON.stringify({ _type: 'event' })))

    const paths = cache.revalidatePath.mock.calls.map((call) => call[0])
    expect(paths).toContain('/')
    expect(paths).toContain('/events')
    expect(paths).toContain('/events/[slug]')
  })

  it('flags singleton documents in the response', async () => {
    const response = await POST(post(JSON.stringify({ _type: 'homepage' })))
    const payload = (await response.json()) as { isSingleton: boolean }

    expect(payload.isSingleton).toBe(true)
  })
})

describe('GET /api/revalidate', () => {
  it('points the caller at POST', async () => {
    expect(GET().status).toBe(405)
  })
})
