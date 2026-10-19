import type { Metadata } from 'next'

import { OpportunityDirectory } from '@/components/demo/directories'
import { Metric, MetricGrid } from '@/components/demo/ui'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'
import { DEMO_DATA, computeDemoStats } from '@/lib/demo/data'

export const metadata: Metadata = {
  title: 'Youth & Scholarships',
  description:
    'Scholarships, internships, mentoring, vocational training and career resources for young people, with an application workflow.',
  alternates: { canonical: '/youth' },
}

export default function YouthPage() {
  const stats = computeDemoStats()

  return (
    <>
      <PageHero
        eyebrow="Youth empowerment"
        title="Opportunity, made visible."
        intro="Scholarships, internships, mentoring and training — in one filterable place, with a clear application route. All listings are fictional demonstrations."
        prototypeKey="hero"
      />

      <DemonstrationNote />

      <Section>
        <MetricGrid>
          <Metric value={String(stats.opportunities)} label="Opportunities listed" />
          <Metric value={String(DEMO_DATA.opportunities.filter((o) => o.status !== 'Closed').length)} label="Open now" />
          <Metric value={String(DEMO_DATA.applications.length)} label="Applications recorded" />
          <Metric value={String(DEMO_DATA.opportunities.filter((o) => o.kind === 'Scholarship').length)} label="Scholarships" />
        </MetricGrid>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Directory"
          title="Find an opportunity"
          description="Filter by type or search by title, provider or location. Each listing opens a detail page with eligibility and an application form."
        />

        <OpportunityDirectory />
      </Section>

      <Section className="model">
        <SectionHeading
          eyebrow="How applying works"
          title="From listing to decision"
          description="The application workflow is simulated end to end, including the admin review stage."
        />

        <ol className="steps-grid">
          <li>
            <small>01</small>
            <p>Open a listing and read the eligibility criteria.</p>
          </li>
          <li>
            <small>02</small>
            <p>Submit the short application form on the listing page.</p>
          </li>
          <li>
            <small>03</small>
            <p>The panel reviews applications in the admin area.</p>
          </li>
          <li>
            <small>04</small>
            <p>Statuses are recorded as Submitted, Under review, Shortlisted or Not taken forward.</p>
          </li>
        </ol>

        <div className="button-row">
          <ButtonLink href="/diaspora" variant="outline">
            Diaspora mentoring
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
