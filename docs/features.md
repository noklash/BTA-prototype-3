# Features and how to use them

Everything this project can do, how to use it, and — honestly — what is real,
what is simulated and what is not built yet.

The site has two layers:

| Layer | What it is | Where the content lives |
| --- | --- | --- |
| **The public site** | The editorial website: home, about, knowledge, enterprise, community impact, heritage, events, news, membership, partner, support and the Prototype 3 public pages | **Sanity CMS** (published content) with the demonstration dataset as a fallback |
| **The platform** | The Prototype 3 community platform: project bank, donations, transparency, diaspora, youth, knowledge hub, business directory, volunteer database, feedback, members' portal, admin area, forum | **The browser** (`localStorage`), because it needs authentication and a database that this demonstration does not have |

> Bainbo Taria Awo   (BTA) is fictional. Every figure, business, partnership,
> document and photograph on the site is illustrative and labelled as such.

---

## 1. Running it

```bash
npm install
cp .env.example .env.local        # Windows: copy .env.example .env.local
#   fill in the Sanity project id, dataset and write token
npm run seed                       # writes the demonstration content to Sanity
npm run dev                        # http://localhost:3000  (Studio at /studio)
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with the embedded Studio at `/studio` |
| `npm run build` | Production build (101 static pages) |
| `npm run start` | Serves the production build |
| `npm run seed` | Creates or replaces the 48 demonstration documents in Sanity |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Vitest (23 files, 260 tests) |
| `npm run sanity` | The Sanity CLI (deploy the Studio, for example) |

The site also runs **without** Sanity: every page then falls back to the
demonstration dataset and shows a short note saying so. Nothing throws.

---

## 2. The public site

### 2.1 Editorial pages (CMS-driven)

| Route | What it shows | Managed in |
| --- | --- | --- |
| `/` | Hero, who we are, figures, the BTA model, featured initiatives, community impact, knowledge, heritage, events, the 2035 vision, partner band | `homepage` (singleton) |
| `/about` | History, mission, committee, values | `aboutPage` (singleton) |
| `/about/story` | The story of the  , in four parts | `detailPage` |
| `/about/leadership` | Leadership and governance, institutional records | `detailPage` |
| `/about/bta-2035` | The eleven goals of BTA 2035 | `detailPage` |
| `/our-people` | The people behind BTA, with a preview of the committee | `editorialPage` |
| `/our-people/leadership` | The leadership directory: names, offices, remits, towns and portraits | Demo dataset (mirrors the member register) |
| `/knowledge` | The Knowledge & Ideas Forum, sessions and topics | `editorialPage` |
| `/enterprise` | Enterprise and the Business Hub | `editorialPage` |
| `/community-impact` | The impact model and project portfolio | `editorialPage` |
| `/blue-economy` | Riverine opportunity and stewardship | `editorialPage` |
| `/heritage` | The Oral History Project | `editorialPage` |
| `/events` | The events diary, split into upcoming and past | `eventsPage` + `event` |
| `/events/[slug]` | One event, prerendered for published events | `event` |
| `/news`, `/news/[slug]` | News and stories | `event` (category `news`) |
| `/media` | The same stories, laid out as media | `event` |
| `/governance` | Governance and the document library | `detailPage` |
| `/membership` | Membership categories, the process and the inquiry form | `membershipPage` |
| `/partner` | Ways to partner, who we work with, the enquiry form | `editorialPage` |
| `/support` | Support choices that lead to the right next step | `membershipPage` |

### 2.2 Prototype 3 public pages

| Route | What it shows | Data |
| --- | --- | --- |
| `/projects` | The project bank: search, category filters, funding trackers | Stories from the CMS (`project`), figures from the demonstration layer |
| `/projects/[slug]` | One project: description, benefits, milestones, budget, documents, location map, updates | Same |
| `/donate` | A two-step contribution flow and an illustrative receipt | Demonstration layer |
| `/transparency` | Illustrative statements, budgets and expenditure | Demonstration layer |
| `/diaspora` | The diaspora hub and a registration form | Demonstration layer |
| `/youth`, `/youth/[slug]` | Scholarships, internships and mentoring, with an application form | Demonstration layer |
| `/library`, `/library/[slug]` | The knowledge hub: articles, research, webinars, reports | Demonstration layer |
| `/enterprise/business-hub`, `…/[slug]` | The member business and investment directory, with filters | Demonstration layer |
| `/volunteer` | The volunteer skills database and a registration form | Demonstration layer |
| `/feedback` | Suggestions, survey responses and project proposals | Demonstration layer |
| `/community-needs` | The community needs register | `communityNeeds` + demonstration layer |
| `/roadmap` | The phased roadmap: demonstrated, simulated, future | Written in code |
| `/knowledge/forum` | The forum index: every published article | CMS (`forumThread`) |
| `/knowledge/forum/[slug]` | One article and its discussion | CMS article + demonstration discussion |

### 2.3 What a visitor can do on the public site

- **Search** — the "Search" button in the navy strip opens a dialog that searches
  projects, knowledge, opportunities, businesses and pages. `Escape`, the close
  button or a click outside closes it.
- **Submit** — a volunteer registration, a feedback entry, a business listing, a
  partnership enquiry, a scholarship application, a diaspora registration and a
  community need. Every form validates in the browser, confirms the result, and
  states that nothing is sent to a real organisation.
- **Contribute** — the donation flow asks for a cause and an amount, then shows a
  receipt that says on its face that it is not an accounting document.
- **Read and discuss** — forum articles can be read by anyone; commenting and
  replying needs a signed-in member.

---

## 3. The Knowledge & Ideas Forum

| Part | Where it lives | Who controls it |
| --- | --- | --- |
| Articles (title, summary, body, image, author, topic, published date) | Sanity, as `forumThread` documents | An editor or the committee, in the Studio |
| Comments and replies | The demonstration layer | The signed-in member who writes them |
| Moderation of comments | The admin area (`/admin/forum`) | The committee |

**How to use it**

1. Open **/studio → Forum threads** and write an article. Set the status to
   *Published* when it is ready; a *Draft* article is invisible in the forum and
   its page returns a 404.
2. Read the article on the site. The discussion is underneath it.
3. Sign in at **/portal/login** (choose any demonstration member) and comment, or
   use **Reply** under an existing comment to start a sub-thread.
4. Hide or re-publish a comment in **/admin/forum**. A hidden comment stays in the
   record and can be published again.

**Rules the forum enforces**

- Only published articles are listed, and only published articles have pages.
- Only a signed-in member can comment or reply. Everyone else is offered the
  sign-in.
- A comment must be at least three characters; the error is shown against the
  field.

---

## 4. The members' portal

Open **/portal/login** and choose a demonstration member. The portal has no
password and no identity provider — that is stated on the sign-in page.

| Page | What it does |
| --- | --- |
| `/portal` | The dashboard: dues standing, next meeting, announcements, upcoming events, quick links |
| `/portal/profile` | Edit name, location, profession and contact details; changes are saved to the local record |
| `/portal/dues` | Dues standing, invoices, the tracker, and a **Pay (simulated)** button that issues a receipt |
| `/portal/meetings` | Meeting records, with notices, agendas and minutes |
| `/portal/directory` | The member directory, with the opt-in rule: only members who agreed to appear are listed |

Signing in as different members shows different content, because the dataset
gives each member a different category, town, profession and dues status.

---

## 5. The administrative dashboard

Open **/admin**. It is deliberately not behind a sign-in so the committee can
walk through it; it is marked `noindex` and disallowed in `robots.txt`, and every
page carries a demonstration notice.

| Panel | What it changes |
| --- | --- |
| Overview | Headline figures, recent activity and the queues |
| Membership | Dues status per member |
| Content & announcements | Publishes announcements, knowledge items and meeting records |
| Projects & progress | Moves a project between Proposed, Approved, Ongoing and Completed |
| Dues & transactions | The invoices and the transaction record |
| Scholarships | The status of each scholarship application |
| Volunteers | Registers, matches and hides volunteers |
| Businesses | Publishes or holds a business listing |
| Feedback & proposals | Reviews, responds to and publishes feedback |
| **Forum discussion** | Publishes or hides a forum comment |
| Partnerships | The partnership enquiry pipeline |
| Roles & activity | The role list and the full activity log |

**Reset** — the overview panel can restore the original dataset and sign you out.

---

## 6. The CMS (Sanity Studio)

Open **/studio**. The Studio is themed with the website's palette (navy chrome,
gold accent) and the desk is organised the way the site is:

```
Content
  Site settings · Home page · About page · Events page · Business Hub
  Knowledge Library · Community Needs · Membership page
  Editorial pages · Detail pages
  Forum threads
  Events · Featured activities
