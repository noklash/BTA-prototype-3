/**
 * Membership inquiry validation.
 *
 * Shared by the browser form (`src/components/membership-form.tsx`) and the
 * route handler (`src/app/api/membership-inquiry/route.ts`) so that both sides
 * enforce exactly the same rules. Client-side validation is a convenience;
 * the server-side call is the one that actually matters, and it never trusts
 * the payload shape.
 */

export interface MembershipInquiryInput {
  name: string
  email: string
  message: string
}

export type MembershipInquiryField = keyof MembershipInquiryInput

export type MembershipInquiryErrors = Partial<Record<MembershipInquiryField, string>>

export const MEMBERSHIP_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 180 },
  message: { min: 10, max: 1200 },
} as const

/**
 * Pragmatic email check: one `@`, no whitespace, a dot in the domain, and no
 * leading/trailing dot in either part. Deliberately not an RFC 5322 parser —
 * the address is only ever used by a human to reply.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/

const ASCII_CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/

export function normaliseInquiryInput(input: Partial<MembershipInquiryInput>): MembershipInquiryInput {
  return {
    name: typeof input.name === 'string' ? input.name.trim() : '',
    email: typeof input.email === 'string' ? input.email.trim() : '',
    message: typeof input.message === 'string' ? input.message.trim() : '',
  }
}

/**
 * Validates an inquiry. Returns the normalised values on success so callers do
 * not have to re-trim.
 */
export function validateMembershipInquiry(
  input: Partial<MembershipInquiryInput>,
): { success: true; data: MembershipInquiryInput } | { success: false; errors: MembershipInquiryErrors } {
  const data = normaliseInquiryInput(input)
  const errors: MembershipInquiryErrors = {}

  if (!data.name) {
    errors.name = 'Please tell us your name.'
  } else if (data.name.length < MEMBERSHIP_LIMITS.name.min) {
    errors.name = `Please enter at least ${MEMBERSHIP_LIMITS.name.min} characters.`
  } else if (data.name.length > MEMBERSHIP_LIMITS.name.max) {
    errors.name = `Please keep your name under ${MEMBERSHIP_LIMITS.name.max} characters.`
  }

  if (!data.email) {
    errors.email = 'Please enter an email address so we can reply.'
  } else if (data.email.length > MEMBERSHIP_LIMITS.email.max) {
    errors.email = `Please keep your email under ${MEMBERSHIP_LIMITS.email.max} characters.`
  } else if (!EMAIL_PATTERN.test(data.email)) {
    errors.email = 'That does not look like a valid email address.'
  }

  if (!data.message) {
    errors.message = 'Please tell us a little about your interest.'
  } else if (data.message.length < MEMBERSHIP_LIMITS.message.min) {
    errors.message = `Please write at least ${MEMBERSHIP_LIMITS.message.min} characters.`
  } else if (data.message.length > MEMBERSHIP_LIMITS.message.max) {
    errors.message = `Please keep your message under ${MEMBERSHIP_LIMITS.message.max} characters.`
  } else if (ASCII_CONTROL_CHARACTERS.test(data.message)) {
    errors.message = 'Please remove any control characters from your message.'
  }

  return Object.keys(errors).length > 0 ? { success: false, errors } : { success: true, data }
}

/* ---------------------------------------------------------------------------
 * Wire format for POST /api/membership-inquiry
 *
 * The endpoint validates a submission and reports the outcome, but it does not
 * store or forward anything: there is no database and no mail provider in this
 * project. `demonstration: true` is part of the contract so that neither the UI
 * nor an API consumer can mistake the response for a delivered message.
 * ------------------------------------------------------------------------- */

export interface MembershipInquirySuccessResponse {
  ok: true
  demonstration: true
  message: string
}

export interface MembershipInquiryErrorResponse {
  ok: false
  message: string
  errors?: MembershipInquiryErrors
}

export type MembershipInquiryResponse =
  | MembershipInquirySuccessResponse
  | MembershipInquiryErrorResponse

export const MEMBERSHIP_DEMONSTRATION_SUCCESS_MESSAGE =
  'Your details passed validation. This is a demonstration form: nothing was stored and no email was sent.'

export const MEMBERSHIP_DEMONSTRATION_UNAVAILABLE_MESSAGE =
  'This is a demonstration form. The submission endpoint is implemented, but no storage or email delivery is configured.'
