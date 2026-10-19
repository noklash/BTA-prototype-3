/**
 * Navigation items come from Sanity (`siteSettings.navItems`). This module
 * declares the shared item shape and a minimal fallback used when the CMS is
 * unreachable.
 */
export interface NavItem {
  href: string
  label: string
  hasChevron?: boolean
}

/** Fallback navigation when the CMS cannot be reached. */
export const FALLBACK_NAV: readonly NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About BTA' },
  { href: '/our-people', label: 'Our People' },
  { href: '/knowledge', label: 'Knowledge' },
  { href: '/enterprise', label: 'Enterprise' },
  { href: '/community-impact', label: 'Community Impact' },
  { href: '/blue-economy', label: 'Blue Economy' },
  { href: '/heritage', label: 'Heritage' },
  { href: '/projects', label: 'Projects' },
  { href: '/events', label: 'Events & Media' },
  { href: '/partner', label: 'Partner' },
]
