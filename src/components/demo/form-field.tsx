import type { ChangeEvent, ReactNode } from 'react'

/**
 * Field primitives for the Prototype 3 forms.
 *
 * They render the same label-above-input pattern as the existing membership
 * form, including the shared `.field-error` message, so every new form matches
 * the site's established form styling.
 */

interface FieldBase {
  id: string
  name: string
  label: string
  value: string
  error?: string
  required?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  hint?: string
  autoComplete?: string
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null
  }
  return (
    <p id={id} className="field-error">
      {message}
    </p>
  )
}

export function TextField({
  id,
  name,
  label,
  value,
  error,
  required,
  onChange,
  hint,
  type = 'text',
  autoComplete,
  wide = false,
}: FieldBase & { type?: 'text' | 'email' | 'tel' | 'url' | 'date'; wide?: boolean }) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

  return (
    <label htmlFor={id} className={wide ? 'wide' : undefined}>
      <span>{label}</span>
      {hint ? (
        <small id={hintId} className="form-hint">
          {hint}
        </small>
      ) : null}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
      />
      <FieldError id={errorId} message={error} />
    </label>
  )
}

export function TextAreaField({
  id,
  name,
  label,
  value,
  error,
  required,
  onChange,
  hint,
  rows = 5,
  wide = true,
}: FieldBase & { rows?: number; wide?: boolean }) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ')

  return (
    <div className={wide ? 'wide' : undefined}>
      <label htmlFor={id}>
        <span>{label}</span>
      </label>
      {hint ? (
        <p id={hintId} className="form-hint">
          {hint}
        </p>
      ) : null}
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
      />
      <FieldError id={errorId} message={error} />
    </div>
  )
}

export function SelectField({
  id,
  name,
  label,
  value,
  error,
  onChange,
  options,
  wide = false,
}: {
  id: string
  name: string
  label: string
  value: string
  error?: string
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  options: readonly { value: string; label: string }[]
  wide?: boolean
}) {
  const errorId = `${id}-error`
  return (
    <label htmlFor={id} className={wide ? 'wide' : undefined}>
      <span>{label}</span>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError id={errorId} message={error} />
    </label>
  )
}

export function CheckboxField({
  id,
  name,
  label,
  checked,
  onChange,
}: {
  id: string
  name: string
  label: string
  checked: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label htmlFor={id} className="check-field wide">
      <input id={id} name={name} type="checkbox" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  )
}

/** Success/error confirmation strip with the shared `.form-feedback` styling. */
export function FormFeedback({ message, tone = 'success' }: { message: string | null; tone?: 'success' | 'error' }) {
  if (!message) {
    return null
  }
  return (
    <p role={tone === 'success' ? 'status' : 'alert'} data-tone={tone} className="form-feedback wide">
      {message}
    </p>
  )
}

export function FormShell({ children }: { children: ReactNode }) {
  return <div className="wide">{children}</div>
}

/** A small label that spans the whole form grid. */
export function FieldSetLabel({ children }: { children: ReactNode }) {
  return <p className="fieldset-label">{children}</p>
}
