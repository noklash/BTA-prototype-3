import type { Metadata } from 'next'

import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section } from '@/components/ui/section'
import { getMembershipPage } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Support BTA',
  description: 'Support Bainbo Taria Awo Club — one-off gifts, regular giving or partner-level contributions.',
  alternates: { canonical: '/support' },
}

export default async function SupportPage() {
  // The membership singleton carries the demonstration note flag; the support
  // page reuses it so the notice stays consistent with the rest of the site.
  const result = await getMembershipPage()
  const note = result.ok && result.value ? result.value.note : true

  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Support BTA"
        intro="One-off gifts, regular giving and partner-level contributions keep the association independent."
      />

      {note ? <DemonstrationNote /> : null}

      <Section className="editorial">
        <article>
          <b>01</b>
          <div>
            <h2>Give once or regularly</h2>
            <p>
              Contributions are directed to the project bank, the scholarship fund and the
              association’s running costs. The demonstration giving flow shows the full journey,
              including a receipt.
            </p>
            <div className="cta-row">
              <ButtonLink href="/donate" variant="primary">
                Make a contribution
              </ButtonLink>
            </div>
          </div>
        </article>

        <article>
          <b>02</b>
          <div>
            <h2>Become a member</h2>
            <p>
              Membership subscriptions provide dependable income and give members a voice at the
              annual general meeting. Every category is described on the membership page.
            </p>
            <div className="cta-row">
              <ButtonLink href="/membership" variant="outline">
                Join BTA
              </ButtonLink>
            </div>
          </div>
        </article>

        <article>
          <b>03</b>
          <div>
            <h2>Partner with us</h2>
            <p>
              Development agencies, foundations, corporate sponsors and diaspora contributors can
              support a specific project or a multi-year programme. The partnership page sets out
              the current priorities.
            </p>
            <div className="cta-row">
              <ButtonLink href="/partner" variant="outline">
                Explore partnership
              </ButtonLink>
            </div>
          </div>
        </article>
      </Section>

      <Section className="partner-home">
        <div className="shell">
          <div>
            <span className="eyebrow">Accountability</span>
            <h2>See where support goes</h2>
          </div>
          <p>
            Illustrative statements, budgets and expenditure are published in the transparency
            section, alongside the progress of every project.
          </p>
          <div>
            <ButtonLink href="/transparency" variant="outline">
              View transparency
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  )
}
