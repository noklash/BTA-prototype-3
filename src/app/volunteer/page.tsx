import type { Metadata } from 'next'

import { VolunteerForm } from '@/components/demo/public-forms'
import { DemoNotice, Metric, MetricGrid } from '@/components/demo/ui'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'
import { DEMO_DATA } from '@/lib/demo/data'

export const metadata: Metadata = {
  title: 'Volunteer Skills',
  description:
    'Register professional skills and areas of expertise so volunteers can be matched with community projects, locally or remotely.',
  alternates: { canonical: '/volunteer' },
}

const CATEGORIES = [
  'Engineering',
  'Healthcare',
  'Education',
  'Law',
  'Finance',
  'Technology',
  'Entrepreneurship',
] as const

export default function VolunteerPage() {
  const byCategory = CATEGORIES.map((category) => ({
    category,
    count: DEMO_DATA.volunteers.filter((volunteer) => volunteer.category === category).length,
  }))

  return (
    <>
      <PageHero
        eyebrow="Volunteer and professional skills"
        title="Put your skills to work."
        intro="Register what you can offer and how much time you have. The demonstration shows how volunteers could be matched with community projects, with private contact details kept back."
        prototypeKey="people"
      />

      <DemonstrationNote />

      <Section>
        <MetricGrid>
          <Metric value={String(DEMO_DATA.volunteers.length)} label="Volunteers registered" />
          <Metric value={String(DEMO_DATA.volunteers.filter((v) => v.status === 'Matched').length)} label="Matched to projects" />
          <Metric value={String(DEMO_DATA.volunteers.filter((v) => v.mode !== 'Local').length)} label="Available remotely" />
          <Metric value={String(CATEGORIES.length)} label="Professional categories" />
        </MetricGrid>
      </Section>

      <Section className="model">
        <SectionHeading
          eyebrow="Where volunteers are needed"
          title="Professional categories"
          description="Current registrations by category in the demonstration database."
        />

        <div className="panel-grid cols-4">
          {byCategory.map((entry) => (
            <div key={entry.category}>
              <h3 style={{ fontSize: 20 }}>{entry.category}</h3>
              <p>
                {entry.count} registered {entry.count === 1 ? 'volunteer' : 'volunteers'}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="form-page">
        <div>
          <span className="eyebrow">Register</span>
          <h2>Offer your skills</h2>
          <p>
            Tell us your profession, your skills and how much time you can give. Matching is
            demonstrated only: no one will contact you from this prototype.
          </p>

          <DemoNotice>
            Private contact details are never shown to other members. The directory only exposes
            category, skills, availability and broad location.
          </DemoNotice>
        </div>

        <VolunteerForm />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="How it works"
          title="From registration to a project match"
        />

        <ol className="steps-grid">
          <li>
            <small>01</small>
            <p>Register your profession, skills and availability.</p>
          </li>
          <li>
            <small>02</small>
            <p>A coordinator reviews the register and shortlists suitable volunteers.</p>
          </li>
          <li>
            <small>03</small>
            <p>Both sides agree the scope, time commitment and how contact is shared.</p>
          </li>
          <li>
            <small>04</small>
            <p>The match is recorded against the relevant project and reviewed at the end.</p>
          </li>
        </ol>

        <div className="button-row">
          <ButtonLink href="/projects">See projects needing volunteers</ButtonLink>
        </div>
      </Section>
    </>
  )
}