```

### 6.1 Document types

| Type | What it holds |
| --- | --- |
| `siteSettings` | Name, short name, tagline, logo, navigation, contact details, footer text, social links |
| `homepage` | The eleven home page sections |
| `aboutPage` | Title, introduction, history, mission, committee, values |
| `editorialPage` | The reusable pages: about, people, knowledge, enterprise, community, blue economy, heritage, partners |
| `detailPage` | The focused pages: story, leadership, vision, forum landing, project, event, article, oral history, centre |
| `eventsPage` | The events diary page and its categories |
| `businessHub` | The curated business listings and the search copy |
| `libraryPage` | The knowledge library page and its filters |
| `communityNeeds` | The community needs register page |
| `membershipPage` | The membership page, its categories and the FAQ |
| `event` | One event or news item, with a draft/published status |
| `featuredActivity` | The activities shown on the home page |
| `forumThread` | One forum article, with a draft/published status |
| `project` | One project in the bank, with its milestones and a draft/published status |

### 6.2 Publishing rules

- Events, forum threads and projects are filtered by `status` **in the query**, not
  in the interface: a draft never reaches a public page.
- A draft event, a draft article and a draft project are all in the seeded dataset
  on purpose, so the rule can be checked.
- Singleton pages are pinned to fixed document ids, so there is only ever one of
  each and the Studio always opens the right one.

### 6.3 Images

Every image field is optional. Leave it empty and the site shows the exact
prototype image for that section; upload an asset and it replaces the prototype
image. The image type is `imageWithAlt`, so the alternative text is required
before an image can be published.

### 6.4 On-demand revalidation

Publishing in the Studio updates the site within two minutes. To update it
immediately, point a Sanity webhook at `POST /api/revalidate` with the shared
secret in `SANITY_REVALIDATE_SECRET`. See `docs/deployment.md`.

---

## 7. The design system

The design is ported one-to-one from the approved BTA prototype.

| Token | Value | Used for |
| --- | --- | --- |
| Navy | `#061d35` | The footer, the utility strip, display type on dark bands |
| Blue | `#0a3157` | Primary buttons, headings |
| Mid | `#145587` | Secondary accents |
| Gold | `#d5a62e` | The accent: rules, roles, the primary call to action |
| Pale | `#f0d47c` | Text on navy |
| Ink | `#11263a` | Body text |
| Mist | `#f3f6f7` | Panel backgrounds, hover states |
| Cormorant Garamond | display | Headings, the footer statement, the logo |
| Manrope | body | Everything else |

