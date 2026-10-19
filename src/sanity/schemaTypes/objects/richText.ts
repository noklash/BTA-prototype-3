import { defineArrayMember, defineField, defineType } from 'sanity'

import { validateRichTextHref } from '../shared/validators'

/**
 * Shared rich text definition.
 *
 * The style and mark set is deliberately small: a heritage association needs
 * headings, lists, links and emphasis, not a full word processor. Keeping the
 * set small also keeps the renderer in `src/components/portable-text.tsx`
 * small, because every style and mark must be handled explicitly there.
 */
export const richText = defineType({
  name: 'richText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Paragraph', value: 'normal' },
        { title: 'Heading', value: 'h3' },
        { title: 'Subheading', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bulleted list', value: 'bullet' },
        { title: 'Numbered list', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) => rule.required().custom(validateRichTextHref),
              }),
              defineField({
                name: 'openInNewTab',
                title: 'Open in a new tab',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          }),
        ],
      },
    }),
  ],
})
