'use client'

import { useState, type FormEvent } from 'react'

import { ArrowRightIcon } from './ui/icons'

/**
 * The footer's newsletter field.
 *
 * The reference prototype renders a labelled form that submits nowhere. This
 * version keeps the same appearance but validates the address and gives an
 * explicit demonstration response, so the button is never inert.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Enter a valid email address.')
      setMessage(null)
      return
    }

    setError(null)
    setMessage('Thank you. This demonstration records nothing and sends no email.')
    setEmail('')
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
      <label>
        <span className="sr-only">Email address</span>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setError(null)
          }}
          placeholder="Email address"
          autoComplete="email"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'newsletter-error' : undefined}
        />
        <button type="submit" aria-label="Subscribe to updates">
          <ArrowRightIcon size={18} />
        </button>
      </label>

      <small id="newsletter-error" role={error ? 'alert' : undefined} className={error ? 'newsletter-error' : undefined}>
        {error ?? message ?? 'Demonstration form — no data is submitted.'}
      </small>
    </form>
  )
}
