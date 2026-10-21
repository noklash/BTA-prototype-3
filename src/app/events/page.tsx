import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { PartitionedEventList } from '@/components/event-list'
import { ButtonLink } from '@/components/ui/button-link'
import { Section } from '@/components/ui/section'
import { ContentErrorState } from '@/components/ui/state-message'
import { getEvents, getEventsPage } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  ...buildMetadata({
    title: "What's happening at BTA",
    description: 'A calendar of forums, member gatherings, heritage walks and partner events hosted by Bainbo Taria Awo Club.',
    path: "/events",
  }),
}

export default async function EventsPage() {
  const eventsResult = await getEvents()
  const pageResult = await getEventsPage()

  return (
    <>
      <PageHero
        eyebrow="Events & Media"
        title="What's happening at BTA"
        intro={
          pageResult.ok && pageResult.value?.pageHero?.intro
            ? pageResult.value.pageHero.intro
            : 'A calendar of forums, member gatherings, heritage walks and partner events. All times are local.'
        }
      />

      {pageResult.ok && pageResult.value?.note ? <DemonstrationNote /> : null}

      <Section>
        {eventsResult.ok ? (
          <PartitionedEventList events={eventsResult.value} />
        ) : (
          <ContentErrorState reason={eventsResult.reason} message={eventsResult.message} />
        )}

        <ButtonLink href="/membership" variant="text">
          Join to receive updates
        </ButtonLink>
      </Section>
    </>
  )
}