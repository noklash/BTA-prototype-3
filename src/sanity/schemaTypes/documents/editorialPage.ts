import { defineArrayMember, defineField, defineType } from 'sanity'

import { MAX_EDITORIAL_ARTICLES } from '../../shared/limits'

/**
 * Kinds of editorial pages, matching the prototype's Editorial component.
 */
export const EDITORIAL_KINDS = [
  { title: 'About BTA', value: 'about' },
  { title: 'Our People', value: 'people' },
  { title: 'Knowledge', value: 'knowledge' },
  { title: 'Enterprise', value: 'enterprise' },
  { title: 'Community Impact', value: 'community' },
  { title: 'Blue Economy', value: 'blue' },
  { title: 'Heritage', value: 'heritage' },
  { title: 'Partners', value: 'partners' },
]

/**
 * A content page using the Editorial layout: page hero + note + articles + CTA.
 *
 * Each kind maps to a route:
 *  - about        → /about
 *  - people       → /our-people
 *  - knowledge    → /knowledge
 *  - enterprise   → /enterprise
 *  - community    → /community-impact
 *  - blue         → /blue-economy
 *  - heritage     → /heritage
 *  - partners     → /partner
 */
export const editorialPage = defineType({
  name: 'editorialPage',
  title: 'Editorial page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Page Hero', default: true },
    { name: 'content', title: 'Articles' },
    { name: 'cta', title: 'Call to Action' },
  ],
  fields: [
    defineField({
      name: 'kind',
      title: 'Page kind',
      type: 'string',
      group: 'hero',
      description: 'Determines the route and which CTA variant is used.',
      options: {
        layout: 'radio',
        list: EDITORIAL_KINDS,
      },
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
          description: 'Optional. Only some kinds display an image.',
        }),
      ],
    }),
    defineField({
      name: 'articles',
      title: 'Articles',
      type: 'array',
      group: 'content',
      description: `Up to ${MAX_EDITORIAL_ARTICLES} numbered articles.`,
      of: [defineArrayMember({ type: 'editorialArticle' })],
      validation: (rule) => rule.max(MAX_EDITORIAL_ARTICLES),
    }),
    defineField({
      name: 'cta',
      title: 'Call to action',
      type: 'callToAction',
      group: 'cta',
      description: 'The CTA button at the end of the article list. The kind determines the default label/destination, but editors can override.',
    }),
  ],
  preview: {
    select: { kind: 'kind', title: 'pageHero.title', media: 'pageHero.image' },
    prepare: ({ kind, title, media }) => ({
      title: title ?? `Editorial page (${kind})`,
      subtitle: kind ? `Kind: ${kind}` : 'No kind selected',
      media,
    }),
  },
})