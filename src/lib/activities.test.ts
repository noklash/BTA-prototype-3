import { describe, expect, it } from 'vitest'

import { selectFeaturedActivities } from './activities'
import type { FeaturedActivity } from '@/types/content'

function activity(overrides: Partial<FeaturedActivity> & { _id: string }): FeaturedActivity {
  return {
    title: `Activity ${overrides._id}`,
    slug: `activity-${overrides._id}`,
    shortDescription: null,
    image: null,
    displayOrder: 0,
    ...overrides,
  }
}

describe('selectFeaturedActivities', () => {
  it('returns an empty array for null, undefined and empty input', () => {
    expect(selectFeaturedActivities(null)).toEqual([])
    expect(selectFeaturedActivities(undefined)).toEqual([])
    expect(selectFeaturedActivities([])).toEqual([])
  })

  it('drops dangling references returned by GROQ as null', () => {
    const result = selectFeaturedActivities([null, activity({ _id: 'a' }), null])
    expect(result.map((item) => item._id)).toEqual(['a'])
  })

  it('drops entries that are missing a title or slug', () => {
    const result = selectFeaturedActivities([
      { ...activity({ _id: 'ok' }) },
      // A partially deleted document could come back without its slug.
      { ...activity({ _id: 'no-slug' }), slug: '' },
      { ...activity({ _id: 'blank-title' }), title: '   ' },
    ])

    expect(result.map((item) => item._id)).toEqual(['ok'])
  })

  it('sorts by display order, lowest first', () => {
    const result = selectFeaturedActivities([
      activity({ _id: 'third', displayOrder: 30 }),
      activity({ _id: 'first', displayOrder: 10 }),
      activity({ _id: 'second', displayOrder: 20 }),
    ])

    expect(result.map((item) => item._id)).toEqual(['first', 'second', 'third'])
  })

  it('keeps the home page order for equal display orders (stable sort)', () => {
    const result = selectFeaturedActivities([
      activity({ _id: 'b', displayOrder: 5 }),
      activity({ _id: 'a', displayOrder: 5 }),
    ])

    expect(result.map((item) => item._id)).toEqual(['b', 'a'])
  })

  it('pushes activities without a display order to the end', () => {
    const result = selectFeaturedActivities([
      activity({ _id: 'unordered', displayOrder: null }),
      activity({ _id: 'ordered', displayOrder: 1 }),
    ])

    expect(result.map((item) => item._id)).toEqual(['ordered', 'unordered'])
  })

  it('applies the limit after sorting', () => {
    const result = selectFeaturedActivities(
      [
        activity({ _id: 'third', displayOrder: 3 }),
        activity({ _id: 'first', displayOrder: 1 }),
        activity({ _id: 'second', displayOrder: 2 }),
      ],
      2,
    )

    expect(result.map((item) => item._id)).toEqual(['first', 'second'])
  })

  it('does not mutate the input array', () => {
    const input = [activity({ _id: 'a', displayOrder: 2 }), activity({ _id: 'b', displayOrder: 1 })]
    selectFeaturedActivities(input)
    expect(input.map((item) => item._id)).toEqual(['a', 'b'])
  })
})
