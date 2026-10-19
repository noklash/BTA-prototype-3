import Link from 'next/link'

import { DemonstrationNote } from './demonstration-note'
import { PageHero } from './page-hero'
import { RichText } from './portable-text'
import { ButtonLink } from './ui/button-link'
import { Section, SectionHeading } from './ui/section'
import { ContentErrorState, StateMessage } from './ui/state-message'
import type { ContentResult } from '@/lib/sanity/fetch'
import type { DetailPage } from '@/types/content'
import type { PrototypeImageKey } from '@/content/prototype-images'

/**
 * Renders a detail page from CMS content: page hero, demonstration note, about
 * section, what-to-expect list, at-a-glance badge and CTA. Used by
 * /knowledge/forum, /community-impact/school-rehabilitation,
 * /blue-economy/centre, /heritage/oral-history and /news/community-education.
 */
export function DetailPage({
  page,
  prototypeKey,
}: {
  page: DetailPage | null
  prototypeKey?: PrototypeImageKey
}) {
  if (!page) {
    return null
  }

  return (
    <>
      <PageHero
        eyebrow={page.pageHero?.eyebrow ?? page.type}
        title={page.pageHero?.title ?? ''}
        intro={page.pageHero?.intro ?? undefined}
        image={page.pageHero?.image ?? null}
        prototypeKey={prototypeKey}
      />

      <DemonstrationNote />

      <Section>
        <div className="detail">
          <div className="shell">
            <article>
              {page.about?.lead ? <p className="lead">{page.about.lead}</p> : null}
              {page.about?.body ? <RichText value={page.about.body} /> : null}

              {page.whatToExpect?.length ? (
                <>
                  <h3>What to expect</h3>
                  <ul>
                    {page.whatToExpect.map((item, index) => (
                      <li key={item._key ?? index}>{item.text}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              <div>
                <Link
                  href="/events"
                  className="text-sm font-semibold text-[var(--mid)] underline underline-offset-4 hover:text-[var(--navy)]"
                >
                  ← All events
                </Link>
              </div>
            </article>

            <aside>
              <span className="eyebrow">At a glance</span>

              {page.atAGlance ? (
                <>
                  <h3>{page.atAGlance.title}</h3>
                  <span className={`status ${page.atAGlance.status.toLowerCase().replace(' ', '-')}`}>
                    <i />
                    {page.atAGlance.status}
                  </span>
                </>
              ) : null}

              {page.cta ? (
                <div>
                  <ButtonLink
                    href={page.cta.buttonHref ?? '/membership'}
                    variant="gold"
                  >
                    {page.cta.buttonLabel ?? 'Express interest'}
                  </ButtonLink>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </Section>

      <SectionHeading eyebrow="Related" title="Learn more" />
    </>
  )
}

/**
 * Renders a detail page route, distinguishing "not published yet" from "the
 * CMS could not be reached" instead of silently returning nothing.
 */
export function DetailPageRoute({
  result,
  label,
  prototypeKey,
}: {
  result: ContentResult<DetailPage | null>
  label: string
  prototypeKey?: PrototypeImageKey
}) {
  if (!result.ok) {
    return (
      <Section>
        <ContentErrorState reason={result.reason} message={result.message} />
      </Section>
    )
  }

  if (!result.value) {
    return (
      <Section>
        <StateMessage
          title={`${label} has not been published yet`}
          description={`Its content is managed in Sanity Studio. Add or publish the ${label} page to see it here.`}
        />
      </Section>
    )
  }

  return <DetailPage page={result.value} prototypeKey={prototypeKey} />
}