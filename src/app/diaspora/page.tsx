import type { Metadata } from 'next'

import { DiasporaForm } from '@/components/demo/public-forms'
import { DemoNotice, Metric, MetricGrid } from '@/components/demo/ui'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'
import { DEMO_DATA, computeDemoStats } from '@/lib/demo/data'

export const metadata: Metadata = {
  title: 'Diaspora Hub',
  description:
    'For members abroad: register with the diaspora hub, volunteer remotely, mentor young people and take part in community projects.',
  alternates: { canonical: '/diaspora' },
}

const WAYS = [
  { title: 'Volunteer remotely', description: 'Offer professional skills — mentoring, review, teaching or advice — from wherever you are.' },
  { title: 'Mentor a young person', description: 'Join a six-month mentoring relationship through the youth programme.' },
  { title: 'Contribute to a project', description: 'Direct a simulated contribution to infrastructure, education, healthcare or heritage.' },
  { title: 'Join an event online', description: 'Some general meetings and forum sessions are open to remote attendance.' },
  { title: 'Take part in projects', description: 'Contribute to project design, procurement review or the oral history archive.' },
]

export default function DiasporaPage() {
  const stats = computeDemoStats()

  return (
    <>
      <PageHero
        eyebrow="Diaspora hub"
        title="Far from home. Still part of it."
        intro="A place for members abroad to stay connected, offer their skills and take part in the community's work — remotely, on their own schedule."
        prototypeKey="boats"
      />

      <DemonstrationNote />

      <Section>
        <MetricGrid>
          <Metric value={String(stats.diasporaMembers)} label="Diaspora members" />
          <Metric value={String(DEMO_DATA.volunteers.filter((v) => v.mode === 'Remote' || v.mode === 'Either').length)} label="Remote volunteers" />
          <Metric value={String(DEMO_DATA.diasporaRegistrations.length)} label="Hub registrations" />
          <Metric value={String(stats.projects)} label="Projects to join" />
        </MetricGrid>
      </Section>

      <Section className="model">
        <SectionHeading
          eyebrow="How to take part"
          title="Five ways in"
          description="Every route below reuses the same demonstration data as the rest of the platform."
        />

        <div className="panel-grid cols-3">
          {WAYS.map((way) => (
            <div key={way.title}>
              <h3>{way.title}</h3>
              <p>{way.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="form-page">
        <div>
          <span className="eyebrow">Register</span>
          <h2>Join the diaspora hub</h2>
          <p>
            Tell us where you are and what you would like to do. Registration is a demonstration: it
            is held in this browser and shown in the admin area only.
          </p>

          <DemoNotice>
            Your email address is stored in this browser only and is never displayed in the public
            member directory.
          </DemoNotice>
        </div>

        <DiasporaForm />
      </Section>

      <Section className="partner-home">
        <div>
          <span className="eyebrow">Keep in touch</span>
          <h2>See what is on</h2>
        </div>

        <p>
          Remote attendance is offered where possible. Check the diary and the project bank for
          ways to take part from abroad.
        </p>

        <div>
          <ButtonLink href="/events" variant="primary">
            Browse events
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
