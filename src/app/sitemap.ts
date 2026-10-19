import type { MetadataRoute } from 'next'

import { DEMO_DATA } from '@/lib/demo/data'
import { getPublishedEventSlugs } from '@/lib/sanity/content'
import { getSiteUrl } from '@/lib/site'

/**
 * Sitemap for the static routes, the demonstration detail pages and every
 * published event.
 *
 * The members' portal and the admin area are deliberately excluded: they are
 * behind a simulated sign-in, marked `noindex` and disallowed in `robots.ts`.
 *
 * When Sanity is unreachable only the local routes are listed: a sitemap that
 * omits content is preferable to one that advertises URLs it cannot confirm.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl()

  const route = (path: string, changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'], priority: number) => ({
    url: new URL(path, baseUrl).toString(),
    changeFrequency,
    priority,
  })

  const staticRoutes: MetadataRoute.Sitemap = [
    route('/', 'monthly', 1),
    route('/about', 'yearly', 0.7),
    route('/our-people', 'yearly', 0.6),
    route('/knowledge', 'monthly', 0.7),
    route('/library', 'weekly', 0.8),
    route('/enterprise', 'yearly', 0.6),
    route('/enterprise/business-hub', 'weekly', 0.7),
    route('/community-impact', 'monthly', 0.7),
    route('/blue-economy', 'yearly', 0.6),
    route('/heritage', 'yearly', 0.7),
    route('/heritage/oral-history', 'yearly', 0.5),
    route('/events', 'weekly', 0.9),
    route('/projects', 'weekly', 0.9),
    route('/donate', 'monthly', 0.8),
    route('/transparency', 'monthly', 0.8),
    route('/diaspora', 'monthly', 0.7),
    route('/youth', 'weekly', 0.8),
    route('/volunteer', 'monthly', 0.7),
    route('/feedback', 'monthly', 0.6),
    route('/partner', 'yearly', 0.7),
    route('/membership', 'yearly', 0.8),
    route('/governance', 'yearly', 0.5),
    route('/roadmap', 'yearly', 0.5),
  ]

  const projectRoutes: MetadataRoute.Sitemap = DEMO_DATA.projects.map((project) =>
    route(`/projects/${project.slug}`, 'monthly', 0.6),
  )

  const opportunityRoutes: MetadataRoute.Sitemap = DEMO_DATA.opportunities.map((opportunity) =>
    route(`/youth/${opportunity.slug}`, 'monthly', 0.5),
  )

  const knowledgeRoutes: MetadataRoute.Sitemap = DEMO_DATA.knowledge
    .filter((item) => item.status === 'Published')
    .map((item) => route(`/library/${item.slug}`, 'yearly', 0.5))

  const businessRoutes: MetadataRoute.Sitemap = DEMO_DATA.businesses
    .filter((business) => business.status === 'Published')
    .map((business) => route(`/enterprise/business-hub/${business.slug}`, 'yearly', 0.5))

  const events = await getPublishedEventSlugs()

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...opportunityRoutes,
    ...knowledgeRoutes,
    ...businessRoutes,
    ...events.map(({ slug }) => route(`/events/${slug}`, 'monthly', 0.6)),
  ]
}
