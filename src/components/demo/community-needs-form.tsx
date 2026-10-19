'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'

import type { FormField } from '@/types/content'
import { useDemo } from '@/lib/demo/store'

import { FormFeedback, TextAreaField, TextField } from './form-field'

/**
 * The community-needs register.
 *
 * The fields are editorial: they come from the `communityNeeds` Sanity
 * document, so the committee can change the questions without a code change.
 * This component adds the missing behaviour the prototype lacked — validation
 * and submission — and records the entry in the local demonstration store as a
 * project proposal, where it appears in the admin feedback queue.
 */
export function CommunityNeedsForm({
  fields,
  submitLabel,
}: {
  fields: FormField[]
  submitLabel: string
}) {
  const { submitFeedback } = useDemo()
  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: Record<string, string> = {}
    for (const field of fields) {
      if (field.required && !values[field.name]?.trim()) {
        nextErrors[field.name] = 'This field is required.'
      }
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setMessage(null)
      return
    }

    const submittedBy =
      values.name?.trim() || values.fullName?.trim() || values.email?.trim() || 'Anonymous'
    const summary = fields
      .map((field) => `${field.label}: ${values[field.name]?.trim() || '—'}`)
      .join('\n')

    submitFeedback({
      kind: 'Project proposal',
      subject: 'Community needs register',
      message: summary,
      submittedBy,
    })

    setValues({})
    setMessage(
      'Thank you. Your entry has been recorded for committee review in this demonstration. It is not sent to a live service.',
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {fields.map((field) => {
        const id = `needs-${field.name}`
        const shared = {
          id,
          name: field.name,
          label: field.label,
          value: values[field.name] ?? '',
          error: errors[field.name],
          required: field.required,
          onChange: handleChange,
          wide: field.wide,
        }

        return field.type === 'textarea' ? (
          <TextAreaField key={field._key ?? field.name} {...shared} />
        ) : (
          <TextField key={field._key ?? field.name} {...shared} type={field.type} />
        )
      })}

      <div className="wide cta-row">
        <button type="submit" className="btn primary">
          {submitLabel}
        </button>
      </div>

      <FormFeedback message={message} />
    </form>
  )
}
