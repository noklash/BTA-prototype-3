/**
 * The single place where the website talks to Sanity.
 *
 * Every read goes through {@link fetchContent}, which never throws: callers get
 * a discriminated union so that a missing configuration or an unreachable
 * Content Lake turns into a rendered error state instead of a hard failure or,
 * worse, silently substituted placeholder content.
 */
import type { QueryParams } from '@sanity/client'

import { getSanityClient } from './client'
import { SanityConfigError } from './errors'

/** Why the content request failed. */
export type ContentFailureReason =
  /** Required environment variables are missing or incomplete. */
  | 'not-configured'
  /** The Content Lake could not be reached, or returned an error. */
  | 'unavailable'

export interface ContentFailure {
  ok: false
  reason: ContentFailureReason
  /** Human-readable message that is safe to render in the UI. */
  message: string
}

export type ContentResult<T> = { ok: true; value: T; stale?: boolean } | ContentFailure

export interface FetchContentOptions {
  /** Cache lifetime in seconds, or `false` to always fetch fresh content. */
  revalidate?: number | false
  /** Cache tags used by the on-demand revalidation webhook. */
  tags?: string[]
}

/** Default cache lifetime for published content. */
export const DEFAULT_REVALIDATE_SECONDS = 120

export interface FetchContentArgs {
  query: string
  params?: QueryParams
  options?: FetchContentOptions
  /** Used in server logs to identify which query failed. */
  label: string
}

/**
 * The last successful response for each query, kept in the server process.
 *
 * A Content Lake outage must not replace a live page with an error box: the
 * site keeps serving the most recent content it managed to read, which is what
 * a visitor sees during a short network incident. The entry is replaced as soon
 * as a fetch succeeds again, so the cache never serves old content once the CMS
 * is reachable.
 */
const lastKnownGood = new Map<string, unknown>()

function cacheKey(label: string, params?: QueryParams): string {
  if (!params || Object.keys(params).length === 0) {
    return label
  }

  return `${label}:${JSON.stringify(params)}`
}

export async function fetchContent<T>({
  query,
  params,
  options,
  label,
}: FetchContentArgs): Promise<ContentResult<T>> {
  const key = cacheKey(label, params)

  try {
    const client = getSanityClient()
    const revalidate = options?.revalidate ?? DEFAULT_REVALIDATE_SECONDS

    const value = await client.fetch<T>(
      query,
      params ?? {},
      revalidate === false
        ? { cache: 'no-store' }
        : { next: { revalidate, tags: options?.tags } },
    )

    lastKnownGood.set(key, value)

    return { ok: true, value }
  } catch (error) {
    if (error instanceof SanityConfigError) {
      return { ok: false, reason: 'not-configured', message: error.message }
    }

    // Server-side log only. The raw error may contain a query or dataset name,
    // so it is never forwarded to the browser. Client fetch failures often bury
    // the useful detail (DNS, TLS, timeout) in `error.cause`, so the whole
    // chain is logged, not just the outer message.
    console.error(`[sanity] ${label} failed:`, describeErrorChain(error))

    // Serve the last content this process read successfully, so a transient
    // outage degrades to slightly stale content rather than an error page.
    if (lastKnownGood.has(key)) {
      console.warn(`[sanity] ${label} serving the last known good content`)

      return { ok: true, value: lastKnownGood.get(key) as T, stale: true }
    }

    return {
      ok: false,
      reason: 'unavailable',
      message:
        'We could not load the latest content from the content management system. Please try again in a moment.',
    }
  }
}

/**
 * Flattens an error and its `cause` chain into one log line, e.g.
 * `"fetch failed" ← "getaddrinfo ENOTFOUND api.sanity.io"`. Depth is capped so
 * a cyclic or pathologically deep chain cannot make logging loop forever.
 */
function describeErrorChain(error: unknown, maxDepth = 4): string {
  const parts: string[] = []
  let current: unknown = error

  for (let depth = 0; depth < maxDepth && current !== null && current !== undefined; depth += 1) {
    parts.push(current instanceof Error ? current.message : String(current))
    current = current instanceof Error ? current.cause : undefined
  }

  return parts.join(' ← ')
}

/**
 * Narrows a content result to its value, or `null` when it failed.
 *
 * Useful for optional sections that simply disappear when their data is
 * missing, instead of blocking the whole page.
 */
export function valueOrNull<T>(result: ContentResult<T>): T | null {
  return result.ok ? result.value : null
}
