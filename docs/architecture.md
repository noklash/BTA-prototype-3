# Architecture

This document explains how the site is put together, why the notable decisions were
made, and what the trade-offs are. It describes the implementation as it exists in this
repository.

## 1. Goals and non-goals

**Goals**

- A small, honest content-modelled site: every piece of marketing copy an editor would
  reasonably expect to change lives in Sanity.
- Correct failure behaviour: a missing configuration, an empty dataset or an unreachable
  Content Lake must produce an accurate state, never a crash and never invented content.
- A clean separation between *content* (Sanity) and *presentation* (Next.js + Tailwind).
- Straightforward deployment to Vercel with a documented caching and revalidation story.

**Non-goals (deliberate)**

Authentication, user accounts, dashboards, payments, approval workflows, role
management, newsletters, complex search, microservices and a custom backend. Their
absence is a scope decision, not an omission.

## 2. High-level shape

```
Browser ──▶ Next.js (App Router)
              │
              │  server components only (no client-side data fetching)
              ▼
        src/lib/sanity/*           typed content layer
              │  GROQ + @sanity/client (server only)
              ▼
        Sanity Content Lake  ◀── Sanity Studio (embedded at /studio)

Sanity webhook ──▶ POST /api/revalidate ──▶ revalidateTag / revalidatePath
```

Pages are React Server Components. They call typed functions in
`src/lib/sanity/content.ts`, receive a discriminated union, and render either the
content or an explicit state. There is no client-side fetching, no API route used as an
internal data proxy, and no global store.

Two route handlers exist for genuinely request/response concerns:

- `POST /api/membership-inquiry` — validates a demonstration form submission.
- `POST /api/revalidate` — the Sanity on-demand revalidation webhook.

## 3. Directory responsibilities

| Path | Responsibility |
| --- | --- |
| `src/app/**` | Routes, layout, metadata, `sitemap.ts`, `robots.ts`, route handlers |
| `src/components/**` | Presentational components. `ui/` holds the small primitives (`Container`, `Section`, `ButtonLink`, `StateMessage`) |
| `src/lib/sanity/**` | The only code that talks to Sanity |
| `src/lib/validation/**` | Membership form rules and wire types, shared by client and server |
| `src/lib/*.ts` | Pure helpers: formatting, event partitioning, activity selection, text |
| `src/sanity/**` | Studio schema and structure (loaded by both Next.js and the Sanity CLI) |
| `src/types/content.ts` | TypeScript shapes of *query results* |
| `scripts/seed.mts` | Deterministic demonstration-content seeder |
| `tests/**` | Non-component tests; `tests/components/**` for component tests |

## 4. The content layer

The content layer is small and has one direction of dependency:
`env → client → fetch → content`, with `queries` and `image` alongside.

### 4.1 `env.ts` — configuration

Reads `process.env.X` through *static* lookups so Next.js can inline `NEXT_PUBLIC_*`
values at build time. `getPublicSanityConfig()` returns `null` when configuration is
incomplete; `assertSanityConfig()` throws a `SanityConfigError`, and it is only called
lazily, from inside the client factory — so importing any module never fails a build.

`SINGLETON_DOCUMENT_IDS` pins the eight single-instance documents to fixed ids
(`siteSettings`, `homepage`, `aboutPage`, `eventsPage`, `businessHub`, `libraryPage`,
`communityNeeds`, `membershipPage`). The same object drives the Studio structure
and the "no new document" filter, so the constraint is declared once.

### 4.2 `client.ts` — the Sanity client

A memoised `@sanity/client` instance, created on first use. The CDN is enabled only when
no read token is configured (authenticated requests are not CDN-cacheable and would risk
leaking the token into a cacheable URL). The client always reads with
`perspective: 'published'`.

### 4.3 `fetch.ts` — the only place a request is made

`fetchContent<T>()` never throws. It returns:

```ts
type ContentResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: 'not-configured' | 'unavailable'; message: string }
```

- A `SanityConfigError` becomes `reason: 'not-configured'` with the actionable
  environment-variable message.
- Any other error is logged server-side (never forwarded) and becomes
  `reason: 'unavailable'` with a neutral, user-facing message.

This is the key reliability decision: **failure is a value, not an exception**, so a page
can pick the right state and a missing dataset can never be silently presented as real
content.

### 4.4 `queries.ts` — GROQ in one place

All queries live here, use explicit projections (never `{...}`), flatten `slug.current`
to a string, and inline references with `->`. The events queries filter on
`status == "published"` so drafts cannot reach the UI.

An important constraint: `src/lib/sanity/{env,fetch,client}.ts` and `src/sanity/**` use
**relative imports**, not the `@/*` alias, because `sanity.config.ts` (and everything it
reaches) is also bundled by the Sanity CLI, which does not resolve the Next.js path
alias.

### 4.5 `content.ts` — the API pages use

Named, typed functions (`getSiteSettings`, `getHomepage`, `getAboutPage`, `getEvents`,
`getEventBySlug`, `getPublishedEventSlugs`) that pair a query with its cache tags and a
log label.

