import Link from 'next/link'

import { prototypePortrait, type PrototypePortraitKey } from '@/content/prototype-images'
import { DEMO_DATA } from '@/lib/demo/data'
import type { DemoDataset, Leader } from '@/lib/demo/types'

import { ButtonLink } from '../ui/button-link'
import { Section, SectionHeading } from '../ui/section'

/**
 * A leader, with the member's details resolved from the shared dataset.
 */
export interface LeadershipEntry extends Leader {
  name: string
  location: string
  profession: string
  portraitUrl: string | null
}

/**
 * Resolves the committee list against the member records.
 *
 * The leadership page and the members' directory read the same records, so a
 * name, town or profession can never differ between the two. A leader without
 * a matching member record is skipped rather than shown with blank details.
 */
export function leadershipEntries(data: DemoDataset = DEMO_DATA): LeadershipEntry[] {
  return data.leaders.flatMap((leader) => {
    const member = data.members.find((candidate) => candidate.id === leader.memberId)

    if (!member) {
      return []
    }

    return [
      {
        ...leader,
        name: member.name,
        location: member.location,
        profession: member.profession,
        portraitUrl: prototypePortrait(leader.portrait as PrototypePortraitKey),
      },
    ]
  })
}

/**
 * The leadership grid.
 *
 * A server-rendered figure per committee member: portrait, office, name, remit
 * and the member's town and profession. The photographs are placeholders for
 * fictional people and are labelled as such on the page.
 */
export function LeadershipGrid({ entries }: { entries: readonly LeadershipEntry[] }) {
  return (
    <ul className="leadership-grid">
      {entries.map((entry) => (
        <li key={entry.id} className="leader-card">
          {entry.portraitUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- a plain image keeps the placeholder service out of the image optimiser
            <img
              src={entry.portraitUrl}
              alt={`Illustrative portrait of ${entry.name}`}
              width={480}
              height={600}
              loading="lazy"
              decoding="async"
            />
          ) : null}

          <div className="leader-card-body">
            <span className="leader-role">{entry.role}</span>

            <h3>{entry.name}</h3>

            <p className="leader-remit">{entry.remit}</p>

            <p className="leader-meta">
              {entry.location}
              {entry.profession ? ` · ${entry.profession}` : ''}
              {` · In role since ${entry.since}`}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}

/**
 * A short leadership preview for the "Our People" page: the first four
 * committee members, each linking to the full directory.
 */
export function LeadershipTeaser() {
  const entries = leadershipEntries()

  return (
    <Section className="model">
      <SectionHeading
        eyebrow="Our People"
        title="Meet the committee."
        description="Volunteers elected each October run the club's work. Their offices, remits and towns are published in full."
      />

      <ul className="leadership-teaser">
        {entries.slice(0, 4).map((entry) => (
          <li key={entry.id}>
            <Link href="/our-people/leadership" className="teaser-person">
              {entry.portraitUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- a plain image keeps the placeholder service out of the image optimiser
                <img
                  src={entry.portraitUrl}
                  alt={`Illustrative portrait of ${entry.name}`}
                  width={320}
                  height={400}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}

              <span>{entry.name}</span>
              <small>{entry.role}</small>
            </Link>
          </li>
        ))}
      </ul>

      <div className="button-row">
        <ButtonLink href="/our-people/leadership" variant="outline">
          View the full committee
        </ButtonLink>
      </div>
    </Section>
  )
}
