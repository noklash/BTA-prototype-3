/**
 * Content access functions — the only API the pages use to read Sanity.
 *
 * Each function returns a {@link ContentResult}, so a page can distinguish
 * "content is missing" from "the CMS could not be reached" and render the right
 * state. Nothing here throws and nothing here substitutes fake content.
 */
import { cache } from 'react'

import type {
  AboutPage,
  BusinessHub,
  CommunityNeeds,
  DetailPage,
  EditorialPage,
  EventDetail,
  EventSlug,
  EventSummary,
  EventsPage,
  Homepage,
  LibraryPage,
  MembershipPage,
  SiteSettings,
} from '@/types/content'

import { fetchContent, type ContentResult, type FetchContentOptions } from './fetch'
import {
  aboutPageQuery,
  businessHubQuery,
  communityNeedsQuery,
  CONTENT_TAGS,
  detailPageByTypeAndSlugQuery,
  detailPagesQuery,
  editorialPageByKindQuery,
  editorialPagesQuery,
  eventsPageQuery,
  eventsQuery,
  eventBySlugQuery,
  homepageQuery,
  libraryPageQuery,
  membershipPageQuery,
  publishedEventSlugsQuery,
  siteSettingsQuery,
} from './queries'

export function getSiteSettings(
  options?: FetchContentOptions,
): Promise<ContentResult<SiteSettings | null>> {
  return fetchContent<SiteSettings | null>({
    query: siteSettingsQuery,
    options: { tags: [CONTENT_TAGS.siteSettings], ...options },
    label: 'siteSettingsQuery',
  })
}

/**
 * Request-scoped memoisation of the site settings.
 *
 * The root layout and its `generateMetadata` both need the organization name and
 * tagline; `cache()` guarantees a single Content Lake request per render instead
 * of one per consumer.
 */
export const getSiteSettingsForLayout = cache(getSiteSettings)

export function getHomepage(
  options?: FetchContentOptions,
): Promise<ContentResult<Homepage | null>> {
  return fetchContent<Homepage | null>({
    query: homepageQuery,
    options: { tags: [CONTENT_TAGS.homepage, CONTENT_TAGS.siteSettings], ...options },
    label: 'homepageQuery',
  })
}

export function getAboutPage(
  options?: FetchContentOptions,
): Promise<ContentResult<AboutPage | null>> {
  return fetchContent<AboutPage | null>({
    query: aboutPageQuery,
    options: { tags: [CONTENT_TAGS.aboutPage], ...options },
    label: 'aboutPageQuery',
  })
}

export function getEditorialPages(
  options?: FetchContentOptions,
): Promise<ContentResult<EditorialPage[]>> {
  return fetchContent<EditorialPage[]>({
    query: editorialPagesQuery,
    options: { tags: [CONTENT_TAGS.editorialPage], ...options },
    label: 'editorialPagesQuery',
  })
}

export function getEditorialPageByKind(
  kind: string,
  options?: FetchContentOptions,
): Promise<ContentResult<EditorialPage | null>> {
  return fetchContent<EditorialPage | null>({
    query: editorialPageByKindQuery,
    params: { kind },
    options: { tags: [CONTENT_TAGS.editorialPage, `${CONTENT_TAGS.editorialPage}:${kind}`], ...options },
    label: 'editorialPageByKindQuery',
  })
}

export function getDetailPages(
  options?: FetchContentOptions,
): Promise<ContentResult<DetailPage[]>> {
  return fetchContent<DetailPage[]>({
    query: detailPagesQuery,
    options: { tags: [CONTENT_TAGS.detailPage], ...options },
    label: 'detailPagesQuery',
  })
}

export function getDetailPageByTypeAndSlug(
  type: string,
  slug: string,
  options?: FetchContentOptions,
): Promise<ContentResult<DetailPage | null>> {
  return fetchContent<DetailPage | null>({
    query: detailPageByTypeAndSlugQuery,
    params: { type, slug },
    options: { tags: [CONTENT_TAGS.detailPage, `${CONTENT_TAGS.detailPage}:${type}:${slug}`], ...options },
    label: 'detailPageByTypeAndSlugQuery',
  })
}

export function getEventsPage(
  options?: FetchContentOptions,
): Promise<ContentResult<EventsPage | null>> {
  return fetchContent<EventsPage | null>({
    query: eventsPageQuery,
    options: { tags: [CONTENT_TAGS.eventsPage], ...options },
    label: 'eventsPageQuery',
  })
}

export function getBusinessHub(
  options?: FetchContentOptions,
): Promise<ContentResult<BusinessHub | null>> {
  return fetchContent<BusinessHub | null>({
    query: businessHubQuery,
    options: { tags: [CONTENT_TAGS.businessHub], ...options },
    label: 'businessHubQuery',
  })
}

export function getLibraryPage(
  options?: FetchContentOptions,
): Promise<ContentResult<LibraryPage | null>> {
  return fetchContent<LibraryPage | null>({
    query: libraryPageQuery,
    options: { tags: [CONTENT_TAGS.libraryPage], ...options },
    label: 'libraryPageQuery',
  })
}

export function getCommunityNeeds(
  options?: FetchContentOptions,
): Promise<ContentResult<CommunityNeeds | null>> {
  return fetchContent<CommunityNeeds | null>({
    query: communityNeedsQuery,
    options: { tags: [CONTENT_TAGS.communityNeeds], ...options },
    label: 'communityNeedsQuery',
  })
}

export function getMembershipPage(
  options?: FetchContentOptions,
): Promise<ContentResult<MembershipPage | null>> {
  return fetchContent<MembershipPage | null>({
    query: membershipPageQuery,
    options: { tags: [CONTENT_TAGS.membershipPage], ...options },
    label: 'membershipPageQuery',
  })
}

export function getEvents(options?: FetchContentOptions): Promise<ContentResult<EventSummary[]>> {
  return fetchContent<EventSummary[]>({
    query: eventsQuery,
    options: { tags: [CONTENT_TAGS.events], ...options },
    label: 'eventsQuery',
  })
}

export function getEventBySlug(
  slug: string,
  options?: FetchContentOptions,
): Promise<ContentResult<EventDetail | null>> {
  return fetchContent<EventDetail | null>({
    query: eventBySlugQuery,
    params: { slug },
    options: { tags: [CONTENT_TAGS.events, `${CONTENT_TAGS.events}:${slug}`], ...options },
    label: 'eventBySlugQuery',
  })
}

/**
 * Slugs of published events. Used for static generation, so failures degrade to
 * an empty list rather than failing the build: events can always be rendered on
 * demand instead.
 */
export async function getPublishedEventSlugs(
  options?: FetchContentOptions,
): Promise<EventSlug[]> {
  const result = await fetchContent<EventSlug[]>({
    query: publishedEventSlugsQuery,
    options: { tags: [CONTENT_TAGS.events], ...options },
    label: 'publishedEventSlugsQuery',
  })

  return result.ok ? result.value : []
}