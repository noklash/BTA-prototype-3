import { describe, expect, it } from 'vitest'

import {
  MEMBERSHIP_LIMITS,
  normaliseInquiryInput,
  validateMembershipInquiry,
} from './membership'

const VALID = {
  name: 'Ada Lovelace',
  email: 'ada@example.org',
  message: 'I would like to join the association, please.',
}

describe('normaliseInquiryInput', () => {
  it('trims every field', () => {
    expect(normaliseInquiryInput({ name: '  Ada  ', email: ' a@b.co ', message: ' hi ' })).toEqual({
      name: 'Ada',
      email: 'a@b.co',
      message: 'hi',
    })
  })

  it('replaces non-string values with empty strings', () => {
    expect(normaliseInquiryInput({})).toEqual({ name: '', email: '', message: '' })
    expect(
      normaliseInquiryInput({ name: 42 as unknown as string, email: null as unknown as string }),
    ).toEqual({ name: '', email: '', message: '' })
  })
})

describe('validateMembershipInquiry', () => {
  it('accepts a valid inquiry and returns the normalised data', () => {
    const result = validateMembershipInquiry({ ...VALID, name: '  Ada Lovelace ' })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Ada Lovelace')
      expect(result.data.email).toBe(VALID.email)
    }
  })

  it('reports every invalid field at once', () => {
    const result = validateMembershipInquiry({ name: 'A', email: 'not-an-email', message: 'short' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(Object.keys(result.errors).sort()).toEqual(['email', 'message', 'name'])
    }
  })

  it.each([
    ['missing name', { ...VALID, name: '' }],
    ['missing email', { ...VALID, email: '' }],
    ['missing message', { ...VALID, message: '' }],
  ])('rejects a %s', (_label, input) => {
    expect(validateMembershipInquiry(input).success).toBe(false)
  })

  it.each([
    'plainaddress',
    'no-at-sign.example.com',
    'two@@example.com',
    'user@localhost',
    'trailing@dot.',
    'spaces in@example.com',
  ])('rejects the invalid email %s', (email) => {
    const result = validateMembershipInquiry({ ...VALID, email })
    expect(result.success).toBe(false)
  })

  it.each(['a@b.co', 'first.last+tag@sub.example.org', 'user_name@example.co.uk'])(
    'accepts the email %s',
    (email) => {
      expect(validateMembershipInquiry({ ...VALID, email }).success).toBe(true)
    },
  )

  it('enforces the maximum length of each field', () => {
    const result = validateMembershipInquiry({
      ...VALID,
      name: 'a'.repeat(MEMBERSHIP_LIMITS.name.max + 1),
      email: `${'a'.repeat(MEMBERSHIP_LIMITS.email.max)}@example.org`,
      message: 'a'.repeat(MEMBERSHIP_LIMITS.message.max + 1),
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors.name).toContain('under')
      expect(result.errors.email).toContain('under')
      expect(result.errors.message).toContain('under')
    }
  })

  it('rejects control characters in the message', () => {
    const result = validateMembershipInquiry({ ...VALID, message: `hello\u0007 world` })
    expect(result.success).toBe(false)
  })

  it('does not treat trailing newlines as control characters', () => {
    const result = validateMembershipInquiry({
      ...VALID,
      message: 'A line of text.\nAnd another line of text.',
    })
    expect(result.success).toBe(true)
  })
})
