import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { RichText } from '@/components/portable-text'
import { ButtonLink } from '@/components/ui/button-link'
import { Section } from '@/components/ui/section'
import { ContentErrorState } from '@/components/ui/state-message'
import { formatEventDateTime, toDateTimeAttribute } from '@/lib/format'
import { getEventBySlug, getPublishedEventSlugs } from '@/lib/sanity/content'
import { buildImageUrl } from '@/lib/sanity/image'
import { getSiteUrl } from '@/lib/site'

export const revalidate = 120

interface EventRouteProps {
  // Next.js 15+ passes route params as a promise.
  params: Promise<{ slug: string }>
}

/**
 * Prerenders every published event at build time. When Sanity is not
 * configured or unreachable this returns an empty list, and the pages are
 * rendered on demand instead (`dynamicParams` defaults to `true`).
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getPublishedEventSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: EventRouteProps): Promise<Metadata> {
  const { slug } = await params
  const result = await getEventBySlug(slug)

  if (!result.ok || !result.value) {
    return { title: 'Event not found', robots: { index: false, follow: false } }
  }

  const event = result.value
  const coverImageUrl = buildImageUrl(event.coverImage, 1200)

  return {
    title: event.title,
    description: event.summary ?? undefined,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      type: 'article',
      title: event.title,
      description: event.summary ?? undefined,
      images: coverImageUrl ? [{ url: coverImageUrl, alt: event.coverImage?.alt ?? event.title }] : undefined,
    },
  }
}

export default async function EventPage({ params }: EventRouteProps) {
  const { slug } = await params
  const result = await getEventBySlug(slug)

  if (!result.ok) {
    return (
      <Section>
        <ContentErrorState reason={result.reason} message={result.message} />
      </Section>
    )
  }

  const event = result.value

  if (!event) {
    // Either the slug does not exist, or the event is not published. Both are a
    // 404 on the public website.
    notFound()
  }

  const dateTimeAttribute = toDateTimeAttribute(event.startDateTime)
  const dateTimeLabel = formatEventDateTime(event.startDateTime)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.summary ?? undefined,
    startDate: dateTimeAttribute ?? event.startDateTime,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: new URL(`/events/${event.slug}`, getSiteUrl()).toString(),
    location: event.location
      ? { '@type': 'Place', name: event.location }
      : { '@type': 'Place', name: 'Venue to be confirmed' },
  }

  return (
    <>
      <PageHero
        eyebrow="Event"
        title={event.title}
        intro={event.summary ?? undefined}
        image={event.coverImage}
      />

      <DemonstrationNote />

      <Section>
        <div className="detail">
          <div className="shell">
            <article>
              {event.fullDescription && event.fullDescription.length > 0 ? (
                <RichText value={event.fullDescription} />
              ) : (
                <p>No full description has been published for this event yet.</p>
              )}

              <div>
                <Link
                  href="/events"
                  className="text-sm font-semibold text-[var(--mid)] underline underline-offset-4 hover:text-[var(--navy)]"
                >
                  ← All events
                </Link>
              </div>
            </article>

            <aside>
              <span className="eyebrow">At a glance</span>

              <h3>When</h3>
              <p>
                {dateTimeAttribute && dateTimeLabel ? (
                  <time dateTime={dateTimeAttribute}>{dateTimeLabel}</time>
                ) : (
                  'Date to be confirmed'
                )}
              </p>

              <h3>Where</h3>
              <p>{event.location ?? 'Venue to be confirmed'}</p>

              <div>
                <ButtonLink href="/membership">Become a member</ButtonLink>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
    </>
  )
}