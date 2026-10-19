'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { NavItem } from './nav'

/**
 * Desktop navigation with the design system's active underline.
 *
 * Navigation items come from `siteSettings.navItems` (passed by the header).
 * When the CMS is unreachable the fallback navigation is used. Only the
 * current-route marking needs the client.
 */
export function PrimaryNav({ navItems }: { navItems: readonly NavItem[] | null }) {
  const pathname = usePathname()
  const items = navItems ?? []

  return (
    <nav aria-label="Primary">
      {items.map((item) => {
        const isCurrent = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isCurrent ? 'page' : undefined}
            className={isCurrent ? 'active' : undefined}
          >
            {item.label}
            {item.hasChevron ? <span className="chevron" aria-hidden="true">▾</span> : null}
          </Link>
        )
      })}
    </nav>
  )
}