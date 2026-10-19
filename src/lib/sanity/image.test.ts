import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { hasImageAsset, buildContentImage, buildImageUrl } from './image'

const ASSET_REF = 'image-9f4f5b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a-1200x800-jpg'

function image(alt: string | null = 'A photograph') {
  return {
    _type: 'image',
    asset: { _ref: ASSET_REF },
    alt,
  }
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'test-project')
  vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'production')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('hasImageAsset', () => {
  it.each([
    [null, false],
    [undefined, false],
    [{}, false],
    [{ asset: null }, false],
    [{ asset: {} }, false],
    [{ asset: { _ref: '' } }, false],
    [{ asset: { _ref: ASSET_REF } }, true],
  ])('handles %j', (input, expected) => {
    expect(hasImageAsset(input as never)).toBe(expected)
  })
})

describe('buildContentImage', () => {
  it('returns null when there is no asset', () => {
    expect(buildContentImage(null)).toBeNull()
    expect(buildContentImage({ alt: 'orphaned field' })).toBeNull()
  })

  it('builds a srcSet from the default widths', () => {
    const result = buildContentImage(image())

    expect(result).not.toBeNull()
    expect(result?.src).toContain('cdn.sanity.io/images/test-project/production/')
    expect(result?.src).toContain('w=1920')
    expect(result?.srcSet?.split(', ')).toHaveLength(5)
    expect(result?.srcSet).toContain('1920w')
  })

  it('honours a custom width list and sorts it ascending', () => {
    const result = buildContentImage(image(), { widths: [800, 400] })

    expect(result?.src).toContain('w=800')
    expect(result?.srcSet).toBeDefined()

    const widths = (result?.srcSet ?? '')
      .split(', ')
      .map((entry) => Number(entry.trim().split(' ')[1]?.replace('w', '')))

    expect(widths).toEqual([400, 800])
  })

  it('uses the editor-provided alternative text', () => {
    expect(buildContentImage(image('The old market hall'))?.alt).toBe('The old market hall')
  })

  it('falls back to the caller alt, then to an empty string', () => {
    expect(buildContentImage(image(null), { fallbackAlt: 'Event cover' })?.alt).toBe('Event cover')
    expect(buildContentImage(image('   '))?.alt).toBe('')
  })

  it('returns null when a width is unusable', () => {
    expect(buildContentImage(image(), { widths: [0, Number.NaN] })).toBeNull()
  })

  it('passes the quality setting through', () => {
    expect(buildContentImage(image(), { widths: [400], quality: 42 })?.src).toContain('q=42')
  })
})

describe('buildImageUrl', () => {
  it('builds a single absolute CDN URL', () => {
    const url = buildImageUrl(image(), 1200) ?? ''

    // The exact asset path is produced by @sanity/image-url, so only the parts
    // this project controls are asserted.
    expect(url.startsWith('https://cdn.sanity.io/images/test-project/production/')).toBe(true)
    expect(url).toContain('w=1200')
    expect(url).toContain('auto=format')
    expect(url).toContain('q=78')
    expect(url).toContain('1200x800')
  })

  it('returns null without an asset', () => {
    expect(buildImageUrl(null, 1200)).toBeNull()
  })
})

describe('when the Sanity project is not configured', () => {
  it('returns null instead of throwing', () => {
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', '')
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', '')

    expect(buildContentImage(image())).toBeNull()
    expect(buildImageUrl(image(), 800)).toBeNull()
  })
})
