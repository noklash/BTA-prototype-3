import type { Metadata, Viewport } from 'next'
import { metadata as studioMetadata, viewport as studioViewport } from 'next-sanity/studio'

import { StudioRoute } from './studio-route'

/**
 * Sanity Studio, embedded at `/studio`.
 *
 * The route segment config and metadata must live in this server component; the
 * Studio itself is rendered by a client component (`studio-route.tsx`) because
 * it needs the browser to load.
 *
 * `force-dynamic` keeps the Studio out of the prerender pass: it must never be
 * statically generated, and it must not be cached by a CDN.
 */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  ...studioMetadata,
  title: 'Content Studio',
}

export const viewport: Viewport = studioViewport

export default function StudioPage() {
  return <StudioRoute />
}
