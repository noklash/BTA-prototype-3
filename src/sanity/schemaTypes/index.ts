/**
 * The complete Studio schema.
 *
 * Keeping the registration list in one module means `sanity.config.ts` and the
 * schema-coverage test in `tests/schema.test.ts` read from the same source.
 */
import { aboutPage } from './documents/aboutPage'
import { businessHub } from './documents/businessHub'
import { communityNeeds } from './documents/communityNeeds'
import { detailPage } from './documents/detailPage'
import { editorialPage } from './documents/editorialPage'
import { event } from './documents/event'
import { eventsPage } from './documents/eventsPage'
import { featuredActivity } from './documents/featuredActivity'
import { homepage } from './documents/homepage'
import { libraryPage } from './documents/libraryPage'
import { membershipPage } from './documents/membershipPage'
import { siteSettings } from './documents/siteSettings'
import { businessEntry } from './objects/businessEntry'
import { callToAction } from './objects/callToAction'
import { detailExpectation } from './objects/detailExpectation'
import { editorialArticle } from './objects/editorialArticle'
import { formField } from './objects/formField'
import { heritageHomeBlock } from './objects/heritageHomeBlock'
import { homeInitiative } from './objects/homeInitiative'
import { homeStat } from './objects/homeStat'
import { imageWithAlt } from './objects/imageWithAlt'
import { impactBlock } from './objects/impactBlock'
import { knowledgeHomeBlock } from './objects/knowledgeHomeBlock'
import { libraryResource } from './objects/libraryResource'
import { membershipStep } from './objects/membershipStep'
import { modelPillar } from './objects/modelPillar'
import { navItem } from './objects/navItem'
import { partnerHomeBlock } from './objects/partnerHomeBlock'
import { richText } from './objects/richText'
import { socialLink } from './objects/socialLink'
import { valueItem } from './objects/valueItem'
import { visionHomeBlock } from './objects/visionHomeBlock'
import { eventsHomeBlock } from './objects/eventsHomeBlock'

export const documentSchemaTypes = [
  siteSettings,
  homepage,
  aboutPage,
  editorialPage,
  detailPage,
  eventsPage,
  businessHub,
  libraryPage,
  communityNeeds,
  membershipPage,
  event,
  featuredActivity,
] as const

export const objectSchemaTypes = [
  imageWithAlt,
  callToAction,
  socialLink,
  valueItem,
  richText,
  navItem,
  homeStat,
  modelPillar,
  homeInitiative,
  impactBlock,
  knowledgeHomeBlock,
  heritageHomeBlock,
  eventsHomeBlock,
  visionHomeBlock,
  partnerHomeBlock,
  editorialArticle,
  detailExpectation,
  businessEntry,
  libraryResource,
  membershipStep,
  formField,
] as const

export const schemaTypes = [...documentSchemaTypes, ...objectSchemaTypes]

/** Document type names that address a single, editor-managed page. */
export const singletonDocumentTypeNames = [
  'siteSettings',
  'homepage',
  'aboutPage',
  'eventsPage',
  'businessHub',
  'libraryPage',
  'communityNeeds',
  'membershipPage',
] as const