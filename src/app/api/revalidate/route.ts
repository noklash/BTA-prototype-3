import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { CONTENT_TAGS } from '@/lib/sanity/queries'
import { SINGLETON_DOCUMENT_TYPES } from '@/lib/sanity/env'

/**
 * `POST /api/revalidate`
 *
 * On-demand revalidation webhook for Sanity. Pages are cached with a
 * time-based `revalidate` window (see `DEFAULT_REVALIDATE_SECONDS`), and this
 * endpoint lets an editor make a change appear immediately instead of waiting
 * for that window to expire.
 *
 * Configure once per dataset:
 *   1. Generate a secret:            node -e "console.log(crypto.randomUUID())"
 *   2. Add it to the environment as:  SANITY_REVALIDATE_SECRET
 *   3. In Sanity, create a webhook pointing at
 *      https://<your-domain>/api/revalidate?secret=<the same value>
 *      with the "Create", "Update" and "Delete" filters enabled, and the
 *      projection `{_type}`.
 *
 * Responses:
 *  - `200` `{ revalidated: true, tags, paths }`
 *  - `401` when the secret is missing or does not match
 *  - `503` when `SANITY_REVALIDATE_SECRET` is not configured on the server
 */

const REVALIDATED_PATHS = ['/', '/about', '/events', '/membership']

/** Maps a document type onto the cache tags it can affect. */
function tagsForDocumentType(documentType: string | undefined): string[] {
  switch (documentType) {
    case 'event':
      return [CONTENT_TAGS.events]
    case 'featuredActivity':
      return [CONTENT_TAGS.homepage, CONTENT_TAGS.events]
    case 'homepage':
      return [CONTENT_TAGS.homepage]
    case 'aboutPage':
      return [CONTENT_TAGS.aboutPage]
    case 'siteSettings':
      return [CONTENT_TAGS.siteSettings, CONTENT_TAGS.homepage, CONTENT_TAGS.aboutPage]
    default:
      return Object.values(CONTENT_TAGS)
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET?.trim()

  if (!expectedSecret) {
    return NextResponse.json(
      {
        revalidated: false,
        message:
          'On-demand revalidation is not configured. Set SANITY_REVALIDATE_SECRET to enable it.',
      },
      { status: 503 },
    )
  }

  const providedSecret =
    request.headers.get('x-sanity-webhook-secret') ??
    new URL(request.url).searchParams.get('secret')

  if (providedSecret !== expectedSecret) {
    return NextResponse.json(
      { revalidated: false, message: 'Invalid revalidation secret.' },
      { status: 401 },
    )
  }

  // Sanity webhooks send the projected document as the request body; a plain
  // ping with no body still performs a full revalidation.
  let documentType: string | undefined
  try {
    const payload: unknown = await request.json()
    if (typeof payload === 'object' && payload !== null && '_type' in payload) {
      const type = (payload as { _type?: unknown })._type
      documentType = typeof type === 'string' ? type : undefined
    }
  } catch {
    documentType = undefined
  }

  const tags = tagsForDocumentType(documentType)

  for (const tag of tags) {
    // `{ expire: 0 }` expires the tagged cache entries immediately, which is
    // what an editor pressing "Publish" expects. (Next.js 16 requires an
    // explicit cache-life profile here.)
    revalidateTag(tag, { expire: 0 })
  }

  // Event detail pages are addressed by slug, so the whole segment is
  // revalidated rather than trying to resolve the slug from the payload. A
  // deleted document therefore also stops being served.
  for (const path of REVALIDATED_PATHS) {
    revalidatePath(path)
  }
  revalidatePath('/events/[slug]', 'page')

  return NextResponse.json({
    revalidated: true,
    documentType: documentType ?? null,
    isSingleton: documentType ? SINGLETON_DOCUMENT_TYPES.includes(documentType) : false,
    tags,
    paths: [...REVALIDATED_PATHS, '/events/[slug]'],
    revalidatedAt: new Date().toISOString(),
  })
}

export function GET(): NextResponse {
  return NextResponse.json(
    { revalidated: false, message: 'Use POST to trigger revalidation.' },
    { status: 405, headers: { Allow: 'POST' } },
  )
}