`getSiteSettingsForLayout` is wrapped in React's `cache()` so the header, the footer and
`generateMetadata` share one request per render instead of issuing three.

`getPublishedEventSlugs` degrades a failure to an empty list rather than failing the
build: event pages can always be rendered on demand.

### 4.6 `image.ts` — CDN URLs

`buildContentImage()` turns an image field into `{ src, srcSet, alt }`. Notable details:

- A fresh `@sanity/image-url` builder is created per URL, because the builder is mutable
  and reuse would leak width/crop state between images.
- Widths are filtered, sorted and used to build an ascending `srcSet`; `src` is the
  largest width.
- `alt` prefers the editor's text, then the caller's fallback, then `''`.
- Everything returns `null` when the image field is empty or Sanity is unconfigured, so
  callers can render a deliberate placeholder.

### 4.7 `types/content.ts` — handwritten query-result types

The shapes are written by hand rather than generated with Sanity TypeGen. The trade-off
is discussed in §13.

## 5. Rendering strategy

| Route | Strategy | Config |
| --- | --- | --- |
| `/`, `/about`, `/events`, `/membership` | Static, revalidated in the background | `export const revalidate = 120` |
| `/events/[slug]` | Prerendered from `generateStaticParams`, revalidated | `revalidate = 120`; `dynamicParams` defaults to `true` |
| `/studio/[[...tool]]` | Server-rendered per request | `export const dynamic = 'force-dynamic'` |
| `/api/*` | Route handlers | — |

Consequences worth knowing:

- Because the four content pages are static-with-revalidation, they are served from the
  edge/CDN cache and refreshed at most every two minutes, or immediately via the
  webhook.
- `/events/[slug]` is prerendered for every published slug at build time. A newly
  published event whose slug was not known at build time is rendered on demand on first
  request and then cached (ISR).
- Nothing is fetched in the browser, so there is no hydration-time request and no
  loading spinner for content. The only client component that issues a request is the
  membership form, and it does so on user action.

## 6. Publication model

Two independent mechanisms control whether an event is public:

1. **Sanity's draft/publish workflow** — `drafts.*` documents are the editor's working
   state. The client reads `perspective: 'published'`, so drafts are never returned.
2. **The `status` field** — part of the published document, defaulting to `draft`. It
   lets an editor keep a finished event hidden (for example while a date is unconfirmed).

Public queries require **both**: they read published documents and filter
`status == "published"`. This is why an editor can publish a document and still not have
it appear, and it is intentional.

## 7. Caching and revalidation

Each content function attaches cache tags:

| Tag | Used by |
| --- | --- |
| `siteSettings` | layout metadata, header/footer, membership page contact address |
| `homepage` | `/` (and indirectly by activity/settings changes) |
| `aboutPage` | `/about` |
| `events` | `/events`, `/events/[slug]` |

Refreshing happens two ways:

- **Time-based**: `revalidate = 120` on the public pages.
- **On-demand**: `POST /api/revalidate`, protected by `SANITY_REVALIDATE_SECRET`. It maps
  a webhook payload's `_type` to the tags it can affect, then calls
  `revalidateTag(tag, { expire: 0 })` for each and revalidates the fixed paths plus the
  `/events/[slug]` segment.

Next.js 16 requires an explicit cache-life profile for `revalidateTag`, hence
`{ expire: 0 }`, which expires the tagged entries immediately (what an editor pressing
"Publish" expects).

Responses: `200` on success, `401` for a wrong/missing secret, `503` when the secret is
not configured on the server, `405` for `GET`.

## 8. Images

Sanity-hosted images are rendered with a plain `<img>` and a hand-built `srcSet`
(`src/components/sanity-image.tsx`) rather than `next/image`.

`next/image` would add a second optimisation pass on top of the Sanity CDN's own
transform pipeline (which already resizes, crops, respects the editor's hotspot and
negotiates WebP), re-encoding every derivative, and it would require an
`images.remotePatterns` allow-list — a second place where image configuration can drift
from the CMS. The Sanity CDN is the optimisation layer; Next.js is not asked to
duplicate it.

The trade-off is that we forgo `next/image`'s automatic sizing/placeholder features. In
exchange the markup is explicit and there is exactly one source of truth for image
transforms. `@next/next/no-img-element` is disabled inline, with the reasoning in the
component's doc comment.

Every image field is optional. When it is empty, components render a deliberate
typographic placeholder (`Event`, the activity title, and so on) instead of a broken
image.

## 9. Rich text

The Studio's `richText` type is deliberately small: paragraph, `h3`, `h4`, blockquote,
bulleted/numbered lists, strong, emphasis, and a `link` annotation. The renderer in
`src/components/portable-text.tsx` handles **every** style and mark declared in the
schema. Keeping the sets equal is the point: anything the schema allows, the renderer
renders on purpose, and anything it does not allow cannot be created.

