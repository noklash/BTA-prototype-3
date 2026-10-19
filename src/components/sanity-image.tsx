import type { ReactNode } from 'react'

import { buildContentImage } from '@/lib/sanity/image'
import type { SanityImageValue } from '@/types/content'
import { prototypeImage, type PrototypeImageKey } from '@/content/prototype-images'

export interface SanityImageProps {
  image: SanityImageValue | null | undefined
  /**
   * Alternative text. Used only when the editor did not supply their own;
   * callers should always pass something meaningful (the event title, the
   * activity name) so an image is never announced as unlabelled.
   */
  alt?: string
  /** `sizes` attribute; required for the browser to pick a sensible `srcSet` entry. */
  sizes?: string
  widths?: readonly number[]
  className?: string
  /** Rendered when there is no usable image asset. */
  fallback?: ReactNode
  /** Set for above-the-fold images so they are not lazily loaded. */
  priority?: boolean
  /**
   * When no CMS image is set, render the prototype's exact image URL for this
   * key instead (BTA-prototype-2/src/app/data.ts `photos`).
   */
  prototypeKey?: PrototypeImageKey
}

/**
 * Renders a Sanity-hosted image as a plain `` with a hand-built `srcSet`.
 *
 * Why not `next/image`: the Sanity CDN already resizes, crops, respects the
 * editor's hotspot and negotiates WebP, so routing the same derivatives through
 * the Next.js optimizer would re-encode every variant. It would also require an
 * `images.remotePatterns` allow-list, which is a second, easily-forgotten place
 * where image configuration can drift. See docs/architecture.md.
 *
 * When no CMS image asset is set and `prototypeKey` is given, renders the
 * prototype's exact Unsplash URL as a plain image so the site always shows the
 * reference imagery. Returns `fallback` (or nothing) when neither is available.
 */
export function SanityImage({
  image,
  alt = '',
  sizes = '100vw',
  widths,
  className = '',
  fallback = null,
  priority = false,
  prototypeKey,
}: SanityImageProps) {
  const contentImage = buildContentImage(image, { widths, fallbackAlt: alt })

  if (contentImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- see the component doc comment above
      <img
        src={contentImage.src}
        srcSet={contentImage.srcSet ?? undefined}
        sizes={sizes}
        alt={contentImage.alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    )
  }

  // No CMS image: fall back to the prototype's exact image URL.
  if (prototypeKey) {
    const url = prototypeImage(prototypeKey)
    if (url) {
      return (
        <img
          src={url}
          alt={alt}
          sizes={sizes}
          className={className}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )
    }
  }

  return <>{fallback}</>
}