import { defineField, defineType } from 'sanity'

/**
 * A step in the membership/support multi-step form.
 */
export const membershipStep = defineType({
  name: 'membershipStep',
  title: 'Membership step',
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      title: 'Step number',
      type: 'string',
      description: 'For example: "01"',
      validation: (rule) => rule.required().max(4),
    }),
    defineField({
      name: 'label',
      title: 'Step label',
      type: 'string',
      description: 'For example: "Express interest"',
      validation: (rule) => rule.required().max(40),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'number' },
  },
})