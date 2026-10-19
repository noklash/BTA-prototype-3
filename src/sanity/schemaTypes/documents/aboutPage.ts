import { defineArrayMember, defineField, defineType } from 'sanity'

import { MAX_ABOUT_VALUES } from '../../shared/limits'

/**
 * Singleton document: the about page.
 */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'About us',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      description: 'A short standfirst shown directly under the page title.',
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: 'history',
      title: 'History',
      type: 'richText',
      description: 'The story of the organization. Headings, lists and links are supported.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mission',
      title: 'Mission',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(600),
    }),
    defineField({
      name: 'leadership',
      title: 'Leadership',
      type: 'text',
      rows: 3,
      description:
        'A short introduction to the people who run the organisation, for example its volunteer committee. Optional.',
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      description: `Up to ${MAX_ABOUT_VALUES} values, each with a short description.`,
      of: [defineArrayMember({ type: 'valueItem' })],
      validation: (rule) => rule.max(MAX_ABOUT_VALUES),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured image',
      type: 'imageWithAlt',
      description: 'Optional. Shown alongside the history section.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'intro', media: 'featuredImage' },
  },
})
