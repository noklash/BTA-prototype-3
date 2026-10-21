import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { DemonstrationNote } from '@/components/demonstration-note'
import { MembershipForm } from '@/components/membership-form'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section } from '@/components/ui/section'
import { getMembershipPage, getSiteSettings } from '@/lib/sanity/content'
import { valueOrNull } from '@/lib/sanity/fetch'

export const revalidate = 120

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Membership',
    description: 'Who can join Bainbo Taria Awo  , what membership includes, how the process works and how to express your interest.',
    path: "/membership",
  }),
}

const MEMBERSHIP_SECTIONS = [
  {
    id: 'who-can-join',
    number: '01',
    heading: 'Who can join',
    paragraphs: [
      'Bainbo Taria Awo   is open to people from the community and the wider district, whether you live here or in the diaspora. Adults, young people and organisations can all take part.',
    ],
    list: [
      'Full members — adults who take part in the life of the association',
      'Youth members — school leavers and students building skills and networks',
      'Associate members — friends of BTA who support the mission from elsewhere',
      'Institutional members — schools, businesses and community organisations',
    ],
  },
  {
    id: 'what-is-included',
    number: '02',
    heading: 'What membership includes',
    paragraphs: [
      'Membership connects you to the association’s decisions, projects and networks. Subscriptions fund the committee’s work and the community programmes it supports.',
    ],
    list: [
      'A members’ portal account with your profile, meetings and dues record',
      'Voting rights at the annual general meeting and access to published minutes',
      'Committee updates, project progress and transparency reports',
      'Access to the knowledge hub, youth opportunities and the business directory',
      'The chance to join the volunteer skills database and mentor young people',
    ],
  },
  {
    id: 'how-the-process-works',
    number: '03',
    heading: 'How the process works',
    paragraphs: [
      'There is no lengthy approval process. The membership secretary reads every inquiry and confirms your category and subscription.',
    ],
    steps: [
      'Send us a short message saying you would like to join, using the form below or the contact address.',
      'A committee member confirms the current subscription rates for your category.',
      'Pay your first subscription and the secretary records you in the member register.',
      'You receive access to the members’ portal and an invitation to the next meeting.',
    ],
  },
  {
    id: 'express-interest',
    number: '04',
    heading: 'Express your interest',
    paragraphs: [
      'Use the form on this page, or write to the secretary directly. A short message is all we need: there is nothing to prepare and no obligation.',
    ],
  },
]

export default async function MembershipPage() {
  const [pageResult, settingsResult] = await Promise.all([
    getMembershipPage(),
    getSiteSettings(),
  ])

  const page = pageResult.ok ? pageResult.value : null
  const settings = valueOrNull(settingsResult)
  const contactEmail = settings?.contactEmail ?? null

  return (
    <>
      <PageHero
        eyebrow={page?.pageHero?.eyebrow ?? 'Membership'}
        title={page?.pageHero?.title ?? 'Belong. Contribute. Build.'}
        intro={page?.pageHero?.intro ?? 'Join a community of people who care about heritage, knowledge and community development.'}
        image={page?.pageHero?.image ?? null}
      />

      {page?.note ? <DemonstrationNote /> : null}

      <Section className="editorial">
        {MEMBERSHIP_SECTIONS.map((section) => (
          <article key={section.id} id={section.id}>
            <b>{section.number}</b>
            <div>
              <h2>{section.heading}</h2>

              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}

              {section.list ? (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}

              {section.steps ? (
                <ol className="steps-grid">
                  {section.steps.map((step, index) => (
                    <li key={step}>
                      <small>{String(index + 1).padStart(2, '0')}</small>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              ) : null}

              {section.id === 'express-interest' && contactEmail ? (
                <p>
                  Email:{' '}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="font-semibold text-[var(--mid)] underline underline-offset-4 hover:text-[var(--navy)]"
                  >
                    {contactEmail}
                  </a>
                </p>
              ) : null}

              {section.id === 'express-interest' && !contactEmail ? (
                <p>
                  The contact address is published from Sanity Studio (Site settings) and is
                  currently unavailable.
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </Section>

      <Section>
        <div className="application">
          <div>
            <span className="eyebrow">Membership inquiry</span>
            <h2>Express your interest</h2>
            <p>
              Name, email and a short message are enough. We will never publish your details. This
              form is a demonstration: nothing is stored or emailed anywhere.
            </p>
          </div>

          <MembershipForm />
        </div>
      </Section>

      <Section className="partner-home">
        <div>
          <span className="eyebrow">See what’s coming up</span>
          <h2>Our diary</h2>
        </div>

        <p>
          Find an event to attend, or come back later — the diary grows as soon as gatherings are
          confirmed.
        </p>

        <div>
          <ButtonLink href="/events" variant="primary">
            Browse events
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}