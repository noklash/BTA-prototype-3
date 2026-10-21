import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '../../icons'

/** The value used by the public queries to identify events that may be shown. */
export const EVENT_STATUS_PUBLISHED = 'published'

/** The default status of a new event, so nothing goes live by accident. */
export const EVENT_STATUS_DRAFT = 'draft'

/** Event categories matching the prototype's event list categories. */
export const EVENT_CATEGORIES = [
  { title: 'Knowledge', value: 'knowledge' },
  { title: 'Members', value: 'members' },
  { title: 'Heritage', value: 'heritage' },
  { title: 'Our People', value: 'our-people' },
]

/**
 * A community event.
 *
 * Two independent things control visibility:
 *  1. Sanity's own draft/publish workflow (`drafts.*` documents), which is a
 *     content editor's working state.
 *  2. The `status` field below, which is part of the document itself and lets an
 *     editor keep a finished event hidden from the website (for example while
 *     the date is still being confirmed).
 *
 * Public queries require `status == "published"` *and* that the document itself
 * is published, so an event must satisfy both.
 */
export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used in the event URL, for example /events/summer-fete.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'One or two sentences shown in event lists.',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'fullDescription',
      title: 'Full description',
      type: 'richText',
      description: 'Shown on the event page. Headings, lists and links are supported.',
    }),
    defineField({
      name: 'startDateTime',
      title: 'Start date and time',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'For example: The Old Library Hall, 12 Market Street.',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Displayed as a small tag in the event list (e.g. Knowledge, Members, Heritage, Our People).',
      options: {
        layout: 'radio',
        list: EVENT_CATEGORIES,
      },
      initialValue: 'knowledge',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'imageWithAlt',
      description: 'Optional.',
    }),
    defineField({
      name: 'status',
      title: 'Publication status',
      type: 'string',
      description:
        'Choose "Published" to show this event on the website. "Draft" keeps it hidden even after the document itself is published.',
      options: {
        layout: 'radio',
        list: [
          { title: 'Draft — hidden from the website', value: EVENT_STATUS_DRAFT },
          { title: 'Published — visible on the website', value: EVENT_STATUS_PUBLISHED },
        ],
      },
      initialValue: EVENT_STATUS_DRAFT,
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Start date, soonest first',
      name: 'startAsc',
      by: [{ field: 'startDateTime', direction: 'asc' }],
    },
    {
      title: 'Start date, most recent first',
      name: 'startDesc',
      by: [{ field: 'startDateTime', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'startDateTime',
      location: 'location',
      category: 'category',
      status: 'status',
      media: 'coverImage',
    },
    prepare: ({ title, subtitle, location, category, status, media }) => {
      const parts = [typeof subtitle === 'string' ? subtitle : undefined, location, category, status]
        .filter((part): part is string => typeof part === 'string' && part.length > 0)
        .join(' · ')

      return {
        title: title ?? 'Untitled event',
        subtitle: parts,
        media,
      }
    },
  },
})