**Spacing** — one vertical rhythm: 108px between desktop sections, 78px on
tablets, 62px on phones. Full-bleed bands (hero, impact, heritage, vision)
break out of the grid deliberately; everything else sits in the 1280px shell.

**Motion** — short and quiet, and every one of them respects
`prefers-reduced-motion`:

| Element | On hover |
| --- | --- |
| Buttons | Lift 2px, a deeper background and a soft shadow; the arrow slides 4px |
| Outline buttons | A 12% tint of their own colour, so the rule works on white, on gold and over a photograph |
| Filter chips | A 1px lift, a border in the accent blue, a mist background |
| Initiative and event rows | Slide 12px right on a mist background |
| Featured cards | Lift 4px with a shadow; the picture scales 4% |
| Leader cards | Lift 4px with a shadow |
| Forum cards | Lift 4px with a shadow; the picture scales 4% |
| Text links | The underline changes colour, the arrow slides |
| Form fields | The rule turns gold on focus, with a soft shadow |
| The mobile menu | Its rows are sized against the viewport height, so the whole menu fits without scrolling |

**Breakpoints** — 1100px (navigation tightens), 900px (the utility strip and
desktop navigation are replaced by the menu; two-column grids become one), 600px
(phones: 62px section padding, single-column grids, the band call to action moves
to its own line).

---

## 8. What works, what is simulated, what is missing

### Works for real

- Server rendering with time-based ISR, plus an on-demand revalidation webhook.
- A typed content layer that distinguishes "no content" from "CMS unreachable",
  and that keeps serving the last good content during a short outage.
- The publication model: drafts cannot reach a public page.
- The global search, the mobile menu, the newsletter field, every form's
  validation, and every link on every page.
- The design system, its responsive behaviour and its motion.
- The build, the type checker, the linter and the test suite.

### Simulated in the browser (works, but nothing is stored on a server)

- Signing in to the portal, and everything behind it.
- Every form submission.
- The donation and dues checkouts, and the receipts they produce.
- The admin area and every change it makes.
- Forum comments and replies, and their moderation.

### Not built (and would need a server, a database and real providers)

- Real authentication and authorisation.
- Real payments.
- Email, file storage, mapping and messaging.
- A database, so changes made in one browser are not visible in another.

---

## 9. How the data is verified

| Check | Command or script | Result |
| --- | --- | --- |
| Types | `npm run typecheck` | Clean |
| Lint | `npm run lint` | Clean, apart from one intentional warning about a plain `<img>` (the Sanity CDN already resizes the images) |
| Tests | `npm test` | 23 files, 260 tests, all passing |
| Build | `npm run build` | 101 static pages |
| Responsive | A scripted audit over 32 routes × 8 widths | No horizontal overflow anywhere |
| Mobile menu | A scripted check on two small screens | The menu opens, fits and scrolls |
| Interactions | A scripted check of 20 flows | All 20 pass |

The recorded results, with the exact commands, are in
[`docs/testing.md`](testing.md).
