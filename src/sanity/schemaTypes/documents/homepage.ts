import { defineArrayMember, defineField, defineType } from 'sanity'

import {
  MAX_HOME_STATS,
  MAX_HOME_INITIATIVES,
  MAX_MODEL_PILLARS,
} from '../../shared/limits'

/**
 * Singleton document: the home page with all prototype sections.
 *
 * Sections in order:
 * 1. Hero
 * 2. Intro (Who we are)
 * 3. Stats
 * 4. Model (The BTA Model)
 * 5. Initiatives (Featured initiatives)
 * 6. Impact (Community impact)
 * 7. Knowledge (Knowledge & Ideas Forum)
 * 8. Heritage (The Oral History Project)
 * 9. Events preview
 * 10. Vision (BTA 2035)
 * 11. Partner
 */
export const homepage = defineType({
  name: 'homepage',
  title: 'Home page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero', default: true },
    { name: 'intro', title: '2. Intro' },
    { name: 'stats', title: '3. Stats' },
    { name: 'model', title: '4. Model' },
    { name: 'initiatives', title: '5. Initiatives' },
    { name: 'impact', title: '6. Impact' },
    { name: 'knowledge', title: '7. Knowledge' },
    { name: 'heritage', title: '8. Heritage' },
    { name: 'events', title: '9. Events' },
    { name: 'vision', title: '10. Vision' },
    { name: 'partner', title: '11. Partner' },
  ],
  fields: [
    // 1. HERO
    defineField({
      name: 'heroHeading',
      title: 'Hero heading',
      type: 'string',
      group: 'hero',
      description: 'The main headline. Supports <br/> for line breaks and <em> for emphasis.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero description',
      type: 'text',
      rows: 3,
      group: 'hero',
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: 'heroAside',
      title: 'Hero aside text',
      type: 'string',
      group: 'hero',
      description: 'Small text in the aside (e.g. "01 A digital home for...").',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'imageWithAlt',
      group: 'hero',
      description: 'Full-width background image. If omitted, a gradient is shown.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroCtaPrimary',
      title: 'Primary CTA (gold button)',
      type: 'callToAction',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroCtaSecondary',
      title: 'Secondary CTA (outline button)',
      type: 'callToAction',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroCtaTertiary',
      title: 'Tertiary CTA (text button)',
      type: 'callToAction',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),

    // 2. INTRO
    defineField({
      name: 'introEyebrow',
      title: 'Intro eyebrow',
      type: 'string',
      group: 'intro',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'introHeading',
      title: 'Intro heading',
      type: 'string',
      group: 'intro',
      description: 'Supports <br/> for line breaks.',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'introLead',
      title: 'Intro lead paragraph',
      type: 'text',
      rows: 3,
      group: 'intro',
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: 'introBody',
      title: 'Intro body paragraph',
      type: 'text',
      rows: 3,
      group: 'intro',
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: 'introCta',
      title: 'Intro CTA',
      type: 'callToAction',
      group: 'intro',
      validation: (rule) => rule.required(),
    }),

    // 3. STATS
    defineField({
      name: 'statsItems',
      title: 'Stat items',
      type: 'array',
      group: 'stats',
      description: `Exactly ${MAX_HOME_STATS} stat cards. Each has a large value and a label.`,
      of: [defineArrayMember({ type: 'homeStat' })],
      validation: (rule) => rule.length(MAX_HOME_STATS),
    }),
    defineField({
      name: 'statsCaption',
      title: 'Stats caption',
      type: 'string',
      group: 'stats',
      description: 'Small print below the stats (e.g. "Illustrative prototype figures").',
      validation: (rule) => rule.max(100),
    }),

    // 4. MODEL
    defineField({
      name: 'modelEyebrow',
      title: 'Model eyebrow',
      type: 'string',
      group: 'model',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'modelHeading',
      title: 'Model heading',
      type: 'string',
      group: 'model',
      description: 'Supports <br/> for line breaks.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'modelIntro',
      title: 'Model intro text',
      type: 'text',
      rows: 3,
      group: 'model',
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: 'modelPillars',
      title: 'Model pillars',
      type: 'array',
      group: 'model',
      description: `Exactly ${MAX_MODEL_PILLARS} pillars. Each has a title and description.`,
      of: [defineArrayMember({ type: 'modelPillar' })],
      validation: (rule) => rule.length(MAX_MODEL_PILLARS),
    }),

    // 5. INITIATIVES
    defineField({
      name: 'initiativesEyebrow',
      title: 'Initiatives eyebrow',
      type: 'string',
      group: 'initiatives',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'initiativesHeading',
      title: 'Initiatives heading',
      type: 'string',
      group: 'initiatives',
      description: 'Supports <br/> for line breaks.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'initiativesIntro',
      title: 'Initiatives intro text',
      type: 'text',
      rows: 3,
      group: 'initiatives',
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'initiativesItems',
      title: 'Initiative cards',
      type: 'array',
      group: 'initiatives',
      description: `Up to ${MAX_HOME_INITIATIVES} initiative cards with status badge and link.`,
      of: [defineArrayMember({ type: 'homeInitiative' })],
      validation: (rule) => rule.max(MAX_HOME_INITIATIVES),
    }),

    // 6. IMPACT
    defineField({
      name: 'impact',
      title: 'Impact section',
      type: 'impactBlock',
      group: 'impact',
      validation: (rule) => rule.required(),
    }),

    // 7. KNOWLEDGE
    defineField({
      name: 'knowledge',
      title: 'Knowledge section',
      type: 'knowledgeHomeBlock',
      group: 'knowledge',
      validation: (rule) => rule.required(),
    }),

    // 8. HERITAGE
    defineField({
      name: 'heritage',
      title: 'Heritage section',
      type: 'heritageHomeBlock',
      group: 'heritage',
      validation: (rule) => rule.required(),
    }),

    // 9. EVENTS
    defineField({
      name: 'events',
      title: 'Events preview section',
      type: 'eventsHomeBlock',
      group: 'events',
      validation: (rule) => rule.required(),
    }),

    // 10. VISION
    defineField({
      name: 'vision',
      title: 'Vision section',
      type: 'visionHomeBlock',
      group: 'vision',
      validation: (rule) => rule.required(),
    }),

    // 11. PARTNER
    defineField({
      name: 'partner',
      title: 'Partner section',
      type: 'partnerHomeBlock',
      group: 'partner',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'heroHeading', subtitle: 'heroDescription', media: 'heroImage' },
    prepare: ({ title, subtitle, media }) => ({
      title: title ?? 'Home page',
      subtitle,
      media,
    }),
  },
})