/**
 * Every GROQ query used by the website, in one place.
 *
 * Conventions:
 *  - `slug.current` is flattened to a plain `string` so callers never deal with
 *    the nested slug object.
 *  - Referenced documents are inlined with `->` where the page needs them.
 *  - `*[_type == "event" && status == "published"]` is the only way events reach
 *    the public site: drafts are filtered in the query, not in the UI.
 *  - `...` is avoided in favour of explicit projections so that adding a schema
 *    field never silently changes a query result shape.
 */
import { defineQuery } from 'next-sanity'

/** Cache tags, used by the revalidation webhook in `src/app/api/revalidate`. */
export const CONTENT_TAGS = {
  siteSettings: 'siteSettings',
  homepage: 'homepage',
  aboutPage: 'aboutPage',
  editorialPage: 'editorialPage',
  detailPage: 'detailPage',
  eventsPage: 'eventsPage',
  businessHub: 'businessHub',
  libraryPage: 'libraryPage',
  communityNeeds: 'communityNeeds',
  membershipPage: 'membershipPage',
  events: 'events',
} as const

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    _id,
    title,
    shortName,
    tagline,
    logo,
    navItems[]{ _key, label, href, hasChevron },
    utilityLink{ label, href },
    contactEmail,
    contactPhone,
    address,
    footerText,
    socialLinks[]{ _key, platform, url }
  }
`)

export const homepageQuery = defineQuery(`
  *[_type == "homepage"][0]{
    _id,
    // 1. Hero
    heroHeading,
    heroDescription,
    heroAside,
    heroImage,
    heroCtaPrimary{ heading, body, buttonLabel, buttonHref },
    heroCtaSecondary{ heading, body, buttonLabel, buttonHref },
    heroCtaTertiary{ heading, body, buttonLabel, buttonHref },
    // 2. Intro
    introEyebrow,
    introHeading,
    introLead,
    introBody,
    introCta{ heading, body, buttonLabel, buttonHref },
    // 3. Stats
    statsItems[]{ _key, value, label },
    statsCaption,
    // 4. Model
    modelEyebrow,
    modelHeading,
    modelIntro,
    modelPillars[]{ _key, title, description },
    // 5. Initiatives
    initiativesEyebrow,
    initiativesHeading,
    initiativesIntro,
    initiativesItems[]{
      _key,
      title,
      slug,
      shortDescription,
      status,
      link,
      image,
      displayOrder
    },
    // 6. Impact
    impact{
      _key,
      image,
      eyebrow,
      heading,
      body,
      metricValue,
      metricLabel,
      cta{ heading, body, buttonLabel, buttonHref }
    },
    // 7. Knowledge
    knowledge{
      _key,
      eyebrow,
      heading,
      body,
      topics[],
      featuredSession{ eyebrow, title, description, link },
      cta{ heading, body, buttonLabel, buttonHref }
    },
    // 8. Heritage
    heritage{
      _key,
      image,
      eyebrow,
      heading,
      body,
      quote,
      cta{ heading, body, buttonLabel, buttonHref }
    },
    // 9. Events
    events{
      _key,
      eyebrow,
      heading,
      maxEvents,
      cta{ heading, body, buttonLabel, buttonHref }
    },
    // 10. Vision
    vision{
      _key,
      eyebrow,
      heading,
      body,
      cta{ heading, body, buttonLabel, buttonHref }
    },
    // 11. Partner
    partner{
      _key,
      eyebrow,
      heading,
      body,
      primaryCta{ heading, body, buttonLabel, buttonHref },
      secondaryCta{ heading, body, buttonLabel, buttonHref }
    }
  }
`)

export const aboutPageQuery = defineQuery(`
  *[_type == "aboutPage"][0]{
    _id,
    title,
    intro,
    history,
    mission,
    leadership,
    values[]{ _key, title, description },
    featuredImage
  }
