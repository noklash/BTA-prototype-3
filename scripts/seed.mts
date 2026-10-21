/**
 * Seeds a Sanity dataset with the complete Bainbo Taria Awo Club (BTA)
 * demonstration content, reproducing the exact contents, images and content
 * structure of the BTA prototype (BTA-prototype-2).
 *
 *   npm run seed
 *
 * What it does
 * ------------
 * Creates (or replaces) every singleton document, every editorial page, every
 * detail page, every sectioned page (events, business hub, library, community
 * needs, membership) and every repeatable document (events, featured
 * activities) using deterministic document ids, so running it twice leaves the
 * dataset in the same state instead of duplicating content.
 *
 * Important
 * ---------
 * `createOrReplace` overwrites the documents listed below. Only run this
 * against a dataset that holds the demonstration content — never against a
 * dataset with real editorial work.
 *
 * Images are intentionally not seeded: uploading assets requires the asset
 * pipeline and deterministic ids are awkward to reproduce. Every image field on
 * the website degrades to a typographic placeholder, so the seed is complete
 * without them. Add imagery through Sanity Studio.
 *
 * Requirements
 * ------------
 * NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
 * SANITY_API_WRITE_TOKEN (an Editor token). See docs/sanity-setup.md.
 *
 * Run directly with Node's TypeScript support (Node >= 22.6); no build step and
 * no extra tooling are involved.
 */
import { createClient } from '@sanity/client'

// Kept in sync with SINGLETON_DOCUMENT_IDS in src/lib/sanity/env.ts. Duplicated
// rather than imported because that module uses extensionless relative imports
// and is therefore not directly loadable by Node's ESM resolver.
const SINGLETON_IDS = {
  siteSettings: 'siteSettings',
  homepage: 'homepage',
  aboutPage: 'aboutPage',
  editorialPageAbout: 'editorialPage-about',
  editorialPagePeople: 'editorialPage-people',
  editorialPageKnowledge: 'editorialPage-knowledge',
  editorialPageEnterprise: 'editorialPage-enterprise',
  editorialPageCommunity: 'editorialPage-community',
  editorialPageBlue: 'editorialPage-blue',
  editorialPageHeritage: 'editorialPage-heritage',
  editorialPagePartners: 'editorialPage-partners',
  editorialPageStory: 'editorialPage-story',
  editorialPageGovernance: 'editorialPage-governance',
  editorialPageVision: 'editorialPage-vision',
  detailPageForum: 'detailPage-forum',
  detailPageProject: 'detailPage-project',
  detailPageEvent: 'detailPage-event',
  detailPageArticle: 'detailPage-article',
  detailPageOral: 'detailPage-oral',
  detailPageCentre: 'detailPage-centre',
  eventsPage: 'eventsPage',
  businessHub: 'businessHub',
  libraryPage: 'libraryPage',
  communityNeeds: 'communityNeeds',
  membershipPage: 'membershipPage',
} as const

const FALLBACK_API_VERSION = '2025-02-19'
const DAY_MS = 86_400_000

interface SeedDocument {
  _id: string
  _type: string
  [key: string]: unknown
}

interface SeedSpan {
  _type: 'span'
  _key: string
  text: string
  marks?: string[]
}

interface SeedBlock {
  _type: 'block'
  _key: string
  style: 'normal' | 'h3' | 'h4' | 'blockquote'
  children: SeedSpan[]
  markDefs?: { _key: string; _type: 'link'; href: string; openInNewTab?: boolean }[]
  listItem?: 'bullet' | 'number'
  level?: number
}

function span(key: string, text: string, marks?: string[]): SeedSpan {
  return marks ? { _type: 'span', _key: key, text, marks } : { _type: 'span', _key: key, text }
}

function textBlock(key: string, style: SeedBlock['style'], text: string): SeedBlock {
  return { _type: 'block', _key: key, style, children: [span(`${key}-span`, text)] }
}

function bullet(key: string, text: string): SeedBlock {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [span(`${key}-span`, text)],
  }
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    console.error(
      `\nCannot seed: ${name} is not set.\n\n` +
        'Copy .env.example to .env.local and fill in your Sanity project id,\n' +
        'dataset and a write token, then run `npm run seed` again.\n' +
        'See docs/sanity-setup.md for the full walkthrough.\n',
    )
    process.exit(1)
  }
  return value
}

/**
 * Builds an ISO timestamp a number of days from the run, pinned to a UTC hour
 * so that a re-run does not shuffle the list. The website renders every date in
 * Europe/London regardless of the stored offset.
 */
function daysFromNow(days: number, hourUtc: number, minuteUtc = 0): string {
  const date = new Date(Date.now() + days * DAY_MS)
  date.setUTCHours(hourUtc, minuteUtc, 0, 0)
  return date.toISOString()
}

// ---------------------------------------------------------------------------
// Prototype reference data (exact copy from BTA-prototype-2/src/app/data.ts)
// ---------------------------------------------------------------------------

const pillars = [
  'Heritage',
  'People',
  'Knowledge',
  'Enterprise',
  'Community',
  'Blue Economy',
  'Next Generation',
  'Legacy',
]

const pillarDescriptions = [
  'Heritage anchors us in who we have always been.',
  'People carry the stories forward, generation to generation.',
  'Knowledge is shared openly, so no one starts from zero.',
  'Enterprise lets members build livelihoods inside their own community.',
  'Community is the rhythm that holds everything else together.',
  'Blue Economy protects the river and everything it sustains.',
  'Next Generation inherits what we build and improves on it.',
  'Legacy is what remains after we are gone — tended, not forgotten.',
]

const initiativeIds = {
  knowledgeForum: 'featured-activity-bta-knowledge-forum',
  heritageEvening: 'featured-activity-heritage-evening',
  fishingCoop: 'featured-activity-fishing-coop',
  schoolRehabilitation: 'featured-activity-school-rehabilitation',
  youthNetworking: 'featured-activity-youth-networking',
} as const

const featuredActivities: SeedDocument[] = [
  {
    _id: initiativeIds.knowledgeForum,
    _type: 'featuredActivity',
    title: 'BTA Knowledge & Ideas Forum',
    slug: { _type: 'slug', current: 'bta-knowledge-forum' },
    shortDescription:
      'Practical knowledge across finance, technology, career and care, led by members for members.',
    displayOrder: 0,
  },
  {
    _id: initiativeIds.heritageEvening,
    _type: 'featuredActivity',
    title: 'Heritage Evening',
    slug: { _type: 'slug', current: 'heritage-evening' },
    shortDescription:
      'Stories, music and food shared at the Old Library Hall each quarter.',
    displayOrder: 1,
  },
  {
    _id: initiativeIds.fishingCoop,
    _type: 'featuredActivity',
    title: 'River Fishing Co-operative',
    slug: { _type: 'slug', current: 'river-fishing-co-operative' },
    shortDescription:
      'Members pool boats, gear and knowledge so the river stays productive.',
    displayOrder: 2,
  },
  {
    _id: initiativeIds.schoolRehabilitation,
    _type: 'featuredActivity',
    title: 'School Rehabilitation',
    slug: { _type: 'slug', current: 'school-rehabilitation' },
    shortDescription:
      'Repairing classrooms and restoring the school garden with community labour.',
    displayOrder: 3,
  },
  {
    _id: initiativeIds.youthNetworking,
    _type: 'featuredActivity',
    title: 'Youth Networking Mixer',
    slug: { _type: 'slug', current: 'youth-networking-mixer' },
    shortDescription:
      'Connecting school leavers with mentors, work placements and enterprise training.',
    displayOrder: 4,
  },
]

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

const siteSettings: SeedDocument = {
  _id: SINGLETON_IDS.siteSettings,
  _type: 'siteSettings',
  title: 'Bainbo Taria Awo Club',
  shortName: 'BTA',
  tagline: 'Our heritage. Our people. Our future.',
  navItems: [
    { _key: 'nav-about-bta', label: 'About BTA', href: '/about', hasChevron: true },
    { _key: 'nav-our-people', label: 'Our People', href: '/our-people', hasChevron: true },
    { _key: 'nav-knowledge', label: 'Knowledge', href: '/knowledge', hasChevron: true },
    { _key: 'nav-enterprise', label: 'Enterprise', href: '/enterprise', hasChevron: false },
    { _key: 'nav-community-impact', label: 'Community Impact', href: '/community-impact', hasChevron: false },
    { _key: 'nav-blue-economy', label: 'Blue Economy', href: '/blue-economy', hasChevron: false },
    { _key: 'nav-heritage', label: 'Heritage', href: '/heritage', hasChevron: false },
    { _key: 'nav-projects', label: 'Projects', href: '/projects', hasChevron: false },
    { _key: 'nav-events-media', label: 'Events & Media', href: '/events', hasChevron: false },
    { _key: 'nav-partner', label: 'Partner', href: '/partner', hasChevron: false },
  ],
  utilityLink: null,
  contactEmail: 'hello@bainbotariaawo.example',
  contactPhone: '+44 20 7946 0958',
  address: 'The Old Library Hall\n12 Market Street\nNorthbridge\nNB1 4HC',
  footerText:
    'Connecting generations, sharing knowledge, creating opportunities and building a lasting legacy.',
  socialLinks: [
    { _key: 'social-facebook', platform: 'Facebook', url: 'https://example.org/bainbotariaawo' },
    { _key: 'social-instagram', platform: 'Instagram', url: 'https://example.org/bainbotariaawo' },
  ],
}