Internal links (relative `href`) go through `next/link`; external links or links marked
`openInNewTab` render an `<a>` with `rel="noreferrer noopener"`. A link annotation with
no `href` degrades to plain text instead of an empty anchor.

## 10. Dates and locales

All dates are formatted in `Europe/London` / `en-GB` using module-level `Intl` instances
(`src/lib/format.ts`). Relying on the runtime time zone would make output depend on the
machine (a laptop, CI, a Vercel region) and silently shift event times. The weekday
comma that `Intl` produces for `en-GB` is dropped to match the editorial style, by
rebuilding the value from `formatToParts`.

Event lists are partitioned into upcoming and past (`src/lib/events.ts`) and sorted by
start date. Past events remain reachable — they are part of the organisation's record —
but are presented as a secondary list rather than as cards.

## 11. The membership inquiry

- `src/lib/validation/membership.ts` holds the rules and the wire types, shared by the
  browser form and the route handler so both enforce exactly the same constraints.
- The form validates locally for fast feedback, then posts JSON to
  `/api/membership-inquiry`.
- The endpoint returns `200` on valid input, `415` for a non-JSON content type, `400` for
  invalid JSON, `422` with per-field errors, and `405` for `GET`.
- **Nothing is stored or forwarded.** There is no database and no mail provider. The
  response carries `demonstration: true` and a message saying so, and the form renders
  that message verbatim. The UI additionally labels the form a demonstration, so the
  honest failure mode ("nothing happened") is stated rather than implied.
- No personal data is logged; a single `console.info` records only that a submission was
  received.

## 12. States, errors and accessibility

- `StateMessage` centralises the three non-content states (empty, error, action slot).
  Pages never invent their own wording, and an empty CMS is never disguised as content.
- `src/app/error.tsx` is a route-level error boundary for *unexpected* rendering errors;
  the content layer normally prevents those by returning a `ContentResult`.
- `src/app/not-found.tsx` handles unknown routes and `notFound()` calls from event pages.

Accessibility measures: a skip link; a real `<button>` with `aria-expanded`/`aria-controls`
for the mobile menu; `<time datetime>` for machine-readable dates; status vs alert
semantics for success and error messages; per-field error messages wired with
`aria-describedby` and `aria-invalid`; and `lang="en-GB"`.

The mobile menu is an inline disclosure, not a modal — no focus trap is used. Open state
is *derived* from the current pathname (`openedForPathname === pathname`) rather than
synced with an effect, so navigation closes the menu during render with no cascading
update.

## 13. Decisions and trade-offs

| Decision | Alternative considered | Why this way |
| --- | --- | --- |
| Plain `<img>` + hand-built `srcSet` | `next/image` | Avoids double optimisation and a second image config surface (§8) |
| Handwritten query-result types | Sanity TypeGen | No code-generation step in the build; the query shapes are small and stable. Cost: types must be kept in sync by hand |
| `ContentResult` union, never throw | Throwing + an error boundary | Lets each page distinguish "empty" from "unavailable" and render an accurate state |
| Relative imports in the Sanity-reachable graph | `@/*` alias everywhere | The Sanity CLI bundles `sanity.config.ts` without resolving the Next.js alias |
| Membership explanatory copy in code | A `membershipPage` document | The brief's schema list has no membership document; four static blocks do not justify a new editor surface. The contact address *is* CMS-driven. Documented so the next step is obvious |
| `revalidate = 120` + webhook | Purely time-based, or `no-store` | Keeps pages static/cacheable while still letting an editor publish instantly |
| TypeScript 5.9 pin | TypeScript 7 preview | Keeps ESLint/Next/Sanity on a supported combination; documented rather than silently floating |
| Seed script writes text only | Seeding uploaded assets | Deterministic ids are awkward for assets, and every image field already degrades gracefully |

## 14. Known limitations

- **Live integration is verified for reads.** A real project is configured in `.env.local`,
  and the production build plus HTTP checks were run against the seeded dataset: real
  content renders, a draft event is unreachable (`404`), and the sitemap excludes it
  (`docs/testing.md` §5–§6). Still unverified: the write path of `npm run seed` from a clean
  dataset, the Sanity Studio running interactively, real webhook-driven revalidation, and
  CDN image rendering (no asset has been uploaded — the seed is text-only).
- **Unknown event slug while the CMS is unreachable** returns HTTP `200` with an error
  state rather than `404`, because the page cannot distinguish an outage from a missing
  slug. With a configured CMS it returns `404` via `notFound()`.
- **`/events/[slug]` prerendering** discovers slugs at build time; events published later
  are rendered on demand until the next build or revalidation.
- The seed script targets the fictional dataset only and overwrites the documents it
  owns; it must not be run against real content.

## 15. Possible next steps

- Add a `membershipPage` document if the copy needs to be editor-managed.
- Introduce Sanity TypeGen once the schema settles, replacing the handwritten types.
- Add a read-token-based draft preview mode.
- Add Playwright end-to-end tests for the seeded-content path.
