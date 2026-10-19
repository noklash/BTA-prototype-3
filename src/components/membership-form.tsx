'use client'

import { useId, useState, type ChangeEvent, type FormEvent } from 'react'

import {
  MEMBERSHIP_LIMITS,
  validateMembershipInquiry,
  type MembershipInquiryErrors,
  type MembershipInquiryInput,
  type MembershipInquiryResponse,
} from '@/lib/validation/membership'

type Status = 'idle' | 'submitting' | 'succeeded' | 'failed'

const INITIAL_VALUES: MembershipInquiryInput = { name: '', email: '', message: '' }

/**
 * Membership inquiry form.
 *
 * Validation runs twice: locally before submitting (fast feedback) and again in
 * `POST /api/membership-inquiry`, which is the check that actually matters. The
 * result banner always states that nothing was stored or emailed — see
 * `src/lib/validation/membership.ts`.
 */
export function MembershipForm() {
  const uid = useId().replace(/[:]/g, '')
  const [values, setValues] = useState<MembershipInquiryInput>(INITIAL_VALUES)
  const [errors, setErrors] = useState<MembershipInquiryErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [feedback, setFeedback] = useState<string | null>(null)

  const ids = {
    form: `${uid}-membership-form`,
    name: `${uid}-name`,
    nameError: `${uid}-name-error`,
    email: `${uid}-email`,
    emailError: `${uid}-email-error`,
    message: `${uid}-message`,
    messageError: `${uid}-message-error`,
    messageHint: `${uid}-message-hint`,
    status: `${uid}-status`,
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const localValidation = validateMembershipInquiry(values)
    if (!localValidation.success) {
      setErrors(localValidation.errors)
      setStatus('failed')
      setFeedback('Please correct the highlighted fields and submit again.')
      return
    }

    setErrors({})
    setStatus('submitting')
    setFeedback(null)

    try {
      const response = await fetch('/api/membership-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localValidation.data),
      })

      const body = (await response.json().catch(() => null)) as MembershipInquiryResponse | null

      if (!response.ok || !body || body.ok === false) {
        setStatus('failed')
        setErrors(body && body.ok === false ? (body.errors ?? {}) : {})
        setFeedback(
          body && body.ok === false
            ? body.message
            : 'The inquiry could not be submitted. Please try again.',
        )
        return
      }

      setStatus('succeeded')
      setFeedback(body.message)
      setValues(INITIAL_VALUES)
    } catch {
      setStatus('failed')
      setFeedback(
        'The inquiry could not be submitted because the server was unreachable. Please check your connection and try again.',
      )
    }
  }

  const isSubmitting = status === 'submitting'

  return (
    <form id={ids.form} noValidate onSubmit={handleSubmit} aria-describedby={feedback ? ids.status : undefined}>
      <p className="form-note wide">
        <strong>Demonstration form.</strong> Submissions are validated in the browser and again by
        the server, but they are not stored or emailed anywhere. Unexpected content can therefore
        never be delivered to a real inbox.
      </p>

      <label htmlFor={ids.name}>
        <span>Your name</span>
        <input
          id={ids.name}
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          autoComplete="name"
          maxLength={MEMBERSHIP_LIMITS.name.max}
          required
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? ids.nameError : undefined}
        />
        <FieldError id={ids.nameError} message={errors.name} />
      </label>

      <label htmlFor={ids.email}>
        <span>Email address</span>
        <input
          id={ids.email}
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          autoComplete="email"
          maxLength={MEMBERSHIP_LIMITS.email.max}
          required
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? ids.emailError : undefined}
        />
        <FieldError id={ids.emailError} message={errors.email} />
      </label>

      <div className="wide">
        <label htmlFor={ids.message}>
          <span>Your message</span>
        </label>

        <p id={ids.messageHint} className="form-hint">
          Tell us a little about your interest in the organisation. Between{' '}
          {MEMBERSHIP_LIMITS.message.min} and {MEMBERSHIP_LIMITS.message.max} characters.
        </p>

        <textarea
          id={ids.message}
          name="message"
          rows={6}
          value={values.message}
          onChange={handleChange}
          maxLength={MEMBERSHIP_LIMITS.message.max}
          required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={
            errors.message ? `${ids.messageHint} ${ids.messageError}` : ids.messageHint
          }
        />
        <FieldError id={ids.messageError} message={errors.message} />
      </div>

      <div className="form-actions wide">
        <button type="submit" className="btn primary" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Express interest'}
        </button>
        <p className="form-hint">All three fields are required.</p>
      </div>

      <div id={ids.status} aria-live="polite" className="wide">
        {feedback ? (
          <p
            role={status === 'succeeded' ? 'status' : 'alert'}
            data-tone={status === 'succeeded' ? 'success' : 'error'}
            className="form-feedback"
          >
            {feedback}
          </p>
        ) : null}
      </div>
    </form>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null
  }

  return (
    <p id={id} className="field-error">
      {message}
    </p>
  )
}
