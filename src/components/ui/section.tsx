import type { ReactNode } from 'react'

/**
 * A page section with the design system's vertical rhythm: a `.section`
 * wrapper around a centred `.shell`.
 *
 * Background treatments are section-specific classes passed through
 * `className` (`model` for the mist band, `editorial` for the numbered
 * articles, and so on) rather than tone props, because each band in the
 * design system owns its own colours.
 */
export function Section({
  children,
  id,
  className = '',
}: {
  children: ReactNode
  id?: string
  className?: string
}) {
  return (
    <section id={id} className={`section ${className}`.trim()}>
      <div className="shell">{children}</div>
    </section>
  )
}

/**
 * The recurring "eyebrow + serif heading + optional introduction" block.
 *
 * `light` switches the block to the inverted treatment used on dark bands.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = 'h2',
  light = false,
}: {
  eyebrow?: string
  title: string
  description?: ReactNode
  as?: 'h1' | 'h2'
  light?: boolean
}) {
  return (
    <div className={light ? 'section-head light' : 'section-head'}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <Heading>{title}</Heading>
      {description ? <p>{description}</p> : null}
    </div>
  )
}
