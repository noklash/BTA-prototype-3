import { defineField, defineType } from 'sanity'

/**
 * A single article in an editorial page.
 */
export const editorialArticle = defineType({
  name: 'editorialArticle',
  title: 'Editorial article',
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      title: 'Number',
      type: 'string',
      description: 'Displayed as a large number prefix (e.g. "01").',
      validation: (rule) => rule.required().max(4),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'body',
      title: 'Body text',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(800),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'number' },
  },
})