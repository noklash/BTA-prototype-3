import type { Metadata } from 'next'

import { ForumIndex, type ForumListItem } from '@/components/demo/forum'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { RichText } from '@/components/portable-text'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'
import { prototypeImage, type PrototypeImageKey } from '@/content/prototype-images'
import { buildContentImage } from '@/lib/sanity/image'
import { DEMO_DATA } from '@/lib/demo/data'
import type { ForumThreadRecord } from '@/lib/demo/types'
import { getDetailPageByTypeAndSlug, getForumThreads } from '@/lib/sanity/content'
import type { ForumThread } from '@/types/content'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Knowledge & Ideas Forum',
  description:
    'The BTA Knowledge & Ideas Forum: articles shared by members, with comments and replies that keep the conversation going.',
  alternates: { canonical: '/knowledge/forum' },
}

/** The copy used when the CMS copy for the forum cannot be read. */
const FALLBACK_INTRO = {
  eyebrow: 'Knowledge & Ideas Forum',
  title: 'Bring an idea. Share knowledge.',
  intro:
    'A place where members publish what they know, and where the conversation continues in comments and replies.',
  lead: 'The forum is where practical knowledge is shared in writing. A member publishes an article, other members read it, and the discussion continues underneath in comments and replies.',
}

/**
 * The forum index.
 *
 * The articles are editorial content, so they are read from the CMS. The
 * demonstration dataset holds a mirror of the same articles, and is used when
 * the Content Lake cannot be reached, so the forum is never an empty page.
 */
export default async function ForumIndexPage() {
  const [introResult, threadsResult] = await Promise.all([
    getDetailPageByTypeAndSlug('forum', 'knowledge-forum'),
    getForumThreads(),
  ])

  const intro = introResult.ok ? introResult.value : null
  const cmsThreads = threadsResult.ok ? (threadsResult.value ?? []) : []

  const items: ForumListItem[] =
    cmsThreads.length > 0
      ? cmsThreads.map((thread) => toListItem(thread))
      : DEMO_DATA.forumThreads.map((thread) => toMockListItem(thread))

  const usingMock = cmsThreads.length === 0

  return (
    <>
      <PageHero
        eyebrow={intro?.pageHero?.eyebrow ?? FALLBACK_INTRO.eyebrow}
        title={intro?.pageHero?.title ?? FALLBACK_INTRO.title}
        intro={intro?.pageHero?.intro ?? FALLBACK_INTRO.intro}
        image={intro?.pageHero?.image ?? null}
        prototypeKey="people"
      />

      <DemonstrationNote />

      <Section>
        <SectionHeading
          eyebrow="The forum"
          title="Articles shared by members"
          description="Read an article, then join the conversation. Members can comment, and reply to a comment to keep a thread alive."
        />

        {intro?.about?.body ? <RichText value={intro.about.body} /> : null}

        {usingMock ? (
          <p className="form-hint" style={{ marginTop: 16 }}>
            These articles are shown from the demonstration dataset because the content management
            system could not be reached. The published versions carry the same content.
          </p>
        ) : null}

        <ForumIndex items={items} />
      </Section>

      <Section className="model">
        <SectionHeading
          eyebrow="Take part"
          title="Share what you know."
          description="Members write the articles. If you have something practical to share, the committee will help you publish it."
        />

        <div className="button-row" style={{ marginTop: 24 }}>
          <ButtonLink href="/membership" variant="primary">
            Join BTA
          </ButtonLink>
          <ButtonLink href="/library" variant="outline">
            Knowledge library
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}

/** Maps a CMS thread to the shape the index renders. */
function toListItem(thread: ForumThread): ForumListItem {
  const image = buildContentImage(thread.image, { widths: [640, 1024], fallbackAlt: thread.title })
  const mock = DEMO_DATA.forumThreads.find((item) => item.slug === thread.slug)

  return {
    slug: thread.slug,
    title: thread.title,
    excerpt: thread.excerpt,
    author: thread.author,
    authorRole: thread.authorRole ?? '',
    category: thread.category,
    date: thread.publishedAt,
    imageUrl:
      image?.src ??
      prototypeImage((mock?.image ?? 'people') as PrototypeImageKey) ??
      prototypeImage('people'),
  }
}

/** Maps a demonstration article to the shape the index renders. */
function toMockListItem(thread: ForumThreadRecord): ForumListItem {
  return {
    slug: thread.slug,
    title: thread.title,
    excerpt: thread.excerpt,
    author: thread.author,
    authorRole: thread.authorRole,
    category: thread.category,
    date: thread.date,
    imageUrl: prototypeImage(thread.image as PrototypeImageKey),
  }
}
