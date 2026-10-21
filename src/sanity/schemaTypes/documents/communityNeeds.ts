import { defineArrayMember, defineField, defineType } from 'sanity'
import { PeopleIcon } from '../../icons'

/**
 * Singleton: Community Needs page (form page).
 */
export const communityNeeds = defineType({
  name: 'communityNeeds',
  title: 'Community Needs',
  type: 'document',
  icon: PeopleIcon,
  groups: [
    { name: 'hero', title: 'Page Hero', default: true },
    { name: 'content', title: 'Form' },
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
          initialValue: 'Community Needs Register',
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: "What does your community need?",
          validation: (rule) => rule.required().max(120),
        }),
        defineField({
          name: 'intro',
          title: 'Intro text',
          type: 'text',
          rows: 3,
          initialValue: 'Make local needs visible for review by the appropriate BTA committee.',
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
      name: 'formTitle',
      title: 'Form title',
      type: 'string',
      group: 'content',
      initialValue: 'Submit a community need',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'formDescription',
      title: 'Form description',
      type: 'text',
      group: 'content',
      rows: 2,
      initialValue: 'Submission does not guarantee funding or implementation.',
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: 'fields',
      title: 'Form fields',
      type: 'array',
      group: 'content',
      description: 'Fields in the order they appear (two-column layout, wide fields span both columns).',
      of: [defineArrayMember({ type: 'formField' })],
      validation: (rule) => rule.min(1).max(10),
    }),
    defineField({
      name: 'submitLabel',
      title: 'Submit button label',
      type: 'string',
      group: 'content',
      initialValue: 'Submit community need',
      validation: (rule) => rule.max(60),
    }),
  ],
  preview: {
    select: { title: 'pageHero.title', media: 'pageHero.image' },
    prepare: ({ title, media }) => ({ title: title ?? 'Community Needs', media }),
  },
})