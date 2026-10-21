import type { Metadata } from 'next'

import { ProjectDirectory } from '@/components/demo/directories'
import { Metric, MetricGrid } from '@/components/demo/ui'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'
import { computeDemoStats } from '@/lib/demo/data'
import { formatCompactNaira } from '@/lib/demo/format'
import { getProjects } from '@/lib/sanity/content'

export const metadata: Metadata = {
  title: 'Project Bank',
  description:
    'A searchable directory of proposed, approved, ongoing and completed Bainbo Taria Awo Club community projects, with budgets, funding targets and progress.',
  alternates: { canonical: '/projects' },
}

export default async function ProjectsPage() {
  const stats = computeDemoStats()
  const cmsProjects = await getProjects()
  const published = cmsProjects.ok ? (cmsProjects.value ?? []) : []

  // The stories come from the CMS; the figures come from the demonstration
  // layer, so a stage change in the admin area shows here straight away.
  const overrides = published.map((project) => ({
    slug: project.slug,
    name: project.title,
    summary: project.summary,
    location: project.location,
    category: project.category,
  }))

  return (
    <>
      <PageHero
        eyebrow="Community development"
        title="The BTA project bank."
        intro="Every community initiative in one place — what is proposed, what is approved, what is under way and what has been completed. Each project page shows its budget, funding target and progress."
        prototypeKey="community"
      />

      <DemonstrationNote />

      <Section>
        <MetricGrid>
          <Metric value={String(stats.projects)} label="Projects listed" />
          <Metric value={String(stats.ongoingProjects)} label="Ongoing" />
          <Metric value={String(stats.projectsCompleted)} label="Completed" />
          <Metric value={formatCompactNaira(stats.fundedNgn)} label="Illustrative funds raised" />
        </MetricGrid>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Directory"
          title="Browse the projects"
          description="Filter by category or search by name, location or summary. Stages and funding figures update as the demonstration admin area is used."
        />

        <ProjectDirectory overrides={overrides} />
      </Section>

      <Section className="partner-home">
        <div>
          <span className="eyebrow">Support a project</span>
          <h2>Fund what matters to you</h2>
        </div>

        <p>
          Contributions are simulated in this prototype. Each category maps to a real project in
          the bank, so you can see where a contribution would be directed.
        </p>

        <div>
          <ButtonLink href="/donate" variant="primary">
            Contribute
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