// ---------------------------------------------------------------------------
// Home page (all 11 sections, exact prototype content)
// ---------------------------------------------------------------------------

const homepage: SeedDocument = {
  _id: SINGLETON_IDS.homepage,
  _type: 'homepage',

  // 1. Hero
  heroHeading: 'Our heritage.<br/>Our people.<br/><em>Our future.</em>',
  heroDescription:
    'Connecting generations, sharing knowledge, creating opportunities and building a lasting legacy.',
  heroAside: '01 A digital home for heritage, knowledge, enterprise and community.',
  heroCtaPrimary: {
    heading: 'Join BTA',
    body: null,
    buttonLabel: 'Join BTA',
    buttonHref: '/membership',
  },
  heroCtaSecondary: {
    heading: 'Explore our initiatives',
    body: null,
    buttonLabel: 'Explore our initiatives',
    buttonHref: '/community-impact',
  },
  heroCtaTertiary: {
    heading: 'Support BTA',
    body: null,
    buttonLabel: 'Support BTA',
    buttonHref: '/support',
  },

  // 2. Intro
  introEyebrow: 'Who we are',
  introHeading: 'A community<br/>built to last.',
  introLead:
    'Bainbo Taria Awo Club brings people together through shared heritage, knowledge, enterprise and a commitment to community development.',
  introBody:
    'We create space for generations to connect, learn from one another and build opportunities beyond the present.',
  introCta: {
    heading: 'Read our story',
    body: null,
    buttonLabel: 'Read our story',
    buttonHref: '/about',
  },

  // 3. Stats
  statsItems: [
    { _key: 'stat-1', value: '50+', label: 'Years of connection' },
    { _key: 'stat-2', value: '500+', label: 'Members' },
    { _key: 'stat-3', value: '12', label: 'Active programmes' },
    { _key: 'stat-4', value: '8', label: 'Community projects' },
  ],
  statsCaption: 'Illustrative prototype figures',

  // 4. Model
  modelEyebrow: 'The BTA model',
  modelHeading: 'A current that carries us forward.',
  modelIntro:
    'One connected institutional model—from where we come from to what we leave behind.',
  modelPillars: pillars.map((title, i) => ({
    _key: `pillar-${i}`,
    title,
    description: pillarDescriptions[i] ?? '',
  })),

  // 5. Initiatives
  initiativesEyebrow: 'Featured initiatives',
  initiativesHeading: 'What we are building',
  initiativesIntro:
    'A curated view across knowledge, community, enterprise, heritage and the future of our riverine communities.',
  initiativesItems: [
    {
      _key: 'initiative-knowledge-forum',
      title: 'BTA Knowledge & Ideas Forum',
      slug: { _type: 'slug', current: 'bta-knowledge-forum' },
      shortDescription:
        'Practical knowledge across finance, technology, career and care, led by members for members.',
      status: 'ACTIVE',
      link: '/knowledge/forum',
      displayOrder: 0,
    },
    {
      _key: 'initiative-heritage-evening',
      title: 'Heritage Evening',
      slug: { _type: 'slug', current: 'heritage-evening' },
      shortDescription:
        'Stories, music and food shared at the Old Library Hall each quarter.',
      status: 'LAUNCHING',
      link: '/heritage',
      displayOrder: 1,
    },
    {
      _key: 'initiative-fishing-coop',
      title: 'River Fishing Co-operative',
      slug: { _type: 'slug', current: 'river-fishing-co-operative' },
      shortDescription:
        'Members pool boats, gear and knowledge so the river stays productive.',
      status: 'PLANNED',
      link: '/blue-economy',
      displayOrder: 2,
    },
    {
      _key: 'initiative-school-rehabilitation',
      title: 'School Rehabilitation',
      slug: { _type: 'slug', current: 'school-rehabilitation' },
      shortDescription:
        'Repairing classrooms and restoring the school garden with community labour.',
      status: 'ACTIVE',
      link: '/community-impact/school-rehabilitation',
      displayOrder: 3,
    },
    {
      _key: 'initiative-youth-networking',
      title: 'Youth Networking Mixer',
      slug: { _type: 'slug', current: 'youth-networking-mixer' },
      shortDescription:
        'Connecting school leavers with mentors, work placements and enterprise training.',
      status: 'VISION_2035',
      link: '/knowledge',
      displayOrder: 4,
    },
  ],

  // 6. Impact
  impact: {
    _key: 'impact-1',
    eyebrow: 'Community impact',
    heading: 'Goodwill, made measurable.',
    body:
      'We identify needs, assess priorities and deliver with transparent reporting.',
    metricValue: '180',
    metricLabel: 'students reached · illustrative metric',
    cta: {
      heading: 'View community impact',
      body: null,
      buttonLabel: 'View community impact',
      buttonHref: '/community-impact',
    },
  },

  // 7. Knowledge
  knowledge: {
    _key: 'knowledge-1',
    eyebrow: 'Knowledge & Ideas Forum',
    heading: 'Bring an idea. Share knowledge. Start a conversation.',
    body:
      'Practical knowledge across finance, technology, career and care, led by members for members.',
    topics: [
      'AI & Technology',
      'Entrepreneurship',
      'Leadership',
      'Health',
      'Aquaculture',
      'Legal Awareness',
    ],
    featuredSession: {
      eyebrow: 'Featured session · 18 October 2026',
      title: 'Understanding Personal Investment in Nigeria',
      description: 'With Dr. Tamuno Briggs',
      link: '/knowledge/forum',
    },
    cta: null,
  },

  // 8. Heritage
  heritage: {
    _key: 'heritage-1',
    eyebrow: 'The Oral History Project',
    heading: 'Preserving what we know.',
    body:
      'Recording the stories, experiences and knowledge of our elders before they are lost.',
    quote:
      '“Every generation holds a part of the story. Our responsibility is to carry it forward.”',
    cta: {
      heading: 'Explore heritage',
      body: null,
      buttonLabel: 'The story',
      buttonHref: '/heritage/oral-history',
    },
  },

  // 9. Events
  events: {
    _key: 'events-1',
    eyebrow: 'Events',
    heading: "What's happening at BTA",
    maxEvents: 3,
    cta: {
      heading: 'View events calendar',
      body: null,
      buttonLabel: 'View events calendar',
      buttonHref: '/events',
    },
  },

  // 10. Vision
  vision: {
    _key: 'vision-1',
    eyebrow: 'BTA 2035',
    heading: 'Looking toward<br/><em>2035.</em>',
    body:
      'A long-term framework for developing people, creating opportunity and preserving what we pass forward.',
    cta: {
      heading: 'Explore the vision',
      body: null,
      buttonLabel: 'The vision',
      buttonHref: '/about/bta-2035',
    },
  },

  // 11. Partner
  partner: {
    _key: 'partner-1',
    eyebrow: 'Partner with BTA',
    heading: 'Build something that lasts.',
    body:
      'Partnerships that create measurable value for members, communities and future generations.',
    primaryCta: {
      heading: 'Partner with us',
      body: null,
      buttonLabel: 'Partner with us',
      buttonHref: '/partner',
    },
    secondaryCta: {
      heading: 'Support BTA',
      body: null,
      buttonLabel: 'Support BTA',
      buttonHref: '/support',
    },
  },
}

// ---------------------------------------------------------------------------
// About page (exact prototype editorial content)
// ---------------------------------------------------------------------------

const aboutHistory: SeedBlock[] = [
  textBlock('history-1', 'h3', 'How we began'),
  textBlock(
    'history-2',
    'normal',
    'In the spring of 1974 a proposal was published to demolish the covered market and replace it with a car park. A group of traders, teachers and retired neighbours met in the back room of the Old Library Hall and decided that the town should at least have a record of what it was about to lose. The market survived; the record-keeping did not stop.',
  ),
  textBlock('history-3', 'h3', 'What we do now'),
  textBlock(
    'history-4',
    'normal',
    'Fifty years on, the association runs on the time of about forty volunteers. Our work falls into a few recurring habits:',
  ),
  bullet('history-5', 'Walking the boundary stones twice a year and noting anything that has changed.'),
  bullet('history-6', 'Recording oral histories with residents, and giving copies to their families.'),
  bullet('history-7', 'Cataloguing donations of photographs, letters and objects for the public archive.'),
  {
    _type: 'block',
    _key: 'history-8',
    style: 'normal',
    markDefs: [
      { _key: 'history-link-membership', _type: 'link', href: '/membership', openInNewTab: false },
    ],
    children: [
      span('history-8-a', 'None of this requires expertise, only curiosity. '),
      span('history-8-b', 'Read how to join', ['history-link-membership']),
      span('history-8-c', '.'),
    ],
  },
  {
    _type: 'block',
    _key: 'history-9',
    style: 'blockquote',
    children: [
      span(
        'history-9-span',
        'Heritage is not only the grand buildings. It is the knowledge of how a place worked.',
      ),
    ],
  },
]

