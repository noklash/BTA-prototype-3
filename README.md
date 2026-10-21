# Bainbo Taria Awo  

A community-association website for a **fictional** organisation, built as a
portfolio demonstration of a production-minded **Next.js (App Router) + TypeScript +
Tailwind CSS + Sanity CMS** integration.

> Bainbo Taria Awo   (BTA) is not a real association. It is not affiliated with any
> real organisation, and every form, payment, receipt, business listing and
> partnership in this project is simulated.

The site is delivered in two layers:

- **The public site** — editorial content driven by Sanity, rendered on the server.
- **Prototype 3** — the community/membership platform (project bank, transparency,
  diaspora hub, youth and scholarships, business directory, volunteer database,
  feedback and proposals, members' portal and an administrative dashboard) built as an
  extension of the same design system, never as a redesign.

---

## What this demonstrates

- A content-modelled Sanity CMS (Studio embedded at `/studio`) with **12 document types**
  and **19 reusable object types**, validation, sensible defaults, singleton documents
  and an editor-friendly structure.
- A typed content layer that never throws, never substitutes fake content, and
  distinguishes "no content" from "CMS unreachable" — and that keeps serving the last
  known good content during a short Content Lake outage instead of replacing a live
  page with an error state.
- A clear publication model: draft/publish workflow **and** an editor-facing status
  field, both enforced in GROQ so unpublished content cannot reach a public page.
- Server-rendered pages with time-based ISR plus an on-demand revalidation webhook.
- Responsive, accessible UI with an editorial (not SaaS) visual language — the design
  system is ported one-to-one from the BTA prototype (BTA-prototype-2): white paper,
  deep navy ink, a single gold accent, Cormorant Garamond for display type and Manrope
  for body copy.
- A validated, clearly-labelled demonstration form with matching client- and
  server-side rules.
- Unit/component tests (Vitest + React Testing Library), linting, type checking, a
  production build, a scripted responsive audit and a scripted interaction check.


## Prototype 3 — the community platform

Prototype 3 implements the committee's recommendations A–L as an extension of the
approved design, not a redesign. Every new page uses the same tokens, type scale,
buttons, cards, tables and navigation as the reference site.

| Recommendation | Where it lives |
| --- | --- |
| A — Members' portal | `/portal` (dashboard, profile, dues, meetings, directory) behind a simulated session |
| B — Diaspora hub | `/diaspora` with a registration form |
| C — Transparency & accountability | `/transparency` (statements, budgets, expenditure) and `/roadmap` |
| D — Project bank and tracker | `/projects` and `/projects/[slug]` with stage, funding and milestone tracking |
| E — Donations | `/donate` with a simulated checkout and an illustrative receipt |
| F — Knowledge-sharing hub | `/library` and `/library/[slug]` |
| G — Youth and scholarships | `/youth` and `/youth/[slug]` with an application flow |
| H — Business and investment directory | `/enterprise/business-hub` and its detail pages |
| I — Volunteer skills database | `/volunteer` with registration and matching |
| J — Feedback, surveys and proposals | `/feedback` with moderation states |
| K — Partnerships and grants | `/partner` with an enquiry form and partnership pipeline |
| L — Administrative dashboard | `/admin` (members, content, projects, dues, scholarships, volunteers, businesses, feedback, partnerships, roles) |

**How the data works.** `src/lib/demo/data.ts` is the single baseline dataset for the
platform: members, projects, knowledge, opportunities, businesses, volunteers,
feedback, partnerships, statements and the committee. Public server pages read that
dataset directly (SSR). Interactive areas read it through
`src/lib/demo/store.tsx`, which layers browser-side mutations on top and persists
them to `localStorage` under `bta-prototype3-demo-v1`. A submission made on a public
form therefore appears in the admin area, and an admin decision is reflected in the
portal and the directories — **within one browser session only**. Nothing is sent to
a server, and no payment, identity, email or messaging provider is connected.

**How the honesty requirements are met.** Every figure, name, business, partnership,
receipt and document is labelled as illustrative on the page that shows it; the
organisation-level statement appears once, in the footer; the inner pages carry the
reference prototype's "prototype content" note; and the admin area carries its own
demonstration notice. The admin area is deliberately not authenticated (it is a
demonstration), but it is marked `noindex` and disallowed in `robots.txt`.

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
| `/our-people` | ISR (2 min) | The people behind BTA, with a preview of the committee |
| `/our-people/leadership` | ISR (2 min) | Leadership directory: names, offices, remits and portraits |
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
| `/projects`, `/projects/[slug]` | ISR (2 min) | Project bank with stage, funding and milestone tracking |
| `/donate` | ISR (2 min) | Simulated contribution checkout and receipt |
| `/transparency` | ISR (2 min) | Illustrative statements, budgets and expenditure |
| `/diaspora` | ISR (2 min) | Diaspora hub and registration |
| `/youth`, `/youth/[slug]` | ISR (2 min) | Scholarships, internships and mentoring |
| `/library`, `/library/[slug]` | ISR (2 min) | Knowledge library: articles, research, webinars |
| `/volunteer` | ISR (2 min) | Volunteer skills database |
| `/feedback` | ISR (2 min) | Feedback, survey responses and project proposals |
| `/roadmap` | ISR (2 min) | Phased roadmap: demonstrated, simulated, future |
| `/portal` | Static + client | Members' portal (simulated sign-in, `noindex`) |
| `/portal/login` | Static + client | Choose a demonstration member to explore the portal |
| `/portal/profile`, `/portal/dues`, `/portal/meetings`, `/portal/directory` | Static + client | Member profile, dues checkout, meeting records, member directory |
| `/admin` and `/admin/*` | Static + client | Administrative dashboard (demonstration, `noindex`) |
| `/studio/[[...tool]]` | Dynamic | Embedded Sanity Studio (setup panel when unconfigured) |
| `/api/membership-inquiry` | Route handler | `POST` only; validates, stores/sends nothing |
| `/api/revalidate` | Route handler | `POST` only; secret-protected on-demand revalidation |
| `/sitemap.xml`, `/robots.txt` | Static | Studio and API routes are excluded from crawling |

## Project structure

```
src/
  app/                 routes, layout, API handlers, sitemap/robots, studio
  components/          presentation components (ui/ holds the primitives)
    demo/              Prototype 3 platform components (store-backed areas)
  content/             prototype image fallbacks (exact prototype URLs)
  lib/
    demo/              Prototype 3 dataset, types, formatting and the client store
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

- No authentication. The members' portal uses a simulated sign-in (choose a
  demonstration member), and the admin area is not gated at all: it is a
  demonstration, marked `noindex` and disallowed in `robots.txt`.
- No payments, email, file storage, mapping or messaging provider. The donation
  and dues checkouts are simulated and issue illustrative receipts; nothing is
  charged and nothing is emailed.
- The platform data layer is **browser-local**: changes live in `localStorage` and are
  visible only in the browser that made them. Server-rendered public pages read the
  baseline dataset, so a mutation is not guaranteed to appear after a full page
  reload of a server-rendered page.
- The leadership photographs are illustrations of the roles, not pictures of the named
  members; the page says so.
- The seed script creates text content only; images are added through the Studio, and
  the prototype image fallbacks are used until an editor uploads one.
- The project has not been committed to a Git repository.