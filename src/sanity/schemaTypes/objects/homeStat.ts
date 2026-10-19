import { defineField, defineType } from 'sanity'

/**
 * A single stat item for the home page stats bar.
 */
export const homeStat = defineType({
  name: 'homeStat',
  title: 'Stat item',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value (large number)',
      type: 'string',
      description: 'For example: "50+" or "500+"',
      validation: (rule) => rule.required().max(20),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Description shown under the value.',
      validation: (rule) => rule.required().max(60),
    }),
  ],
  preview: {
    select: { title: 'value', subtitle: 'label' },
  },
})