import { defineField, defineType } from 'sanity'

/**
 * The home page knowledge section (topics + featured session).
 */
export const knowledgeHomeBlock = defineType({
  name: 'knowledgeHomeBlock',
  title: 'Knowledge section',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'body',
      title: 'Body text',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: 'topics',
      title: 'Topic tags',
      type: 'array',
      description: 'Displayed as a bullet-separated list.',
      of: [
        defineField({
          name: 'topic',
          title: 'Topic',
          type: 'string',
          validation: (rule) => rule.max(40),
        }),
      ],
      validation: (rule) => rule.max(12),
    }),
    defineField({
      name: 'featuredSession',
      title: 'Featured session',
      type: 'object',
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow',
          type: 'string',
          description: 'For example: "Featured session · 18 October 2026"',
          validation: (rule) => rule.max(80),
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
          rows: 3,
          validation: (rule) => rule.max(300),
        }),
        defineField({
          name: 'link',
          title: 'Link path',
          type: 'string',
          validation: (rule) => rule.required().regex(/^\/.*$/),
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Call to action',
      type: 'callToAction',
    }),
  ],
  preview: {
    select: { title: 'heading' },
  },
})