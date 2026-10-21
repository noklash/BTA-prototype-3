import type { Metadata } from 'next'
import Link from 'next/link'

import { EventList } from '@/components/event-list'
import { PartnerBand } from '@/components/call-to-action'
import { SanityImage } from '@/components/sanity-image'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'
import { StructuredData } from '@/components/structured-data'
import { ContentErrorState, StateMessage } from '@/components/ui/state-message'
import { getEvents, getHomepage } from '@/lib/sanity/content'
import { partitionEvents } from '@/lib/events'
import type { Homepage } from '@/types/content'

import { ArrowRightIcon } from '@/components/ui/icons'

export const revalidate = 120

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const homepageResult = await getHomepage()
  const eventsResult = await getEvents()

  if (!homepageResult.ok) {
    return (
      <Section>
        <ContentErrorState reason={homepageResult.reason} message={homepageResult.message} />
      </Section>
    )
  }

  const homepage = homepageResult.value ?? emptyHomepage()

  const upcomingEvents = eventsResult.ok
    ? partitionEvents(eventsResult.value).upcoming.slice(0, 3)
    : []

  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Bainbo Taria Awo  ',
          alternateName: 'BTA',
          slogan: 'Our heritage. Our people. Our future.',
          url: '/',
          logo: '/icon.svg',
        }}
      />

      <Hero homepage={homepage} />

      <IntroBlock intro={homepage} />

      <StatsBlock stats={homepage} />

      <ModelBlock model={homepage} />

      <InitiativesBlock initiatives={homepage} />

      <ImpactBlock impact={homepage.impact} />

      <KnowledgeBlock knowledge={homepage.knowledge} />

      <HeritageBlock heritage={homepage.heritage} />

      <EventsBlock events={homepage.events} upcomingEvents={upcomingEvents} />

      <VisionBlock vision={homepage.vision} />

      <PartnerBlock partner={homepage.partner} />
    </>
  )
}

/**
 * The home page shape used when Sanity is not configured or the document is
 * missing. Only `heroHeading` is required to render the page structure; every
 * other block has an explicit "not written yet" state instead of placeholder
 * marketing copy.
 */
function emptyHomepage(): Homepage {
  return {
    _id: 'homepage-missing',
    // 1. Hero
    heroHeading: 'Bainbo Taria Awo  ',
    heroDescription: null,
    heroAside: null,
    heroImage: null,
    heroCtaPrimary: null,
    heroCtaSecondary: null,
    heroCtaTertiary: null,
    // 2. Intro
    introEyebrow: null,
    introHeading: null,
    introLead: null,
    introBody: null,
    introCta: null,
    // 3. Stats
    statsItems: null,
    statsCaption: null,
    // 4. Model
    modelEyebrow: null,
    modelHeading: null,
    modelIntro: null,
    modelPillars: null,
    // 5. Initiatives
    initiativesEyebrow: null,
    initiativesHeading: null,
    initiativesIntro: null,
    initiativesItems: null,
    // 6. Impact
    impact: null,
    // 7. Knowledge
    knowledge: null,
    // 8. Heritage
    heritage: null,
    // 9. Events
    events: null,
    // 10. Vision
    vision: null,
    // 11. Partner
    partner: null,
  }
}

// ---------------------------------------------------------------------------
// 1. Hero
// ---------------------------------------------------------------------------

function Hero({ homepage }: { homepage: Homepage }) {
  return (
    <section className="hero">
      <SanityImage
        image={homepage.heroImage}
        alt={homepage.heroHeading}
        sizes="100vw"
        widths={[768, 1280, 1920]}
        priority
        className="h-full w-full object-cover"
        prototypeKey="hero"
      />

      <div className="shade" />

      <div className="shell hero-copy">
        <span className="eyebrow">Bainbo Taria Awo  </span>

        <h1>
          <RichTextFragments value={homepage.heroHeading} />
        </h1>

        {homepage.heroDescription ? <p>{homepage.heroDescription}</p> : null}

        <div>
          <ButtonLink href="/membership" variant="gold">
            Join BTA
          </ButtonLink>
          <ButtonLink href="/community-impact" variant="outline">
            Explore our initiatives
          </ButtonLink>
          <ButtonLink href="/support" variant="text">
            Support BTA
          </ButtonLink>
        </div>
      </div>

      {homepage.heroAside ? (
        <aside>
          <b>01</b> {homepage.heroAside}
        </aside>
      ) : null}
    </section>
  )
}

/**
 * Renders the hero heading's simple markup: `<br/>` becomes a line break and
 * `<em>...</em>` becomes emphasis. The CMS stores the heading as a plain
 * string so editors don't need to know HTML.
 */
