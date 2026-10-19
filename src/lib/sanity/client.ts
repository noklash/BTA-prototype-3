/**
 * Server-side Sanity client.
 *
 * This module must only be imported from server components, route handlers or
 * the seed script. It reads `SANITY_API_READ_TOKEN`, which must never end up in
 * a client bundle.
 */
import { createClient, type SanityClient } from '@sanity/client'

import { assertSanityConfig } from './env'

let cachedClient: SanityClient | null = null

/**
 * Returns a memoised Sanity client configured for read-only, published content.
 *
 * The public API CDN is used for publicly readable datasets. As soon as a read
 * token is configured the CDN is disabled, because authenticated requests are
 * not cached by the CDN and would otherwise fail or leak the token into a
 * cacheable URL.
 */
export function getSanityClient(): SanityClient {
  if (cachedClient) {
    return cachedClient
  }

  const { projectId, dataset, apiVersion, token } = assertSanityConfig()

  cachedClient = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: token === undefined,
    // The public website only ever shows published documents.
    perspective: 'published',
  })

  return cachedClient
}

/** Test helper: drops the memoised client so that changed env vars take effect. */
export function resetSanityClient(): void {
  cachedClient = null
}
