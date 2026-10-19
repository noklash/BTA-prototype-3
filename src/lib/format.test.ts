import { describe, expect, it } from 'vitest'

import {
  formatEventDate,
  formatEventDateTime,
  formatEventDay,
  formatEventMonth,
  formatEventTime,
  parseDateTime,
  toDateTimeAttribute,
} from './format'

describe('parseDateTime', () => {
  it.each([
    [null, null],
    [undefined, null],
    ['', null],
    ['not-a-date', null],
    ['2026-13-45T99:99:00Z', null],
  ])('rejects unusable input (%s)', (input, expected) => {
    expect(parseDateTime(input)).toBe(expected)
  })

  it('parses a Sanity datetime with an explicit offset', () => {
    const parsed = parseDateTime('2026-03-14T19:00:00.000+00:00')
    expect(parsed?.toISOString()).toBe('2026-03-14T19:00:00.000Z')
  })
})

describe('formatEventDate', () => {
  it('renders a stable en-GB date in the site time zone', () => {
    // 18:00 UTC on 14 March 2026 is still 18:00 in Europe/London (GMT), so the
    // rendered date is independent of the machine running the tests.
    expect(formatEventDate('2026-03-14T18:00:00.000Z')).toBe('Sat 14 March 2026')
  })

  it('uses the Europe/London offset rather than the runtime time zone', () => {
    // 23:30 UTC on 13 March is 23:30 GMT, and 00:30 BST on 14 March would be the
    // next day only after the clocks change. Asserting the GMT case keeps the
    // test deterministic all year round.
    expect(formatEventDate('2026-03-13T23:30:00.000Z')).toBe('Fri 13 March 2026')
  })

  it('returns null for a missing value', () => {
    expect(formatEventDate(null)).toBeNull()
    expect(formatEventDate('')).toBeNull()
  })
})

describe('formatEventTime', () => {
  it('renders a 24-hour time', () => {
    expect(formatEventTime('2026-03-14T19:05:00.000Z')).toBe('19:05')
  })

  it('zero-pads before 10am', () => {
    expect(formatEventTime('2026-07-01T08:00:00.000Z')).toBe('09:00')
  })

  it('returns null for unusable input', () => {
    expect(formatEventTime('nonsense')).toBeNull()
  })
})

describe('formatEventDay', () => {
  it('renders the zero-padded day for the date block', () => {
    expect(formatEventDay('2026-03-14T18:00:00.000Z')).toBe('14')
  })

  it('returns null for unusable input', () => {
    expect(formatEventDay('')).toBeNull()
    expect(formatEventDay('nonsense')).toBeNull()
  })
})

describe('formatEventMonth', () => {
  it('renders the short month for the date block', () => {
    expect(formatEventMonth('2026-03-14T18:00:00.000Z')).toBe('Mar')
  })

  it('returns null for unusable input', () => {
    expect(formatEventMonth(undefined)).toBeNull()
  })
})

describe('formatEventDateTime', () => {
  it('combines date and time', () => {
    expect(formatEventDateTime('2026-03-14T19:00:00.000Z')).toBe('Sat 14 March 2026 · 19:00')
  })

  it('falls back to the date alone when the time is unparsable', () => {
    // A date-only value is still parseable by `new Date`, so this documents
    // that the combination is null-safe rather than timezone sensitive.
    expect(formatEventDateTime('2026-03-14')).toContain('2026')
  })

  it('returns null when nothing is parseable', () => {
    expect(formatEventDateTime('')).toBeNull()
  })
})

describe('toDateTimeAttribute', () => {
  it('produces an ISO string for <time datetime>', () => {
    expect(toDateTimeAttribute('2026-03-14T19:00:00.000+00:00')).toBe('2026-03-14T19:00:00.000Z')
  })

  it('returns null instead of an invalid attribute value', () => {
    expect(toDateTimeAttribute('monday')).toBeNull()
  })
})
