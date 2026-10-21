import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { BusinessDirectory } from '@/components/demo/directories'
import { BusinessSubmissionForm } from '@/components/demo/public-forms'
import { DemoNotice, Metric, MetricGrid } from '@/components/demo/ui'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'
import { DEMO_DATA } from '@/lib/demo/data'
import { getBusinessHub } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Business Hub',
    description: 'Buy BTA. A searchable directory of illustrative member businesses, professional services and cooperative opportunities, with a submission form.',
    path: "/enterprise/business-hub",
  }),
}

/**
 * The business and investment directory.
 *
 * The curated, CMS-managed featured listings are preserved; the committee's
 * searchable directory, category filters, detail pages and submission form are
 * added around them.
 */
export default async function BusinessHubPage() {
  const result = await getBusinessHub()
  const page = result.ok ? result.value : null
  const featured = page?.businesses ?? []

  const published = DEMO_DATA.businesses.filter((business) => business.status === 'Published')
  const categories = new Set(DEMO_DATA.businesses.map((business) => business.category))

  return (
    <>
      <PageHero
        eyebrow={page?.pageHero?.eyebrow ?? 'BTA Business Hub'}
        title={page?.pageHero?.title ?? 'Buy BTA. Support a BTA business.'}
        intro={page?.pageHero?.intro ?? undefined}
        image={page?.pageHero?.image ?? null}
      />

      {page?.note ? <DemonstrationNote /> : null}

      <Section>
        <MetricGrid>
          <Metric value={String(published.length)} label="Listed businesses" />
          <Metric value={String(categories.size)} label="Categories" />
          <Metric value={String(DEMO_DATA.businesses.filter((b) => b.diasporaOwned).length)} label="Diaspora-owned" />
          <Metric value={String(DEMO_DATA.businesses.filter((b) => b.status === 'Pending review').length)} label="Awaiting review" />
        </MetricGrid>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Directory"
          title="Find a business or service"
          description="Filter by category or search by name, service or location. Every listing is illustrative."
        />

        <DemoNotice>
          These businesses are fictional or illustrative. Listing here is not an endorsement and does
          not imply any verification by the club.
        </DemoNotice>

        <BusinessDirectory />
      </Section>

      {featured.length > 0 ? (
        <Section className="model">
          <SectionHeading
            eyebrow="Featured"
            title="Selected by the club"
            description="Curated listings published by editors in Sanity Studio."
          />

          <div className="business-list">
            {featured.map((business, index) => (
              <div key={business._key ?? index}>
                <small>{business.number}</small>
                <div>
                  <h2>{business.name}</h2>
                  {business.category ? <p>{business.category}</p> : null}
                </div>
                <div className="business-list-meta">
                  {business.location ? <b>{business.location}</b> : null}
                  {business.link ? (
                    <ButtonLink href={business.link} variant="text">
                      View
                    </ButtonLink>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section className="form-page">
        <div>
          <span className="eyebrow">Add a listing</span>
          <h2>List your business</h2>
          <p>
            Members can submit a business, professional service or cooperative for review. New
            listings are marked Pending review and appear in the demonstration admin area.
          </p>
        </div>

        <BusinessSubmissionForm />
      </Section>

      <Section className="partner-home">
        <div>
          <span className="eyebrow">Cooperative opportunities</span>
          <h2>Grow together</h2>
        </div>

        <p>
          The directory also carries cooperative and community investment opportunities. No
          investment is offered and no returns are promised.
        </p>

        <div>
          <ButtonLink href="/partner" variant="primary">
            Partner with BTA
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
