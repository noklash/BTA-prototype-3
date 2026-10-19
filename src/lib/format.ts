/**
 * Date formatting for event content.
 *
 * The organisation is fictional but London-based, so every date is rendered in
 * `Europe/London` explicitly. Relying on the runtime time zone would make the
 * output depend on where the code runs (a developer laptop, CI, Vercel) and
 * would silently shift event times.
 */

export const SITE_TIME_ZONE = 'Europe/London'
export const SITE_LOCALE = 'en-GB'

const WEEKDAY_DATE_FORMATTER = new Intl.DateTimeFormat(SITE_LOCALE, {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: SITE_TIME_ZONE,
})

const TIME_FORMATTER = new Intl.DateTimeFormat(SITE_LOCALE, {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: SITE_TIME_ZONE,
})

/** Used by the event list's date block: `"18"`. */
const DAY_FORMATTER = new Intl.DateTimeFormat(SITE_LOCALE, {
  day: '2-digit',
  timeZone: SITE_TIME_ZONE,
})

/** Used by the event list's date block: `"Apr"`. */
const MONTH_FORMATTER = new Intl.DateTimeFormat(SITE_LOCALE, {
  month: 'short',
  timeZone: SITE_TIME_ZONE,
})

/** Parses a Sanity `datetime` value, returning `null` for empty/invalid input. */
export function parseDateTime(value: string | null | undefined): Date | null {
  if (!value) {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * `Intl` renders the `en-GB` weekday/date pattern as `"Sat, 14 March 2026"`, but
 * the editorial house style drops the comma. Rebuilding the value from the
 * formatted parts keeps that decision explicit instead of depending on a
 * literal-comma replacement that a locale change could silently break.
 */
function formatWeekdayDate(date: Date): string {
  return WEEKDAY_DATE_FORMATTER.formatToParts(date)
    .filter((part) => part.type !== 'literal')
    .map((part) => part.value)
    .join(' ')
}

/** `"Sat 14 March 2026"`, or `null` when the value cannot be parsed. */
export function formatEventDate(value: string | null | undefined): string | null {
  const date = parseDateTime(value)
  return date ? formatWeekdayDate(date) : null
}

/** `"19:00"`, or `null` when the value cannot be parsed. */
export function formatEventTime(value: string | null | undefined): string | null {
  const date = parseDateTime(value)
  return date ? TIME_FORMATTER.format(date) : null
}

/** `"18"`, the day part of the event list's date block, or `null`. */
export function formatEventDay(value: string | null | undefined): string | null {
  const date = parseDateTime(value)
  return date ? DAY_FORMATTER.format(date) : null
}

/** `"Apr"`, the month part of the event list's date block, or `null`. */
export function formatEventMonth(value: string | null | undefined): string | null {
  const date = parseDateTime(value)
  return date ? MONTH_FORMATTER.format(date) : null
}

/**
 * `"Sat 14 March 2026 · 19:00"`, or `null` when the value cannot be parsed.
 * The middle dot is intentional: it avoids the ambiguous slash of `14/03` and
 * reads correctly in a screen reader.
 */
export function formatEventDateTime(value: string | null | undefined): string | null {
  const date = formatEventDate(value)
  const time = formatEventTime(value)
  if (!date) {
    return null
  }
  return time ? `${date} · ${time}` : date
}

/**
 * Value for the `dateTime` attribute of `<time>`. Returns `null` for unusable
 * input so the caller can omit the attribute instead of emitting garbage.
 */
export function toDateTimeAttribute(value: string | null | undefined): string | null {
  const date = parseDateTime(value)
  return date ? date.toISOString() : null
}
