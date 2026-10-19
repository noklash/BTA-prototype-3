import { defineField, defineType } from 'sanity'

/**
 * A navigation item for the site header.
 */
export const navItem = defineType({
  name: 'navItem',
  title: 'Navigation item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'href',
      title: 'URL path',
      type: 'string',
      description: 'Must start with /. For example: /about',
      validation: (rule) => rule.required().regex(/^\/.*$/),
    }),
    defineField({
      name: 'hasChevron',
      title: 'Show chevron',
      type: 'boolean',
      description: 'Display a decorative chevron (no dropdown behaviour).',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
  },
})