import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Badge, DemoNotice } from '@/components/demo/ui'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'
import { DEMO_DATA, findBusiness } from '@/lib/demo/data'

interface BusinessRouteProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams(): { slug: string }[] {
  return DEMO_DATA.businesses
    .filter((business) => business.status === 'Published')
    .map((business) => ({ slug: business.slug }))
}

export async function generateMetadata({ params }: BusinessRouteProps): Promise<Metadata> {
  const { slug } = await params
  const business = findBusiness(slug)

  if (!business || business.status !== 'Published') {
    return { title: 'Listing not found', robots: { index: false, follow: false } }
  }

  return {
    title: business.name,
    description: business.description,
    alternates: { canonical: `/enterprise/business-hub/${business.slug}` },
  }
}

export default async function BusinessPage({ params }: BusinessRouteProps) {
  const { slug } = await params
  const business = findBusiness(slug)

  if (!business || business.status !== 'Published') {
    notFound()
  }

  const related = DEMO_DATA.businesses
    .filter((item) => item.id !== business.id && item.category === business.category && item.status === 'Published')
    .slice(0, 3)

  return (
    <>
      <PageHero
        eyebrow={`${business.category} · Business Hub`}
        title={business.name}
        intro={business.description}
        prototypeKey="community"
      />

      <DemonstrationNote />

      <Section>
        <div className="detail">
          <div className="shell">
            <article>
              <DemoNotice>
                This listing is illustrative. It is not a verified business and its presence here is
                not an endorsement, guarantee or investment offer.
              </DemoNotice>

              <h2>About this listing</h2>
              <p>{business.description}</p>

              <h3>Services</h3>
              <ul>
                {business.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>

              <div style={{ marginTop: 34 }}>
                <Link
                  href="/enterprise/business-hub"
                  className="text-sm font-semibold text-[var(--mid)] underline underline-offset-4 hover:text-[var(--navy)]"
                >
                  ← Back to the directory
                </Link>
              </div>
            </article>

            <aside>
              <span className="eyebrow">At a glance</span>

              <h3>Category</h3>
              <p>{business.category}</p>

              <h3>Owner</h3>
              <p>{business.owner}</p>

              <h3>Location</h3>
              <p>{business.location}</p>

              {business.diasporaOwned ? (
                <>
                  <h3>Diaspora</h3>
                  <p>
                    <Badge>Diaspora-owned</Badge>
                  </p>
                </>
              ) : null}

              <h3>Contact</h3>
              <p>
                <a href={`mailto:${business.contactEmail}`}>{business.contactEmail}</a>
                {business.website ? (
                  <>
                    <br />
                    <a href={business.website} rel="nofollow noopener noreferrer" target="_blank">
                      Website
                    </a>
                  </>
                ) : null}
              </p>

              <div>
                <ButtonLink href="/enterprise/business-hub" variant="outline">
                  More listings
                </ButtonLink>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section className="model">
          <SectionHeading eyebrow="Related" title={`More in ${business.category}`} />

          <div className="panel-grid cols-3">
            {related.map((item) => (
              <div key={item.id}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p style={{ marginTop: 12 }}>
                  <Link
                    href={`/enterprise/business-hub/${item.slug}`}
                    className="text-sm font-semibold text-[var(--mid)] underline underline-offset-4 hover:text-[var(--navy)]"
                  >
                    View listing
                  </Link>
                </p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  )
}
