import type { Metadata } from 'next'

import { BRAND_NAME, getSiteUrl } from './site'

/**
 * One place that builds the metadata for every page.
 *
 * Each page gets its own title and description, an absolute canonical URL, and
 * a complete Open Graph and Twitter card — including a generated social image —
 * so a shared link shows the BTA branding and the page it came from.
 */
export interface PageMetadataInput {
  /** The page title, without the site name. */
  title: string
  /** One or two sentences, used for the search result and the social card. */
  description: string
  /** The path of the page, used for the canonical URL and the social image. */
  path: string
  /** The social card type. `article` adds the published date and author. */
  type?: 'website' | 'article'
  /** ISO date, for an article card. */
  publishedTime?: string
  /** ISO date, for an article card. */
  modifiedTime?: string
  /** The people credited, for an article card. */
  authors?: string[]
  /** The topic, for an article card. */
  section?: string
  /** Extra search terms. */
  keywords?: string[]
  /** Keeps the page out of the index (the portal and the admin area). */
  noIndex?: boolean
  /** An explicit social image, when the page has one. */
  image?: string
}

/**
 * Builds the metadata for a page.
 *
 * The title template lives in the root layout, so a page only supplies its own
 * title here. The social image is generated per page by `/api/og`, which keeps
 * every link preview on brand without a separate asset per route.
 */
export function buildMetadata({
  title,
  description,
  path,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  section,
  keywords,
  noIndex,
  image,
}: PageMetadataInput): Metadata {
  const baseUrl = getSiteUrl()
  const url = new URL(path, baseUrl).toString()
  const socialImage = image ?? new URL(`/api/og?title=${encodeURIComponent(title)}`, baseUrl).toString()

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: BRAND_NAME,
      locale: 'en_GB',
      images: [{ url: socialImage, width: 1200, height: 630, alt: title }],
      ...(type === 'article'
        ? {
            publishedTime,
            modifiedTime,
            authors,
            section,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
  }
}
