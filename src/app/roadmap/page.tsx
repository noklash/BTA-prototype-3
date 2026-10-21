import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { Badge, DemoNotice, Panel } from '@/components/demo/ui'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Roadmap',
    description: 'The committee’s phased implementation roadmap, showing what Prototype 3 demonstrates, what is simulated, and what requires future production development.',
    path: "/roadmap",
  }),
}

interface Phase {
  phase: string
  title: string
  description: string
  items: { label: string; status: 'Demonstrated' | 'Simulated' | 'Future production' }[]
}

const PHASES: Phase[] = [
  {
    phase: 'Phase 1',
    title: 'Public website and core information',
    description:
      'The approved public website: content management, heritage, projects, mobile optimisation and core organisational information.',
    items: [
      { label: 'Public pages and navigation', status: 'Demonstrated' },
      { label: 'Sanity CMS content model', status: 'Demonstrated' },
      { label: 'Heritage and oral history pages', status: 'Demonstrated' },
      { label: 'Project bank directory', status: 'Demonstrated' },
      { label: 'Mobile layout', status: 'Demonstrated' },
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Members, dues and diaspora',
    description:
      'The members’ portal, dues, meeting records, diaspora engagement and knowledge sharing.',
    items: [
      { label: 'Members’ portal with internal navigation', status: 'Demonstrated' },
      { label: 'Profile viewing and editing', status: 'Demonstrated' },
      { label: 'Dues status and receipts', status: 'Simulated' },
      { label: 'Meeting notices, agendas and minutes', status: 'Demonstrated' },
      { label: 'Diaspora hub registration', status: 'Demonstrated' },
      { label: 'Authentication and real payments', status: 'Future production' },
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Projects, fundraising and opportunity',
    description:
      'Project tracking, fundraising, partnerships, scholarships, the business directory and professional volunteering.',
    items: [
      { label: 'Project tracker and progress updates', status: 'Demonstrated' },
      { label: 'Contribution flow and receipt', status: 'Simulated' },
      { label: 'Transparency reports', status: 'Demonstrated' },
      { label: 'Scholarships and applications', status: 'Simulated' },
      { label: 'Business directory and submissions', status: 'Demonstrated' },
      { label: 'Volunteer skills database', status: 'Demonstrated' },
      { label: 'Payment gateway and file storage', status: 'Future production' },
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Advanced infrastructure and engagement',
    description:
      'Advanced mapping, analytics, expanded archives and community engagement capabilities.',
    items: [
      { label: 'Illustrative project location board', status: 'Simulated' },
      { label: 'Feedback and moderation workflow', status: 'Demonstrated' },
      { label: 'Administrative dashboard', status: 'Demonstrated' },
      { label: 'Real mapping and geodata', status: 'Future production' },
      { label: 'Analytics and reporting pipeline', status: 'Future production' },
      { label: 'Expanded digital archive', status: 'Future production' },
    ],
  },
]

const STATUS_TONE: Record<Phase['items'][number]['status'], 'paid' | 'due' | 'default'> = {
  Demonstrated: 'paid',
  Simulated: 'due',
  'Future production': 'default',
}

export default function RoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow="Implementation"
        title="The roadmap."
        intro="The committee's phased plan, with each feature marked as demonstrated in Prototype 3, simulated for demonstration, or dependent on future production development."
        prototypeKey="river"
      />

      <DemonstrationNote />

      <Section>
        <DemoNotice>
          Prototype 3 shows the intended experience for later phases too. Demonstrating a feature
          here does not mean it is included in the current delivery, and no simulated feature
          should be treated as production-ready.
        </DemoNotice>

        <div className="panel-grid cols-2">
          {PHASES.map((phase) => (
            <div key={phase.phase}>
              <Badge tone="dark">{phase.phase}</Badge>
              <h3 style={{ marginTop: 14 }}>{phase.title}</h3>
              <p>{phase.description}</p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0' }}>
                {phase.items.map((item) => (
                  <li
                    key={item.label}
                    style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--line)' }}
                  >
                    <span style={{ fontSize: 13 }}>{item.label}</span>
                    <Badge tone={STATUS_TONE[item.status]}>{item.status}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section className="model">
        <SectionHeading
          eyebrow="Administration"
          title="Everything is connected"
          description="Prototype 3 uses one mock dataset across the public website, the members' portal and the admin area, so figures stay consistent."
        />

        <Panel>
          <p>
            Public forms feed the admin queues; admin status changes appear in the portal and in the
            public directories. All of it is held in the browser for the demonstration and is
            clearly labelled as simulated.
          </p>
        </Panel>
      </Section>

      <Section className="partner-home">
        <div>
          <span className="eyebrow">Next</span>
          <h2>Explore the platform</h2>
        </div>

        <p>
          Open the members’ portal to see the sign-in demonstration, or the project bank to see the
          tracker.
        </p>

        <div>
          <ButtonLink href="/portal" variant="primary">
            Members’ portal
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
