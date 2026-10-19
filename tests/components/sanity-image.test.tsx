import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SanityImage } from '@/components/sanity-image'
import type { SanityImageValue } from '@/types/content'

const ASSET_REF = 'image-9f4f5b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a-1200x800-jpg'

function image(alt: string | null = 'A photograph'): SanityImageValue {
  return { _type: 'image', asset: { _ref: ASSET_REF }, alt }
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', 'test-project')
  vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', 'production')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('SanityImage', () => {
  it('renders a responsive image from the Sanity CDN', () => {
    render(
      <SanityImage
        image={image('The old market hall')}
        sizes="(min-width: 1024px) 50vw, 100vw"
        widths={[400, 800]}
        className="h-full w-full object-cover"
      />,
    )

    const img = screen.getByRole('img')

    // Plain `<img>`, not `next/image`: see the component doc comment.
    expect(img.tagName).toBe('IMG')
    expect(img).toHaveAttribute('alt', 'The old market hall')
    expect(img).toHaveAttribute('sizes', '(min-width: 1024px) 50vw, 100vw')
    expect(img).toHaveAttribute('class', 'h-full w-full object-cover')
    expect(img.getAttribute('src')).toContain('cdn.sanity.io/images/test-project/production/')
    // `src` targets the largest configured width.
    expect(img.getAttribute('src')).toContain('w=800')

    const srcSet = img.getAttribute('srcSet') ?? ''
    expect(srcSet).toContain('400w')
    expect(srcSet).toContain('800w')
  })

  it('lazy-loads by default and eagerly loads priority images', () => {
    const { unmount } = render(<SanityImage image={image()} />)
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy')
    expect(screen.getByRole('img')).toHaveAttribute('decoding', 'async')
    unmount()

    render(<SanityImage image={image()} priority />)
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'eager')
  })

  it('falls back to the caller-supplied alt text when the editor left it empty', () => {
    render(<SanityImage image={image(null)} alt="Spring Heritage Walk" />)

    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Spring Heritage Walk')
  })

  it('renders the fallback when the image field has no asset', () => {
    render(<SanityImage image={{ _type: 'image', alt: 'added later' }} fallback={<span>Event</span>} />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('Event')).toBeInTheDocument()
  })

  it('renders nothing when there is neither an image nor a fallback', () => {
    const { container } = render(<SanityImage image={null} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the fallback instead of a broken image when Sanity is not configured', () => {
    vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', '')
    vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', '')

    render(<SanityImage image={image()} fallback={<span>Event</span>} />)

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('Event')).toBeInTheDocument()
  })
})
