import type { Metadata } from 'next'

import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

/**
 * 404 page.
 *
 * Registered at the application root, so it catches unknown routes as well as
 * `notFound()` calls from the event detail page (for example an event that has
 * been unpublished or deleted).
 */
export default function NotFound() {
  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="404"
        title="We could not find that page"
        description="The link may be out of date, or the page may have been moved. Try the events diary, or head back to the start."
      />
      <div className="button-row">
        <ButtonLink href="/">Back to the home page</ButtonLink>
        <ButtonLink href="/events" variant="outline">
          Browse events
        </ButtonLink>
      </div>
    </Section>
  )
}
