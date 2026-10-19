import { defineArrayMember, defineField, defineType } from 'sanity'

import { MAX_LIBRARY_RESOURCES } from '../../shared/limits'

/**
 * Singleton: Knowledge Library page.
 */
export const libraryPage = defineType({
  name: 'libraryPage',
  title: 'Library page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Page Hero', default: true },
    { name: 'content', title: 'Resources' },
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
          initialValue: 'Knowledge Library',
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Knowledge, kept in motion.',
          validation: (rule) => rule.required().max(120),
        }),
        defineField({
          name: 'intro',
          title: 'Intro text',
          type: 'text',
          rows: 3,
          initialValue: 'Videos, presentations, articles, session summaries, research and community reports.',
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
      name: 'resources',
      title: 'Resources',
      type: 'array',
      group: 'content',
      description: `Up to ${MAX_LIBRARY_RESOURCES} resources. The first featured resource spans two rows.`,
      of: [defineArrayMember({ type: 'libraryResource' })],
      validation: (rule) => rule.max(MAX_LIBRARY_RESOURCES),
    }),
  ],
  preview: {
    select: { title: 'pageHero.title', media: 'pageHero.image' },
    prepare: ({ title, media }) => ({ title: title ?? 'Library page', media }),
  },
})