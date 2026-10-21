import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ForumDiscussion } from '@/components/demo/forum'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { RichText } from '@/components/portable-text'
import { articleSchema, breadcrumbSchema, StructuredData } from '@/components/structured-data'
import { ButtonLink } from '@/components/ui/button-link'
import { Section } from '@/components/ui/section'
import { prototypeImage, type PrototypeImageKey } from '@/content/prototype-images'
import { DEMO_DATA } from '@/lib/demo/data'
import { buildMetadata } from '@/lib/metadata'
import { getForumThreadBySlug, getForumThreads } from '@/lib/sanity/content'

export const revalidate = 120

interface PageProps {
  params: Promise<{ slug: string }>
}

/**
 * Prerenders the published threads, plus the demonstration articles, so an
 * article is a static page rather than a request-time render.
 */
export async function generateStaticParams() {
  const result = await getForumThreads()
  const slugs = result.ok ? (result.value ?? []).map((thread) => thread.slug) : []

  for (const thread of DEMO_DATA.forumThreads) {
    if (!slugs.includes(thread.slug)) {
      slugs.push(thread.slug)
    }
  }

  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const thread = await getForumThreadBySlug(slug)
  const mock = DEMO_DATA.forumThreads.find((item) => item.slug === slug)

  const title = thread.ok && thread.value ? thread.value.title : (mock?.title ?? 'Forum thread')
  const description =
    thread.ok && thread.value
      ? thread.value.excerpt
      : (mock?.excerpt ?? 'A discussion on the BTA Knowledge & Ideas Forum.')

  const author = thread.ok && thread.value ? thread.value.author : mock?.author
  const published = thread.ok && thread.value ? thread.value.publishedAt : mock?.date
  const category = thread.ok && thread.value ? thread.value.category : mock?.category

  return buildMetadata({
    title,
    description,
    path: `/knowledge/forum/${slug}`,
    type: 'article',
    publishedTime: published,
    authors: author ? [author] : undefined,
    section: category,
    keywords: [category, 'BTA forum', 'members’ discussion'].filter(Boolean) as string[],
  })
}

/**
 * A forum article with its discussion.
 *
 * The article is read from the CMS; the demonstration dataset holds a mirror of
 * it, used when the Content Lake cannot be reached, so a published article is
 * never a dead link.
 */
export default async function ForumThreadPage({ params }: PageProps) {
  const { slug } = await params
  const result = await getForumThreadBySlug(slug)
  const thread = result.ok ? result.value : null
  const mock = DEMO_DATA.forumThreads.find((item) => item.slug === slug) ?? null

  if (!thread && !mock) {
    notFound()
  }

  const title = thread?.title ?? mock?.title ?? ''
  const excerpt = thread?.excerpt ?? mock?.excerpt ?? ''
  const author = thread?.author ?? mock?.author ?? ''
  const authorRole = thread?.authorRole ?? mock?.authorRole ?? ''
  const category = thread?.category ?? mock?.category ?? ''

  return (
    <>
      <StructuredData
        data={{
          ...articleSchema({
            headline: title,
            description: excerpt,
            path: `/knowledge/forum/${slug}`,
            publishedAt: thread?.publishedAt ?? mock?.date,
            author,
            section: category,
          }),
          ...breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Knowledge', path: '/knowledge' },
            { name: 'Forum', path: '/knowledge/forum' },
            { name: title, path: `/knowledge/forum/${slug}` },
          ]),
        }}
      />

      <PageHero
        eyebrow={category}
        title={title}
        intro={excerpt}
        image={thread?.image ?? null}
        fallbackUrl={prototypeImage((mock?.image ?? 'people') as PrototypeImageKey)}
      />

      <DemonstrationNote />

      <Section className="detail">
        <article>
          <p className="forum-byline" style={{ marginBottom: 26 }}>
            <b>{author}</b>
            {authorRole ? <span>{authorRole}</span> : null}
            <span>{category}</span>
          </p>

          {thread?.body ? (
            <RichText value={thread.body} />
          ) : (
            <div className="rich-text">
              {(mock?.body ?? []).map((block, index) => {
                if (block.kind === 'heading') {
                  return <h3 key={index}>{block.text}</h3>
                }
                if (block.kind === 'quote') {
                  return <blockquote key={index}>{block.text}</blockquote>
                }
                if (block.kind === 'list') {
                  return (
                    <ul key={index}>
                      {(block.items ?? []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )
                }
                return <p key={index}>{block.text}</p>
              })}
            </div>
          )}
        </article>

        <aside>
          <span className="eyebrow">About the author</span>
          <h3>{author}</h3>
          {authorRole ? <p>{authorRole}</p> : null}
          <p>
            Members write and discuss the articles in this forum. Sign in to add a comment or a
            reply.
          </p>
          <ButtonLink href="/portal/login" variant="primary">
            Sign in to comment
          </ButtonLink>
        </aside>
      </Section>

      <Section>
        <ForumDiscussion threadSlug={slug} />
      </Section>
    </>
  )
}
