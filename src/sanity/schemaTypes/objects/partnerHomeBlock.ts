import { defineField, defineType } from 'sanity'

/**
 * The home page partner section (two CTAs side by side).
 */
export const partnerHomeBlock = defineType({
  name: 'partnerHomeBlock',
  title: 'Partner section',
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
      name: 'primaryCta',
      title: 'Primary call to action',
      type: 'callToAction',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary call to action',
      type: 'callToAction',
      description: 'Rendered as an outline button.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'heading' },
  },
})