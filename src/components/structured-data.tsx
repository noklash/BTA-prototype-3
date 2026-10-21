/**
 * Structured data (JSON-LD).
 *
 * Search engines and social platforms read this to understand what a page is:
 * an article, an event, an organisation. The payload is built by the page that
 * owns the content, and rendered once, in the document head area of the body.
 */
export function StructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own content, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/**
 * The breadcrumb trail for a page, so search engines can show the hierarchy.
 */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path,
    })),
  }
}

/**
 * An article: what it is, who wrote it and when it was published.
 */
export function articleSchema({
  headline,
  description,
  path,
  image,
  publishedAt,
  modifiedAt,
  author,
  section,
  wordCount,
}: {
  headline: string
  description: string
  path: string
  image?: string | null
  publishedAt?: string | null
  modifiedAt?: string | null
  author?: string | null
  section?: string | null
  wordCount?: number | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    ...(image ? { image } : {}),
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    ...(modifiedAt ? { dateModified: modifiedAt } : {}),
    ...(author ? { author: { '@type': 'Person', name: author } } : {}),
    ...(section ? { articleSection: section } : {}),
    ...(wordCount ? { wordCount } : {}),
    publisher: {
      '@type': 'Organization',
      name: 'Bainbo Taria Awo Club',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': path },
  }
}

/** An event: what it is, when it happens and where. */
export function eventSchema({
  name,
  description,
  path,
  startDate,
  endDate,
  location,
  image,
}: {
  name: string
  description: string
  path: string
  startDate?: string | null
  endDate?: string | null
  location?: string | null
  image?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {}),
    ...(location ? { location: { '@type': 'Place', name: location } } : {}),
    ...(image ? { image } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    organizer: { '@type': 'Organization', name: 'Bainbo Taria Awo Club' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': path },
  }
}
