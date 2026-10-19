import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ScholarshipApplicationForm } from '@/components/demo/public-forms'
import { DemoNotice } from '@/components/demo/ui'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'
import { DEMO_DATA, findOpportunity } from '@/lib/demo/data'

interface OpportunityRouteProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams(): { slug: string }[] {
  return DEMO_DATA.opportunities.map((opportunity) => ({ slug: opportunity.slug }))
}

export async function generateMetadata({ params }: OpportunityRouteProps): Promise<Metadata> {
  const { slug } = await params
  const opportunity = findOpportunity(slug)

  if (!opportunity) {
    return { title: 'Opportunity not found', robots: { index: false, follow: false } }
  }

  return {
    title: opportunity.title,
    description: opportunity.summary,
    alternates: { canonical: `/youth/${opportunity.slug}` },
  }
}

export default async function OpportunityPage({ params }: OpportunityRouteProps) {
  const { slug } = await params
  const opportunity = findOpportunity(slug)

  if (!opportunity) {
    notFound()
  }

  return (
    <>
      <PageHero
        eyebrow={`${opportunity.kind} · ${opportunity.status}`}
        title={opportunity.title}
        intro={opportunity.summary}
        prototypeKey="hero"
      />

      <DemonstrationNote />

      <Section>
        <div className="detail">
          <div className="shell">
            <article>
              <DemoNotice>
                This is a fictional opportunity created for the prototype. Applying does not enter a
                real competition and no fee or document is ever requested.
              </DemoNotice>

              <h2>About this opportunity</h2>
              <p>{opportunity.summary}</p>

              <h3>Who can apply</h3>
              <ul>
                {opportunity.eligibility.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3>Apply</h3>
              <ScholarshipApplicationForm
                opportunityId={opportunity.id}
                opportunityTitle={opportunity.title}
              />

              <div style={{ marginTop: 34 }}>
                <Link
                  href="/youth"
                  className="text-sm font-semibold text-[var(--mid)] underline underline-offset-4 hover:text-[var(--navy)]"
                >
                  ← All opportunities
                </Link>
              </div>
            </article>

            <aside>
              <span className="eyebrow">At a glance</span>

              <h3>Type</h3>
              <p>{opportunity.kind}</p>

              <h3>Provider</h3>
              <p>{opportunity.provider}</p>

              <h3>Award</h3>
              <p>{opportunity.award}</p>

              <h3>Level</h3>
              <p>{opportunity.studyLevel}</p>

              <h3>Location</h3>
              <p>{opportunity.location}</p>

              <h3>Application deadline</h3>
              <p>{opportunity.deadline}</p>

              <div>
                <ButtonLink href="/youth" variant="outline">
                  Other opportunities
                </ButtonLink>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      <Section className="model">
        <SectionHeading
          eyebrow="Related"
          title="More openings"
          description="Other opportunities in the demonstration directory."
        />

        <div className="panel-grid cols-3">
          {DEMO_DATA.opportunities
            .filter((item) => item.id !== opportunity.id)
            .slice(0, 3)
            .map((item) => (
              <div key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <p style={{ marginTop: 12 }}>
                  <Link
                    href={`/youth/${item.slug}`}
                    className="text-sm font-semibold text-[var(--mid)] underline underline-offset-4 hover:text-[var(--navy)]"
                  >
                    View opportunity
                  </Link>
                </p>
              </div>
            ))}
        </div>
      </Section>
    </>
  )
}
