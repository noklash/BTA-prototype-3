import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'
import Link from 'next/link'

import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section } from '@/components/ui/section'
import { getEvents } from '@/lib/sanity/content'

import { SanityImage } from '@/components/sanity-image'
import { ArrowRightIcon } from '@/components/ui/icons'

export const revalidate = 120

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Media',
    description: 'Latest news and stories from Bainbo Taria Awo  .',
    path: "/media",
  }),
}

export default async function MediaPage() {
  const result = await getEvents()

  return (
    <>
      <PageHero
        eyebrow="Media"
        title="Latest from BTA"
        intro="Stories, session summaries and community updates from across the association."
      />

      <DemonstrationNote />

      <Section>
        {result.ok ? (
          <div className="news">
            {result.value.map((event) => (
              <Link key={event._id} href={`/events/${event.slug}`} className="news-item">
                {event.coverImage?.asset?._ref ? (
                  <SanityImage image={event.coverImage} alt={event.title} sizes="(max-width: 600px) 100vw, 600px" widths={[300, 600]} />
                ) : null}
                <div>
                  <span>
                    {event.category} · {new Date(event.startDateTime).getFullYear()}
                  </span>
                  <h2>{event.title}</h2>
                  {event.summary ? <p>{event.summary}</p> : null}
                  <ArrowRightIcon />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>Media items appear here as soon as events are published in Sanity Studio.</p>
        )}

        <ButtonLink href="/events" variant="text">
          View all events
        </ButtonLink>
      </Section>
    </>
  )
}