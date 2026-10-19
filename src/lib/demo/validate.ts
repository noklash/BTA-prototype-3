/**
 * Shared validation helpers for the Prototype 3 demonstration forms.
 *
 * These run in the browser only and exist to give fast, friendly feedback. They
 * are not a security boundary: nothing is sent to a server, so there is no
 * server-side re-validation to pair them with (unlike the membership inquiry,
 * which does post to a route handler).
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/

export function isBlank(value: string): boolean {
  return value.trim().length === 0
}

export function required(value: string, label: string): string | undefined {
  return isBlank(value) ? `${label} is required.` : undefined
}

export function minLength(value: string, length: number, label: string): string | undefined {
  return value.trim().length < length ? `${label} must be at least ${length} characters.` : undefined
}

export function validEmail(value: string): string | undefined {
  if (isBlank(value)) {
    return 'An email address is required.'
  }
  return EMAIL_PATTERN.test(value.trim()) ? undefined : 'That does not look like a valid email address.'
}

export function validAmount(value: string): string | undefined {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Enter an amount greater than zero.'
  }
  if (amount > 100_000_000) {
    return 'Enter an amount below ₦100,000,000.'
  }
  return undefined
}

/**
 * Removes `undefined` entries so callers can test `Object.keys(errors).length`.
 */
export function compactErrors<T extends string>(
  errors: Partial<Record<T, string | undefined>>,
): Partial<Record<T, string>> {
  const result: Partial<Record<T, string>> = {}
  for (const key of Object.keys(errors) as T[]) {
    const value = errors[key]
    if (value) {
      result[key] = value
    }
  }
  return result
}
