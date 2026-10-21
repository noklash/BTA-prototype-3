import type { Metadata } from 'next'

import { BeforeAfter, Badge, DemoNotice, Metric, MetricGrid, Tracker } from '@/components/demo/ui'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'
import { DEMO_DATA, computeDemoStats } from '@/lib/demo/data'
import { formatCompactNaira, formatNaira, progressPercent } from '@/lib/demo/format'

export const metadata: Metadata = {
  title: 'Transparency & Accountability',
  description:
    'Illustrative financial summaries, project budgets, expenditure and progress reporting for the Bainbo Taria Awo Club demonstration.',
  alternates: { canonical: '/transparency' },
}

export default function TransparencyPage() {
  const stats = computeDemoStats()
  const projectsWithImages = DEMO_DATA.projects.filter((project) => project.beforeAfter)

  return (
    <>
      <PageHero
        eyebrow="Accountability"
        title="Open by default."
        intro="Illustrative financial summaries, project budgets and progress reporting. Everything here is sample data created for the demonstration — it is not an audited account."
        prototypeKey="river"
      />

      <DemonstrationNote />

      <Section>
        <DemoNotice>
          <strong>Sample records.</strong> The statements, budgets and figures on this page are
          invented for the prototype. They are not audited records, and no figure should be relied
          upon as a real financial statement.
        </DemoNotice>

        <MetricGrid>
          <Metric value={formatCompactNaira(stats.fundedNgn)} label="Illustrative funds raised" />
          <Metric value={formatCompactNaira(stats.fundingTargetNgn)} label="Combined project target" />
          <Metric value={String(stats.ongoingProjects)} label="Projects underway" />
          <Metric value={String(projectsWithImages.length)} label="Projects with before/after" />
        </MetricGrid>
      </Section>

      <Section className="model">
        <SectionHeading
          eyebrow="Financial reporting"
          title="Statements and summaries"
          description="Each summary carries the label “illustrative sample” so it is never mistaken for a real statement."
        />

        <div className="panel-grid cols-3">
          {DEMO_DATA.statements.map((statement) => (
            <div key={statement.id}>
              <Badge tone="due">{statement.label}</Badge>
              <h3 style={{ marginTop: 14 }}>{statement.title}</h3>
              <p>
                {statement.period} · {statement.scope}
              </p>

              <div className="table-wrap" style={{ marginTop: 16 }}>
                <table className="data-table">
                  <tbody>
                    {statement.lines.map((line) => (
                      <tr key={line.label}>
                        <td>{line.label}</td>
                        <td className="num">{formatNaira(line.amountNgn)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Project budgets"
          title="Funding targets and expenditure"
          description="Budget, funding target and illustrative spend for each project in the bank."
        />

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">Stage</th>
                <th scope="col" className="num">
                  Budget
                </th>
                <th scope="col" className="num">
                  Raised
                </th>
                <th scope="col" className="num">
                  Spent
                </th>
                <th scope="col" className="num">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody>
              {DEMO_DATA.projects.map((project) => {
                const spent = DEMO_DATA.budgetLines
                  .filter((line) => line.projectId === project.id)
                  .reduce((sum, line) => sum + line.spentNgn, 0)
                return (
                  <tr key={project.id}>
                    <td>{project.name}</td>
                    <td className="muted">{project.stage}</td>
                    <td className="num">{formatNaira(project.estimatedCostNgn)}</td>
                    <td className="num">{formatNaira(project.raisedNgn)}</td>
                    <td className="num">{formatNaira(spent)}</td>
                    <td className="num">{progressPercent(project.raisedNgn, project.fundingTargetNgn)}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="model">
        <SectionHeading
          eyebrow="Progress"
          title="Where the work has reached"
          description="Funding progress against target for the projects currently underway."
        />

        <div className="panel-grid cols-2">
          {DEMO_DATA.projects
            .filter((project) => project.stage === 'Ongoing' || project.stage === 'Approved')
            .map((project) => (
              <div key={project.id}>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <Tracker
                  raised={project.raisedNgn}
                  target={project.fundingTargetNgn}
                  formatValue={formatNaira}
                  leftLabel="Raised"
                />
              </div>
            ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Documents"
          title="Supporting documents"
          description="References to the illustrative budgets, reports and approvals held for each project."
        />

        <div className="row-list">
          {DEMO_DATA.projects.flatMap((project) =>
            project.documents.map((document) => (
              <div key={document.reference}>
                <div>
                  <Badge>{document.kind}</Badge>
                </div>
                <div>
                  <small>{project.name}</small>
                  <h3>{document.name}</h3>
                  <p>Reference {document.reference} · illustrative document</p>
                </div>
                <div />
              </div>
            )),
          )}
        </div>
      </Section>

      <Section className="model">
        <SectionHeading
          eyebrow="Evidence"
          title="Before and after"
          description="Prototype imagery showing the kind of before/after record each project would carry."
        />

        <div className="stack">
          {projectsWithImages.map((project) =>
            project.beforeAfter ? (
              <div key={project.id}>
                <SmallHeading>{project.name}</SmallHeading>
                <BeforeAfter {...project.beforeAfter} />
              </div>
            ) : null,
          )}
        </div>
      </Section>

      <Section className="partner-home">
        <div>
          <span className="eyebrow">Questions</span>
          <h2>Ask us anything</h2>
        </div>

        <p>
          Members can raise questions through the feedback form; the committee records how each
          one is handled.
        </p>

        <div>
          <ButtonLink href="/feedback" variant="primary">
            Send feedback
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}

function SmallHeading({ children }: { children: React.ReactNode }) {
  return <h3 style={{ marginBottom: 6 }}>{children}</h3>
}
