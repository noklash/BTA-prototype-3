/**
 * TypeScript shapes for every piece of content the website reads out of Sanity.
 *
 * These types describe *query results*, not the stored schema: slugs are
 * flattened to strings and referenced documents are inlined. They are written
 * by hand rather than generated, to keep the build free of a code-generation
 * step; docs/architecture.md explains that trade-off.
 */
import type { PortableTextBlock } from '@portabletext/react'

/** A Sanity image reference. Only `_ref` is needed to build CDN URLs. */
export interface SanityImageAssetRef {
  _ref: string
  _type?: string
}

export interface SanityImageHotspot {
  x: number
  y: number
  width: number
  height: number
}

export interface SanityImageCrop {
  top: number
  bottom: number
  left: number
  right: number
}

/**
 * A stored `imageWithAlt` object. `asset` is optional because an editor can add
 * the field and leave it empty; every consumer must cope with a missing asset.
 */
export interface SanityImageValue {
  _type?: string
  asset?: SanityImageAssetRef | null
  alt?: string | null
  hotspot?: SanityImageHotspot | null
  crop?: SanityImageCrop | null
}

export type RichTextValue = PortableTextBlock[]

export interface SocialLink {
  _key?: string
  platform: string
  url: string
}

export interface NavItem {
  _key?: string
  label: string
  href: string
  hasChevron: boolean
}

export interface UtilityLink {
  label: string | null
  href: string | null
}

export interface SiteSettings {
  _id: string
  title: string
  shortName: string | null
  tagline: string | null
  logo: SanityImageValue | null
  navItems: NavItem[] | null
  utilityLink: UtilityLink | null
  contactEmail: string
  contactPhone: string | null
  address: string | null
  footerText: string
  socialLinks: SocialLink[] | null
}

export interface CallToAction {
  heading: string
  body: string | null
  buttonLabel: string | null
  buttonHref: string | null
}

export interface FeaturedActivity {
  _id: string
  title: string
  slug: string
  shortDescription: string | null
  image: SanityImageValue | null
  displayOrder: number | null
}

/** Homepage section types */

export interface HomeStat {
  _key?: string
  value: string
  label: string
}

export interface ModelPillar {
  _key?: string
  title: string
  description: string | null
}

export type InitiativeStatus = 'ACTIVE' | 'LAUNCHING' | 'PLANNED' | 'VISION_2035'

export interface HomeInitiative {
  _key?: string
  title: string
  slug: string
  shortDescription: string | null
  status: InitiativeStatus
  link: string
  image: SanityImageValue | null
  displayOrder: number | null
}

export interface ImpactBlock {
  _key?: string
  image: SanityImageValue | null
  eyebrow: string | null
  heading: string
  body: string | null
  metricValue: string | null
  metricLabel: string | null
  cta: CallToAction | null
}

export interface KnowledgeHomeBlock {
  _key?: string
  eyebrow: string | null
  heading: string
  body: string | null
  topics: string[] | null
  featuredSession: {
    eyebrow: string | null
    title: string
    description: string | null
    link: string
  } | null
  cta: CallToAction | null
}

export interface HeritageHomeBlock {
  _key?: string
  image: SanityImageValue | null
  eyebrow: string | null
  heading: string
  body: string | null
  quote: string | null
  cta: CallToAction | null
}

export interface EventsHomeBlock {
  _key?: string
  eyebrow: string | null
  heading: string
  maxEvents: number | null
  cta: CallToAction | null
}

export interface VisionHomeBlock {
  _key?: string
  eyebrow: string | null
  heading: string
  body: string | null
  cta: CallToAction | null
}

export interface PartnerHomeBlock {
  _key?: string
  eyebrow: string | null
  heading: string
  body: string | null
  primaryCta: CallToAction | null
  secondaryCta: CallToAction | null
}

export interface Homepage {
  _id: string
  // 1. Hero
  heroHeading: string
  heroDescription: string | null
  heroAside: string | null
  heroImage: SanityImageValue | null
  heroCtaPrimary: CallToAction | null
  heroCtaSecondary: CallToAction | null
  heroCtaTertiary: CallToAction | null
  // 2. Intro
  introEyebrow: string | null
  introHeading: string | null
  introLead: string | null
  introBody: string | null
  introCta: CallToAction | null
  // 3. Stats
  statsItems: HomeStat[] | null
  statsCaption: string | null
  // 4. Model
  modelEyebrow: string | null
  modelHeading: string | null
  modelIntro: string | null
  modelPillars: ModelPillar[] | null
  // 5. Initiatives
  initiativesEyebrow: string | null
  initiativesHeading: string | null
  initiativesIntro: string | null
  initiativesItems: HomeInitiative[] | null
  // 6. Impact
  impact: ImpactBlock | null
  // 7. Knowledge
  knowledge: KnowledgeHomeBlock | null
  // 8. Heritage
  heritage: HeritageHomeBlock | null
  // 9. Events
  events: EventsHomeBlock | null
  // 10. Vision
  vision: VisionHomeBlock | null
  // 11. Partner
  partner: PartnerHomeBlock | null
}

export interface ValueItem {
  _key?: string
  title: string
  description: string | null
}

export interface AboutPage {
  _id: string
  title: string
  intro: string | null
  history: RichTextValue | null
  mission: string | null
  leadership: string | null
  values: ValueItem[] | null
  featuredImage: SanityImageValue | null
}

