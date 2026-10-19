# Bainbo Taria Awo Club

A small community-association website for a **fictional** organisation, built as a
portfolio demonstration of a production-minded **Next.js (App Router) + TypeScript +
Tailwind CSS + Sanity CMS** integration.

> Bainbo Taria Awo Club (BTA) is not a real association. It is not affiliated with any
> real organisation, and the membership/support forms deliberately do not store or send
> anything.

---

## What this demonstrates

- A content-modelled Sanity CMS (Studio embedded at `/studio`) with **12 document types**
  and **19 reusable object types**, validation, sensible defaults, singleton documents
  and an editor-friendly structure.
- A typed content layer that never throws, never substitutes fake content, and
  distinguishes "no content" from "CMS unreachable".
- A clear publication model: draft/publish workflow **and** an editor-facing status
  field, both enforced in GROQ so unpublished content cannot reach a public page.
- Server-rendered pages with time-based ISR plus an on-demand revalidation webhook.
- Responsive, accessible UI with an editorial (not SaaS) visual language — the design
  system is ported one-to-one from the BTA prototype (BTA-prototype-2): white paper,
  deep navy ink, a single gold accent, Cormorant Garamond for display type and Manrope
  for body copy.
- A validated, clearly-labelled demonstration form with matching client- and
  server-side rules.
- Unit/component tests (Vitest + React Testing Library), linting, type checking and a
  production build.

## Stack

| Area | Choice | Version |
| --- | --- | --- |
| Framework | Next.js (App Router, Turbopack) | 16.4.2 |
| UI | React / React DOM | 19.3.1 |
| Language | TypeScript | 5.9.3 |
| Styling | Tailwind CSS (v4, `@theme` tokens) | 4.3.3 |
| CMS | Sanity + embedded Studio | 6.19.0 |
| CMS integration | `next-sanity`, `@sanity/client`, `@sanity/image-url` | 13.3.4 / 8.9.0 / 2.1.1 |
| Rich text | `@portabletext/react` | 8.0.1 |
| Tests | Vitest, Testing Library, jsdom | 5.0.5 |
| Target platform | Vercel | — |

TypeScript is intentionally pinned to **5.9.x** rather than the current 7.x preview so
that the ESLint/Next/Sanity toolchain stays on a supported combination. See
`docs/architecture.md`.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure Sanity
cp .env.example .env.local      # Windows: copy .env.example .env.local
#   then fill in NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
#   and SANITY_API_WRITE_TOKEN (see docs/sanity-setup.md)

# 3. Create the demonstration content
npm run seed

# 4. Run the site and the Studio
npm run dev                     # http://localhost:3000  (Studio at /studio)
```

Without any Sanity configuration the site still starts, but every page shows an
explicit **"Content is not connected yet"** state instead of fabricated content, and
`/studio` shows a setup panel. That is the intended behaviour, not a bug.

## Environment variables

All placeholders are documented in `.env.example`. Nothing here is required to run the
test suite, the type checker, the linter or the build.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes (for content) | Public Sanity project id |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes (for content) | Dataset name (for example `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No | Content Lake API date; defaults to `2025-02-19` |
| `SANITY_API_READ_TOKEN` | No | Server-only read token for private datasets/drafts |
| `SANITY_API_WRITE_TOKEN` | Only for `npm run seed` | Editor token used by the seed script |
| `SANITY_REVALIDATE_SECRET` | No | Shared secret for the `/api/revalidate` webhook |
| `NEXT_PUBLIC_SITE_URL` | No | Absolute origin for canonical URLs/sitemap; defaults to `http://localhost:3000` |

