import { DEMONSTRATION_NOTICE } from '@/lib/site'

/**
 * The honesty banner carried by every inner page, in the design system's
 * `.note` treatment: the site is a fictional association built as a portfolio
 * demonstration, and this states it above the content rather than only in the
 * footer.
 */
export function DemonstrationNote() {
  return (
    <div className="shell">
      <p className="note">{DEMONSTRATION_NOTICE}</p>
    </div>
  )
}
