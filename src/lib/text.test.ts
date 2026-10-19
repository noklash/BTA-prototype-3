import { describe, expect, it } from 'vitest'

import { getInitials } from './text'

describe('getInitials', () => {
  it('skips leading articles', () => {
    expect(getInitials('The Heritage Circle')).toBe('HC')
  })

  it('uses the first letters of up to two significant words', () => {
    expect(getInitials('Market Street Preservation Society')).toBe('MS')
  })

  it('honours maxLetters', () => {
    expect(getInitials('Market Street Preservation Society', 3)).toBe('MSP')
  })

  it('falls back to every word when all of them are insignificant', () => {
    expect(getInitials('the and')).toBe('TA')
  })

  it('handles a single word', () => {
    expect(getInitials('Archive')).toBe('A')
  })

  it('collapses extra whitespace', () => {
    expect(getInitials('  The   Heritage    Circle  ')).toBe('HC')
  })

  it('returns a placeholder for empty input', () => {
    expect(getInitials('')).toBe('?')
    expect(getInitials('   ')).toBe('?')
  })
})