function RichTextFragments({ value }: { value: string }) {
  // Pre-parse the simple markup into a tree of nodes so the render pass
  // never reassigns variables (which React's immutability rule forbids).
  const rawParts = value.split(/(<br\s*\/?>|<em>|<\/em>)/).filter(Boolean)

  type Node = { type: 'text'; content: string; emph?: boolean } | { type: 'br' }
  const nodes: Node[] = []
  let emph = false

  for (const part of rawParts) {
    if (part === '<br/>' || part === '<br>') {
      nodes.push({ type: 'br' })
    } else if (part === '<em>') {
      emph = true
    } else if (part === '</em>') {
      emph = false
    } else {
      nodes.push({ type: 'text', content: part, emph })
    }
  }

  return (
    <>
      {nodes.map((node, index) => {
        if (node.type === 'br') {
          return <br key={index} />
        }
        return node.emph ? (
          <em key={index}>{node.content}</em>
        ) : (
          <span key={index}>{node.content}</span>
        )
      })}
    </>
  )
}

// ---------------------------------------------------------------------------
// 2. Intro
// ---------------------------------------------------------------------------

function IntroBlock({ intro }: { intro: Homepage }) {
  if (!intro.introHeading && !intro.introLead && !intro.introBody) {
    return null
  }

  return (
    <Section className="intro">
      <div>
        {intro.introEyebrow ? <span className="eyebrow">{intro.introEyebrow}</span> : null}
        <h2>
          <RichTextFragments value={intro.introHeading ?? 'A community built to last.'} />
        </h2>
      </div>

      <div>
        {intro.introLead ? <p className="lead">{intro.introLead}</p> : null}
        {intro.introBody ? <p>{intro.introBody}</p> : null}

        {intro.introCta ? (
          <ButtonLink
            href={intro.introCta.buttonHref ?? '/about'}
            variant="text"
          >
            {intro.introCta.buttonLabel ?? 'Read our story'}
          </ButtonLink>
        ) : null}
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// 3. Stats
// ---------------------------------------------------------------------------

function StatsBlock({ stats }: { stats: Homepage }) {
  if (!stats.statsItems || stats.statsItems.length === 0) {
    return null
  }

  return (
    <section className="stats">
      <div className="shell">
        {stats.statsItems.map((item, index) => (
          <div key={item._key ?? index}>
            <b>{item.value}</b>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {stats.statsCaption ? <small>{stats.statsCaption}</small> : null}
    </section>
  )
}

// ---------------------------------------------------------------------------
// 4. Model
// ---------------------------------------------------------------------------

function ModelBlock({ model }: { model: Homepage }) {
  if (!model.modelHeading && !model.modelPillars) {
    return null
  }

  return (
    <Section className="model">
      <SectionHeading
        eyebrow={model.modelEyebrow ?? undefined}
        title={model.modelHeading ?? 'The BTA model'}
        description={model.modelIntro ?? undefined}
      />

      <div className="model-grid">
        {(model.modelPillars ?? []).map((pillar, index) => (
          <div key={pillar._key ?? index}>
            <small>{String(index + 1).padStart(2, '0')}</small>
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// 5. Initiatives
// ---------------------------------------------------------------------------

function InitiativesBlock({ initiatives }: { initiatives: Homepage }) {
  if (!initiatives.initiativesItems || initiatives.initiativesItems.length === 0) {
    return null
  }

  return (
    <Section className="initiatives">
      <SectionHeading
        eyebrow={initiatives.initiativesEyebrow ?? undefined}
        title={initiatives.initiativesHeading ?? 'Featured initiatives'}
        description={initiatives.initiativesIntro ?? undefined}
      />

      <div className="initiative-list">
        {initiatives.initiativesItems.map((item, index) => (
          <Link key={item._key ?? index} href={item.link}>
            <b>{String(index + 1).padStart(2, '0')}</b>
            <div>
              <span className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>
                <i />
                {item.status}
              </span>
              <h3>{item.title}</h3>
              <p>{item.shortDescription}</p>
            </div>
            <ArrowRightIcon />
          </Link>
        ))}
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// 6. Impact
// ---------------------------------------------------------------------------

function ImpactBlock({ impact }: { impact: Homepage['impact'] }) {
  if (!impact) {
    return null
  }

  return (
    <section className="impact">
      <SanityImage image={impact.image} alt={impact.heading} prototypeKey="community" />

      <div>
        <SectionHeading
          light
          eyebrow={impact.eyebrow ?? 'Community impact'}
          title={impact.heading}
          description={impact.body ?? undefined}
        />

        {impact.metricValue && impact.metricLabel ? (
          <>
            <strong>{impact.metricValue}</strong>
            <span>{impact.metricLabel}</span>
          </>
        ) : null}

        {impact.cta ? (
          <ButtonLink
            href={impact.cta.buttonHref ?? '/community-impact'}
            variant="gold"
          >
            {impact.cta.buttonLabel ?? 'View community impact'}
          </ButtonLink>
        ) : null}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// 7. Knowledge
// ---------------------------------------------------------------------------

function KnowledgeBlock({ knowledge }: { knowledge: Homepage['knowledge'] }) {
  if (!knowledge) {
    return null
  }

  return (
    <section className="section knowledge-home">
      <div className="shell">
        <div>
          {knowledge.eyebrow ? <span className="eyebrow">{knowledge.eyebrow}</span> : null}
          <h2>{knowledge.heading}</h2>
          {knowledge.body ? <p>{knowledge.body}</p> : null}

          {(knowledge.topics ?? []).length > 0 ? (
            <div className="topics">
              {(knowledge.topics ?? []).map((topic, index) => (
                <span key={topic}>{topic}{index < (knowledge.topics ?? []).length - 1 ? ' ·' : null}</span>
              ))}
            </div>
          ) : null}

          {knowledge.cta ? (
            <ButtonLink
              href={knowledge.cta.buttonHref ?? '/knowledge'}
              variant="text"
            >
              {knowledge.cta.buttonLabel ?? 'Explore the forum'}
            </ButtonLink>
          ) : null}
        </div>

        {knowledge.featuredSession ? (
          <Link href={knowledge.featuredSession.link} className="featured-session">
            {knowledge.featuredSession.eyebrow ? (
              <span>{knowledge.featuredSession.eyebrow}</span>
            ) : null}
            <h3>{knowledge.featuredSession.title}</h3>
            {knowledge.featuredSession.description ? (
              <p>{knowledge.featuredSession.description}</p>
            ) : null}
            <ArrowRightIcon size={16} />
          </Link>
        ) : null}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// 8. Heritage
// ---------------------------------------------------------------------------

function HeritageBlock({ heritage }: { heritage: Homepage['heritage'] }) {
  if (!heritage) {
    return null
  }

  return (
    <section className="heritage-home">
      <SanityImage image={heritage.image} alt={heritage.heading} prototypeKey="elder" />

      <div>
        <SectionHeading
          light
          eyebrow={heritage.eyebrow ?? 'The Oral History Project'}
          title={heritage.heading}
          description={heritage.body ?? undefined}
        />

        {heritage.quote ? (
          <blockquote>
            {heritage.quote}
          </blockquote>
        ) : null}

        {heritage.cta ? (
          <ButtonLink
            href={heritage.cta.buttonHref ?? '/heritage/oral-history'}
            variant="gold"
          >
            {heritage.cta.buttonLabel ?? 'Explore heritage'}
          </ButtonLink>
        ) : null}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// 9. Events preview
// ---------------------------------------------------------------------------

function EventsBlock({
  events,
  upcomingEvents,
}: {
  events: Homepage['events']
  upcomingEvents: readonly import('@/types/content').EventSummary[]
}) {
  if (!events) {
    return null
  }

  return (
    <Section className="events-home">
      <SectionHeading
        eyebrow={events.eyebrow ?? undefined}
        title={events.heading ?? "What's happening at BTA"}
      />

      {upcomingEvents.length > 0 ? (
        <EventList events={upcomingEvents} />
      ) : (
        <StateMessage
          title="Nothing in the diary right now"
          description="Upcoming events appear here as soon as an editor publishes them in Sanity Studio."
        />
      )}

      {events.cta ? (
        <ButtonLink
          href={events.cta.buttonHref ?? '/events'}
          variant="text"
        >
          {events.cta.buttonLabel ?? 'View events calendar'}
        </ButtonLink>
      ) : null}
    </Section>
  )
}

// ---------------------------------------------------------------------------
// 10. Vision
// ---------------------------------------------------------------------------

function VisionBlock({ vision }: { vision: Homepage['vision'] }) {
  if (!vision) {
    return null
  }

  return (
    <section className="vision-home">
      <div className="shell">
        {vision.eyebrow ? <span className="eyebrow">{vision.eyebrow}</span> : null}
        <h2>
          <RichTextFragments value={vision.heading} />
        </h2>
        {vision.body ? <p>{vision.body}</p> : null}

        {vision.cta ? (
          <ButtonLink
            href={vision.cta.buttonHref ?? '/about/bta-2035'}
            variant="gold"
          >
            {vision.cta.buttonLabel ?? 'Explore the vision'}
          </ButtonLink>
        ) : null}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// 11. Partner
// ---------------------------------------------------------------------------

function PartnerBlock({ partner }: { partner: Homepage['partner'] }) {
  if (!partner || !partner.primaryCta || !partner.secondaryCta) {
    return null
  }

  return (
    <PartnerBand
      eyebrow={partner.eyebrow ?? 'Partner with BTA'}
      heading={partner.heading}
      body={partner.body ?? ''}
      primaryCta={partner.primaryCta}
      secondaryCta={partner.secondaryCta}
    />
  )
}