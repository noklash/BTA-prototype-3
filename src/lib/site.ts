/**
 * Site-level constants that are not content.
 *
 * `BRAND_NAME` is the identity of this application (used for the browser tab
 * title template, structured metadata and error pages). Everything a content
 * editor should be able to change — the displayed organization name, tagline,
 * logo, contact details — lives in Sanity instead (`siteSettings`).
 */
export const BRAND_NAME = 'Bainbo Taria Awo  '

export const BRAND_DESCRIPTION =
  'A fictional community association website demonstrating a Next.js and Sanity CMS integration.'

/** Shown in the site footer so the demonstration is never mistaken for the real organization. */
export const DEMONSTRATION_NOTICE =
  'Bainbo Taria Awo   is a fictional organisation created for a portfolio demonstration. It is not affiliated with any real association.'

/**
 * The note carried by every inner page, above the content.
 *
 * It repeats the reference prototype's own wording, so the page states once
 * that its figures and documents are illustrative. The organisation-level
 * statement lives in the footer only, and is not repeated on every page.
 */
export const PROTOTYPE_NOTE =
  'Prototype content — names, dates, figures and documents are illustrative and will be replaced with verified BTA information.'

/** Default `metadataBase`, used when `NEXT_PUBLIC_SITE_URL` is not set. */
export const DEFAULT_SITE_URL = 'http://localhost:3000'

/**
 * Absolute site URL, used for `metadataBase`, canonical URLs and the sitemap.
 * Trailing slashes are removed so that `new URL()` concatenation is predictable.
 */
export function getSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const value = configured && configured.length > 0 ? configured : DEFAULT_SITE_URL

  try {
    return new URL(value)
  } catch {
    return new URL(DEFAULT_SITE_URL)
  }
}