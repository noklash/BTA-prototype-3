import { defineField, defineType } from 'sanity'

/**
 * The home page vision section (with background image via CSS).
 */
export const visionHomeBlock = defineType({
  name: 'visionHomeBlock',
  title: 'Vision section',
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
      description: 'Supports line breaks and <em> for emphasis.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'body',
      title: 'Body text',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'cta',
      title: 'Call to action',
      type: 'callToAction',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'heading' },
  },
})