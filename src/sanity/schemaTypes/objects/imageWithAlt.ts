import { defineField, defineType } from 'sanity'

/**
 * Reusable image type with the alternative text that accessibility requires.
 *
 * Alt text is mandatory whenever an asset is actually uploaded, which is
 * enforced with a custom rule rather than `required()` so that an empty image
 * field does not block an editor from saving a draft.
 */
export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description:
        'Describe the image for people who cannot see it. Leave empty only if the image is purely decorative.',
      validation: (rule) =>
        rule.max(180).custom((value, context) => {
          const parent = context.parent as { asset?: unknown } | undefined
          const hasAsset = Boolean(parent?.asset)

          if (hasAsset && !value) {
            return 'Alternative text is required once an image has been uploaded.'
          }

          return true
        }),
    }),
  ],
})