const aboutPage: SeedDocument = {
  _id: SINGLETON_IDS.aboutPage,
  _type: 'aboutPage',
  title: 'About BTA',
  intro:
    'A community shaped by continuity.',
  history: aboutHistory,
  mission:
    'Our heritage. Our people. Our future.',
  leadership:
    'The association is run by a volunteer committee, elected each October at the annual general meeting. No one is paid, and every role is shared so that no single person becomes indispensable.',
  values: [
    { _key: 'value-1', title: 'Open by default', description: 'Everything we hold is available to residents, schools and researchers, free of charge.' },
    { _key: 'value-2', title: 'Told by many voices', description: 'We record memories from as wide a range of people as will speak to us, and we say who said what.' },
    { _key: 'value-3', title: 'Careful with people', description: 'Personal stories are shared only with permission, and never sold or handed to third parties.' },
    { _key: 'value-4', title: 'Useful to the present', description: 'History that is never used is only nostalgia, so we look for decisions it can inform today.' },
  ],
}

// ---------------------------------------------------------------------------
// Editorial pages (exact prototype Editorial kind content)
// ---------------------------------------------------------------------------

const editorialPages: SeedDocument[] = [
  // people (Our People)
  {
    _id: SINGLETON_IDS.editorialPagePeople,
    _type: 'editorialPage',
    kind: 'people',
    pageHero: {
      eyebrow: 'Our People',
      title: 'The people behind BTA.',
      intro: 'A community run by volunteers, for volunteers.',
    },
    articles: [
      {
        _key: 'people-art-1',
        number: '01',
        title: 'Volunteer committee',
        body: 'Elected each October at the annual general meeting, the committee steers every programme and keeps the association accountable.',
      },
      {
        _key: 'people-art-2',
        number: '02',
        title: 'Programme leads',
        body: 'Each initiative — from the Knowledge Forum to Heritage Evening — has a named lead who reports back at every meeting.',
      },
      {
        _key: 'people-art-3',
        number: '03',
        title: 'How to get involved',
        body: 'No expertise is required, only curiosity. Attend a meeting, join a walk or start a conversation at the next event.',
      },
    ],
    cta: {
      heading: 'Participate in BTA',
      body: null,
      buttonLabel: 'Join BTA',
      buttonHref: '/membership',
    },
  },

  // knowledge (Knowledge)
  {
    _id: SINGLETON_IDS.editorialPageKnowledge,
    _type: 'editorialPage',
    kind: 'knowledge',
    pageHero: {
      eyebrow: 'Knowledge',
      title: 'Knowledge, shared openly.',
      intro: 'Practical sessions across finance, technology, career and care — led by members, for members.',
    },
    articles: [
      {
        _key: 'knowledge-art-1',
        number: '01',
        title: 'The Forum',
        body: 'A monthly gathering where members present what they know and ask what they do not. No entry fee, no gatekeeping.',
      },
      {
        _key: 'knowledge-art-2',
        number: '02',
        title: 'Session archives',
        body: 'Summaries, recordings and reading lists from past sessions are kept in the Knowledge Library and available to everyone.',
      },
      {
        _key: 'knowledge-art-3',
        number: '03',
        title: 'Start a session',
        body: 'Any member can propose a session topic. The committee helps with space, promotion and finding a facilitator.',
      },
    ],
    cta: {
      heading: 'Explore the forum',
      body: null,
      buttonLabel: 'Open forum',
      buttonHref: '/knowledge/forum',
    },
  },

  // enterprise (Enterprise)
  {
    _id: SINGLETON_IDS.editorialPageEnterprise,
    _type: 'editorialPage',
    kind: 'enterprise',
    pageHero: {
      eyebrow: 'Enterprise',
      title: 'Buy BTA. Support a BTA business.',
      intro: 'A prototype member directory for trusted services, expertise and enterprise.',
    },
    articles: [
      {
        _key: 'enterprise-art-1',
        number: '01',
        title: 'The Business Hub',
        body: 'A curated directory of businesses owned by BTA members, searchable by name, expertise or location.',
      },
      {
        _key: 'enterprise-art-2',
        number: '02',
        title: 'Trusted by members',
        body: 'Every listing is recommended by at least two members and reviewed before it appears.',
      },
      {
        _key: 'enterprise-art-3',
        number: '03',
        title: 'List your business',
        body: 'BTA members in good standing can add their business to the directory at no cost.',
      },
    ],
    cta: {
      heading: 'Visit the Business Hub',
      body: null,
      buttonLabel: 'Open the hub',
      buttonHref: '/enterprise/business-hub',
    },
  },

  // community (Community Impact)
  {
    _id: SINGLETON_IDS.editorialPageCommunity,
    _type: 'editorialPage',
    kind: 'community',
    pageHero: {
      eyebrow: 'Community Impact',
      title: 'Goodwill, made measurable.',
      intro: 'We identify needs, assess priorities and deliver with transparent reporting.',
    },
    articles: [
      {
        _key: 'community-art-1',
        number: '01',
        title: 'Community Needs Register',
        body: 'Local needs are logged, reviewed by the appropriate committee and matched with available resources.',
      },
      {
        _key: 'community-art-2',
        number: '02',
        title: 'Transparent reporting',
        body: 'Every project publishes what was done, what it cost and who benefited — no exceptions.',
      },
      {
        _key: 'community-art-3',
        number: '03',
        title: 'Submit a need',
        body: 'Any resident can submit a community need through the register on this site.',
      },
    ],
    cta: {
      heading: 'Submit a community need',
      body: null,
      buttonLabel: 'Submit a need',
      buttonHref: '/community-needs',
    },
  },

  // blue (Blue Economy)
  {
    _id: SINGLETON_IDS.editorialPageBlue,
    _type: 'editorialPage',
    kind: 'blue',
    pageHero: {
      eyebrow: 'Blue Economy',
      title: 'Protecting the river, together.',
      intro: 'The river sustains this community. The Blue Economy programme keeps it productive for the next generation.',
    },
    articles: [
      {
        _key: 'blue-art-1',
        number: '01',
        title: 'River stewardship',
        body: 'Members monitor water quality, restore banks and protect breeding grounds along the shoreline.',
      },
      {
        _key: 'blue-art-2',
        number: '02',
        title: 'Fishing co-operative',
        body: 'Shared boats, gear and knowledge keep the river productive without depleting it.',
      },
      {
        _key: 'blue-art-3',
        number: '03',
        title: 'Blue Economy Centre',
        body: 'A planned centre for training, equipment storage and community research on the water.',
      },
    ],
    cta: {
      heading: 'Visit the Centre',
      body: null,
      buttonLabel: 'The vision',
      buttonHref: '/blue-economy/centre',
    },
  },

  // heritage (Heritage)
  {
    _id: SINGLETON_IDS.editorialPageHeritage,
    _type: 'editorialPage',
    kind: 'heritage',
    pageHero: {
      eyebrow: 'Heritage',
      title: 'Preserving what we know.',
      intro: 'Recording the stories, experiences and knowledge of our elders before they are lost.',
    },
    articles: [
      {
        _key: 'heritage-art-1',
        number: '01',
        title: 'Oral History Project',
        body: 'Interviews with elders, preserved in the archive and shared with their families.',
      },
      {
        _key: 'heritage-art-2',
        number: '02',
        title: 'Boundary stones',
        body: 'Twice-yearly walks trace the old parish markers and record anything that has changed.',
      },
      {
        _key: 'heritage-art-3',
        number: '03',
        title: 'Public archive',
        body: 'Photographs, letters and objects donated by residents are catalogued and freely available.',
      },
    ],
    cta: {
      heading: 'Explore heritage',
      body: null,
      buttonLabel: 'The story',
      buttonHref: '/heritage/oral-history',
    },
  },

  // partners (Partners)
  {
    _id: SINGLETON_IDS.editorialPagePartners,
    _type: 'editorialPage',
    kind: 'partners',
    pageHero: {
      eyebrow: 'Partner with BTA',
      title: 'Build something that lasts.',
      intro: 'Partnerships that create measurable value for members, communities and future generations.',
    },
    articles: [
      {
        _key: 'partners-art-1',
        number: '01',
        title: 'Why partner',
        body: 'Partner programmes reach every programme BTA runs, from knowledge sessions to heritage walks.',
      },
      {
        _key: 'partners-art-2',
        number: '02',
        title: 'What we offer',
        body: 'Access to an engaged community, local insight and a track record of delivery across Northbridge.',
      },
      {
        _key: 'partners-art-3',
        number: '03',
        title: 'Start a conversation',
        body: 'Get in touch through the partner page and we will arrange a meeting within the month.',
      },
    ],
    cta: {
      heading: 'Start a conversation',
      body: null,
      buttonLabel: 'Talk to us',
      buttonHref: '/partner',
    },
  },

  // story (Our Story)
  {
    _id: SINGLETON_IDS.editorialPageStory,
    _type: 'editorialPage',
    kind: 'story',
    pageHero: {
      eyebrow: 'Our Story',
      title: 'Continuity is our inheritance.',
      intro: "A place for BTA's verified history, milestones, people and records.",
    },
    articles: [
      {
        _key: 'story-art-1',
        number: '01',
        title: 'Origins',
        body: 'In 1974, a proposal to demolish the covered market brought neighbours together. The market survived, and the association was born.',
      },
      {
        _key: 'story-art-2',
        number: '02',
        title: 'Growth',
        body: 'Five decades of walks, talks, recordings and campaigns that kept Northbridge&rsquo;s heritage alive.',
      },
      {
        _key: 'story-art-3',
        number: '03',
        title: 'Today',
        body: 'A volunteer-run association with programmes across knowledge, enterprise, heritage and the river.',
      },
      {
        _key: 'story-art-4',
        number: '04',
        title: 'The future',
        body: 'BTA 2035 sets out the long-term framework for the next generation.',
      },
    ],
    cta: {
      heading: 'Explore heritage',
      body: null,
      buttonLabel: 'The story',
      buttonHref: '/heritage/oral-history',
    },
  },

  // governance (Leadership & Governance)
  {
    _id: SINGLETON_IDS.editorialPageGovernance,
    _type: 'editorialPage',
    kind: 'governance',
    pageHero: {
      eyebrow: 'Leadership & Governance',
      title: 'Trust requires accountability.',
      intro: 'Clear governance, responsible leadership and accessible institutional records strengthen BTA.',
    },
    articles: [
      {
        _key: 'gov-art-1',
        number: '01',
        title: 'Constitution',
        body: 'The association&rsquo;s governing document, reviewed at each annual general meeting.',
      },
      {
        _key: 'gov-art-2',
        number: '02',
        title: 'Committee minutes',
        body: 'Minutes from committee meetings, available to members on request.',
      },
      {
        _key: 'gov-art-3',
        number: '03',
        title: 'Annual reports',
        body: 'Yearly summaries of activity, finances and plans, published each spring.',
      },
      {
        _key: 'gov-art-4',
        number: '04',
        title: 'Safeguarding policy',
        body: 'How we protect vulnerable people involved in our activities.',
      },
      {
        _key: 'gov-art-5',
        number: '05',
        title: 'Equality statement',
        body: 'BTA is open to everyone, regardless of background, belief or identity.',
      },
      {
        _key: 'gov-art-6',
        number: '06',
        title: 'Data protection',
        body: 'How we collect, store and use personal information in line with UK law.',
      },
    ],
    cta: {
      heading: 'Read the documents',
      body: null,
      buttonLabel: 'The library',
      buttonHref: '/governance',
    },
  },

  // vision (BTA 2035)
  {
    _id: SINGLETON_IDS.editorialPageVision,
    _type: 'editorialPage',
    kind: 'vision',
    pageHero: {
      eyebrow: 'BTA 2035',
      title: 'Looking toward 2035.',
      intro: 'Our long-term framework for a stronger institution and the heritage we pass forward.',
    },
    articles: [
      {
        _key: 'vision-art-1',
        number: '01',
        title: 'Develop long-term capacity',
        body: 'Build the volunteer base, the skills and the systems the association needs to last.',
      },
      {
        _key: 'vision-art-2',
        number: '02',
        title: 'Create measurable value',
        body: 'Every programme should show what it achieved, for whom and at what cost.',
      },
      {
        _key: 'vision-art-3',
        number: '03',
        title: 'Preserve what we pass forward',
        body: 'The archive, the oral histories and the boundary stones are for the next generation.',
      },
      {
        _key: 'vision-art-4',
        number: '04',
        title: 'Strengthen the river economy',
        body: 'The Blue Economy Centre and fishing co-operative keep the river productive.',
      },
      {
        _key: 'vision-art-5',
        number: '05',
        title: 'Reach the next generation',
        body: 'Schools, youth networking and mentoring keep BTA relevant to those who come next.',
      },
      {
        _key: 'vision-art-6',
        number: '06',
        title: 'Keep the knowledge flowing',
        body: 'The forum, the library and the session archives stay open to everyone.',
      },
      {
        _key: 'vision-art-7',
        number: '07',
        title: 'Protect the heritage',
        body: 'Boundary stones, oral histories and the public archive grow every year.',
      },
      {
        _key: 'vision-art-8',
        number: '08',
        title: 'Support local enterprise',
        body: 'The Business Hub connects members with trusted local services.',
      },
      {
        _key: 'vision-art-9',
        number: '09',
        title: 'Record community needs',
        body: 'The Needs Register makes local priorities visible and actionable.',
      },
      {
        _key: 'vision-art-10',
        number: '10',
        title: 'Invite partnership',
        body: 'Organisations and individuals can partner with BTA on shared goals.',
      },
      {
        _key: 'vision-art-11',
        number: '11',
        title: 'Hand it on',
        body: 'Succession planning so no role depends on a single person.',
      },
    ],
    cta: {
      heading: 'Explore the vision',
      body: null,
      buttonLabel: 'The vision',
      buttonHref: '/about/bta-2035',
    },
  },
]

