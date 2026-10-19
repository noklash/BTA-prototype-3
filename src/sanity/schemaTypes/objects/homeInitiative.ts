import { defineField, defineType } from 'sanity'

/**
 * Status values used by featured initiatives (matching the prototype).
 */
export const INITIATIVE_STATUSES = [
  { title: 'Active', value: 'ACTIVE' },
  { title: 'Launching', value: 'LAUNCHING' },
  { title: 'Planned', value: 'PLANNED' },
  { title: 'Vision 2035', value: 'VISION_2035' },
]

/**
 * A home page initiative card — extends the reusable featuredActivity with
 * a status badge and a link target.
 */
export const homeInitiative = defineType({
  name: 'homeInitiative',
  title: 'Home initiative',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used in links to this initiative. Generate from the title.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description: 'Two or three sentences describing the initiative.',
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: 'status',
      title: 'Status badge',
      type: 'string',
      description: 'Displayed as a coloured tag next to the initiative number.',
      options: {
        layout: 'radio',
        list: INITIATIVE_STATUSES,
      },
      initialValue: 'ACTIVE',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link path',
      type: 'string',
      description: 'Internal path the initiative card links to (e.g. /knowledge/forum).',
      validation: (rule) => rule.required().regex(/^\/.*$/),
    }),
    defineField({
      name: 'image',
      title: 'Image (Studio preview only)',
      type: 'imageWithAlt',
      description: 'Optional. Not rendered on the public site; used for Studio identification.',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0).max(999),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'shortDescription', status: 'status', order: 'displayOrder' },
    prepare: ({ title, subtitle, status, order }) => ({
      title: typeof order === 'number' ? `${title} · #${order}` : title,
      subtitle: `${status ?? '—'} · ${subtitle ?? ''}`,
    }),
  },
})