Only `NEXT_PUBLIC_*` values reach the browser bundle. The read and write tokens never
do.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the site and the embedded Studio in development |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (flat config, `eslint-config-next`) |
| `npm run typecheck` | `tsc --noEmit` |
| npm test | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run seed` | Create/replace the demonstration content in Sanity |
| `npm run sanity` | Run the Sanity CLI (for example `npm run sanity deploy`) |

## Routes

| Route | Rendering | Notes |
| --- | --- | --- |
| `/` | ISR (2 min) | Home: hero, intro, stats, model, initiatives, impact, knowledge, heritage, events, vision, partner |
| `/about` | ISR (2 min) | About BTA: history, mission, committee, values |
| `/about/story` | ISR (2 min) | Our story: origins, growth, today, future |
| `/about/leadership` | ISR (2 min) | Leadership & governance: constitution, minutes, reports |
| `/about/bta-2035` | ISR (2 min) | BTA 2035 vision: 11 long-term goals |
| `/our-people` | ISR (2 min) | The people behind BTA |
| `/knowledge` | ISR (2 min) | Knowledge sessions and forums |
| `/knowledge/forum` | ISR (2 min) | Knowledge & Ideas Forum detail |
| `/enterprise` | ISR (2 min) | Enterprise: Business Hub intro |
| `/enterprise/business-hub` | ISR (2 min) | Member business directory with search |
| `/community-impact` | ISR (2 min) | Community impact programmes |
| `/community-impact/school-rehabilitation` | ISR (2 min) | School rehabilitation project detail |
| `/community-needs` | ISR (2 min) | Community needs register form |
| `/blue-economy` | ISR (2 min) | Blue Economy: river stewardship |
| `/blue-economy/centre` | ISR (2 min) | Blue Economy Centre detail |
| `/heritage` | ISR (2 min) | Heritage: oral history project |
| `/heritage/oral-history` | ISR (2 min) | Oral history detail |
| `/events` | ISR (2 min) | Events diary: upcoming and past |
| `/events/[slug]` | SSG + on-demand | Prerendered from published slugs; 404 for unknown/unpublished |
| `/news` | ISR (2 min) | News and stories from BTA |
| `/news/community-education` | ISR (2 min) | Community education article detail |
| `/media` | ISR (2 min) | Media (same content as /news) |
| `/partner` | ISR (2 min) | Partner with BTA |
| `/membership` | ISR (2 min) | Membership: join, process, demonstration inquiry form |
| `/support` | ISR (2 min) | Support BTA: giving choices |
| `/studio/[[...tool]]` | Dynamic | Embedded Sanity Studio (setup panel when unconfigured) |
| `/api/membership-inquiry` | Route handler | `POST` only; validates, stores/sends nothing |
| `/api/revalidate` | Route handler | `POST` only; secret-protected on-demand revalidation |
| `/sitemap.xml`, `/robots.txt` | Static | Studio and API routes are excluded from crawling |

## Project structure

```
src/
  app/                 routes, layout, API handlers, sitemap/robots, studio
  components/          presentation components (ui/ holds the primitives)
  lib/
    sanity/            env, client, fetch, queries, content API, image URLs
    validation/        shared membership form rules + wire types
    format.ts          locale-fixed date/time formatting
    events.ts          upcoming/past partitioning
    site.ts            small helpers and brand constants
  sanity/              Studio schema (documents, objects, structure, limits)
  types/content.ts     TypeScript shapes for query results
scripts/seed.mts       deterministic demonstration-content seeder
tests/                 route, query, schema, API and component tests
docs/                  architecture, Sanity setup, deployment, testing
```

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — design, rendering strategy and
  trade-offs.
- [`docs/sanity-setup.md`](docs/sanity-setup.md) — project, dataset, tokens, seeding and
  the content model.
- [`docs/deployment.md`](docs/deployment.md) — deploying to Vercel and wiring the
  revalidation webhook.
- [`docs/testing.md`](docs/testing.md) — what is tested, how to run it, and the exact
  results observed for this repository.

## Limitations

- No authentication, dashboards, payments, approval workflows, newsletters or search —
  all deliberately out of scope.
- The membership form validates and responds, but **nothing is stored or emailed**.
  There is no database and no mail provider.
- The seed script creates text content only; images are added through the Studio.
- The project has not been committed to a Git repository.