// ---------------------------------------------------------------------------
// Forum threads (articles shared by members, discussed in comments)
// ---------------------------------------------------------------------------

const forumThreads: SeedDocument[] = [
  {
    _id: 'forumThread-personal-investment',
    _type: 'forumThread',
    title: 'Understanding Personal Investment in Nigeria',
    slug: { _type: 'slug', current: 'understanding-personal-investment-in-nigeria' },
    excerpt:
      'What personal investment actually means in the Nigerian context: where to start, what to avoid, and how much of your income should be committed.',
    body: [
      textBlock(
        'thread-investment-1',
        'normal',
        'Every month someone in the club asks where to start with money they do not have much of. This article is the answer we agreed to write down properly: what personal investment means here, the three rules we follow, and the mistakes we have seen other people make.',
      ),
      textBlock('thread-investment-2', 'h3', 'Start with the boring part'),
      textBlock(
        'thread-investment-3',
        'normal',
        'Before any investment, the money that comes in has to be divided: the part that pays for the month, the part that covers the surprises, and only then the part that can be committed for years. Members who skip this step tend to start again from zero.',
      ),
      textBlock('thread-investment-4', 'h3', 'Three questions before you buy anything'),
      bullet('thread-investment-5', 'Do I understand exactly what I am buying?'),
      bullet('thread-investment-6', 'What happens to it if I need the money next year?'),
      bullet('thread-investment-7', 'Who is taking a fee from me, and how much?'),
      textBlock(
        'thread-investment-8',
        'normal',
        'None of this is financial advice, and no member is a licensed adviser. It is what has worked for people in this club, written down so that the next person can start from a clearer place.',
      ),
    ],
    author: 'Tamuno Georgewill',
    authorRole: 'Treasurer',
    category: 'Knowledge & Ideas',
    publishedAt: '2026-10-18T09:00:00.000Z',
    status: 'published',
  },
  {
    _id: 'forumThread-cooperative-lessons',
    _type: 'forumThread',
    title: 'Running a fisheries cooperative: what worked and what did not',
    slug: { _type: 'slug', current: 'running-a-fisheries-cooperative' },
    excerpt:
      'Three years of running a cooperative on the river, written honestly: the decisions that paid off, the ones that did not, and the bookkeeping we should have kept from day one.',
    body: [
      textBlock(
        'thread-coop-1',
        'normal',
        'Our cooperative now supplies four neighbouring communities, and it nearly did not survive its second year. This is the version of the story I would have wanted before we started, written while the details are still honest.',
      ),
      textBlock('thread-coop-2', 'h3', 'What worked'),
      bullet('thread-coop-3', 'Writing the rules down before we needed them.'),
      bullet('thread-coop-4', 'Buying cold storage together instead of individually.'),
      bullet('thread-coop-5', 'Meeting on the same day every month, whatever the weather.'),
      textBlock('thread-coop-3', 'h3', 'What did not'),
      textBlock(
        'thread-coop-6',
        'normal',
        'We started without a bookkeeper. For eleven months the money was tracked in a notebook, and reconciling it took a fortnight. We also took on a member who wanted to sell to us at a lower price than the market, and the disagreement nearly ended the cooperative.',
      ),
      textBlock(
        'thread-coop-7',
        'blockquote',
        'The record of a decision is worth more than the decision itself.',
      ),
    ],
    author: 'Precious Abbey',
    authorRole: 'Committee member',
    category: 'Aquaculture & Blue Economy',
    publishedAt: '2026-09-29T09:00:00.000Z',
    status: 'published',
  },
  {
    _id: 'forumThread-first-role-in-technology',
    _type: 'forumThread',
    title: 'Getting a first role in technology without a computer science degree',
    slug: { _type: 'slug', current: 'getting-a-first-role-in-technology' },
    excerpt:
      'A practical path into the technology industry for people who studied something else: what to learn, what to build, and how to answer the interview question nobody prepares for.',
    body: [
      textBlock(
        'thread-tech-1',
        'normal',
        'Several members came into technology from law, education and engineering management. Here is the route that worked for them, in the order it actually happened rather than the order it is usually described.',
      ),
      textBlock('thread-tech-2', 'h3', 'Pick one thing and build it for someone real'),
      textBlock(
        'thread-tech-3',
        'normal',
        'A portfolio of five small, finished projects beats a certificate every time. The projects do not need to be impressive; they need to be real, used by someone, and explainable in three minutes.',
      ),
      textBlock('thread-tech-4', 'h3', 'The question nobody prepares for'),
      textBlock(
        'thread-tech-5',
        'normal',
        'Expect to be asked what you have changed in the work of others. Answer with a specific example: a process you shortened, a report you automated, a colleague you handed something to that used to be lost.',
      ),
    ],
    author: 'Ibifuro Amachree',
    authorRole: 'Diaspora member',
    category: 'Technology',
    publishedAt: '2026-09-12T09:00:00.000Z',
    status: 'published',
  },
  {
    _id: 'forumThread-oral-history-notes',
    _type: 'forumThread',
    title: 'Notes from the Oral History Project: recording an elder’s story',
    slug: { _type: 'slug', current: 'oral-history-project-notes' },
    excerpt:
      'What we have learned after twelve recorded conversations: how to prepare, how to listen, and why the pauses matter more than the answers.',
    body: [
      textBlock(
        'thread-oral-1',
        'normal',
        'Twelve conversations in, the project has taught us more about listening than about recording. These are the working notes we share before the recordings are archived.',
      ),
      textBlock('thread-oral-2', 'h3', 'Before the visit'),
      bullet('thread-oral-3', 'Ask what the elder wants remembered, and write it down.'),
      bullet('thread-oral-4', 'Agree with the family who may hear it.'),
      bullet('thread-oral-5', 'Test the equipment in the room, not in the car.'),
      textBlock('thread-oral-6', 'h3', 'During'),
      textBlock(
        'thread-oral-7',
        'normal',
        'Leave the silence alone. The pause before an answer is usually where the memory is being located, and filling it takes the memory with it. Two people, one recorder, and no hurry.',
      ),
      textBlock(
        'thread-oral-8',
        'blockquote',
        'Every generation holds a part of the story. Our responsibility is to carry it forward.',
      ),
    ],
    author: 'Ada Nwosu',
    authorRole: 'Vice President',
    category: 'Heritage',
    publishedAt: '2026-08-20T09:00:00.000Z',
    status: 'published',
  },
  {
    _id: 'forumThread-building-in-public',
    _type: 'forumThread',
    title: 'Building in public: why we publish our project numbers',
    slug: { _type: 'slug', current: 'building-in-public-project-numbers' },
    excerpt:
      'Somebody asked why we publish costs and shortfalls alongside our successes. The short answer is trust; the long answer is in how decisions get made.',
    body: [
      textBlock(
        'thread-public-1',
        'normal',
        'Publishing the numbers is not a favour we do to supporters. It is how the committee makes decisions, because a number that everybody can see is a number that has to be explained.',
      ),
      textBlock('thread-public-2', 'h3', 'What we publish'),
      bullet('thread-public-3', 'The cost of each project, and what it was estimated at.'),
      bullet('thread-public-4', 'How much has been raised, and from where.'),
      bullet('thread-public-5', 'Where the money went, including the parts that did not work.'),
      textBlock(
        'thread-public-6',
        'normal',
        'A project that fell short and was published is worth more to the club than a project that succeeded quietly and taught us nothing.',
      ),
    ],
    author: 'Soala Ogan',
    authorRole: 'Secretary',
    category: 'Leadership & Governance',
    publishedAt: '2026-08-04T09:00:00.000Z',
    status: 'published',
  },
  {
    // A draft article: it must not appear in the forum until it is published,
    // exactly like the draft event.
    _id: 'forumThread-untitled-draft',
    _type: 'forumThread',
    title: 'Draft: notes towards a mentoring circle',
    slug: { _type: 'slug', current: 'notes-towards-a-mentoring-circle' },
    excerpt:
      'A working draft. It is still being written and must not be visible in the forum.',
    body: [
      textBlock(
        'thread-draft-1',
        'normal',
        'This article is still a draft. It is in the dataset so that the publishing rule can be checked: a draft thread is not listed in the forum, and its page is not reachable.',
      ),
    ],
    author: 'Boma Tariah',
    authorRole: 'Committee member',
    category: 'Leadership & Governance',
    publishedAt: '2026-10-21T09:00:00.000Z',
    status: 'draft',
  },
]

