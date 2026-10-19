import { defineField, defineType } from 'sanity'

/**
 * A single business entry in the Business Hub.
 */
export const businessEntry = defineType({
  name: 'businessEntry',
  title: 'Business entry',
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      title: 'Number',
      type: 'string',
      description: 'Displayed as a small numbered prefix (e.g. "01").',
      validation: (rule) => rule.required().max(4),
    }),
    defineField({
      name: 'name',
      title: 'Business name',
      type: 'string',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: 'link',
      title: 'Link path',
      type: 'string',
      description: 'Where the "View" button links to.',
      validation: (rule) => rule.required().regex(/^\/.*$/),
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category' },
  },
})