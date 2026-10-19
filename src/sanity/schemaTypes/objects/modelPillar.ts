import { defineField, defineType } from 'sanity'

/**
 * A single pillar in the home page model grid.
 */
export const modelPillar = defineType({
  name: 'modelPillar',
  title: 'Model pillar',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(300),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
})