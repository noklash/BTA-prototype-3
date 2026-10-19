'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useState } from 'react'

import { ButtonLink } from './ui/button-link'
import { CloseIcon, MenuIcon } from './ui/icons'
import type { NavItem } from './nav'

/**
 * Small-screen navigation: the design system's full-height panel behind a
 * `.menu` toggle.
 *
 * Navigation items come from `siteSettings.navItems` (passed by the header).
 * The toggle is a real `<button>` with `aria-expanded`/`aria-controls`, the
 * panel stays in the DOM while collapsed (hidden by the `hidden` attribute, so
 * `aria-controls` always points at a real element), and the menu closes on
 * navigation and on Escape. It is an inline disclosure rather than a modal, so
 * there is no focus trap.
 */
export function MobileNav({ navItems }: { navItems: readonly NavItem[] | null }) {
  const pathname = usePathname()
  const panelId = useId()
  const items = navItems ?? []

  /**
   * The menu is only open for the route it was opened on. Deriving open state
   * from the current pathname means a navigation closes the menu as part of the
   * render, instead of an effect that would set state and cause a second render.
   */
  const [openedForPathname, setOpenedForPathname] = useState<string | null>(null)
  const isOpen = openedForPathname === pathname

  function toggleMenu() {
    setOpenedForPathname((current) => (current === pathname ? null : pathname))
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenedForPathname(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="menu"
      >
        {isOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      <div id={panelId} className="mobile-nav" hidden={!isOpen}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href) ? 'page' : undefined}
            onClick={() => setOpenedForPathname(null)}
          >
            {item.label}
          </Link>
        ))}

        <ButtonLink
          href="/membership"
          variant="gold"
          onClick={() => setOpenedForPathname(null)}
        >
          Join BTA
        </ButtonLink>

        <ButtonLink
          href="/portal"
          variant="outline"
          onClick={() => setOpenedForPathname(null)}
        >
          Members Login
        </ButtonLink>
      </div>
    </>
  )
}