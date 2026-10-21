import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { KnowledgeDirectory } from '@/components/demo/directories'
import { KnowledgeContributionForm } from '@/components/demo/public-forms'
import { DemoNotice } from '@/components/demo/ui'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ArrowRightIcon } from '@/components/ui/icons'
import { Section, SectionHeading } from '@/components/ui/section'
import { getLibraryPage } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Knowledge Hub',
    description: 'Articles, research, webinars and resources shared by community professionals, academics, entrepreneurs and leaders, plus the   knowledge library.',
    path: "/library",
  }),
}

/**
 * The knowledge hub.
 *
 * It keeps the original CMS-driven resource library (curated by editors in
 * Sanity) and adds the committee's knowledge-sharing section on top: a
 * filterable directory of member contributions with detail pages and a
 * submission form. Extending the existing library rather than creating a second
 * "knowledge" route keeps one coherent section.
 */
export default async function LibraryPage() {
  const result = await getLibraryPage()
  const page = result.ok ? result.value : null
  const resources = page?.resources ?? []

  return (
    <>
      <PageHero
        eyebrow={page?.pageHero?.eyebrow ?? 'Knowledge hub'}
        title={page?.pageHero?.title ?? 'Knowledge, kept in motion.'}
        intro={
          page?.pageHero?.intro ??
          'Articles, research, webinars and resources contributed by members — and the  ’s curated library of session materials and reports.'
        }
        image={page?.pageHero?.image ?? null}
      />

      {page?.note ? <DemonstrationNote /> : null}

      <Section>
        <SectionHeading
          eyebrow="Contributed knowledge"
          title="Shared by the community"
          description="Filter by type or search by title, author or topic. Each contribution opens its own page."
        />

        <DemoNotice>
          Contributions here are fictional demonstrations submitted through the form below, not
          verified research.
        </DemoNotice>

        <KnowledgeDirectory />
      </Section>

      <Section className="form-page">
        <div>
          <span className="eyebrow">Contribute</span>
          <h2>Share your knowledge</h2>
          <p>
            Members, academics, entrepreneurs and professionals can offer an article, research
            summary, webinar or resource. Submissions enter the review queue rather than publishing
            straight away.
          </p>
        </div>

        <KnowledgeContributionForm />
      </Section>

      <Section className="model">
        <SectionHeading
          eyebrow="  library"
          title={page?.pageHero?.eyebrow ?? 'Curated resources'}
          description="Session recordings, presentations, reports and research curated by the  ."
        />

        {resources.length > 0 ? (
          <div className="library">
            {resources.map((resource, index) => (
              <a
                key={resource._key ?? index}
                href={resource.link}
                className={resource.featured ? 'featured' : undefined}
              >
                {resource.type ? <span>{resource.type}</span> : null}
                <h2>{resource.title}</h2>
                {resource.description ? <p>{resource.description}</p> : null}
                <ArrowRightIcon size={16} />
              </a>
            ))}
          </div>
        ) : (
          <p>Library resources appear here as soon as they are added in Sanity Studio.</p>
        )}
      </Section>
    </>
  )
}
