/**
 * Pure helpers for ordering and partitioning events.
 *
 * Kept free of React and of the Sanity client so that they can be unit tested
 * directly and reused by both the events list and the home page.
 */
import { parseDateTime } from './format'

export interface EventLike {
  startDateTime: string
}

export interface EventPartitions<T extends EventLike> {
  /** Soonest first. */
  upcoming: T[]
  /** Most recent first. */
  past: T[]
}

function startTimestamp(event: EventLike): number {
  const date = parseDateTime(event.startDateTime)
  return date ? date.getTime() : Number.NEGATIVE_INFINITY
}

/**
 * Splits events into upcoming and past buckets, both sorted.
 *
 * Events with an unparsable date cannot be "upcoming", so they are treated as
 * past and sorted to the end of that bucket rather than being silently dropped.
 */
export function partitionEvents<T extends EventLike>(
  events: readonly T[],
  now: Date = new Date(),
): EventPartitions<T> {
  const nowTimestamp = now.getTime()
  const upcoming: T[] = []
  const past: T[] = []

  for (const event of events) {
    if (startTimestamp(event) >= nowTimestamp) {
      upcoming.push(event)
    } else {
      past.push(event)
    }
  }

  upcoming.sort((a, b) => startTimestamp(a) - startTimestamp(b))
  past.sort((a, b) => startTimestamp(b) - startTimestamp(a))

  return { upcoming, past }
}

/** The next upcoming event, or `null` when there is none. */
export function getNextEvent<T extends EventLike>(
  events: readonly T[],
  now: Date = new Date(),
): T | null {
  return partitionEvents(events, now).upcoming[0] ?? null
}
