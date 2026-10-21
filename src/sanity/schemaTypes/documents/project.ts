import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * The categories a community project can belong to. They match the categories
 * the demonstration dataset uses, so the seeded projects and the ones an editor
 * creates are the same kinds of work.
 */
export const PROJECT_CATEGORIES = [
  { title: 'Education', value: 'Education' },
  { title: 'Health', value: 'Health' },
  { title: 'Water & Sanitation', value: 'Water & Sanitation' },
  { title: 'Infrastructure', value: 'Infrastructure' },
  { title: 'Aquaculture', value: 'Aquaculture' },
  { title: 'Heritage', value: 'Heritage' },
  { title: 'Youth', value: 'Youth' },
] as const

/**
 * A community project: the editorial story of a project in the bank.
 *
 * The story — the title, the description, the benefits and the milestones — is
 * editorial content and belongs in the CMS. The live figures (stage, budget,
 * funding raised) are demonstration data, because the admin area can move a
 * project between stages and the site has to show it.
 */
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'story', title: 'The project', default: true },
    { name: 'progress', title: 'Progress' },
    { name: 'meta', title: 'Details' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'story',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'story',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      group: 'story',
      description: 'Shown in the project bank under the title.',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'richText',
      group: 'story',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      group: 'story',
      description: 'Optional. The prototype image is used when no image is set.',
    }),
    defineField({
      name: 'milestones',
      title: 'Milestones',
      type: 'array',
      group: 'progress',
      description: 'The steps of the project, in order.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'projectMilestone',
          fields: [
            defineField({
              name: 'label',
              title: 'Milestone',
              type: 'string',
              validation: (rule) => rule.required().max(120),
            }),
            defineField({
              name: 'done',
              title: 'Complete',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'label', done: 'done' },
            prepare: ({ title, done }) => ({ title: title ?? 'Milestone', subtitle: done ? 'Complete' : 'In progress' }),
          },
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'meta',
      options: {
        layout: 'radio',
        list: [...PROJECT_CATEGORIES],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'meta',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'beneficiaries',
      title: 'Beneficiaries',
      type: 'string',
      group: 'meta',
      description: 'For example: "180 students" or "40 households".',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'communityBenefits',
      title: 'Expected community benefits',
      type: 'array',
      group: 'meta',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.max(12),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'meta',
      description: 'Only published projects appear in the project bank.',
      options: {
        layout: 'radio',
        list: [
          { title: 'Published', value: 'published' },
          { title: 'Draft', value: 'draft' },
        ],
      },
      initialValue: 'published',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'image' },
  },
})
