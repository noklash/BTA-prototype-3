import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BeforeAfter, DemoNotice, MapBoard, StageBadge, Tracker } from '@/components/demo/ui'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'
import { ArrowRightIcon } from '@/components/ui/icons'
import { RichText } from '@/components/portable-text'
import { DEMO_DATA, findProject } from '@/lib/demo/data'
import { formatNaira } from '@/lib/demo/format'
import type { ProjectCategory } from '@/lib/demo/types'
import { getProjectBySlug } from '@/lib/sanity/content'

interface ProjectRouteProps {
  params: Promise<{ slug: string }>
}

/** Maps a project category to the prototype image used in its page hero. */
const HERO_IMAGE: Record<ProjectCategory, 'community' | 'river' | 'boats' | 'people' | 'elder' | 'hero'> = {
  Infrastructure: 'community',
  Education: 'hero',
  Healthcare: 'people',
  'Cultural preservation': 'elder',
  'Youth empowerment': 'boats',
  'Water and sanitation': 'river',
}

export function generateStaticParams(): { slug: string }[] {
  return DEMO_DATA.projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectRouteProps): Promise<Metadata> {
  const { slug } = await params
  const project = findProject(slug)

  if (!project) {
    return { title: 'Project not found', robots: { index: false, follow: false } }
  }

  return buildMetadata({
    title: project.name,
    description: project.summary,
    path: `/projects/${project.slug}`,
    type: 'article',
    section: project.category,
    keywords: [project.category, project.location, 'BTA project'].filter(Boolean),
  })
}

export default async function ProjectPage({ params }: ProjectRouteProps) {
  const { slug } = await params
  const project = findProject(slug)
  const cmsResult = await getProjectBySlug(slug)
  const cmsProject = cmsResult.ok ? cmsResult.value : null

  if (!project) {
    notFound()
  }

  const budgetLines = DEMO_DATA.budgetLines.filter((line) => line.projectId === project.id)

  // The story is editorial content and comes from the CMS; the figures stay in
  // the demonstration layer, where the admin area can move a project between
  // stages and the site has to show it.
  const title = cmsProject?.title ?? project.name
  const summary = cmsProject?.summary ?? project.summary
  const category = cmsProject?.category ?? project.category
  const location = cmsProject?.location ?? project.location
  const beneficiaries = cmsProject?.beneficiaries ?? project.beneficiaries
  const benefits = cmsProject?.communityBenefits ?? project.communityBenefits
  const milestones = cmsProject?.milestones ?? project.milestones

  return (
    <>
      <PageHero
        eyebrow={`Project · ${category}`}
        title={title}
        intro={summary}
        prototypeKey={HERO_IMAGE[project.category]}
      />

      <DemonstrationNote />

      <Section>
        <div className="detail">
          <div className="shell">
            <article>
              <DemoNotice>
                Budget, expenditure and progress figures on this page are illustrative samples.
                They are not audited records and the before/after images are prototype
                illustrations.
              </DemoNotice>

              <h2>About this project</h2>
              {cmsProject?.description ? (
                <RichText value={cmsProject.description} />
              ) : (
                <p>{project.description}</p>
              )}

              <h3>Expected community benefits</h3>
              <ul>
                {benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>

              <h3>Milestones</h3>
              <ul className="timeline">
                {milestones.map((milestone) => (
                  <li key={milestone.label}>
                    <b>{milestone.label}</b>
                    <small>{milestone.done ? 'Completed' : 'Not yet started'}</small>
                  </li>
                ))}
              </ul>

              {project.updates.length > 0 ? (
                <>
                  <h3>Progress updates</h3>
                  <ul className="timeline">
                    {project.updates.map((update) => (
                      <li key={update.id}>
                        <small>{update.date}</small>
                        <b>{update.title}</b>
                        <p>{update.body}</p>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>No progress updates have been published for this project yet.</p>
              )}

              {project.beforeAfter ? <BeforeAfter {...project.beforeAfter} /> : null}

              <h3>Budget and expenditure</h3>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Line item</th>
                      <th scope="col" className="num">
                        Budget
                      </th>
                      <th scope="col" className="num">
                        Spent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetLines.map((line) => (
                      <tr key={line.id}>
                        <td>{line.item}</td>
                        <td className="num">{formatNaira(line.budgetNgn)}</td>
                        <td className="num">{formatNaira(line.spentNgn)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>
                        <strong>Total</strong>
                      </td>
                      <td className="num">
                        <strong>{formatNaira(project.estimatedCostNgn)}</strong>
                      </td>
                      <td className="num">
                        <strong>
                          {formatNaira(budgetLines.reduce((sum, line) => sum + line.spentNgn, 0))}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>Supporting documents</h3>
              <ul>
                {project.documents.map((document) => (
                  <li key={document.reference}>
                    {document.name} ({document.kind}) — reference {document.reference}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 34 }}>
                <Link
                  href="/projects"
                  className="text-sm font-semibold text-[var(--mid)] underline underline-offset-4 hover:text-[var(--navy)]"
                >
                  ← All projects
                </Link>
              </div>
            </article>

            <aside>
              <span className="eyebrow">At a glance</span>

              <h3>Stage</h3>
              <p>
                <StageBadge stage={project.stage} />
              </p>

              <h3>Location</h3>
              <p>{location}</p>

              <h3>Funding target</h3>
              <p>{formatNaira(project.fundingTargetNgn)}</p>

              <Tracker raised={project.raisedNgn} target={project.fundingTargetNgn} formatValue={formatNaira} leftLabel="Raised" />

              <h3>Beneficiaries</h3>
              <p>{beneficiaries}</p>

              <div>
                <ButtonLink href="/donate" variant="gold">
                  Contribute
                </ButtonLink>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      <Section className="model">
        <SectionHeading
          eyebrow="Location"
          title="Where the work is happening"
          description="Developer's sketch of the project location. It is illustrative and not a survey."
        />

        <MapBoard x={project.mapX} y={project.mapY} note={project.locationNote} highlight />
      </Section>

      <Section>
        <SectionHeading eyebrow="Keep exploring" title="Other projects" />
        <div className="row-list">
          {DEMO_DATA.projects
            .filter((item) => item.id !== project.id)
            .slice(0, 3)
            .map((item) => (
              <Link key={item.id} href={`/projects/${item.slug}`}>
                <div>
                  <StageBadge stage={item.stage} />
                </div>
                <div>
                  <small>{item.category}</small>
                  <h3>{item.name}</h3>
                  <p>{item.summary}</p>
                </div>
                <div>
                  <ArrowRightIcon />
                </div>
              </Link>
            ))}
        </div>
      </Section>
    </>
  )
}
