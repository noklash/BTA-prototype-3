/**
 * Formatting helpers for the Prototype 3 demonstration data.
 *
 * Currency is presented in Nigerian naira because the organisation is fictional
 * but Nigerian in setting; the values themselves are illustrative. `Intl`
 * handles the grouping so amounts stay consistent everywhere they appear.
 */
const nairaFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
})

const compactNairaFormatter = new Intl.NumberFormat('en-NG', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatNaira(amount: number): string {
  return nairaFormatter.format(amount)
}

/** Compact form for stat tiles, for example `₦4.5M`. */
export function formatCompactNaira(amount: number): string {
  return `₦${compactNairaFormatter.format(amount)}`
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

/** Formats an ISO date (`YYYY-MM-DD`); returns the input unchanged if unparseable. */
export function formatDemoDate(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) {
    return iso
  }
  return dateFormatter.format(parsed)
}

/** A stable, readable identifier for demonstration records. */
export function demoReference(prefix: string, seed: number): string {
  return `${prefix}-${String(seed).padStart(4, '0')}`
}

/** Whole-number percentage of a target that has been raised, capped at 100. */
export function progressPercent(raised: number, target: number): number {
  if (target <= 0) {
    return 0
  }
  return Math.min(100, Math.max(0, Math.round((raised / target) * 100)))
}

/** Initials for avatar placeholders, for example "Ada Nwosu" -> "AN". */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}
