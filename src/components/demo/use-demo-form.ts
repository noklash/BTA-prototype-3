'use client'

import { useId, useState, type ChangeEvent, type FormEvent } from 'react'

export type FormErrors<Values> = Partial<Record<keyof Values, string>>

/**
 * A tiny form controller shared by the Prototype 3 demonstration forms.
 *
 * It owns the values, validation errors and the success message, and calls the
 * caller's `onValid` callback only after local validation passes. Because every
 * form is a browser-only demonstration, "submitting" means recording the entry
 * in the local demonstration store, never a network request.
 */
export function useDemoForm<Values extends Record<string, string>>(
  initial: Values,
  validate: (values: Values) => FormErrors<Values>,
) {
  const uid = useId().replace(/[:]/g, '')
  const [values, setValues] = useState<Values>(initial)
  const [errors, setErrors] = useState<FormErrors<Values>>({})
  const [message, setMessage] = useState<string | null>(null)

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = event.target
    const nextValue = type === 'checkbox' ? String((event.target as HTMLInputElement).checked) : value
    setValues((current) => ({ ...current, [name]: nextValue }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>, onValid: (values: Values) => string) {
    event.preventDefault()

    const nextErrors = validate(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setMessage(null)
      return
    }

    setErrors({})
    setMessage(onValid(values))
    setValues(initial)
  }

  function reset() {
    setValues(initial)
    setErrors({})
    setMessage(null)
  }

  return { uid, values, errors, message, handleChange, handleSubmit, reset, setValues }
}
