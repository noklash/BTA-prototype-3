import { describe, expect, it } from 'vitest'

import { demoReference, formatDemoDate, initials, progressPercent } from '@/lib/demo/format'
import {
  compactErrors,
  isBlank,
  minLength,
  required,
  validAmount,
  validEmail,
} from '@/lib/demo/validate'

describe('demonstration formatting', () => {
  it('formats and clamps progress percentages', () => {
    expect(progressPercent(0, 100)).toBe(0)
    expect(progressPercent(50, 100)).toBe(50)
    expect(progressPercent(150, 100)).toBe(100)
    expect(progressPercent(-10, 100)).toBe(0)
    expect(progressPercent(10, 0)).toBe(0)
  })

  it('builds stable references', () => {
    expect(demoReference('TXN', 1)).toBe('TXN-0001')
    expect(demoReference('RCP', 42)).toBe('RCP-0042')
  })

  it('derives initials from a name', () => {
    expect(initials('Ada Nwosu')).toBe('AN')
    expect(initials('  Ada   Nwosu  ')).toBe('AN')
    expect(initials('Ada')).toBe('A')
    expect(initials('')).toBe('')
  })

  it('formats ISO dates and leaves invalid input unchanged', () => {
    expect(formatDemoDate('2026-03-14')).toContain('2026')
    expect(formatDemoDate('not-a-date')).toBe('not-a-date')
  })
})

describe('demonstration validation', () => {
  it('treats whitespace as blank', () => {
    expect(isBlank('   ')).toBe(true)
    expect(isBlank('value')).toBe(false)
    expect(required('  ', 'Name')).toBe('Name is required.')
    expect(required('Ada', 'Name')).toBeUndefined()
  })

  it('enforces a minimum length after trimming', () => {
    expect(minLength('  ab  ', 3, 'Message')).toBe('Message must be at least 3 characters.')
    expect(minLength('  abc  ', 3, 'Message')).toBeUndefined()
  })

  it('accepts ordinary addresses and rejects malformed ones', () => {
    expect(validEmail('ada.nwosu@example.org')).toBeUndefined()
    expect(validEmail('ada@example')).toContain('valid email')
    expect(validEmail('ada example.org')).toContain('valid email')
    expect(validEmail('   ')).toBe('An email address is required.')
  })

  it('accepts positive amounts inside the demonstration ceiling', () => {
    expect(validAmount('5000')).toBeUndefined()
    expect(validAmount('0')).toContain('greater than zero')
    expect(validAmount('-1')).toContain('greater than zero')
    expect(validAmount('abc')).toContain('greater than zero')
    expect(validAmount('100000001')).toContain('below')
  })

  it('removes undefined entries from an error map', () => {
    expect(compactErrors({ name: undefined, email: 'Required' })).toEqual({ email: 'Required' })
    expect(compactErrors({})).toEqual({})
  })
})
