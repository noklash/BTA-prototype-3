import type { Metadata } from 'next'

import { LeadershipGrid, leadershipEntries } from '@/components/demo/leadership'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Leadership',
  description:
    'The Bainbo Taria Awo Club committee: names, offices, remits and the members who hold them.',
  alternates: { canonical: '/our-people/leadership' },
}

/**
 * The leadership directory under "Our People".
 *
 * The page is server-rendered from the shared demonstration dataset, so the
 * people shown here are the same people the members' directory and the portal
 * know about. The photographs are placeholders for fictional people, and the
 * page says so.
 */
export default function LeadershipPage() {
  const entries = leadershipEntries()

  return (
    <>
      <PageHero
        eyebrow="Our People"
        title="The committee behind the work."
        intro="BTA is run by volunteers elected each October at the annual general meeting. Every office is shared, so no single person becomes indispensable."
        prototypeKey="people"
      />

      <DemonstrationNote />

      <Section>
        <SectionHeading
          eyebrow="Leadership"
          title="Who serves"
          description="The officers and committee leads responsible for the club's work, drawn from the membership register."
        />

        <LeadershipGrid entries={entries} />

        <p className="leadership-note">
          The people and photographs on this page are illustrative. In a live deployment each entry
          is published from the members&rsquo; register, with the member&rsquo;s consent and their own
          portrait.
        </p>
      </Section>

      <section className="partner-home">
        <div className="shell">
          <div>
            <span className="eyebrow">Take part</span>
            <h2>Stand for election.</h2>
          </div>

          <p>
            Committee places are open to every active member. Nominations are considered at the annual
            general meeting each October.
          </p>

          <div>
            <ButtonLink href="/membership" variant="outline">
              Membership details
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
