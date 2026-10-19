'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export interface AppNavItem {
  href: string
  label: string
  /** When true, the item is only active on an exact path match (e.g. an index page). */
  exact?: boolean
}

/**
 * The internal layout used by the members' portal and the admin area.
 *
 * It keeps the public site's header and footer (rendered by the root layout)
 * and adds a side navigation appropriate to working inside the platform. Only
 * the active-link highlighting needs the browser, so this is the one client
 * component in the shell; each page renders its own heading inside `children`.
 */
export function AppFrame({
  label,
  nav,
  sideFoot,
  children,
}: {
  label: string
  nav: readonly AppNavItem[]
  sideFoot?: ReactNode
  children: ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="app">
      <aside className="app-side">
        <span className="side-title">{label}</span>

        <nav aria-label={label}>
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? 'active' : undefined}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {sideFoot ? <div className="side-foot">{sideFoot}</div> : null}
      </aside>

      <div className="app-main">{children}</div>
    </div>
  )
}
