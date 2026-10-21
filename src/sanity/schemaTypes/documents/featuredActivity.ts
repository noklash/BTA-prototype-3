import { defineField, defineType } from 'sanity'
import { MarkIcon } from '../../icons'

/**
 * A community initiative highlighted on the home page and reusable elsewhere.
 */
export const featuredActivity = defineType({
  name: 'featuredActivity',
  title: 'Featured activity',
  type: 'document',
  icon: MarkIcon,
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
      description: 'Used in links to this activity. Generate it from the title.',
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
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      description: 'Optional.',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first. Activities are sorted by this value.',
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0).max(999),
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'shortDescription', media: 'image', order: 'displayOrder' },
    prepare: ({ title, subtitle, media, order }) => ({
      title: typeof order === 'number' ? `${title} · #${order}` : title,
      subtitle,
      media,
    }),
  },
})
