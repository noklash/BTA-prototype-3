import { defineField, defineType } from 'sanity'

/**
 * The home page impact section (photo + content + CTA).
 */
export const impactBlock = defineType({
  name: 'impactBlock',
  title: 'Impact section',
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
      name: 'metricValue',
      title: 'Metric value (large number)',
      type: 'string',
      description: 'For example: "180"',
      validation: (rule) => rule.max(20),
    }),
    defineField({
      name: 'metricLabel',
      title: 'Metric label',
      type: 'string',
      description: 'For example: "students reached · illustrative metric"',
      validation: (rule) => rule.max(100),
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