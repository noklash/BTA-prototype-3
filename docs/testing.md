# Testing

This document describes how the project is verified, what each test file covers, the
exact commands to run, and the results observed for this repository. It separates what has
actually been run from what still requires a real Sanity project.

## 1. Approach

- **Unit-test the logic, not the framework.** Pure helpers (date formatting, event
  partitioning, activity selection, validation) carry the most tests, because they carry
  the most behaviour.
- **Pin the invariants that could break silently.** The GROQ queries are strings, and the
  Studio schema is the contract between the CMS and the site; both have dedicated tests.
- **Prove the failure paths.** A large part of the suite exists to demonstrate that a
  missing configuration, an unreachable CMS, bad form input and an unauthenticated webhook
  each produce the intended result rather than a crash.
- **No fabricated results.** Where a check needs credentials or a live project, it is
  listed as unverified in §7 instead of being claimed.

## 2. Tools and configuration

| Tool | Role |
| --- | --- |
| Vitest 5 | Test runner |
| jsdom | Default environment (component tests) |
| `@testing-library/react` + `user-event` | Component interaction |
| `@testing-library/jest-dom` | DOM matchers |

`vitest.config.ts` sets `globals: false` (tests import `describe`/`it`/`expect`
explicitly), `restoreMocks: true`, and an `@/* → src/*` alias. `vitest.setup.ts` registers
jest-dom matchers and an explicit `cleanup()` after each test, because RTL's automatic
cleanup relies on globals.

The default environment is `jsdom`. Files that touch Next.js server internals use a
`// @vitest-environment node` docblock (`tests/schema.test.ts`, `tests/queries.test.ts`,
`tests/api-*.test.ts`).

Environment variables are always stubbed with `vi.stubEnv` and restored afterwards, so a
developer's real credentials can never make a test hit the network or change its result.
`tests/routes.test.ts` and the component tests clear the Sanity variables on purpose.

## 3. Commands

```bash
npm test             # run the whole suite once
npm run test:watch   # watch mode
npm run typecheck    # tsc --noEmit
npm run lint         # eslint .
npm run build        # production build (also type-checks)

# A single file
npx vitest run tests/components/membership-form.test.tsx
```

## 4. Test inventory

20 files, 204 tests.

### Logic and helpers

| File | Covers |
| --- | --- |
| `src/lib/format.test.ts` | `parseDateTime`, `formatEventDate`/`Time`/`DateTime`, `toDateTimeAttribute`, `formatEventSchedule`; rejects unusable input; asserts the `Europe/London` offset is respected regardless of the runtime time zone |
| `src/lib/events.test.ts` | `partitionEvents` (upcoming/past split, sorting, "starts exactly now" is upcoming, unparsable dates land at the end of the past bucket, input not mutated) and `getNextEvent` |
| `src/lib/activities.test.ts` | `selectFeaturedActivities`: empty/null input, drops dangling references and title/slug-less entries, sorts by `displayOrder` with a stable sort, pushes missing order to the end, applies the limit after sorting, does not mutate input |
| `src/lib/text.test.ts` | `getInitials`: skips insignificant words, `maxLetters`, fallbacks, whitespace collapsing, empty input |
| `src/lib/validation/membership.test.ts` | The shared form rules: required fields, length bounds, email shape, control characters, normalisation (trimming) |

### Content layer

| File | Covers |
| --- | --- |
| `src/lib/sanity/env.test.ts` | `isSanityConfigured` (missing/partial/whitespace values), `assertSanityConfig` (throws `SanityConfigError` naming the missing variables, trims, applies the API-version fallback, returns the read token server-side only) |
| `src/lib/sanity/fetch.test.ts` | `fetchContent` returns the value on success; passes the default revalidate window and tags; `revalidate: false` becomes `cache: 'no-store'`; a client error becomes an `unavailable` result whose message contains no host, query or token; the failing label is logged server-side. Client is mocked |
| `src/lib/sanity/content.test.ts` | Deliberately **unmocked**: with no configuration, both `fetchContent` and `getSiteSettings` return a typed `not-configured` failure naming the environment variable — never a throw, never substitute content |
| `src/lib/sanity/image.test.ts` | `hasImageAsset`, `buildContentImage` (srcSet from default widths, custom width list sorted ascending, editor alt preferred over fallback, unusable widths rejected, quality passed through) and `buildImageUrl`; returns `null` when the project is unconfigured |

### Schema, queries and routes

| File | Covers |
| --- | --- |
| `tests/schema.test.ts` | Every document type is registered; the field set of each type is pinned; `event.status` defaults to `draft` with exactly `draft`/`published`; the featured-activities reference targets `featuredActivity`; `richText` allows exactly one block type with the expected styles and decorators; the singleton list matches the schema. `alt` on `imageWithAlt` |
| `tests/queries.test.ts` | All queries are non-empty GROQ, never use `{...}`; the events queries filter `status == "published"`; ordering is `startDateTime asc`; slug lookups are parameterised; projections flatten slugs; `siteSettings` fields are selected explicitly |
| `tests/routes.test.ts` | Each public route exports a component; `/studio` and both API routes exist with the expected route config; importing and awaiting every CMS-backed page **without a configuration** resolves without throwing; `generateStaticParams` returns `[]` instead of failing the build; event metadata reports "Event not found" |

