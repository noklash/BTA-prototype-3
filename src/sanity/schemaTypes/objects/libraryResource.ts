import { defineField, defineType } from 'sanity'

/**
 * A single resource in the Knowledge Library.
 */
export const libraryResource = defineType({
  name: 'libraryResource',
  title: 'Library resource',
  type: 'object',
  fields: [
    defineField({
      name: 'featured',
      title: 'Featured (spans two rows)',
      type: 'boolean',
      description: 'If true, this card spans two grid rows and uses the navy background variant.',
      initialValue: false,
    }),
    defineField({
      name: 'type',
      title: 'Resource type',
      type: 'string',
      description: 'Displayed as a small gold tag (e.g. "Session recording").',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'For example: "BTA Knowledge Library · 2026"',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'link',
      title: 'Link path',
      type: 'string',
      validation: (rule) => rule.required().regex(/^\/.*$/),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'type' },
  },
})