/** Editorial page types */

export type EditorialKind = 'about' | 'people' | 'knowledge' | 'enterprise' | 'community' | 'blue' | 'heritage' | 'partners'

export interface EditorialArticle {
  _key?: string
  number: string
  title: string
  body: string | null
}

export interface EditorialPageHero {
  eyebrow: string | null
  title: string
  intro: string | null
  image: SanityImageValue | null
}

export interface EditorialPage {
  _id: string
  kind: EditorialKind
  pageHero: EditorialPageHero | null
  articles: EditorialArticle[] | null
  cta: CallToAction | null
}

/** Detail page types */

export type DetailType = 'forum' | 'project' | 'event' | 'article' | 'oral' | 'centre'

export type DetailStatus = 'ACTIVE' | 'LAUNCHING' | 'PLANNED' | 'VISION_2035'

export interface DetailExpectation {
  _key?: string
  text: string
}

export interface DetailPageAtAGlance {
  title: string
  status: DetailStatus
}

export interface DetailPageHero {
  eyebrow: string | null
  title: string
  intro: string | null
  image: SanityImageValue | null
}

export interface DetailPageAbout {
  lead: string | null
  body: RichTextValue | null
}

export interface DetailPage {
  _id: string
  type: DetailType
  slug: string
  pageHero: DetailPageHero | null
  about: DetailPageAbout | null
  whatToExpect: DetailExpectation[] | null
  atAGlance: DetailPageAtAGlance | null
  cta: CallToAction | null
}

/**
 * A project in the bank, as published from the CMS.
 */
export interface CmsProject {
  _id: string
  title: string
  slug: string
  summary: string
  description: RichTextValue | null
  image: SanityImageValue | null
  milestones: { label: string; done: boolean }[] | null
  category: string
  location: string
  beneficiaries: string | null
  communityBenefits: string[] | null
}

/**
 * A forum thread: an article shared by a member, with an optional image, that
 * members discuss in comments and replies.
 */
export interface ForumThread {
  _id: string
  title: string
  slug: string
  excerpt: string
  body: RichTextValue | null
  image: SanityImageValue | null
  author: string
  authorRole: string | null
  category: string
  publishedAt: string
}

/** Events page types */
export interface EventsPageHero {
  eyebrow: string | null
  title: string
  intro: string | null
  image: SanityImageValue | null
}

export interface EventsPage {
  _id: string
  pageHero: EventsPageHero | null
  note: boolean
  categories: string[] | null
}

/** Business Hub types */

export interface BusinessEntry {
  _key?: string
  number: string
  name: string
  category: string | null
  location: string | null
  link: string
}

export interface BusinessHubPageHero {
  eyebrow: string | null
  title: string
  intro: string | null
  image: SanityImageValue | null
}

export interface BusinessHub {
  _id: string
  pageHero: BusinessHubPageHero | null
  note: boolean
  searchPlaceholder: string | null
  searchCategoriesButton: string | null
  businesses: BusinessEntry[] | null
}

/** Library types */

export interface LibraryResource {
  _key?: string
  featured: boolean
  type: string | null
  title: string
  description: string | null
  link: string
}

export interface LibraryPageHero {
  eyebrow: string | null
  title: string
  intro: string | null
  image: SanityImageValue | null
}

export interface LibraryPage {
  _id: string
  pageHero: LibraryPageHero | null
  note: boolean
  resources: LibraryResource[] | null
}

/** Community Needs types */

export interface FormField {
  _key?: string
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea'
  required: boolean
  wide: boolean
  placeholder: string | null
}

export interface CommunityNeedsPageHero {
  eyebrow: string | null
  title: string
  intro: string | null
  image: SanityImageValue | null
}

export interface CommunityNeeds {
  _id: string
  pageHero: CommunityNeedsPageHero | null
  note: boolean
  formTitle: string | null
  formDescription: string | null
  fields: FormField[] | null
  submitLabel: string | null
}

/** Membership page types */

export interface MembershipStep {
  _key?: string
  number: string
  label: string
}

export interface SupportChoice {
  _key?: string
  value: string
  label: string
  description: string | null
}

export interface MembershipPageHero {
  eyebrow: string | null
  title: string
  intro: string | null
  image: SanityImageValue | null
}

export interface MembershipPage {
  _id: string
  pageHero: MembershipPageHero | null
  note: boolean
  steps: MembershipStep[] | null
  supportMode: boolean
  supportChoices: SupportChoice[] | null
  fields: FormField[] | null
  continueLabel: string | null
  submitLabel: string | null
}

/** Event types */

export type EventStatus = 'published' | 'draft'

export type EventCategory = 'knowledge' | 'members' | 'heritage' | 'our-people'

/** List/card projection of an event. */
export interface EventSummary {
  _id: string
  title: string
  slug: string
  summary: string | null
  startDateTime: string
  location: string | null
  category: EventCategory
  coverImage: SanityImageValue | null
  status: EventStatus
}

/** Full event projection used by `/events/[slug]`. */
export interface EventDetail extends EventSummary {
  fullDescription: RichTextValue | null
}

/** Minimal projection used by `generateStaticParams`. */
export interface EventSlug {
  slug: string
}