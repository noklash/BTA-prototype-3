import { DemonstrationNote } from './demonstration-note'
import { PageHero } from './page-hero'
import { ButtonLink } from './ui/button-link'
import { Section } from './ui/section'
import { ContentErrorState, StateMessage } from './ui/state-message'
import type { ContentResult } from '@/lib/sanity/fetch'
import type { EditorialPage } from '@/types/content'
import type { PrototypeImageKey } from '@/content/prototype-images'

/**
 * Renders an editorial page from CMS content: page hero, demonstration note,
 * numbered articles and a closing CTA. Used by /our-people, /knowledge,
 * /enterprise, /community-impact, /blue-economy, /heritage and /partner.
 */
export function EditorialPage({
  page,
  prototypeKey,
}: {
  page: EditorialPage | null
  prototypeKey?: PrototypeImageKey
}) {
  if (!page) {
    return null
  }

  const articles = page.articles ?? []

  return (
    <>
      <PageHero
        eyebrow={page.pageHero?.eyebrow ?? ''}
        title={page.pageHero?.title ?? ''}
        intro={page.pageHero?.intro ?? undefined}
        image={page.pageHero?.image ?? null}
        prototypeKey={prototypeKey}
      />

      <DemonstrationNote />

      {articles.length > 0 ? (
        <Section className="editorial">
          {articles.map((article, index) => (
            <article key={article._key ?? index}>
              <b>{article.number}</b>
              <div>
                <h2>{article.title}</h2>
                {article.body ? <p>{article.body}</p> : null}
              </div>
            </article>
          ))}
        </Section>
      ) : null}

      {page.cta ? (
        <Section className="partner-home">
          <div className="shell">
            <div>
              <span className="eyebrow">Take part</span>
              <h2>{page.cta.heading}</h2>
            </div>
            {page.cta.body ? <p>{page.cta.body}</p> : null}
            <div>
              <ButtonLink
                href={page.cta.buttonHref ?? '/membership'}
                variant="outline"
              >
                {page.cta.buttonLabel ?? 'Participate in BTA'}
              </ButtonLink>
            </div>
          </div>
        </Section>
      ) : null}
    </>
  )
}

/**
 * Renders an editorial page route, distinguishing "not published yet" from
 * "the CMS could not be reached" instead of silently returning nothing.
 */
export function EditorialPageRoute({
  result,
  label,
  prototypeKey,
}: {
  result: ContentResult<EditorialPage | null>
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

  return <EditorialPage page={result.value} prototypeKey={prototypeKey} />
}