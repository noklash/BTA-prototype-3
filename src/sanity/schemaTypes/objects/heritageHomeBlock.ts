import { defineField, defineType } from 'sanity'

/**
 * The home page heritage section (photo + content + quote + CTA).
 */
export const heritageHomeBlock = defineType({
  name: 'heritageHomeBlock',
  title: 'Heritage section',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Background image',
      type: 'imageWithAlt',
      description: 'Full-height image on the left side.',
      validation: (rule) => rule.required(),
    }),
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
      rows: 4,
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      description: 'Rendered as a blockquote with a gold left border.',
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: 'cta',
      title: 'Call to action',
      type: 'callToAction',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'image' },
  },
})