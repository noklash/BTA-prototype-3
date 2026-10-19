import { defineField, defineType } from 'sanity'

/**
 * The home page events preview section.
 */
export const eventsHomeBlock = defineType({
  name: 'eventsHomeBlock',
  title: 'Events preview section',
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
      name: 'maxEvents',
      title: 'Maximum events to show',
      type: 'number',
      description: 'How many upcoming events to display (default 3).',
      initialValue: 3,
      validation: (rule) => rule.integer().min(1).max(10),
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