import { defineField, defineType } from 'sanity'

import { validateInternalOrExternalLink } from '../shared/validators'

/**
 * A reusable call-to-action block. Currently used by the home page membership
 * call to action; defined as an object type so it can be reused elsewhere
 * without duplicating field definitions.
 */
export const callToAction = defineType({
  name: 'callToAction',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'Find out more',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'buttonHref',
      title: 'Button link',
      type: 'string',
      description: 'A site path such as /membership, or a full https:// URL.',
      validation: (rule) => rule.required().custom(validateInternalOrExternalLink),
    }),
  ],
})
