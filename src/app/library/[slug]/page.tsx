import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Badge, DemoNotice } from '@/components/demo/ui'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'
import { DEMO_DATA, findKnowledgeResource } from '@/lib/demo/data'
import { formatDemoDate } from '@/lib/demo/format'

interface KnowledgeRouteProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams(): { slug: string }[] {
  return DEMO_DATA.knowledge.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: KnowledgeRouteProps): Promise<Metadata> {
  const { slug } = await params
  const item = findKnowledgeResource(slug)

  if (!item) {
    return { title: 'Contribution not found', robots: { index: false, follow: false } }
  }

  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `/library/${item.slug}` },
  }
}

export default async function KnowledgeResourcePage({ params }: KnowledgeRouteProps) {
  const { slug } = await params
  const item = findKnowledgeResource(slug)

  if (!item || item.status !== 'Published') {
    notFound()
  }

  return (
    <>
      <PageHero
        eyebrow={`${item.kind} · Knowledge hub`}
        title={item.title}
        intro={item.summary}
        prototypeKey="people"
      />

      <DemonstrationNote />

      <Section>
        <div className="detail">
          <div className="shell">
            <article>
              <DemoNotice>
                A fictional contribution written for the prototype. It is illustrative and should not
                be relied upon as research or advice.
              </DemoNotice>

              {item.body.map((paragraph) => (
                <p key={paragraph} className="lead">
                  {paragraph}
                </p>
              ))}

              <div style={{ marginTop: 34 }}>
                <Link
                  href="/library"
                  className="text-sm font-semibold text-[var(--mid)] underline underline-offset-4 hover:text-[var(--navy)]"
                >
                  ← Back to the knowledge hub
                </Link>
              </div>
            </article>

            <aside>
              <span className="eyebrow">At a glance</span>

              <h3>Author</h3>
              <p>
                {item.author}
                <br />
                {item.authorRole}
              </p>

              <h3>Published</h3>
              <p>{formatDemoDate(item.date)}</p>

              <h3>Topics</h3>
              <p>
                {item.topics.map((topic) => (
                  <Badge key={topic} className="mr-1">
                    {topic}
                  </Badge>
                ))}
              </p>

              <div>
                <ButtonLink href="/library" variant="outline">
                  More contributions
                </ButtonLink>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      <Section className="model">
        <SectionHeading eyebrow="Related" title="More from the hub" />

        <div className="panel-grid cols-3">
          {DEMO_DATA.knowledge
            .filter((entry) => entry.id !== item.id && entry.status === 'Published')
            .slice(0, 3)
            .map((entry) => (
              <div key={entry.id}>
                <Badge>{entry.kind}</Badge>
                <h3 style={{ marginTop: 12 }}>{entry.title}</h3>
                <p>{entry.summary}</p>
                <p style={{ marginTop: 12 }}>
                  <Link
                    href={`/library/${entry.slug}`}
                    className="text-sm font-semibold text-[var(--mid)] underline underline-offset-4 hover:text-[var(--navy)]"
                  >
                    Read more
                  </Link>
                </p>
              </div>
            ))}
        </div>
      </Section>
    </>
  )
}