`)

/**
 * Query all editorial pages. Each has a `kind` field that maps to a route.
 */
export const editorialPagesQuery = defineQuery(`
  *[_type == "editorialPage"]{
    _id,
    kind,
    pageHero{
      eyebrow,
      title,
      intro,
      image
    },
    articles[]{ _key, number, title, body },
    cta{ heading, body, buttonLabel, buttonHref }
  }
`)

/**
 * Query a single editorial page by kind.
 */
export const editorialPageByKindQuery = defineQuery(`
  *[_type == "editorialPage" && kind == $kind][0]{
    _id,
    kind,
    pageHero{
      eyebrow,
      title,
      intro,
      image
    },
    articles[]{ _key, number, title, body },
    cta{ heading, body, buttonLabel, buttonHref }
  }
`)

/**
 * Query all detail pages. Each has a `type` and `slug` field.
 */
export const detailPagesQuery = defineQuery(`
  *[_type == "detailPage"]{
    _id,
    type,
    slug,
    pageHero{
      eyebrow,
      title,
      intro,
      image
    },
    about{
      lead,
      body
    },
    whatToExpect[]{ _key, text },
    atAGlance{ title, status },
    cta{ heading, body, buttonLabel, buttonHref }
  }
`)

/**
 * Query a single detail page by type and slug.
 */
export const detailPageByTypeAndSlugQuery = defineQuery(`
  *[_type == "detailPage" && type == $type && slug.current == $slug][0]{
    _id,
    type,
    slug,
    pageHero{
      eyebrow,
      title,
      intro,
      image
    },
    about{
      lead,
      body
    },
    whatToExpect[]{ _key, text },
    atAGlance{ title, status },
    cta{ heading, body, buttonLabel, buttonHref }
  }
`)

export const eventsPageQuery = defineQuery(`
  *[_type == "eventsPage"][0]{
    _id,
    pageHero{
      eyebrow,
      title,
      intro,
      image
    },
    note,
    categories[]
  }
`)

export const businessHubQuery = defineQuery(`
  *[_type == "businessHub"][0]{
    _id,
    pageHero{
      eyebrow,
      title,
      intro,
      image
    },
    note,
    searchPlaceholder,
    searchCategoriesButton,
    businesses[]{ _key, number, name, category, location, link }
  }
`)

export const libraryPageQuery = defineQuery(`
  *[_type == "libraryPage"][0]{
    _id,
    pageHero{
      eyebrow,
      title,
      intro,
      image
    },
    note,
    resources[]{ _key, featured, type, title, description, link }
  }
`)

export const communityNeedsQuery = defineQuery(`
  *[_type == "communityNeeds"][0]{
    _id,
    pageHero{
      eyebrow,
      title,
      intro,
      image
    },
    note,
    formTitle,
    formDescription,
    fields[]{ _key, name, label, type, required, wide, placeholder },
    submitLabel
  }
`)

export const membershipPageQuery = defineQuery(`
  *[_type == "membershipPage"][0]{
    _id,
    pageHero{
      eyebrow,
      title,
      intro,
      image
    },
    note,
    steps[]{ _key, number, label },
    supportMode,
    supportChoices[]{ _key, value, label, description },
    fields[]{ _key, name, label, type, required, wide, placeholder },
    continueLabel,
    submitLabel
  }
`)

export const eventsQuery = defineQuery(`
  *[_type == "event" && status == "published"] | order(startDateTime asc){
    _id,
    title,
    "slug": slug.current,
    summary,
    startDateTime,
    location,
    category,
    coverImage,
    status
  }
`)

export const eventBySlugQuery = defineQuery(`
  *[_type == "event" && status == "published" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    fullDescription,
    startDateTime,
    location,
    category,
    coverImage,
    status
  }
`)

/**
 * Slugs of every published event, newest first, used by
 * `generateStaticParams` so that event detail pages are prerendered.
 */
export const publishedEventSlugsQuery = defineQuery(`
  *[_type == "event" && status == "published" && defined(slug.current)]{
    "slug": slug.current
  }
`)