// ---------------------------------------------------------------------------
// Projects (seeded from the shared demonstration dataset)
// ---------------------------------------------------------------------------

const projects: SeedDocument[] = [
  {
    _id: 'project-buguma-community-hall-rehabilitation',
    _type: 'project',
    title: 'Community hall rehabilitation',
    slug: { _type: 'slug', current: 'buguma-community-hall-rehabilitation' },
    summary:
      'Re-roofing, re-wiring and accessibility works at the community hall used for general meetings and youth programmes.',
    description: [
      textBlock(
        'project-buguma-community-hall-rehabilitation-1',
        'normal',
        'The hall is the association’s main gathering space. The rehabilitation replaces the leaking roof, modernises the electrical installation and adds a ramped entrance and accessible toilet. Works are carried out in phases so the hall can stay in use.',
      ),
      textBlock(
        'project-buguma-community-hall-rehabilitation-2',
        'h3',
        'Expected community benefits: About 1,200 residents who use the hall each year',
      ),
    ],
    milestones: [
      { _key: 'project-buguma-community-hall-rehabilitation-milestone-0', _type: 'projectMilestone', label: 'Structural survey completed', done: true },
      { _key: 'project-buguma-community-hall-rehabilitation-milestone-1', _type: 'projectMilestone', label: 'Roof and trusses replaced', done: true },
      { _key: 'project-buguma-community-hall-rehabilitation-milestone-2', _type: 'projectMilestone', label: 'Electrical installation', done: false },
      { _key: 'project-buguma-community-hall-rehabilitation-milestone-3', _type: 'projectMilestone', label: 'Accessibility works', done: false },
      { _key: 'project-buguma-community-hall-rehabilitation-milestone-4', _type: 'projectMilestone', label: 'Handover to the community', done: false },
    ],
    category: 'Infrastructure',
    location: 'Buguma, Asari-Toru',
    beneficiaries: 'About 1,200 residents who use the hall each year',
    communityBenefits: [
      'A safe, dry venue for general meetings and community events',
      'Step-free access for older members and wheelchair users',
      'Reliable power for the youth reading room',
    ],
    status: 'published',
  },
  {
    _id: 'project-water-sanitation-upgrade',
    _type: 'project',
    title: 'Water and sanitation upgrade',
    slug: { _type: 'slug', current: 'water-sanitation-upgrade' },
    summary:
      'A solar-powered borehole and a community sanitation block serving three streets near the waterfront.',
    description: [
      textBlock(
        'project-water-sanitation-upgrade-1',
        'normal',
        'The project delivers a solar-powered borehole with a 10,000-litre storage tank and a small sanitation block. A local water committee is trained to maintain the pump, and a modest tariff covers replacement parts.',
      ),
      textBlock(
        'project-water-sanitation-upgrade-2',
        'h3',
        'Expected community benefits: Roughly 300 households within walking distance',
      ),
    ],
    milestones: [
      { _key: 'project-water-sanitation-upgrade-milestone-0', _type: 'projectMilestone', label: 'Hydrogeological survey', done: true },
      { _key: 'project-water-sanitation-upgrade-milestone-1', _type: 'projectMilestone', label: 'Borehole drilling', done: false },
      { _key: 'project-water-sanitation-upgrade-milestone-2', _type: 'projectMilestone', label: 'Solar array and tank', done: false },
      { _key: 'project-water-sanitation-upgrade-milestone-3', _type: 'projectMilestone', label: 'Sanitation block', done: false },
    ],
    category: 'Water and sanitation',
    location: 'Buguma waterfront',
    beneficiaries: 'Roughly 300 households within walking distance',
    communityBenefits: [
      'Reliable clean water during the dry season',
      'Reduced reliance on vendors and sachet water',
      'Local maintenance work for two technicians',
    ],
    status: 'published',
  },
  {
    _id: 'project-secondary-school-scholarships',
    _type: 'project',
    title: 'Secondary school scholarships',
    slug: { _type: 'slug', current: 'secondary-school-scholarships' },
    summary:
      'Means-tested scholarships covering fees, books and transport for twelve students each academic year.',
    description: [
      textBlock(
        'project-secondary-school-scholarships-1',
        'normal',
        'The scholarship scheme supports students from households that would otherwise struggle to keep them in school. Awards are means-tested by a panel and reviewed each term. This project page tracks the fund, not individual students.',
      ),
      textBlock(
        'project-secondary-school-scholarships-2',
        'h3',
        'Expected community benefits: 12 students each academic year',
      ),
    ],
    milestones: [
      { _key: 'project-secondary-school-scholarships-milestone-0', _type: 'projectMilestone', label: 'Panel constituted', done: true },
      { _key: 'project-secondary-school-scholarships-milestone-1', _type: 'projectMilestone', label: 'First cohort awarded', done: true },
      { _key: 'project-secondary-school-scholarships-milestone-2', _type: 'projectMilestone', label: 'Second cohort awarded', done: true },
      { _key: 'project-secondary-school-scholarships-milestone-3', _type: 'projectMilestone', label: 'Endowment target reached', done: false },
    ],
    category: 'Education',
    location: 'Buguma and surrounding communities',
    beneficiaries: '12 students each academic year',
    communityBenefits: [
      'Reduced dropout among lower-income households',
      'A pipeline of young people into tertiary education',
      'Mentoring by member professionals',
    ],
    status: 'published',
  },
  {
    _id: 'project-primary-health-post-equipment',
    _type: 'project',
    title: 'Primary health post equipment',
    slug: { _type: 'slug', current: 'primary-health-post-equipment' },
    summary:
      'Diagnostic equipment, a vaccine fridge and maternity supplies for the primary health post.',
    description: [
      textBlock(
        'project-primary-health-post-equipment-1',
        'normal',
        'The health post is the first point of care for many families. This project equips it with a working vaccine cold chain, basic diagnostics and safe maternity supplies, and supports refresher training for two nurses.',
      ),
      textBlock(
        'project-primary-health-post-equipment-2',
        'h3',
        'Expected community benefits: Families within the health post catchment',
      ),
    ],
    milestones: [
      { _key: 'project-primary-health-post-equipment-milestone-0', _type: 'projectMilestone', label: 'Needs assessment', done: true },
      { _key: 'project-primary-health-post-equipment-milestone-1', _type: 'projectMilestone', label: 'Equipment procurement', done: false },
      { _key: 'project-primary-health-post-equipment-milestone-2', _type: 'projectMilestone', label: 'Nurse refresher training', done: false },
    ],
    category: 'Healthcare',
    location: 'Buguma',
    beneficiaries: 'Families within the health post catchment',
    communityBenefits: [
      'A reliable vaccine cold chain',
      'Basic diagnostics available locally',
      'Safer maternity care',
    ],
    status: 'published',
  },
  {
    _id: 'project-oral-history-archive',
    _type: 'project',
    title: 'Oral history archive',
    slug: { _type: 'slug', current: 'oral-history-archive' },
    summary:
      'Recording, transcribing and archiving the stories of elders, with a public listening room.',
    description: [
      textBlock(
        'project-oral-history-archive-1',
        'normal',
        'The archive records interviews with elders, transcribes them, and stores both audio and transcripts. A small listening room lets members and school groups access the collection under supervision.',
      ),
      textBlock(
        'project-oral-history-archive-2',
        'h3',
        'Expected community benefits: Members, researchers and school groups',
      ),
    ],
    milestones: [
      { _key: 'project-oral-history-archive-milestone-0', _type: 'projectMilestone', label: 'Recording equipment acquired', done: true },
      { _key: 'project-oral-history-archive-milestone-1', _type: 'projectMilestone', label: 'First 40 interviews recorded', done: true },
      { _key: 'project-oral-history-archive-milestone-2', _type: 'projectMilestone', label: 'Transcription backlog cleared', done: false },
      { _key: 'project-oral-history-archive-milestone-3', _type: 'projectMilestone', label: 'Listening room opened', done: false },
    ],
    category: 'Cultural preservation',
    location: 'Buguma',
    beneficiaries: 'Members, researchers and school groups',
    communityBenefits: [
      'A permanent record of local knowledge',
      'Teaching material for schools',
      'A shared heritage for the diaspora',
    ],
    status: 'published',
  },
  {
    _id: 'project-youth-vocational-workshop',
    _type: 'project',
    title: 'Youth vocational workshop',
    slug: { _type: 'slug', current: 'youth-vocational-workshop' },
    summary:
      'A shared workshop for tailoring, carpentry and solar maintenance training for young people.',
    description: [
      textBlock(
        'project-youth-vocational-workshop-1',
        'normal',
        'The workshop gives school leavers practical skills and a route into work or self-employment. Training runs in short cycles with local artisans as instructors and a starter-toolkit grant on completion.',
      ),
      textBlock(
        'project-youth-vocational-workshop-2',
        'h3',
        'Expected community benefits: 40 trainees a year',
      ),
    ],
    milestones: [
      { _key: 'project-youth-vocational-workshop-milestone-0', _type: 'projectMilestone', label: 'Site identified', done: true },
      { _key: 'project-youth-vocational-workshop-milestone-1', _type: 'projectMilestone', label: 'Curriculum agreed', done: false },
      { _key: 'project-youth-vocational-workshop-milestone-2', _type: 'projectMilestone', label: 'Building works', done: false },
    ],
    category: 'Youth empowerment',
    location: 'Buguma',
    beneficiaries: '40 trainees a year',
    communityBenefits: [
      'Practical skills for school leavers',
      'Support for local artisans',
      'A route into self-employment',
    ],
    status: 'published',
  },
  {
    _id: 'project-river-cleanup-and-mangrove-restoration',
    _type: 'project',
    title: 'River clean-up and mangrove restoration',
    slug: { _type: 'slug', current: 'river-cleanup-and-mangrove-restoration' },
    summary:
      'Community clean-ups and mangrove replanting along the creeks with the fisheries cooperative.',
    description: [
      textBlock(
        'project-river-cleanup-and-mangrove-restoration-1',
        'normal',
        'Working with the fisheries cooperative, volunteers clear plastic waste from the creeks and replant mangroves in degraded areas. The project also collects simple data on the fish catch to track recovery.',
      ),
      textBlock(
        'project-river-cleanup-and-mangrove-restoration-2',
        'h3',
        'Expected community benefits: Fishing households and the wider creek ecosystem',
      ),
    ],
    milestones: [
      { _key: 'project-river-cleanup-and-mangrove-restoration-milestone-0', _type: 'projectMilestone', label: 'Baseline survey', done: true },
      { _key: 'project-river-cleanup-and-mangrove-restoration-milestone-1', _type: 'projectMilestone', label: 'First planting season', done: true },
      { _key: 'project-river-cleanup-and-mangrove-restoration-milestone-2', _type: 'projectMilestone', label: 'Second planting season', done: false },
    ],
    category: 'Water and sanitation',
    location: 'Buguma creeks',
    beneficiaries: 'Fishing households and the wider creek ecosystem',
    communityBenefits: [
      'Healthier nursery grounds for fish',
      'Less plastic in the creeks',
      'Better data on the local fishery',
    ],
    status: 'published',
  },
  {
    _id: 'project-members-welfare-fund',
    _type: 'project',
    title: 'Members’ welfare fund',
    slug: { _type: 'slug', current: 'members-welfare-fund' },
    summary:
      'A modest, confidential fund for members facing bereavement or sudden hardship.',
    description: [
      textBlock(
        'project-members-welfare-fund-1',
        'normal',
        'The welfare fund makes small, confidential grants to members and their immediate families at times of bereavement or sudden hardship. Disbursements are recorded in aggregate only, to protect privacy.',
      ),
      textBlock(
        'project-members-welfare-fund-2',
        'h3',
        'Expected community benefits: Members and their families',
      ),
    ],
    milestones: [
      { _key: 'project-members-welfare-fund-milestone-0', _type: 'projectMilestone', label: 'Fund established', done: true },
      { _key: 'project-members-welfare-fund-milestone-1', _type: 'projectMilestone', label: 'First full year of operation', done: true },
      { _key: 'project-members-welfare-fund-milestone-2', _type: 'projectMilestone', label: 'Reviewed and re-endowed', done: true },
    ],
    category: 'Cultural preservation',
    location: 'Association-wide',
    beneficiaries: 'Members and their families',
    communityBenefits: [
      'A dignified response to bereavement',
      'Immediate support in a crisis',
      'Strengthened member solidarity',
    ],
    status: 'published',
  },
]

