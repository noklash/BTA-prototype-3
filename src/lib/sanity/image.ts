/**
 * Sanity image URL construction.
 *
 * The URL builder is created fresh for every URL so that chain state (width,
 * crop rectangle) can never leak from one image into the next — the builder
 * mutates itself and is normally reused across calls.
 *
 * The resulting `srcSet` is handed to a plain `<img>` in
 * `src/components/sanity-image.tsx`; see docs/architecture.md for why the
 * Next.js image optimizer is not used on top of Sanity's CDN transforms.
 */
import { createImageUrlBuilder, type ImageUrlBuilder } from '@sanity/image-url'

import type { SanityImageValue } from '@/types/content'

import { getSanityDataset, getSanityProjectId } from './env'

/** Default JPEG/WebP quality passed to the Sanity CDN. */
export const IMAGE_QUALITY = 78

/** Widths used for the generated `srcSet`, ascending. */
export const DEFAULT_IMAGE_WIDTHS: readonly number[] = [480, 768, 1024, 1440, 1920]

export interface ContentImage {
  /** Largest configured width; the fallback for browsers without `srcset` support. */
  src: string
  /** Responsive candidates, or `null` when only one width was requested. */
  srcSet: string | null
  /** Never empty for content images: falls back to the caller-provided alt or `''`. */
  alt: string
}

export interface BuildContentImageOptions {
  widths?: readonly number[]
  /** Used when the editor did not provide alternative text. */
  fallbackAlt?: string
  quality?: number
}

interface ResolvedImageSource {
  _type: 'image'
  asset: { _ref: string }
  crop?: SanityImageValue['crop']
  hotspot?: SanityImageValue['hotspot']
}

export function hasImageAsset(
  image: SanityImageValue | null | undefined,
): image is SanityImageValue & { asset: { _ref: string } } {
  return typeof image?.asset?._ref === 'string' && image.asset._ref.length > 0
}

function createBuilder(): ImageUrlBuilder | null {
  const projectId = getSanityProjectId()
  const dataset = getSanityDataset()

  if (!projectId || !dataset) {
    return null
  }

  return createImageUrlBuilder({ projectId, dataset })
}

function toImageSource(image: SanityImageValue & { asset: { _ref: string } }): ResolvedImageSource {
  return {
    _type: 'image',
    asset: { _ref: image.asset._ref },
    crop: image.crop ?? undefined,
    hotspot: image.hotspot ?? undefined,
  }
}

/**
 * Builds a single CDN URL at a given width.
 * Returns `null` when the image is empty or the project is not configured.
 */
export function buildImageUrl(
  image: SanityImageValue | null | undefined,
  width: number,
  quality: number = IMAGE_QUALITY,
): string | null {
  if (!hasImageAsset(image)) {
    return null
  }

  const builder = createBuilder()
  if (!builder) {
    return null
  }

  return builder.image(toImageSource(image)).width(width).auto('format').quality(quality).url()
}

/**
 * Builds the props needed to render a content image responsively.
 * Returns `null` when there is nothing usable to render, so callers can fall
 * back to a typographic placeholder instead of a broken image.
 */
export function buildContentImage(
  image: SanityImageValue | null | undefined,
  options: BuildContentImageOptions = {},
): ContentImage | null {
  if (!hasImageAsset(image)) {
    return null
  }

  const widths = (options.widths ?? DEFAULT_IMAGE_WIDTHS)
    .filter((width) => Number.isFinite(width) && width > 0)
    .sort((a, b) => a - b)

  if (widths.length === 0) {
    return null
  }

  const quality = options.quality ?? IMAGE_QUALITY
  const source = toImageSource(image)

  const candidates = widths.map((width) => {
    const builder = createBuilder()
    if (!builder) {
      return null
    }
    const url = builder.image(source).width(width).auto('format').quality(quality).url()
    return { width, url }
  })

  if (candidates.some((candidate) => candidate === null)) {
    return null
  }

  const usable = candidates as { width: number; url: string }[]
  const largest = usable[usable.length - 1]
  if (!largest) {
    return null
  }

  const alt = image.alt?.trim() || options.fallbackAlt?.trim() || ''

  return {
    src: largest.url,
    srcSet: usable.length > 1 ? usable.map(({ url, width }) => `${url} ${width}w`).join(', ') : null,
    alt,
  }
}
