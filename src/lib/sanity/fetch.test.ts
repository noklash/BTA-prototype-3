import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchContent, valueOrNull, DEFAULT_REVALIDATE_SECONDS } from './fetch'

const mocks = vi.hoisted(() => ({
  fetch: vi.fn(),
}))

// The client is replaced so these tests never touch the network. The real
// client construction is covered by `env.test.ts` and by the running app.
vi.mock('./client', () => ({
  getSanityClient: () => ({ fetch: mocks.fetch }),
  resetSanityClient: () => {},
}))

beforeEach(() => {
  mocks.fetch.mockReset()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('fetchContent', () => {
  it('returns the value on success', async () => {
    mocks.fetch.mockResolvedValue({ title: 'The Heritage Circle' })

    const result = await fetchContent<{ title: string }>({
      query: '*[_type == "siteSettings"][0]',
      label: 'test',
    })

    expect(result).toEqual({ ok: true, value: { title: 'The Heritage Circle' } })
  })

  it('passes the default revalidation window and tags to Next.js', async () => {
    mocks.fetch.mockResolvedValue(null)

    await fetchContent({
      query: '*',
      params: { slug: 'spring-fete' },
      options: { tags: ['events'] },
      label: 'test',
    })

    expect(mocks.fetch).toHaveBeenCalledWith('*', { slug: 'spring-fete' }, {
      next: { revalidate: DEFAULT_REVALIDATE_SECONDS, tags: ['events'] },
    })
  })

  it('opts out of the cache when revalidate is false', async () => {
    mocks.fetch.mockResolvedValue(null)

    await fetchContent({ query: '*', options: { revalidate: false }, label: 'test' })

    expect(mocks.fetch).toHaveBeenCalledWith('*', {}, { cache: 'no-store' })
  })

  it('reports an unavailable CMS rather than throwing', async () => {
    mocks.fetch.mockRejectedValue(new Error('getaddrinfo ENOTFOUND api.sanity.io'))

    const result = await fetchContent({ query: '*', label: 'eventsQuery' })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toBe('unavailable')
      // The message is safe to render: it contains no query, host or token.
      expect(result.message).not.toContain('ENOTFOUND')
      expect(result.message).not.toContain('api.sanity.io')
    }
  })

  it('logs the failing query label server-side', async () => {
    mocks.fetch.mockRejectedValue(new Error('boom'))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await fetchContent({ query: '*', label: 'aboutPageQuery' })

    expect(errorSpy).toHaveBeenCalledWith('[sanity] aboutPageQuery failed:', 'boom')
  })
})

describe('valueOrNull', () => {
  it('unwraps a successful result', () => {
    expect(valueOrNull({ ok: true, value: 42 })).toBe(42)
  })

  it('returns null for a failed result', () => {
    expect(valueOrNull({ ok: false, reason: 'unavailable', message: 'nope' })).toBeNull()
  })
})
