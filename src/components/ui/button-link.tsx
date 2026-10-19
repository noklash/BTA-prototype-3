import Link from 'next/link'
import type { ComponentProps } from 'react'

import { ArrowRightIcon } from './icons'

type Variant = 'primary' | 'gold' | 'outline' | 'text'

/**
 * A link styled as a button, using the design system's `.btn` classes.
 *
 * `primary` is the default deep-blue button; `gold` is used for the single
 * most important action on a page; `outline` draws the border in the current
 * text colour so it works on both light and gold backgrounds; `text` is the
 * underlined "read more" link.
 */
export function ButtonLink({
  href,
  variant = 'primary',
  children,
  className = '',
  ...rest
}: {
  href: string
  variant?: Variant
  children: React.ReactNode
  className?: string
} & Omit<ComponentProps<typeof Link>, 'href' | 'className'>) {
  const classes = `btn ${variant} ${className}`.trim()
  const content = (
    <>
      {children}
      <ArrowRightIcon size={14} />
    </>
  )

  // Renders a plain `<a>` when the target leaves the site so that
  // `rel`/`target` are applied correctly, and a Next.js `<Link>` internally.
  if (/^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith('mailto:')) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  )
}
