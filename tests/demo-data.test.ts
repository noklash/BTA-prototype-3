import { describe, expect, it } from 'vitest'

import {
  DEMO_DATA,
  DEMO_MEMBER_ID,
  computeDemoStats,
  findBusiness,
  findKnowledgeResource,
  findOpportunity,
  findProject,
} from '@/lib/demo/data'

/**
 * The demonstration dataset is shared by the public site, the portal and the
 * admin area. These tests guard the invariants that keep those three views in
 * agreement: unique identifiers, valid categories, and statistics derived from
 * the same arrays rather than hand-maintained totals.
 */
describe('demonstration dataset', () => {
  it('has unique member ids and emails', () => {
    const ids = DEMO_DATA.members.map((member) => member.id)
    const emails = DEMO_DATA.members.map((member) => member.email.toLowerCase())

    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(emails).size).toBe(emails.length)
  })

  it('signs the demonstration in as a real member', () => {
    expect(DEMO_DATA.members.some((member) => member.id === DEMO_MEMBER_ID)).toBe(true)
  })

  it('has unique slugs for every routable collection', () => {
    for (const collection of [
      DEMO_DATA.projects,
      DEMO_DATA.opportunities,
      DEMO_DATA.knowledge,
      DEMO_DATA.businesses,
    ]) {
      const slugs = collection.map((item) => item.slug)
      expect(new Set(slugs).size).toBe(slugs.length)
      expect(slugs.every((slug) => slug.length > 0)).toBe(true)
    }
  })

  it('covers every dues invoice with its member', () => {
    for (const invoice of DEMO_DATA.duesInvoices) {
      expect(DEMO_DATA.members.some((member) => member.id === invoice.memberId)).toBe(true)
      expect(invoice.amountNgn).toBeGreaterThan(0)
    }
  })

  it('keeps every project and opportunity financially plausible', () => {
    for (const project of DEMO_DATA.projects) {
      expect(project.fundingTargetNgn).toBeGreaterThan(0)
      expect(project.raisedNgn).toBeGreaterThanOrEqual(0)
    }

    for (const category of DEMO_DATA.donationCategories) {
      expect(category.id.length).toBeGreaterThan(0)
      expect(category.label.length).toBeGreaterThan(0)
    }

    const categoryIds = new Set(DEMO_DATA.donationCategories.map((category) => category.id))
    for (const contribution of DEMO_DATA.contributions) {
      expect(categoryIds.has(contribution.categoryId)).toBe(true)
      expect(contribution.amountNgn).toBeGreaterThan(0)
    }
  })

  it('derives statistics from the same arrays the pages render', () => {
    const stats = computeDemoStats()

    expect(stats.members).toBe(DEMO_DATA.members.length)
    expect(stats.projects).toBe(DEMO_DATA.projects.length)
    expect(stats.projectsCompleted).toBe(
      DEMO_DATA.projects.filter((project) => project.stage === 'Completed').length,
    )
    expect(stats.projectsCompleted + stats.ongoingProjects).toBeLessThanOrEqual(stats.projects)
    expect(stats.fundingTargetNgn).toBe(
      DEMO_DATA.projects.reduce((sum, project) => sum + project.fundingTargetNgn, 0),
    )
    expect(stats.fundedNgn).toBe(
      DEMO_DATA.projects.reduce((sum, project) => sum + project.raisedNgn, 0),
    )
    expect(stats.businesses).toBe(
      DEMO_DATA.businesses.filter((business) => business.status === 'Published').length,
    )
    expect(stats.knowledgeResources).toBe(
      DEMO_DATA.knowledge.filter((item) => item.status === 'Published').length,
    )
  })

  it('reports the same statistics for an unmodified copy', () => {
    const copy = structuredClone(DEMO_DATA)
    expect(computeDemoStats(copy)).toEqual(computeDemoStats(DEMO_DATA))
  })

  it('looks up records by slug and returns null when absent', () => {
    function first<T>(items: T[]): T {
      const item = items[0]
      if (!item) {
        throw new Error('expected at least one item in the demonstration dataset')
      }
      return item
    }

    const project = first(DEMO_DATA.projects)
    const opportunity = first(DEMO_DATA.opportunities)
    const knowledge = first(DEMO_DATA.knowledge)
    const business = first(DEMO_DATA.businesses)

    expect(findProject(project.slug)?.id).toBe(project.id)
    expect(findOpportunity(opportunity.slug)?.id).toBe(opportunity.id)
    expect(findKnowledgeResource(knowledge.slug)?.id).toBe(knowledge.id)
    expect(findBusiness(business.slug)?.id).toBe(business.id)

    expect(findProject('missing-project')).toBeNull()
    expect(findOpportunity('missing-opportunity')).toBeNull()
    expect(findKnowledgeResource('missing-resource')).toBeNull()
    expect(findBusiness('missing-business')).toBeNull()
  })
})