// ---------------------------------------------------------------------------
// Detail pages (exact prototype Detail type content)
// ---------------------------------------------------------------------------

const detailPages: SeedDocument[] = [
  // forum (Knowledge Forum landing page)
  {
    _id: SINGLETON_IDS.detailPageForum,
    _type: 'detailPage',
    type: 'forum',
    slug: { _type: 'slug', current: 'knowledge-forum' },
    pageHero: {
      eyebrow: 'Knowledge & Ideas Forum',
      title: 'Bring an idea. Share knowledge.',
      intro:
        'A place where members publish what they know, and where the conversation continues in comments and replies.',
    },
    about: {
      lead:
        'The forum is where practical knowledge is shared in writing. A member publishes an article, other members read it, and the discussion continues underneath in comments and replies.',
      body: [
        textBlock(
          'forum-about-1',
          'normal',
          'Articles are written and published by members, with an image where one helps the story. Anyone signed in to the members portal can comment, and can reply to a comment to keep the conversation going. The forum is deliberately slow and considered: a thread is a conversation over days, not minutes.',
        ),
        textBlock(
          'forum-about-2',
          'blockquote',
          'Bring an idea. Share knowledge. Start a conversation.',
        ),
      ],
    },
    whatToExpect: [
      { _key: 'expect-forum-1', text: 'Articles on finance, enterprise, health, technology and heritage' },
      { _key: 'expect-forum-2', text: 'Comments from members, with replies that keep a thread alive' },
      { _key: 'expect-forum-3', text: 'Reading lists and practical next steps, not theory' },
    ],
    atAGlance: {
      title: 'Knowledge & Ideas Forum',
      status: 'ACTIVE',
    },
    cta: {
      heading: 'Join BTA',
      body: null,
      buttonLabel: 'Join BTA',
      buttonHref: '/membership',
    },
  },

  // project (School Rehabilitation)
  {
    _id: SINGLETON_IDS.detailPageProject,
    _type: 'detailPage',
    type: 'project',
    slug: { _type: 'slug', current: 'school-rehabilitation' },
    pageHero: {
      eyebrow: 'Community Project',
      title: 'School Rehabilitation',
      intro: 'Repairing classrooms and restoring the school garden with community labour.',
    },
    about: {
      lead:
        'The school rehabilitation project restores classrooms and the school garden at the community primary school, using local labour and donated materials.',
      body: [
        textBlock(
          'project-about-1',
          'normal',
          'Volunteers repair roofs, repaint walls and rebuild desks. The garden grows vegetables for the school kitchen and teaches children how to grow their own food.',
        ),
      ],
    },
    whatToExpect: [
      { _key: 'expect-project-1', text: 'Weekend work parties every month' },
      { _key: 'expect-project-2', text: 'Tools and materials provided' },
      { _key: 'expect-project-3', text: 'Open to all members and residents' },
    ],
    atAGlance: {
      title: 'School Rehabilitation',
      status: 'ACTIVE',
    },
    cta: {
      heading: 'Express interest',
      body: null,
      buttonLabel: 'Join BTA',
      buttonHref: '/membership',
    },
  },

  // event (Knowledge Forum event)
  {
    _id: SINGLETON_IDS.detailPageEvent,
    _type: 'detailPage',
    type: 'event',
    slug: { _type: 'slug', current: 'knowledge-forum' },
    pageHero: {
      eyebrow: 'Event',
      title: 'Understanding Personal Investment in Nigeria',
      intro: 'With Dr. Tamuno Briggs · 18 October 2026',
    },
    about: {
      lead:
        'The forum session on personal investment, held at the Old Library Hall on 18 October 2026.',
      body: [
        textBlock(
          'event-about-1',
          'normal',
          'Dr. Tamuno Briggs leads this session on personal investment in the Nigerian context — what it means, how to start and what to watch out for. Fifty minutes of talk, followed by questions and refreshments.',
        ),
      ],
    },
    whatToExpect: [
      { _key: 'expect-event-1', text: 'Doors open at 3:30 PM' },
      { _key: 'expect-event-2', text: 'Talk begins at 4:00 PM' },
      { _key: 'expect-event-3', text: 'Free entry, all welcome' },
    ],
    atAGlance: {
      title: 'Knowledge Forum',
      status: 'ACTIVE',
    },
    cta: {
      heading: 'Express interest',
      body: null,
      buttonLabel: 'Join BTA',
      buttonHref: '/membership',
    },
  },

  // article (Community Education)
  {
    _id: SINGLETON_IDS.detailPageArticle,
    _type: 'detailPage',
    type: 'article',
    slug: { _type: 'slug', current: 'community-education' },
    pageHero: {
      eyebrow: 'Article',
      title: 'Community Education in Northbridge',
      intro: 'A look at how local schools and the association work together.',
    },
    about: {
      lead:
        'Community education sits at the intersection of the school rehabilitation project and the Knowledge Forum.',
      body: [
        textBlock(
          'article-about-1',
          'normal',
          'When classrooms are repaired and the garden is producing, children learn better. When adults attend forum sessions, they bring that knowledge home. The two sides feed each other.',
        ),
      ],
    },
    whatToExpect: [
      { _key: 'expect-article-1', text: 'Termly parent-teacher forums' },
      { _key: 'expect-article-2', text: 'Adult literacy classes in the reading room' },
      { _key: 'expect-article-3', text: 'Holiday reading programmes' },
    ],
    atAGlance: {
      title: 'Community Education',
      status: 'LAUNCHING',
    },
    cta: {
      heading: 'Express interest',
      body: null,
      buttonLabel: 'Join BTA',
      buttonHref: '/membership',
    },
  },

  // oral (Oral History)
  {
    _id: SINGLETON_IDS.detailPageOral,
    _type: 'detailPage',
    type: 'oral',
    slug: { _type: 'slug', current: 'oral-history' },
    pageHero: {
      eyebrow: 'Oral History',
      title: 'The Oral History Project',
      intro: 'Recording the stories, experiences and knowledge of our elders before they are lost.',
    },
    about: {
      lead:
        'Every generation holds a part of the story. Our responsibility is to carry it forward.',
      body: [
        textBlock(
          'oral-about-1',
          'normal',
          'Volunteers record interviews with elders across Northbridge, preserving memories of the market, the river and the old parish. Copies go to the families and to the public archive.',
        ),
      ],
    },
    whatToExpect: [
      { _key: 'expect-oral-1', text: 'Interviews recorded with permission' },
      { _key: 'expect-oral-2', text: 'Audio and transcript preserved' },
      { _key: 'expect-oral-3', text: 'Family copies provided' },
    ],
    atAGlance: {
      title: 'Oral History Project',
      status: 'PLANNED',
    },
    cta: {
      heading: 'Express interest',
      body: null,
      buttonLabel: 'Join BTA',
      buttonHref: '/membership',
    },
  },

  // centre (Blue Economy Centre)
  {
    _id: SINGLETON_IDS.detailPageCentre,
    _type: 'detailPage',
    type: 'centre',
    slug: { _type: 'slug', current: 'blue-economy-centre' },
    pageHero: {
      eyebrow: 'Blue Economy Centre',
      title: 'A centre on the water.',
      intro: 'Training, equipment storage and community research for the river economy.',
    },
    about: {
      lead:
        'The planned Blue Economy Centre will house the fishing co-operative, training space and community research lab by the river.',
      body: [
        textBlock(
          'centre-about-1',
          'normal',
          'The centre will provide secure storage for boats and gear, a classroom for training sessions, and a small lab for water-quality monitoring run with local schools.',
        ),
      ],
    },
    whatToExpect: [
      { _key: 'expect-centre-1', text: 'Feasibility study underway' },
      { _key: 'expect-centre-2', text: 'Site identified on the riverbank' },
      { _key: 'expect-centre-3', text: 'Funding applications in progress' },
    ],
    atAGlance: {
      title: 'Blue Economy Centre',
      status: 'VISION_2035',
    },
    cta: {
      heading: 'Express interest',
      body: null,
      buttonLabel: 'Join BTA',
      buttonHref: '/membership',
    },
  },
]

