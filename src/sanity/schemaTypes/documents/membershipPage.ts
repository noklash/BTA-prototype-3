import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * Singleton: Membership/Join/Support page (multi-step form).
 */
export const membershipPage = defineType({
  name: 'membershipPage',
  title: 'Membership page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Page Hero', default: true },
    { name: 'steps', title: 'Steps' },
    { name: 'form', title: 'Form Fields' },
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
          initialValue: 'Membership',
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Belong. Contribute. Build.',
          validation: (rule) => rule.required().max(120),
        }),
        defineField({
          name: 'intro',
          title: 'Intro text',
          type: 'text',
          rows: 3,
          initialValue: 'Join a community of people who care about heritage, knowledge and community development.',
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
      group: 'steps',
      initialValue: true,
    }),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      group: 'steps',
      description: 'The step indicators shown at the top of the form.',
      of: [defineArrayMember({ type: 'membershipStep' })],
      validation: (rule) => rule.min(2).max(6),
    }),
    defineField({
      name: 'supportMode',
      title: 'Support mode (first step shows donation options)',
      type: 'boolean',
      group: 'form',
      description: 'If true, the first step shows radio choices for donation amount instead of the standard form.',
      initialValue: false,
    }),
    defineField({
      name: 'supportChoices',
      title: 'Support choices',
      type: 'array',
      group: 'form',
      description: 'Radio options for the support mode first step.',
      of: [
        defineArrayMember({
          name: 'supportChoice',
          title: 'Support choice',
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required().max(80) }),
            defineField({ name: 'description', title: 'Description', type: 'string', validation: (rule) => rule.max(200) }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'fields',
      title: 'Form fields (steps after the first)',
      type: 'array',
      group: 'form',
      description: 'Fields for the application steps. Wide fields span both columns.',
      of: [defineArrayMember({ type: 'formField' })],
      validation: (rule) => rule.min(1).max(12),
    }),
    defineField({
      name: 'continueLabel',
      title: 'Continue button label',
      type: 'string',
      group: 'form',
      initialValue: 'Continue',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'submitLabel',
      title: 'Submit button label (final step)',
      type: 'string',
      group: 'form',
      initialValue: 'Submit',
      validation: (rule) => rule.max(40),
    }),
  ],
  preview: {
    select: { title: 'pageHero.title', media: 'pageHero.image' },
    prepare: ({ title, media }) => ({ title: title ?? 'Membership page', media }),
  },
})