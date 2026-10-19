import { defineField, defineType } from 'sanity'

/**
 * Singleton: Events listing page configuration.
 */
export const eventsPage = defineType({
  name: 'eventsPage',
  title: 'Events page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Page Hero', default: true },
    { name: 'content', title: 'Content' },
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
          initialValue: 'Events & Media',
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: "What's happening at BTA",
          validation: (rule) => rule.required().max(120),
        }),
        defineField({
          name: 'intro',
          title: 'Intro text',
          type: 'text',
          rows: 3,
          initialValue: 'A calendar of forums, member gatherings, heritage walks and partner events. All times are local.',
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
      description: 'Show the standard demonstration notice at the top of the page.',
      initialValue: true,
    }),
    defineField({
      name: 'categories',
      title: 'Filter categories',
      type: 'array',
      group: 'content',
      description: 'Categories shown as filter tabs. The first is treated as "All".',
      of: [defineField({ name: 'category', title: 'Category', type: 'string', validation: (rule) => rule.max(30) })],
      validation: (rule) => rule.min(1).max(8),
    }),
  ],
  preview: {
    select: { title: 'pageHero.title', media: 'pageHero.image' },
    prepare: ({ title, media }) => ({ title: title ?? 'Events page', media }),
  },
})