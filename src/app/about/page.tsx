import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { RichText } from '@/components/portable-text'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'
import { ContentErrorState, StateMessage } from '@/components/ui/state-message'
import { getAboutPage } from '@/lib/sanity/content'
import { PartnerBand } from '@/components/call-to-action'

export const revalidate = 120

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'About BTA',
    description: 'The background, history, mission and values of Bainbo Taria Awo  .',
    path: "/about",
  }),
}

export default async function AboutPage() {
  const result = await getAboutPage()

  if (!result.ok) {
    return (
      <Section>
        <ContentErrorState reason={result.reason} message={result.message} />
      </Section>
    )
  }

  const about = result.value

  if (!about) {
    return (
      <Section>
        <StateMessage
          title="The about page has not been written yet"
          description="Open Sanity Studio, create the “About page” document and publish it. Its title, introduction, history and values will appear here."
          action={<ButtonLink href="/studio">Open Sanity Studio</ButtonLink>}
        />
      </Section>
    )
  }

  const values = about.values ?? []

  return (
    <>
      <PageHero
        eyebrow="About BTA"
        title={about.title}
        intro={about.intro ?? undefined}
        image={about.featuredImage}
        prototypeKey="boats"
      />

      <DemonstrationNote />

      <Section className="editorial">
        <article>
          <b>01</b>
          <div>
            <h2>Our history</h2>
            {about.history && about.history.length > 0 ? (
              <RichText value={about.history} />
            ) : (
              <p>
                The history section has not been written yet. It is managed in Sanity Studio under
                “About page”.
              </p>
            )}
          </div>
        </article>

        <article>
          <b>02</b>
          <div>
            <h2>Our mission</h2>
            <p>
              {about.mission ??
                'The mission statement has not been written yet. It is managed in Sanity Studio under “About page”.'
              }
            </p>
          </div>
        </article>

        <article>
          <b>03</b>
          <div>
            <h2>Our committee</h2>
            {about.leadership ? (
              <p className="whitespace-pre-line">{about.leadership}</p>
            ) : (
              <p>
                The committee has not been listed yet. It is managed in Sanity Studio under “About
                page”.
              </p>
            )}
          </div>
        </article>
      </Section>

      {values.length > 0 ? (
        <Section>
          <SectionHeading eyebrow="What guides us" title="Our values" />

          <div className="vision-grid">
            {values.map((value, index) => (
              <div key={value._key ?? `${value.title}-${index}`}>
                <small>{String(index + 1).padStart(2, '0')}</small>
                <h3>{value.title}</h3>
                {value.description ? <p>{value.description}</p> : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <PartnerBand
        eyebrow="Take part"
        heading="Interested in joining?"
        body="Membership is open to anyone who wants to help look after the history of this district."
        primaryCta={{
          heading: 'Join BTA',
          body: null,
          buttonLabel: 'Join BTA',
          buttonHref: '/membership',
        }}
        secondaryCta={{
          heading: 'Support BTA',
          body: null,
          buttonLabel: 'Support BTA',
          buttonHref: '/support',
        }}
      />
    </>
  )
}