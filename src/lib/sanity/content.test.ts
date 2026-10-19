/**
 * The content layer must fail loudly-but-gracefully when the Sanity
 * configuration is missing: a typed failure, never a thrown exception and never
 * substitute content. This file deliberately does *not* mock the client, so the
 * real `getSanityClient` is exercised.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getSiteSettings } from './content'
import { resetSanityClient } from './client'
import { fetchContent } from './fetch'

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', '')
  vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', '')
  vi.stubEnv('SANITY_API_READ_TOKEN', '')
  resetSanityClient()
})

afterEach(() => {
  vi.unstubAllEnvs()
  resetSanityClient()
})

describe('when Sanity is not configured', () => {
  it('returns a not-configured failure instead of throwing', async () => {
    const result = await fetchContent({ query: '*', label: 'test' })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toBe('not-configured')
      expect(result.message).toContain('NEXT_PUBLIC_SANITY_PROJECT_ID')
    }
  })

  it('surfaces the same failure through the content API', async () => {
    const result = await getSiteSettings()

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.reason).toBe('not-configured')
    }
  })
})
