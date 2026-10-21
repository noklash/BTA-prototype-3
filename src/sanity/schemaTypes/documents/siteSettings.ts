import { defineArrayMember, defineField, defineType } from 'sanity'
import { SettingsIcon } from '../../icons'

/**
 * Singleton document: global identity, contact details, navigation and footer content.
 *
 * Pinned to the document id `siteSettings` by the Studio structure, so an
 * editor can never accidentally create a second one.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: SettingsIcon,
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'navigation', title: 'Navigation' },
    { name: 'contact', title: 'Contact' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Organization name',
      type: 'string',
      group: 'identity',
      description: 'Shown in the site header, the footer and browser tab titles.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'shortName',
      title: 'Short name (logo)',
      type: 'string',
      group: 'identity',
      description: 'The abbreviated name shown in the logo (e.g. "BTA").',
      validation: (rule) => rule.required().max(10),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'identity',
      description: 'A short line that sits under the organization name (utility bar).',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'imageWithAlt',
      group: 'identity',
      description: 'Optional. A wide or square mark works best; it is shown at 40px high.',
    }),
    defineField({
      name: 'navItems',
      title: 'Main navigation',
      type: 'array',
      group: 'navigation',
      description: 'The primary navigation links in the header. Order determines display order.',
      of: [defineArrayMember({ type: 'navItem' })],
      validation: (rule) => rule.min(1).max(12),
    }),
    defineField({
      name: 'utilityLink',
      title: 'Utility link (right side of top bar)',
      type: 'object',
      group: 'navigation',
      description: 'Optional link in the top utility bar (e.g. Members Login). Omitted for demo.',
      fields: [
        defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.max(40) }),
        defineField({ name: 'href', title: 'Href', type: 'string', validation: (rule) => rule.regex(/^\/.*$/) }),
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact phone',
      type: 'string',
      group: 'contact',
      description: 'Optional.',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 3,
      group: 'contact',
      description: 'Optional. Line breaks are preserved on the website.',
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: 'footerText',
      title: 'Footer text',
      type: 'text',
      rows: 3,
      group: 'footer',
      description: 'A short closing note shown in the site footer.',
      validation: (rule) => rule.required().max(400),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'array',
      group: 'footer',
      description: 'Optional. Displayed in the footer in the order listed here.',
      of: [defineArrayMember({ type: 'socialLink' })],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'tagline' },
  },
})
