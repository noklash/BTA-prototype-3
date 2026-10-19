import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { assertSanityConfig, isSanityConfigured, SANITY_API_VERSION_FALLBACK } from './env'
import { SanityConfigError } from './errors'

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', '')
  vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', '')
  vi.stubEnv('NEXT_PUBLIC_SANITY_API_VERSION', '')
  vi.stubEnv('SANITY_API_READ_TOKEN', '')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('isSanityConfigured', () => {
  it('is false when both required variables are empty', () => {
    expect(isSanityConfigured()).toBe(false)
  })

  it('is false when only one required variable is set', () => {
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'abc123')
    expect(isSanityConfigured()).toBe(false)
  })

  it('treats whitespace-only values as missing', () => {
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', '   ')
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', '\t')
    expect(isSanityConfigured()).toBe(false)
  })

  it('is true when both are set', () => {
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'abc123')
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'production')
    expect(isSanityConfigured()).toBe(true)
  })
})

describe('assertSanityConfig', () => {
  it('throws a SanityConfigError naming the missing variables', () => {
    try {
      assertSanityConfig()
      expect.unreachable('assertSanityConfig should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(SanityConfigError)
      expect((error as Error).message).toContain('NEXT_PUBLIC_SANITY_PROJECT_ID')
      expect((error as Error).message).toContain('NEXT_PUBLIC_SANITY_DATASET')
    }
  })

  it('trims values and applies the API version fallback', () => {
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', '  abc123  ')
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', ' production ')

    expect(assertSanityConfig()).toEqual({
      projectId: 'abc123',
      dataset: 'production',
      apiVersion: SANITY_API_VERSION_FALLBACK,
      token: undefined,
    })
  })

  it('never exposes the read token through the public configuration check', () => {
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'abc123')
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'production')
    vi.stubEnv('SANITY_API_READ_TOKEN', 'sk-secret')

    expect(assertSanityConfig().token).toBe('sk-secret')
  })
})
