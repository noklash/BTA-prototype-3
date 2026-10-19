import { defineArrayMember, defineField, defineType } from 'sanity'

import { MAX_BUSINESS_ENTRIES } from '../../shared/limits'

/**
 * Singleton: Business Hub page.
 */
export const businessHub = defineType({
  name: 'businessHub',
  title: 'Business Hub',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Page Hero', default: true },
    { name: 'content', title: 'Business Directory' },
  ],
  fields: [
    defineField({
      name: 'pageHero',
      title: 'Page hero',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow',
          type: 'string',
          initialValue: 'BTA Business Hub',
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Buy BTA. Support a BTA business.',
          validation: (rule) => rule.required().max(120),
        }),
        defineField({
          name: 'intro',
          title: 'Intro text',
          type: 'text',
          rows: 3,
          initialValue: 'A prototype member directory for trusted services, expertise and enterprise.',
          validation: (rule) => rule.max(400),
        }),
        defineField({
          name: 'image',
          title: 'Hero image',
          type: 'imageWithAlt',
        }),
      ],
    }),
    defineField({
      name: 'note',
      title: 'Demonstration note',
      type: 'boolean',
      group: 'content',
      initialValue: true,
    }),
    defineField({
      name: 'searchPlaceholder',
      title: 'Search placeholder',
      type: 'string',
      group: 'content',
      initialValue: 'Search by name, expertise or location',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'searchCategoriesButton',
      title: 'Search categories button label',
      type: 'string',
      group: 'content',
      initialValue: 'All categories',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'businesses',
      title: 'Business entries',
      type: 'array',
      group: 'content',
      description: `Up to ${MAX_BUSINESS_ENTRIES} businesses.`,
      of: [defineArrayMember({ type: 'businessEntry' })],
      validation: (rule) => rule.max(MAX_BUSINESS_ENTRIES),
    }),
  ],
  preview: {
    select: { title: 'pageHero.title', media: 'pageHero.image' },
    prepare: ({ title, media }) => ({ title: title ?? 'Business Hub', media }),
  },
})