// ---------------------------------------------------------------------------
// Sectioned pages
// ---------------------------------------------------------------------------

const eventsPage: SeedDocument = {
  _id: SINGLETON_IDS.eventsPage,
  _type: 'eventsPage',
  pageHero: {
    eyebrow: 'Events & Media',
    title: "What's happening at BTA",
    intro: 'A calendar of forums, member gatherings, heritage walks and partner events. All times are local.',
  },
  note: true,
  categories: ['All', 'Knowledge', 'Members', 'Heritage', 'Our People'],
}

const businessHub: SeedDocument = {
  _id: SINGLETON_IDS.businessHub,
  _type: 'businessHub',
  pageHero: {
    eyebrow: 'BTA Business Hub',
    title: 'Buy BTA. Support a BTA business.',
    intro: 'A prototype member directory for trusted services, expertise and enterprise.',
  },
  note: true,
  searchPlaceholder: 'Search by name, expertise or location',
  searchCategoriesButton: 'All categories',
  businesses: [
    { _key: 'biz-1', number: '01', name: 'River Bend Supplies', category: 'General store', location: 'Market Street', link: '/enterprise/business-hub' },
    { _key: 'biz-2', number: '02', name: 'Northbridge Boatyard', category: 'Marine services', location: 'Riverbank Road', link: '/enterprise/business-hub' },
    { _key: 'biz-3', number: '03', name: 'Old Library Café', category: 'Food & drink', location: '12 Market Street', link: '/enterprise/business-hub' },
    { _key: 'biz-4', number: '04', name: 'Kiln Lane Workshop', category: 'Repairs', location: '4 Kiln Lane', link: '/enterprise/business-hub' },
  ],
}

const libraryPage: SeedDocument = {
  _id: SINGLETON_IDS.libraryPage,
  _type: 'libraryPage',
  pageHero: {
    eyebrow: 'Knowledge Library',
    title: 'Knowledge, kept in motion.',
    intro: 'Videos, presentations, articles, session summaries, research and community reports.',
  },
  note: true,
  resources: [
    {
      _key: 'lib-1',
      featured: true,
      type: 'Session recording',
      title: 'Understanding Personal Investment in Nigeria',
      description: 'BTA Knowledge Library · 2026',
      link: '/knowledge/forum',
    },
    {
      _key: 'lib-2',
      featured: false,
      type: 'Presentation',
      title: 'Boundary Stones of Northbridge',
      description: 'BTA Knowledge Library · 2026',
      link: '/knowledge/forum',
    },
    {
      _key: 'lib-3',
      featured: false,
      type: 'Report',
      title: 'Community Needs Register 2026',
      description: 'BTA Knowledge Library · 2026',
      link: '/knowledge/forum',
    },
    {
      _key: 'lib-4',
      featured: false,
      type: 'Article',
      title: 'Oral History: Elders Remember',
      description: 'BTA Knowledge Library · 2026',
      link: '/knowledge/forum',
    },
    {
      _key: 'lib-5',
      featured: false,
      type: 'Guide',
      title: 'Starting a Session at the Forum',
      description: 'BTA Knowledge Library · 2026',
      link: '/knowledge/forum',
    },
  ],
}

