import type { Metadata } from 'next'

import { PartnershipForm } from '@/components/demo/public-forms'
import { DemoNotice, Tracker } from '@/components/demo/ui'
import { EditorialPage } from '@/components/editorial-page'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'
import { ContentErrorState, StateMessage } from '@/components/ui/state-message'
import { DEMO_DATA } from '@/lib/demo/data'
import { formatNaira } from '@/lib/demo/format'
import { getEditorialPageByKind } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Partner',
  description:
    'Development priorities, sample project briefs, accountability information and a partnership enquiry form for agencies, foundations, sponsors and diaspora contributors.',
  alternates: { canonical: '/partner' },
}

/**
 * The partner page keeps its CMS editorial content and adds the committee's
 * partnership material: development priorities, sample briefs drawn from the
 * project bank, a link to the transparency area and an enquiry form.
 */
export default async function PartnerPage() {
  const result = await getEditorialPageByKind('partners')

  if (!result.ok) {
    return (
      <Section>
        <ContentErrorState reason={result.reason} message={result.message} />
      </Section>
    )
  }

  if (!result.value) {
    return (
      <Section>
        <StateMessage
          title="The partner page has not been published yet"
          description="Its content is managed in Sanity Studio. Add or publish the “partners” editorial page to see it here."
        />
      </Section>
    )
  }

  const briefs = DEMO_DATA.projects.filter((project) => project.stage !== 'Completed').slice(0, 3)

  return (
    <>
      <EditorialPage page={result.value} />

      <Section className="model">
        <SectionHeading
          eyebrow="Development priorities"
          title="Where partnership helps most"
          description="Each priority maps to projects in the bank, with budgets and progress published openly."
        />

        <div className="panel-grid cols-3">
          {DEMO_DATA.donationCategories.map((category) => (
            <div key={category.id}>
              <h3>{category.label}</h3>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Sample project briefs"
          title="Three projects ready to partner on"
          description="Illustrative briefs drawn from the project bank. Each links to its full page with budget and tracker."
        />

        <div className="panel-grid cols-3">
          {briefs.map((project) => (
            <div key={project.id}>
              <h3>{project.name}</h3>
              <p>{project.summary}</p>
              <Tracker
                raised={project.raisedNgn}
                target={project.fundingTargetNgn}
                formatValue={formatNaira}
                leftLabel="Raised"
              />
              <p style={{ marginTop: 16 }}>
                <ButtonLink href={`/projects/${project.slug}`} variant="text">
                  Read the brief
                </ButtonLink>
              </p>
            </div>
          ))}
        </div>

        <div className="button-row">
          <ButtonLink href="/transparency">Accountability and reporting</ButtonLink>
        </div>
      </Section>

      <Section className="form-page">
        <div>
          <span className="eyebrow">Enquire</span>
          <h2>Work with BTA</h2>
          <p>
            Development agencies, foundations, corporate sponsors and diaspora contributors can send
            an enquiry. No real organisation is contacted by this prototype and no partnership is
            implied.
          </p>

          <DemoNotice>
            Enquiries are recorded in this browser and appear in the demonstration admin area. No
            grant, sponsorship or signed partnership exists.
          </DemoNotice>
        </div>

        <PartnershipForm />
      </Section>
    </>
  )
}
