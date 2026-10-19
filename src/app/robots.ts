import type { MetadataRoute } from 'next'

import { getSiteUrl } from '@/lib/site'

/**
 * The Studio (`/studio`) is disallowed: it is an editor tool, and its metadata
 * already sets `noindex`. The members' portal and the admin area are also
 * disallowed: they are behind a simulated sign-in and marked `noindex`, so they
 * should never be crawled. Everything else is crawlable.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/studio', '/api/', '/portal', '/admin'],
      },
    ],
    sitemap: new URL('/sitemap.xml', baseUrl).toString(),
  }
}
