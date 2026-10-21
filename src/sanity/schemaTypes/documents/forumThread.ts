import { defineField, defineType } from 'sanity'

/**
 * Topics a forum thread can belong to. Kept small and stable so the index can
 * filter by them without a second taxonomy.
 */
export const FORUM_CATEGORIES = [
  { title: 'Knowledge & Ideas', value: 'Knowledge & Ideas' },
  { title: 'Enterprise & Investment', value: 'Enterprise & Investment' },
  { title: 'Technology', value: 'Technology' },
  { title: 'Health & Wellbeing', value: 'Health & Wellbeing' },
  { title: 'Aquaculture & Blue Economy', value: 'Aquaculture & Blue Economy' },
  { title: 'Leadership & Governance', value: 'Leadership & Governance' },
  { title: 'Heritage', value: 'Heritage' },
] as const

/**
 * A forum thread: an article shared by a member, with an image, that members
 * can discuss in comments and replies.
 *
 * The article itself is editorial content and lives in the CMS. The discussion
 * is member-generated and lives in the demonstration layer (see
 * `src/lib/demo`), so a thread can be published without any discussion.
 */
export const forumThread = defineType({
  name: 'forumThread',
  title: 'Forum thread',
  type: 'document',
  groups: [
    { name: 'article', title: 'Article', default: true },
    { name: 'meta', title: 'Details' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'article',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'article',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'article',
      description: 'Shown in the forum index under the title.',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'body',
      title: 'Article',
      type: 'richText',
      group: 'article',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Article image',
      type: 'imageWithAlt',
      group: 'article',
      description: 'Optional. The prototype image is used when no image is set.',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      group: 'meta',
      description: 'The member who wrote the article.',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'authorRole',
      title: 'Author role',
      type: 'string',
      group: 'meta',
      description: 'For example: "Treasurer" or "Committee member".',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'category',
      title: 'Topic',
      type: 'string',
      group: 'meta',
      options: {
        layout: 'radio',
        list: FORUM_CATEGORIES,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published',
      type: 'datetime',
      group: 'meta',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'author', media: 'image' },
  },
})
