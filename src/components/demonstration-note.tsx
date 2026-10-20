import { PROTOTYPE_NOTE } from '@/lib/site'

/**
 * The note carried by every inner page, in the design system's `.note`
 * treatment.
 *
 * It sits directly under the page hero, exactly where the approved reference
 * prototype places its note, and states that the page's names, dates, figures
 * and documents are illustrative. The organisation-level statement appears once,
 * in the footer, so it is not repeated on every page.
 */
export function DemonstrationNote() {
  return (
    <div className="shell">
      <p className="note">{PROTOTYPE_NOTE}</p>
    </div>
  )
}