### API route handlers

| File | Covers |
| --- | --- |
| `tests/api-membership-inquiry.test.ts` | `200` with `demonstration: true` and the "nothing was stored / no email was sent" message; `422` with per-field errors; `415` for a non-JSON content type; `400` for malformed JSON; a non-object body is treated as empty input; **no personal data is logged**; `GET` is `405` with `Allow: POST` |
| `tests/api-revalidate.test.ts` | `503` when the secret is unset; `401` for a wrong secret; the header-based secret is accepted; tag mapping per document type; unknown type revalidates every tag; a body-less ping is a full revalidation; the public paths and the `/events/[slug]` segment are revalidated; singletons flagged in the response; `GET` is `405` |

### Components

| File | Covers |
| --- | --- |
| `tests/components/event-card.test.tsx` | Title/date/time/location/summary rendering, `<time datetime>`, two links to the same detail page, the call-to-action link's distinguishing accessible name, omitted optional fields, the missing-image placeholder, and the "Date to be confirmed" fallback |
| `tests/components/event-list.test.tsx` | `EventGrid` (empty state, one item per event) and `PartitionedEventList` (upcoming vs past sections, empty-upcoming state, archive count pluralisation, hidden archive, fully empty programme) |
| `tests/components/membership-form.test.tsx` | Field labelling and the demonstration notice; local validation blocks the request; errors are associated with inputs; a successful submit posts normalised values and reports the demonstration outcome; server field errors are surfaced; an unreachable server is reported without claiming success; the submit button is disabled while in flight |
| `tests/components/sanity-image.test.tsx` | Plain `<img>` with a Sanity CDN `src`/`srcSet`/`sizes`; editor alt preferred with the caller alt as fallback; lazy by default and eager when `priority`; fallback rendered when the asset is missing or Sanity is unconfigured; nothing rendered when there is no image and no fallback |
| `tests/components/portable-text.test.tsx` | Empty value renders nothing; every declared block style maps to semantic HTML; bulleted/numbered lists; strong/emphasis marks; internal links use the Next.js router; external links get `rel="noreferrer noopener"`; `openInNewTab` adds `target="_blank"`; a link without `href` degrades to text |
| `tests/components/mobile-nav.test.tsx` | Collapsed by default with `aria-expanded="false"` and a hidden panel; opening on click exposes the primary links; Escape closes it; a route change closes it (open state is derived from the pathname) |
| `tests/components/state-message.test.tsx` | Status vs alert roles, title/description rendering, the action slot, and that `ContentErrorState` shows setup instructions only for `not-configured` |

## 5. Behaviour verified by running the app

The unit suite mocks or clears the CMS. The tables below were produced by starting the
production server (`npx next start`) and issuing real requests, which confirms the pages,
headers and handler responses end to end.

### Without a Sanity configuration

With no credentials the site must degrade gracefully rather than invent content.

| Request | Expected | Observed |
| --- | --- | --- |
| `GET /` | 200, "not connected" state | 200, marker present |
| `GET /about` | 200, "not connected" state | 200, marker present |
| `GET /events` | 200, "not connected" state | 200, marker present |
| `GET /membership` | 200, demonstration notice | 200, marker present |
| `GET /events/does-not-exist` | 200 with error state (see limitation) | 200, marker present |
| `GET /studio` | 200, setup panel | 200, marker present |
| `GET /robots.txt` | 200, includes `Sitemap:` | 200, marker present |
| `GET /sitemap.xml` | 200, includes `<urlset` | 200, marker present |
| `POST /api/membership-inquiry` (valid) | 200 `demonstration: true` | 200, marker present |
| `POST /api/membership-inquiry` (invalid) | 422 with `errors` | 422, marker present |
| `POST /api/membership-inquiry` (wrong content type) | 415 | 415, marker present |
| `GET /api/membership-inquiry` | 405 | 405, marker present |
| `POST /api/revalidate` (no secret configured) | 503 | 503, marker present |
| `GET /api/revalidate` | 405 | 405, marker present |

`npm run seed` was also run without a configuration: it printed the "cannot seed" guidance
naming `NEXT_PUBLIC_SANITY_PROJECT_ID` and exited with code 1 — the intended behaviour.

### With a configured dataset (integration)

Once a real project was configured in `.env.local`, the production build and the running
server were checked against the seeded content. This is the live frontend ↔ Content Lake
path, and it includes the publication gate.

