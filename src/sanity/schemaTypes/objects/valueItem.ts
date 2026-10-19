import { defineField, defineType } from 'sanity'

export const valueItem = defineType({
  name: 'valueItem',
  title: 'Value',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Value',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
})