const communityNeeds: SeedDocument = {
  _id: SINGLETON_IDS.communityNeeds,
  _type: 'communityNeeds',
  pageHero: {
    eyebrow: 'Community Needs Register',
    title: "What does your community need?",
    intro: 'Make local needs visible for review by the appropriate BTA committee.',
  },
  note: true,
  formTitle: 'Submit a community need',
  formDescription: 'Submission does not guarantee funding or implementation.',
  fields: [
    { _key: 'field-need-1', name: 'location', label: 'Location', type: 'text', required: true, wide: false, placeholder: 'Where is the need?' },
    { _key: 'field-need-2', name: 'nature', label: 'Nature of problem', type: 'text', required: true, wide: false, placeholder: 'What is the issue?' },
    { _key: 'field-need-3', name: 'people', label: 'People affected', type: 'text', required: true, wide: false, placeholder: 'Who is affected?' },
    { _key: 'field-need-4', name: 'urgency', label: 'Urgency', type: 'text', required: true, wide: false, placeholder: 'How urgent is it?' },
    { _key: 'field-need-5', name: 'description', label: 'Description', type: 'textarea', required: true, wide: true, placeholder: 'Tell us more about the need' },
    { _key: 'field-need-6', name: 'solution', label: 'Suggested solution', type: 'textarea', required: true, wide: true, placeholder: 'What would help?' },
    { _key: 'field-need-7', name: 'contact', label: 'Contact information', type: 'text', required: true, wide: true, placeholder: 'How can we reach you?' },
  ],
  submitLabel: 'Submit community need',
}

const membershipPage: SeedDocument = {
  _id: SINGLETON_IDS.membershipPage,
  _type: 'membershipPage',
  pageHero: {
    eyebrow: 'Membership',
    title: 'Belong. Contribute. Build.',
    intro: 'Join a community of people who care about heritage, knowledge and community development.',
  },
  note: true,
  steps: [
    { _key: 'step-1', number: '01', label: 'Express interest' },
    { _key: 'step-2', number: '02', label: 'Application' },
    { _key: 'step-3', number: '03', label: 'Review' },
    { _key: 'step-4', number: '04', label: 'Confirmation' },
  ],
  supportMode: false,
  supportChoices: [
    { _key: 'support-1', value: 'small', label: 'Small gift', description: 'A modest one-off contribution.' },
    { _key: 'support-2', value: 'regular', label: 'Regular giving', description: 'A monthly amount you choose.' },
    { _key: 'support-3', value: 'partner', label: 'Partner level', description: 'For businesses and organisations.' },
  ],
  fields: [
    { _key: 'field-mem-1', name: 'fullName', label: 'Full name', type: 'text', required: true, wide: false, placeholder: 'Your full name' },
    { _key: 'field-mem-2', name: 'email', label: 'Email', type: 'email', required: true, wide: false, placeholder: 'you@example.org' },
    { _key: 'field-mem-3', name: 'phone', label: 'Phone', type: 'tel', required: true, wide: false, placeholder: 'Your phone number' },
    { _key: 'field-mem-4', name: 'location', label: 'Location', type: 'text', required: true, wide: false, placeholder: 'Where you live' },
    { _key: 'field-mem-5', name: 'message', label: 'Message', type: 'textarea', required: true, wide: true, placeholder: 'Why do you want to join?' },
  ],
  continueLabel: 'Continue',
  submitLabel: 'Submit',
}

// ---------------------------------------------------------------------------
// Events (exact prototype events, dates pinned to nearest future occurrences)
// ---------------------------------------------------------------------------

const events: SeedDocument[] = [
  {
    _id: 'event-knowledge-forum-oct-2026',
    _type: 'event',
    title: 'Understanding Personal Investment in Nigeria',
    slug: { _type: 'slug', current: 'knowledge-forum' },
    summary:
      'Dr. Tamuno Briggs on personal investment in the Nigerian context — what it means, how to start and what to watch out for.',
    startDateTime: daysFromNow(0, 10, 0), // 18 October 2026 (today), 10:00 UTC
    location: 'The Old Library Hall, 12 Market Street',
    category: 'knowledge',
    status: 'published',
    fullDescription: [
      textBlock(
        'event-kf-1',
        'normal',
        'Dr. Tamuno Briggs leads this session on personal investment in the Nigerian context — what it means, how to start and what to watch out for. Fifty minutes of talk, followed by questions and refreshments in the reading room.',
      ),
      textBlock('event-kf-2', 'h3', 'What to expect'),
      bullet('event-kf-3', 'Doors open at 3:30 PM'),
      bullet('event-kf-4', 'Talk begins at 4:00 PM'),
      bullet('event-kf-5', 'Free entry, all welcome'),
    ],
  },
  {
    _id: 'event-annual-general-meeting',
    _type: 'event',
    title: 'Annual General Meeting',
    slug: { _type: 'slug', current: 'annual-general-meeting' },
    summary:
      'Committee elections, annual reports and the programme for the year ahead. All members welcome.',
    startDateTime: daysFromNow(34, 18, 0), // 21 November 2026
    location: 'The Old Library Hall, 12 Market Street',
    category: 'members',
    status: 'published',
    fullDescription: [
      textBlock(
        'event-agm-1',
        'normal',
        'The annual general meeting is where the committee reports on the year, elections are held and the programme for the year ahead is agreed. Every member has a vote.',
      ),
    ],
  },
  {
    _id: 'event-heritage-evening-dec-2026',
    _type: 'event',
    title: 'Heritage Evening',
    slug: { _type: 'slug', current: 'heritage-evening' },
    summary:
      'Stories, music and food shared at the Old Library Hall. An evening of belonging, led by the people who remember.',
    startDateTime: daysFromNow(55, 18, 0), // 12 December 2026
    location: 'The Old Library Hall, 12 Market Street',
    category: 'heritage',
    status: 'published',
    fullDescription: [
      textBlock(
        'event-he-1',
        'normal',
        'Heritage Evening brings together stories, music and food shared at the Old Library Hall each quarter. Come for the company, stay for the stories.',
      ),
    ],
  },
  {
    _id: 'event-youth-networking-jan-2027',
    _type: 'event',
    title: 'Youth Networking Mixer',
    slug: { _type: 'slug', current: 'youth-networking-mixer' },
    summary:
      'Connecting school leavers with mentors, work placements and enterprise training.',
    startDateTime: daysFromNow(98, 18, 0), // 24 January 2027
    location: 'The Old Library Hall, 12 Market Street',
    category: 'our-people',
    status: 'published',
    fullDescription: [
      textBlock(
        'event-yn-1',
        'normal',
        'An evening for school leavers to meet mentors, hear about work placements and learn about enterprise training available through BTA members.',
      ),
    ],
  },
  {
    _id: 'event-committee-planning',
    _type: 'event',
    title: 'Committee planning meeting',
    slug: { _type: 'slug', current: 'committee-planning-meeting' },
    summary:
      'Internal planning meeting for the autumn programme. Not published to the website while the date is being confirmed.',
    startDateTime: daysFromNow(14, 19, 0),
    location: 'The Old Library Room, 12 Market Street',
    category: 'members',
    // Deliberately draft: the website must never show this event even though the
    // document itself is written.
    status: 'draft',
    fullDescription: [
      textBlock('planning-1', 'normal', 'Draft agenda to be circulated to committee members.'),
    ],
  },
]

// ---------------------------------------------------------------------------
// Commit
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const projectId = requireEnv('NEXT_PUBLIC_SANITY_PROJECT_ID')
  const dataset = requireEnv('NEXT_PUBLIC_SANITY_DATASET')
  const token = requireEnv('SANITY_API_WRITE_TOKEN')
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || FALLBACK_API_VERSION

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
    // Writes bypass the published perspective, so request the raw pipeline.
    perspective: 'raw',
  })

  const documents: SeedDocument[] = [
    siteSettings,
    homepage,
    aboutPage,
    ...featuredActivities,
    ...editorialPages,
    ...detailPages,
    ...forumThreads,
    ...projects,
    eventsPage,
    businessHub,
    libraryPage,
    communityNeeds,
    membershipPage,
    ...events,
  ]

  console.log(`Seeding ${documents.length} documents into ${projectId}/${dataset}…`)

  const transaction = client.transaction()
  for (const document of documents) {
    transaction.createOrReplace(document)
  }

  try {
    const result = await transaction.commit()
    for (const document of result.results) {
      console.log(`  ${document.operation}  ${document.id}`)
    }
    console.log(`\nDone. Seeded ${result.results.length} documents.`)
    console.log('Open /studio to review the content, or /events to see it rendered.')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`\nSeeding failed: ${message}`)
    console.error(
      'Check that the token has Editor permissions for this dataset and that the project id and dataset are correct.',
    )
    process.exitCode = 1
  }
}

await main()