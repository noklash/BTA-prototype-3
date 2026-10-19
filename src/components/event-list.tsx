import Link from 'next/link'

import { partitionEvents } from '@/lib/events'
import {
  formatEventDay,
  formatEventMonth,
  toDateTimeAttribute,
} from '@/lib/format'
import type { EventSummary } from '@/types/content'

import { ArrowRightIcon, MapPinIcon } from './ui/icons'
import { SectionHeading } from './ui/section'
import { StateMessage } from './ui/state-message'

/**
 * The event listing rows used on the home page and the events diary.
 *
 * Each row is a single link to the event's detail page. The date block shows
 * day and month (`18 OCT`), the category shows as a small tag. `startDateTime`
 * is rendered with `<time datetime>` so that assistive technology and search
 * engines get the machine-readable value; when the date cannot be parsed at
 * all the row says so instead of showing a broken date block.
 */
export function EventList({
  events,
  className = '',
}: {
  events: readonly EventSummary[]
  className?: string
}) {
  if (events.length === 0) {
    return null
  }

  return (
    <div className={`event-list ${className}`.trim()}>
      {events.map((event) => (
        <EventRow key={event._id} event={event} />
      ))}
    </div>
  )
}

function EventRow({ event }: { event: EventSummary }) {
  const dateTimeAttribute = toDateTimeAttribute(event.startDateTime)
  const day = formatEventDay(event.startDateTime)
  const month = formatEventMonth(event.startDateTime)

  return (
    <Link href={`/events/${event.slug}`}>
      <div className="date">
        {day && month && dateTimeAttribute ? (
          <time dateTime={dateTimeAttribute}>
            <b>{day}</b>
            <span>{month.toUpperCase()}</span>
          </time>
        ) : (
          <>
            <span aria-hidden="true">TBC</span>
            <span className="sr-only">Date to be confirmed</span>
          </>
        )}
      </div>

      <div>
        <small>{event.category}</small>
        <h3>{event.title}</h3>
        {event.location ? (
          <p>
            <MapPinIcon /> {event.location}
          </p>
        ) : null}
      </div>

      <div>
        <ArrowRightIcon />
      </div>
    </Link>
  )
}

/**
 * Full events listing: upcoming events first, the archive below.
 *
 * Past events stay reachable (they are part of the organisation's record) but
 * are visually secondary. Draft events never reach this component: the GROQ
 * query filters them out.
 */
export function PartitionedEventList({
  events,
  now,
}: {
  events: readonly EventSummary[]
  now?: Date
}) {
  const { upcoming, past } = partitionEvents(events, now)

  return (
    <>
      <div className="event-group">
        <SectionHeading eyebrow="Diary" title="Upcoming events" />

        {upcoming.length > 0 ? (
          <EventList events={upcoming} />
        ) : (
          <StateMessage
            title="No events are scheduled right now"
            description="New events appear here as soon as an editor publishes them in Sanity Studio. Past gatherings are listed below."
          />
        )}
      </div>

      {past.length > 0 ? (
        <div className="event-group">
          <SectionHeading
            eyebrow="Archive"
            title="Past events"
            description={`${past.length} previous ${
              past.length === 1 ? 'gathering' : 'gatherings'
            } from our archive.`}
          />

          <EventList events={past} />
        </div>
      ) : null}
    </>
  )
}