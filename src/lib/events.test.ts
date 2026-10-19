import { describe, expect, it } from 'vitest'

import { getNextEvent, partitionEvents } from './events'

const NOW = new Date('2026-06-01T12:00:00.000Z')

const event = (id: string, startDateTime: string) => ({ id, startDateTime })

describe('partitionEvents', () => {
  it('splits events around the reference time and sorts both buckets', () => {
    const events = [
      event('past-old', '2025-01-01T10:00:00.000Z'),
      event('future-late', '2026-12-01T10:00:00.000Z'),
      event('past-recent', '2026-05-31T10:00:00.000Z'),
      event('future-soon', '2026-06-02T10:00:00.000Z'),
    ]

    const { upcoming, past } = partitionEvents(events, NOW)

    expect(upcoming.map((item) => item.id)).toEqual(['future-soon', 'future-late'])
    expect(past.map((item) => item.id)).toEqual(['past-recent', 'past-old'])
  })

  it('treats an event starting exactly now as upcoming', () => {
    const { upcoming, past } = partitionEvents([event('now', NOW.toISOString())], NOW)
    expect(upcoming.map((item) => item.id)).toEqual(['now'])
    expect(past).toHaveLength(0)
  })

  it('treats an unparsable date as past instead of dropping the event', () => {
    const { upcoming, past } = partitionEvents(
      [event('broken', 'whenever'), event('real', '2026-06-05T10:00:00.000Z')],
      NOW,
    )

    expect(upcoming.map((item) => item.id)).toEqual(['real'])
    expect(past.map((item) => item.id)).toEqual(['broken'])
  })

  it('sorts unparsable dates to the end of the past bucket', () => {
    const { past } = partitionEvents(
      [event('broken', 'whenever'), event('past', '2026-01-01T10:00:00.000Z')],
      NOW,
    )

    expect(past.map((item) => item.id)).toEqual(['past', 'broken'])
  })

  it('handles an empty list', () => {
    expect(partitionEvents([], NOW)).toEqual({ upcoming: [], past: [] })
  })

  it('does not mutate the input order', () => {
    const events = [event('b', '2026-07-02T10:00:00.000Z'), event('a', '2026-07-01T10:00:00.000Z')]
    partitionEvents(events, NOW)
    expect(events.map((item) => item.id)).toEqual(['b', 'a'])
  })
})

describe('getNextEvent', () => {
  it('returns the soonest upcoming event', () => {
    const next = getNextEvent(
      [
        event('later', '2026-08-01T10:00:00.000Z'),
        event('sooner', '2026-06-10T10:00:00.000Z'),
        event('past', '2025-01-01T10:00:00.000Z'),
      ],
      NOW,
    )

    expect(next?.id).toBe('sooner')
  })

  it('returns null when only past events exist', () => {
    expect(getNextEvent([event('past', '2025-01-01T10:00:00.000Z')], NOW)).toBeNull()
  })
})
