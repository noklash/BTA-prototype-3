// @vitest-environment node
/**
 * Guards the Studio schema against accidental regressions.
 *
 * The schema is the contract between the CMS and the website, so this test
 * asserts the document types and the fields each one exposes.
 */
import { describe, expect, it } from 'vitest'

import {
  documentSchemaTypes,
  objectSchemaTypes,
  schemaTypes,
  singletonDocumentTypeNames,
} from '@/sanity/schemaTypes'
import { SINGLETON_DOCUMENT_TYPES } from '@/lib/sanity/env'

interface LooseField {
  name?: string
  type?: string
  initialValue?: unknown
  options?: { list?: { value?: string }[] }
  of?: {
    type?: string
    to?: { type?: string }[]
    styles?: { value?: string }[]
    marks?: { decorators?: { value?: string }[] }
  }[]
}

interface LooseType {
  name?: string
  type?: string
  fields?: LooseField[]
  groups?: { name?: string }[]
  of?: LooseField['of']
}

const types = schemaTypes as unknown as LooseType[]

function requireType(name: string): LooseType {
  const found = types.find((candidate) => candidate.name === name)
  if (!found) {
    throw new Error(`Schema type "${name}" is not registered.`)
  }
  return found
}

function fieldNames(type: LooseType): string[] {
  return (type.fields ?? []).map((field) => field.name ?? '').sort()
}

function requireField(type: LooseType, fieldName: string): LooseField {
  const field = (type.fields ?? []).find((candidate) => candidate.name === fieldName)
  if (!field) {
    throw new Error(`Field "${fieldName}" is missing from "${type.name}".`)
  }
  return field
}

describe('schema registration', () => {
  it('registers every document type required by the project', () => {
    expect(documentSchemaTypes.map((type) => type.name).sort()).toEqual([
      'aboutPage',
      'businessHub',
      'communityNeeds',
      'detailPage',
      'editorialPage',
      'event',
      'eventsPage',
      'featuredActivity',
      'homepage',
      'libraryPage',
      'membershipPage',
      'siteSettings',
    ])
  })

  it('registers the reusable object types', () => {
    expect(objectSchemaTypes.map((type) => type.name).sort()).toEqual([
      'businessEntry',
      'callToAction',
      'detailExpectation',
      'editorialArticle',
      'eventsHomeBlock',
      'formField',
      'heritageHomeBlock',
      'homeInitiative',
      'homeStat',
      'imageWithAlt',
      'impactBlock',
      'knowledgeHomeBlock',
      'libraryResource',
      'membershipStep',
      'modelPillar',
      'navItem',
      'partnerHomeBlock',
      'richText',
      'socialLink',
      'valueItem',
      'visionHomeBlock',
    ])
  })

  it('has no duplicate type names', () => {
    const names = schemaTypes.map((type) => type.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('keeps the singleton list in sync with the schema', () => {
    expect([...singletonDocumentTypeNames].sort()).toEqual([...SINGLETON_DOCUMENT_TYPES].sort())
  })
})

describe('siteSettings', () => {
  it('exposes exactly the fields the website reads', () => {
    expect(fieldNames(requireType('siteSettings'))).toEqual([
      'address',
      'contactEmail',
      'contactPhone',
      'footerText',
      'logo',
      'navItems',
      'shortName',
      'socialLinks',
      'tagline',
      'title',
      'utilityLink',
    ])
  })
})

describe('homepage', () => {
  it('exposes all 11 section groups', () => {
    const type = requireType('homepage')
    const names = fieldNames(type)

    expect(names).toContain('heroHeading')
    expect(names).toContain('heroDescription')
    expect(names).toContain('heroAside')
    expect(names).toContain('heroImage')
    expect(names).toContain('heroCtaPrimary')
    expect(names).toContain('heroCtaSecondary')
    expect(names).toContain('heroCtaTertiary')
    expect(names).toContain('introEyebrow')
    expect(names).toContain('introHeading')
    expect(names).toContain('introLead')
    expect(names).toContain('introBody')
    expect(names).toContain('introCta')
    expect(names).toContain('statsItems')
    expect(names).toContain('statsCaption')
    expect(names).toContain('modelEyebrow')
    expect(names).toContain('modelHeading')
    expect(names).toContain('modelIntro')
    expect(names).toContain('modelPillars')
    expect(names).toContain('initiativesEyebrow')
    expect(names).toContain('initiativesHeading')
    expect(names).toContain('initiativesIntro')
    expect(names).toContain('initiativesItems')
    expect(names).toContain('impact')
    expect(names).toContain('knowledge')
    expect(names).toContain('heritage')
    expect(names).toContain('events')
    expect(names).toContain('vision')
    expect(names).toContain('partner')
  })
})

describe('aboutPage', () => {
  it('exposes the required copy fields plus the optional image and leadership note', () => {
    expect(fieldNames(requireType('aboutPage'))).toEqual([
      'featuredImage',
      'history',
      'intro',
      'leadership',
      'mission',
      'title',
      'values',
    ])
  })

  it('uses the shared rich text type for the history section', () => {
    expect(requireField(requireType('aboutPage'), 'history').type).toBe('richText')
  })
})

describe('event', () => {
  it('exposes every field described in the project brief', () => {
    expect(fieldNames(requireType('event'))).toEqual([
      'category',
      'coverImage',
      'fullDescription',
      'location',
      'slug',
      'startDateTime',
      'status',
      'summary',
      'title',
    ])
  })

  it('defaults to draft so a new event is never public by accident', () => {
    const status = requireField(requireType('event'), 'status')

    expect(status.initialValue).toBe('draft')
    expect(status.options?.list?.map((option) => option.value)).toEqual(['draft', 'published'])
  })

  it('stores the start as a datetime', () => {
    expect(requireField(requireType('event'), 'startDateTime').type).toBe('datetime')
  })

  it('requires a slug generated from the title', () => {
    expect(requireField(requireType('event'), 'slug').type).toBe('slug')
  })
})

describe('featuredActivity', () => {
  it('exposes the fields the home page renders', () => {
    expect(fieldNames(requireType('featuredActivity'))).toEqual([
      'displayOrder',
      'image',
      'shortDescription',
      'slug',
      'title',
    ])
  })

  it('defaults the display order to zero', () => {
    expect(requireField(requireType('featuredActivity'), 'displayOrder').initialValue).toBe(0)
  })
})

describe('reusable object types', () => {
  it('requires alternative text on images through the shared image type', () => {
    expect(fieldNames(requireType('imageWithAlt'))).toEqual(['alt'])
  })

  it('exposes the call to action contract used by the home page', () => {
    expect(fieldNames(requireType('callToAction'))).toEqual([
      'body',
      'buttonHref',
      'buttonLabel',
      'heading',
    ])
  })

  it('exposes the value item and social link contracts', () => {
    expect(fieldNames(requireType('valueItem'))).toEqual(['description', 'title'])
    expect(fieldNames(requireType('socialLink'))).toEqual(['platform', 'url'])
  })

  it('restricts rich text to a single block type with the declared styles and marks', () => {
    const richText = requireType('richText')

    expect(richText.of).toHaveLength(1)
    const block = richText.of?.[0]

    expect(block?.type).toBe('block')
    expect(block?.styles?.map((style) => style.value)).toEqual([
      'normal',
      'h3',
      'h4',
      'blockquote',
    ])
    expect(block?.marks?.decorators?.map((decorator) => decorator.value)).toEqual(['strong', 'em'])
  })
})