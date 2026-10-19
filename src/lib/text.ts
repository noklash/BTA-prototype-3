/**
 * Small, pure string helpers used by the presentation layer.
 */

/** Words that carry no meaning in an abbreviation. */
const INSIGNIFICANT_WORDS = new Set(['the', 'a', 'an', 'of', 'and', 'for', 'to', 'in', 'on'])

/**
 * Builds a short monogram from an organization name.
 * `"The Heritage Circle"` becomes `"HC"`; the leading article is skipped so the
 * mark is made of the meaningful words.
 */
export function getInitials(value: string, maxLetters = 2): string {
  const words = value
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0)

  if (words.length === 0) {
    return '?'
  }

  const significant = words.filter(
    (word) => !INSIGNIFICANT_WORDS.has(word.toLowerCase().replace(/[^a-z0-9]/gi, '')),
  )
  const chosen = significant.length > 0 ? significant : words

  return (
    chosen
      .slice(0, maxLetters)
      .map((word) => word.charAt(0).toUpperCase())
      .join('') || '?'
  )
}
