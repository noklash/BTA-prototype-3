/**
 * Route smoke tests.
 *
 * Every public page module must exist and export a component. The pages that
 * read Sanity are imported for real (with the Sanity environment deliberately
 * cleared), which also proves that they degrade to a rendered state instead of
 * throwing during import — the failure mode that would otherwise only show up in
 * production.
 *
 * The embedded Studio route is intentionally not imported: pulling the full
 * Sanity Studio into a unit test is slow and tests the vendor bundle rather than
 * this application. It is covered by the production build and by the HTTP checks
 * recorded in docs/testing.md.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import AboutRoute from '@/app/about/page'
import AdminOverviewRoute from '@/app/admin/page'
import AdminBusinessesRoute from '@/app/admin/businesses/page'
import AdminContentRoute from '@/app/admin/content/page'
import AdminDuesRoute from '@/app/admin/dues/page'
import AdminFeedbackRoute from '@/app/admin/feedback/page'
import AdminMembersRoute from '@/app/admin/members/page'
import AdminPartnershipsRoute from '@/app/admin/partnerships/page'
import AdminProjectsRoute from '@/app/admin/projects/page'
import AdminRolesRoute from '@/app/admin/roles/page'
import AdminScholarshipsRoute from '@/app/admin/scholarships/page'
import AdminVolunteersRoute from '@/app/admin/volunteers/page'
import CommunityNeedsRoute from '@/app/community-needs/page'
import DiasporaRoute from '@/app/diaspora/page'
import DonateRoute from '@/app/donate/page'
import BusinessHubRoute from '@/app/enterprise/business-hub/page'
import FeedbackRoute from '@/app/feedback/page'
import EventsRoute from '@/app/events/page'
import EventDetailRoute, {
  generateMetadata as eventGenerateMetadata,
  generateStaticParams as eventGenerateStaticParams,
} from '@/app/events/[slug]/page'
import HomeRoute from '@/app/page'
import LibraryRoute from '@/app/library/page'
import MembershipRoute from '@/app/membership/page'
import NotFoundRoute from '@/app/not-found'
import PartnerRoute from '@/app/partner/page'
import PortalRoute from '@/app/portal/(dash)/page'
import PortalDirectoryRoute from '@/app/portal/(dash)/directory/page'
import PortalDuesRoute from '@/app/portal/(dash)/dues/page'
import PortalMeetingsRoute from '@/app/portal/(dash)/meetings/page'
import PortalProfileRoute from '@/app/portal/(dash)/profile/page'
import PortalLoginRoute from '@/app/portal/login/page'
import ProjectsRoute from '@/app/projects/page'
import RoadmapRoute from '@/app/roadmap/page'
import TransparencyRoute from '@/app/transparency/page'
import VolunteerRoute from '@/app/volunteer/page'
import YouthRoute from '@/app/youth/page'
import RouteError from '@/app/error'
import { resetSanityClient } from '@/lib/sanity/client'

const appDirectory = join(process.cwd(), 'src', 'app')

beforeAll(() => {
  // Guarantee the "no CMS" path and, more importantly, that no test can make a
  // real network request if the developer happens to have credentials exported.
  vi.stubEnv('NEXT_PUBLIC_SANITY_PROJECT_ID', '')
  vi.stubEnv('NEXT_PUBLIC_SANITY_DATASET', '')
  vi.stubEnv('SANITY_API_READ_TOKEN', '')
  resetSanityClient()
})

afterAll(() => {
  vi.unstubAllEnvs()
  resetSanityClient()
})

describe('required routes', () => {
  it.each([
    ['/', HomeRoute],
    ['/about', AboutRoute],
    ['/events', EventsRoute],
    ['/events/[slug]', EventDetailRoute],
    ['/membership', MembershipRoute],
    ['not-found', NotFoundRoute],
    ['error boundary', RouteError],
  ])('exposes a component for %s', (_route, component) => {
    expect(typeof component).toBe('function')
  })

  it.each([
    ['/projects', ProjectsRoute],
    ['/donate', DonateRoute],
    ['/transparency', TransparencyRoute],
    ['/diaspora', DiasporaRoute],
    ['/volunteer', VolunteerRoute],
    ['/feedback', FeedbackRoute],
    ['/roadmap', RoadmapRoute],
    ['/youth', YouthRoute],
    ['/library', LibraryRoute],
    ['/enterprise/business-hub', BusinessHubRoute],
    ['/partner', PartnerRoute],
    ['/community-needs', CommunityNeedsRoute],
  ])('exposes the Prototype 3 public route %s', (_route, component) => {
    expect(typeof component).toBe('function')
  })

  it.each([
    ['/portal/login', PortalLoginRoute],
    ['/portal', PortalRoute],
    ['/portal/profile', PortalProfileRoute],
    ['/portal/dues', PortalDuesRoute],
    ['/portal/meetings', PortalMeetingsRoute],
    ['/portal/directory', PortalDirectoryRoute],
  ])('exposes the members’ portal route %s', (_route, component) => {
    expect(typeof component).toBe('function')
  })

  it.each([
    ['/admin', AdminOverviewRoute],
    ['/admin/members', AdminMembersRoute],
    ['/admin/content', AdminContentRoute],
    ['/admin/projects', AdminProjectsRoute],
    ['/admin/dues', AdminDuesRoute],
    ['/admin/scholarships', AdminScholarshipsRoute],
    ['/admin/volunteers', AdminVolunteersRoute],
    ['/admin/businesses', AdminBusinessesRoute],
    ['/admin/feedback', AdminFeedbackRoute],
    ['/admin/partnerships', AdminPartnershipsRoute],
    ['/admin/roles', AdminRolesRoute],
  ])('exposes the administrative route %s', (_route, component) => {
    expect(typeof component).toBe('function')
  })

  it('prerenders event detail pages from published slugs', () => {
    expect(typeof eventGenerateStaticParams).toBe('function')
    expect(typeof eventGenerateMetadata).toBe('function')
  })

  it('keeps the Studio route in place', () => {
    const studioPage = join(appDirectory, 'studio', '[[...tool]]', 'page.tsx')

    expect(existsSync(studioPage)).toBe(true)

    const source = readFileSync(studioPage, 'utf8')
    expect(source).toContain('export default')
    expect(source).toContain("dynamic = 'force-dynamic'")
  })

  it('keeps the API routes in place', () => {
    expect(existsSync(join(appDirectory, 'api', 'membership-inquiry', 'route.ts'))).toBe(true)
    expect(existsSync(join(appDirectory, 'api', 'revalidate', 'route.ts'))).toBe(true)
  })
})

describe('rendering without a CMS configuration', () => {
  it('does not throw while importing or awaiting the home page', async () => {
    await expect(HomeRoute()).resolves.toBeDefined()
  })

  it('does not throw while importing or awaiting the about page', async () => {
    await expect(AboutRoute()).resolves.toBeDefined()
  })

  it('does not throw while importing or awaiting the events page', async () => {
    await expect(EventsRoute()).resolves.toBeDefined()
  })

  it('does not throw while importing or awaiting the membership page', async () => {
    await expect(MembershipRoute()).resolves.toBeDefined()
  })

  it('returns no static params rather than failing the build', async () => {
    await expect(eventGenerateStaticParams()).resolves.toEqual([])
  })

  it('reports an unusable event as not found in metadata', async () => {
    const metadata = await eventGenerateMetadata({ params: Promise.resolve({ slug: 'missing' }) })
    expect(metadata.title).toBe('Event not found')
  })
})
