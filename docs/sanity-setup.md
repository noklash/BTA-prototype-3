# Sanity setup

This is the end-to-end walkthrough for connecting the website to a Sanity project:
create the project, configure the environment, seed the demonstration content, open the
Studio, and understand the content model.

The site runs without any of this — every page then shows an explicit
"Content is not connected yet" state — so you can complete the steps at your own pace.

## 1. Prerequisites

- Node.js 20.19 or newer (the repository declares `engines.node >= 20.19.0`).
- A [Sanity](https://www.sanity.io/) account.
- For `npm run seed`, **Node.js 22.6 or newer**, because the script is run directly as
  TypeScript using Node's built-in type stripping. Everything else works on 20.19.

## 2. Create a Sanity project and dataset

Use an existing project, or create one:

```bash
npm run sanity -- init --env
```

`npx sanity init` guides you through creating a project and a dataset (the default
dataset name is `production`). If you prefer the web UI, create the project at
<https://manage.sanity.io> instead. Either way, note:

- the **project id** (for example `abc12def`), and
- the **dataset name** (for example `production`).

## 3. Configure the environment

Copy the example file and fill it in.

```bash
cp .env.example .env.local        # Windows: copy .env.example .env.local
```

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID="abc12def"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2025-02-19"
SANITY_API_WRITE_TOKEN="sk..."     # Editor token, only needed for seeding
```

`.env.local` is git-ignored. Never commit real credentials, and never add a token to a
`NEXT_PUBLIC_*` variable.

| Variable | Needed for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Everything | Public; inlined into the browser bundle |
| `NEXT_PUBLIC_SANITY_DATASET` | Everything | Public |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Optional | Content Lake API date; defaults to `2025-02-19` |
| `SANITY_API_WRITE_TOKEN` | `npm run seed` | Editor permission; server/CLI only |
| `SANITY_API_READ_TOKEN` | Private datasets or draft preview | Server only; not needed for a public dataset |

The website, `npm run seed` and the `npx sanity …` CLI all read the same file, in different ways:

- Next.js reads `.env.local` automatically; the seeder passes `--env-file-if-exists` to Node.
- The Sanity CLI loads `.env`, then `.env.local`, from the project root before every command
  (a global prerun hook). Run `npx sanity …` from this directory. Variables already exported
  in your shell take precedence over the files.

## 4. Dataset visibility and CORS

- **Public dataset** (the default): leave `SANITY_API_READ_TOKEN` empty. The site reads
  through the CDN.
- **Private dataset**: create a **Viewer** token, set `SANITY_API_READ_TOKEN`, and the
  client automatically stops using the CDN (authenticated requests are not CDN-cached).

For the embedded Studio to talk to the API from your machine and from production, add
CORS origins under **manage.sanity.io → API → CORS origins**:

- `http://localhost:3000` with **Allow credentials** enabled.
- your production URL (for example `https://heritage-circle.vercel.app`) with
  **Allow credentials** enabled.

## 5. Create a write token for seeding

Under **manage.sanity.io → API → Tokens**, create a token with **Editor** permission and
put it in `.env.local` as `SANITY_API_WRITE_TOKEN`. It is used only by `scripts/seed.mts`
and is never read by the website.

## 6. Seed the demonstration content

```bash
npm run seed
```

The script creates or replaces, using deterministic document ids:

- the three singletons — `siteSettings`, `homepage`, `aboutPage`;
- three featured activities (`featured-activity-walking-archive`, `…-schools-programme`,
  `…-repair-cafe`);
- five events: three upcoming and one past event with `status: published`, plus one
  `status: draft` event that must **not** appear on the site.

Because the ids are fixed, running it again leaves the dataset in the same state instead
of creating duplicates. Relative event dates are computed from the run time, so re-running
moves the events back into the future.

> **Warning:** `createOrReplace` overwrites the documents listed above. Only run the
> seeder against a dataset that holds this demonstration content, never against real
> editorial work.

Images are not seeded. Every image field on the website degrades to a typographic
placeholder, so the content is complete without them; add imagery in the Studio.

> **Note (Prototype 3):** the platform pages — the project bank, the knowledge library,
> the business directory, the volunteer database, the youth opportunities, the diaspora
> hub, the feedback board and the leadership directory — are **not** stored in Sanity.
> They read the demonstration dataset in `src/lib/demo/data.ts`, so they work with no
> CMS content at all and never need seeding. The leadership page resolves each person
> from the member records in that dataset, which is why the committee and the members'
> directory can never disagree.

If the script reports that a variable is not set, re-check `.env.local` and remember that
Node only reads it because `npm run seed` passes `--env-file-if-exists`.

## 7. Open the Studio

```bash
npm run dev
```

- Website: <http://localhost:3000>
- Studio: <http://localhost:3000/studio>

The Studio's left-hand list is organised so that the content an editor changes most often
is first:

1. **Site settings** (singleton)
2. **Home page** (singleton)
3. **About page** (singleton)
4. **Events**
5. **Featured activities**

The three singletons are pinned to fixed document ids and are removed from the global
"create new document" menu, so a second one cannot be created by accident.

## 8. Content model reference

### Site settings — `siteSettings` (singleton)

Global identity and contact details. Groups: *Identity*, *Contact*, *Footer*.

| Field | Type | Rules |
| --- | --- | --- |
| `title` | string | Required, ≤ 80 — the organisation name in the header/footer/titles |
| `tagline` | string | ≤ 160 |
| `logo` | `imageWithAlt` | Optional; shown at ~40px high |
| `contactEmail` | string | Required, must be a valid email — shown on the membership page |
| `contactPhone` | string | ≤ 40 |
| `address` | text | ≤ 240; line breaks preserved |
| `footerText` | text | Required, ≤ 400 |
| `socialLinks` | array of `socialLink` | ≤ 6, rendered in order |

### Home page — `homepage` (singleton)

Groups: *Hero*, *Mission*, *Featured activities*, *Membership call to action*.

| Field | Type | Rules |
| --- | --- | --- |
| `heroHeading` | string | Required, ≤ 90 |
| `heroDescription` | text | Required, ≤ 320 |
| `heroImage` | `imageWithAlt` | Optional |
| `missionStatement` | text | Required, ≤ 400 |
| `heritageIntro` | text | ≤ 600; the section is hidden when empty |
| `featuredActivities` | array of references to `featuredActivity` | ≤ 3, displayed in each activity's `displayOrder` |
| `membershipCta` | `callToAction` | Required |

### About page — `aboutPage` (singleton)

| Field | Type | Rules |
| --- | --- | --- |
| `title` | string | Required, ≤ 90; initial value "About us" |
| `intro` | text | Required, ≤ 320 |
| `history` | `richText` | Required |
| `mission` | text | Required, ≤ 600 |
| `leadership` | text | ≤ 400; optional committee note |
| `values` | array of `valueItem` | ≤ 6 |
| `featuredImage` | `imageWithAlt` | Optional |

### Event — `event`

| Field | Type | Rules |
| --- | --- | --- |
| `title` | string | Required, ≤ 120 |
| `slug` | slug | Required; generated from the title, ≤ 96 |
| `summary` | text | Required, ≤ 300; shown in lists |
| `fullDescription` | `richText` | Optional |
| `startDateTime` | datetime | Required; `YYYY-MM-DD HH:mm` picker |
| `location` | string | Required, ≤ 160 |
| `coverImage` | `imageWithAlt` | Optional |
| `status` | string (radio) | Required; **defaults to `draft`** |

`status` is the website's own publication gate and is separate from Sanity's draft/publish
workflow. Public queries require **both** a published document and `status == "published"`,
so a new event is never public by accident. See `docs/architecture.md` §6.

### Featured activity — `featuredActivity`

| Field | Type | Rules |
| --- | --- | --- |
| `title` | string | Required, ≤ 100 |
| `slug` | slug | Required, ≤ 96 |
| `shortDescription` | text | Required, ≤ 280 |
| `image` | `imageWithAlt` | Optional |
| `displayOrder` | number | Required integer, 0–999, default 0; lower appears first |

### Reusable object types

| Type | Fields | Notes |
| --- | --- | --- |
| `imageWithAlt` | `alt` | Hotspot enabled. `alt` is mandatory **once an asset is uploaded** (a custom rule, so an empty field never blocks saving) |
| `callToAction` | `heading` (required), `body`, `buttonLabel` (required, default "Find out more"), `buttonHref` (required) | `buttonHref` accepts a site path (`/membership`) or an `http(s)://` URL; `javascript:` and bare fragments are rejected |
| `valueItem` | `title` (required), `description` | — |
| `socialLink` | `platform` (required), `url` (required) | URL must be `http`/`https` |
| `richText` | array of block | Paragraph, `h3`, `h4`, quote, bullet/number lists, strong/emphasis, and a `link` annotation limited to `http(s)`, `mailto`, `tel`, site paths and `#` anchors |

## 9. Publishing workflow

1. Create or edit a document.
2. Press **Publish** (this is Sanity's own draft/publish step).
3. For events, also set **Publication status** to *Published*.

Either step alone is not enough for an event to appear, and that is deliberate. If an
event is published but still missing from the site, check its `status` field first.

Changes appear within two minutes (the page `revalidate` window). To make them appear
immediately, configure the revalidation webhook — see `docs/deployment.md` §4.

## 10. Adding images

Upload through any `imageWithAlt` field. Alt text is required once an asset exists.
Always supply it unless the image is purely decorative; the renderer falls back to the
event/activity title when the editor leaves it blank.

## 11. Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Every page says "Content is not connected yet" | `NEXT_PUBLIC_SANITY_PROJECT_ID` / `..._DATASET` missing or empty | Fill in `.env.local` and restart the dev server |
| `/studio` shows "Content Studio is not connected" | Same as above | Same |
| Page says "Content is unavailable" | Project id/dataset wrong, dataset private without a read token, or no network | Check credentials, dataset visibility and `SANITY_API_READ_TOKEN` |
| Home page says the document has not been created | The `homepage` singleton does not exist | Create it in the Studio, or run `npm run seed` |
| An event does not appear although it is published | Its `status` is `draft` | Set **Publication status** to *Published* |
| A change takes up to two minutes to appear | Time-based ISR (`revalidate = 120`) | Expected; configure the webhook for instant updates |
| `npm run seed` reports a missing variable | `.env.local` incomplete | Add the project id, dataset and write token |
| `npm run seed` fails with a permission error | The token is not an Editor token, or belongs to another project | Recreate the token with Editor permission |
| CORS error in the Studio | Origin not allowed | Add the origin under API → CORS origins with credentials enabled |
