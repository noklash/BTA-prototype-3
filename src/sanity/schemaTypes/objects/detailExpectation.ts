import { defineField, defineType } from 'sanity'

/**
 * A "What to expect" item in a detail page.
 */
export const detailExpectation = defineType({
  name: 'detailExpectation',
  title: 'What to expect item',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (rule) => rule.required().max(160),
    }),
  ],
  preview: {
    select: { title: 'text' },
  },
})