| Request | Expected | Observed |
| --- | --- | --- |
| `npm run build` | Prerender one page per **published** event and none for the draft | 14/14 static pages; SSG entries for `spring-heritage-walk`, `repair-cafe-…`, `evening-lecture-…`, `archive-open-day`; **no** entry for `committee-planning-meeting` |
| `GET /` | 200, real hero copy | 200, contains "Our streets remember", not the "not connected" state |
| `GET /about` | 200, real history | 200, contains "How we began" (rich-text `h3`) |
| `GET /events` | 200, published events only; past event archived | 200, contains "Spring Heritage Walk" and "Archive Open Day"; does **not** contain the draft's title |
| `GET /events/spring-heritage-walk` | 200 | 200, contains the event title |
| `GET /events/committee-planning-meeting` | **404** (draft must be unreachable) | 404 |
| `GET /events/no-such-event` | 404 | 404 |
| `GET /membership` | 200, contact address from `siteSettings` | 200, contains `hello@heritagecircle.example` |
| `GET /sitemap.xml` | Only published event URLs | Contains `spring-heritage-walk`; does **not** contain the draft slug |
| `GET /robots.txt` | 200 | 200, includes `Sitemap:` |
| `POST /api/membership-inquiry` | 200, `demonstration: true` | 200, `demonstration: true` |

A read-only count query against the dataset returned `siteSettings: 1, homepage: 1,
aboutPage: 1, featuredActivity: 3, eventsTotal: 5, eventsPublished: 4`, which is the shape
the seeder produces.

## 6. Recorded results (this repository)

Environment: Windows, Node **v24.18.0**, npm, Vitest 5.0.5, Next.js 16.4.2. Recorded on
2026-10-18 against the current working tree.

| Command | Result |
| --- | --- |
| `npm test` | **21 files passed, 207 tests passed** (exit 0). Vitest prints a non-fatal warning that `vitest.config.ts` uses ESM syntax while being loaded as CommonJS; it suggests a `.mjs` extension. It does not affect results |
| `npm run typecheck` | Passed, no output (exit 0) |
| `npm run lint` | Passed, no output (exit 0) |
| `npm run build` (no Sanity config) | Compiled successfully; 10/10 static pages generated. Route table: `/`, `/_not-found`, `/about`, `/events`, `/membership`, `/robots.txt`, `/sitemap.xml` static; `/` `/about` `/events` `/membership` revalidate every 2m; `/events/[slug]` SSG; `/api/membership-inquiry`, `/api/revalidate`, `/studio/[[...tool]]` dynamic |
| `npm run build` (with `.env.local`) | Compiled successfully; 14/14 static pages generated, with one SSG entry per **published** event and none for the draft (see §5) |
| HTTP checks without a configuration (§5) | All 14 requests matched expectations |
| HTTP checks with the seeded dataset (§5) | All 11 integration requests matched expectations, including **404 for the draft event** |

Vitest also suggests reusing the jsdom environment across files (`pool: 'vmThreads'` or
`isolate: false`) to reduce the ~60s wall time. That is a performance note only and was
left as-is to keep per-file isolation.

## 7. Not yet covered

The live frontend ↔ Content Lake path was verified against a real project on 2026-10-18
(§5, §6). The following still require actions this environment cannot take on its own, or
assets that do not exist yet.

- **Seeding a dataset from here.** The dataset already held the seeded documents, and the
  observed counts match the seeder exactly, but `npm run seed` itself was only exercised
  here on its missing-configuration path. Run it against a scratch dataset to confirm the
  write path (it calls `createOrReplace`, so it overwrites the demonstration documents).
- **`sanity dev` / the Sanity CLI.** The Studio is validated by the production build and by
  `/studio` returning its setup panel, not by running the Studio interactively.
- **On-demand revalidation with a real webhook.** The handler is unit-tested with a mocked
  `next/cache`; the Sanity → Vercel delivery has not been observed. See
  `docs/deployment.md` §7.
- **Image CDN rendering.** `buildContentImage` is unit-tested against the URL builder, but
  no real asset has been uploaded (the seeder is text-only), so no image has been fetched
  from the CDN. Uploading one image in the Studio and reloading the homepage exercises it.

## 8. Adding tests

- Put pure-logic tests next to the module (`src/lib/foo.test.ts`) and everything else under
  `tests/`, with components in `tests/components/`.
- Import `describe`, `it`, `expect` explicitly — `globals` is `false`.
- Stub environment variables with `vi.stubEnv` and clear them in `afterEach`; call
  `resetSanityClient()` after changing Sanity variables so the memoised client is rebuilt.
- Prefer asserting on behaviour the user or the CMS contract depends on, and keep the
  `// @vitest-environment node` docblock for files that must not run in jsdom.
- When a component renders a Sanity image, either configure the stub environment (as
  `sanity-image.test.tsx` does) or mock `@/components/sanity-image` (as
  `event-list.test.tsx` does).
