import { defineField, defineType } from 'sanity'

/**
 * A form field definition for the membership/support form.
 */
export const formField = defineType({
  name: 'formField',
  title: 'Form field',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Field name',
      type: 'string',
      description: 'Used as the input name attribute and for validation.',
      validation: (rule) => rule.required().max(40).regex(/^[a-z]+$/),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'type',
      title: 'Input type',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Text', value: 'text' },
          { title: 'Email', value: 'email' },
          { title: 'Tel', value: 'tel' },
          { title: 'Textarea', value: 'textarea' },
        ],
      },
      initialValue: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'wide',
      title: 'Full width',
      type: 'boolean',
      description: 'Spans both columns in the two-column form layout.',
      initialValue: false,
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'string',
      validation: (rule) => rule.max(100),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'type' },
  },
})