import { defineArrayMember, defineField, defineType } from 'sanity'

import { MAX_WHAT_TO_EXPECT } from '../../shared/limits'

/**
 * Types of detail pages, matching the prototype's Detail component.
 */
export const DETAIL_TYPES = [
  { title: 'Forum', value: 'forum' },
  { title: 'Project', value: 'project' },
  { title: 'Event', value: 'event' },
  { title: 'Article', value: 'article' },
  { title: 'Oral History', value: 'oral' },
  { title: 'Centre', value: 'centre' },
]

/**
 * Status values for the "At a glance" badge.
 */
export const DETAIL_STATUSES = [
  { title: 'Active', value: 'ACTIVE' },
  { title: 'Launching', value: 'LAUNCHING' },
  { title: 'Planned', value: 'PLANNED' },
  { title: 'Vision 2035', value: 'VISION_2035' },
]

/**
 * A detail page: page hero + about section + what to expect + at a glance + CTA.
 *
 * Each type maps to a route:
 *  - forum   → /knowledge/forum
 *  - project → /community-impact/school-rehabilitation
 *  - event   → /events/knowledge-forum
 *  - article → /news/community-education
 *  - oral    → /heritage/oral-history
 *  - centre  → /blue-economy/centre
 */
export const detailPage = defineType({
  name: 'detailPage',
  title: 'Detail page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Page Hero', default: true },
    { name: 'about', title: 'About this Initiative' },
    { name: 'expect', title: 'What to Expect' },
    { name: 'glance', title: 'At a Glance' },
    { name: 'cta', title: 'Call to Action' },
  ],
  fields: [
    defineField({
      name: 'type',
      title: 'Page type',
      type: 'string',
      group: 'hero',
      description: 'Determines the route and which status variant is shown.',
      options: {
        layout: 'radio',
        list: DETAIL_TYPES,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'hero',
      description: 'The final URL segment (e.g. "knowledge-forum"). The parent route is determined by the type.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
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
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (rule) => rule.required().max(120),
        }),
        defineField({
          name: 'intro',
          title: 'Intro text',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required().max(400),
        }),
        defineField({
          name: 'image',
          title: 'Hero image',
          type: 'imageWithAlt',
          description: 'Optional. Only some types display an image.',
        }),
      ],
    }),
    defineField({
      name: 'about',
      title: 'About this initiative',
      type: 'object',
      group: 'about',
      fields: [
        defineField({
          name: 'lead',
          title: 'Lead paragraph',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required().max(500),
        }),
        defineField({
          name: 'body',
          title: 'Body text',
          type: 'richText',
          description: 'Full description with headings, lists, links.',
        }),
      ],
    }),
    defineField({
      name: 'whatToExpect',
      title: 'What to expect',
      type: 'array',
      group: 'expect',
      description: `Up to ${MAX_WHAT_TO_EXPECT} items shown as a bulleted list.`,
      of: [defineArrayMember({ type: 'detailExpectation' })],
      validation: (rule) => rule.max(MAX_WHAT_TO_EXPECT),
    }),
    defineField({
      name: 'atAGlance',
      title: 'At a glance',
      type: 'object',
      group: 'glance',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'For example: "Knowledge Forum" or "School Rehabilitation".',
          validation: (rule) => rule.required().max(80),
        }),
        defineField({
          name: 'status',
          title: 'Status badge',
          type: 'string',
          options: {
            layout: 'radio',
            list: DETAIL_STATUSES,
          },
          initialValue: 'ACTIVE',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Call to action',
      type: 'callToAction',
      group: 'cta',
      description: 'Button linking to /join (Express interest).',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { type: 'type', title: 'pageHero.title', slug: 'slug.current', media: 'pageHero.image' },
    prepare: ({ type, title, slug, media }) => ({
      title: title ?? `Detail page (${type})`,
      subtitle: slug ? `/${type}/${slug}` : 'No slug',
      media,
    }),
  },
})