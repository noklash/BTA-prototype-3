// @vitest-environment node
/**
 * The GROQ queries are strings, so they are easy to break silently. These tests
 * pin down the behaviour the website depends on — most importantly that drafts
 * can never be returned to a public page.
 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('next-sanity', () => ({
  defineQuery: (query: string) => query,
}))

const {
  aboutPageQuery,
  CONTENT_TAGS,
  eventBySlugQuery,
  eventsQuery,
  forumThreadBySlugQuery,
  forumThreadsQuery,
  homepageQuery,
  publishedEventSlugsQuery,
  siteSettingsQuery,
} = await import('@/lib/sanity/queries')

const allQueries = {
  siteSettingsQuery,
  homepageQuery,
  aboutPageQuery,
  eventsQuery,
  eventBySlugQuery,
  publishedEventSlugsQuery,
  forumThreadsQuery,
  forumThreadBySlugQuery,
}

describe('query definitions', () => {
  it.each(Object.entries(allQueries))('%s is a non-empty GROQ query', (_name, query) => {
    expect(typeof query).toBe('string')
    expect(query).toContain('*[')
    expect(query).toContain('_type ==')
  })

  it('never selects every field of a document', () => {
    for (const query of Object.values(allQueries)) {
      expect(query).not.toContain('...}')
    }
  })
})

describe('event visibility', () => {
  it('filters unpublished events out in GROQ, not in the UI', () => {
    expect(eventsQuery).toContain('status == "published"')
    expect(eventBySlugQuery).toContain('status == "published"')
    expect(publishedEventSlugsQuery).toContain('status == "published"')
  })

  it('orders the events list by start date, soonest first', () => {
    expect(eventsQuery).toContain('order(startDateTime asc)')
  })

  it('looks events up by the flattened slug, parameterised', () => {
    expect(eventBySlugQuery).toContain('slug.current == $slug')
  })

  it('only returns slugs that exist', () => {
    expect(publishedEventSlugsQuery).toContain('defined(slug.current)')
  })
})

describe('projections', () => {
  it('flattens slugs to strings for every document that has one', () => {
    expect(eventsQuery).toContain('"slug": slug.current')
    expect(eventBySlugQuery).toContain('"slug": slug.current')
    // homepage inlines initiatives with their slugs
    expect(homepageQuery).toContain('initiativesItems[]{')
    expect(homepageQuery).toContain('slug,')
  })

  it('inlines the referenced featured activities', () => {
    expect(homepageQuery).toContain('initiativesItems[]{')
  })

  it('selects the call to action fields explicitly', () => {
    expect(homepageQuery).toContain('heroCtaPrimary{ heading, body, buttonLabel, buttonHref }')
  })

  it('projects the forum thread fields the article page renders', () => {
    for (const query of [forumThreadsQuery, forumThreadBySlugQuery]) {
      for (const field of [
        'title',
        'excerpt',
        'body',
        'image',
        'author',
        'authorRole',
        'category',
        'publishedAt',
      ]) {
        expect(query).toContain(field)
      }
    }
  })

  it('does not select the private read token or dataset from documents', () => {
    for (const query of Object.values(allQueries)) {
      expect(query).not.toContain('token')
    }
  })
})

describe('cache tags', () => {
  it('uses unique, stable tag values', () => {
    const tags = Object.values(CONTENT_TAGS)
    expect(new Set(tags).size).toBe(tags.length)
    expect(tags).toContain('events')
  })
})