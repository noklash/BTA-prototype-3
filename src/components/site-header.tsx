import Link from 'next/link'

import type { SiteSettings } from '@/types/content'

import { GlobalSearch } from './global-search'
import { Logo } from './logo'
import { MobileNav } from './mobile-nav'
import { PrimaryNav } from './primary-nav'
import { ButtonLink } from './ui/button-link'

/**
 * Site header: the design system's utility strip, sticky header, logo, primary
 * navigation and the single membership call to action.
 *
 * The structure mirrors the approved reference: a navy utility strip carrying
 * the tagline, the members' sign-in and the search dialog; then the white
 * header with the logo, the editorial navigation and the Support / Join BTA
 * actions. Navigation comes from `siteSettings.navItems`; when the CMS is
 * unreachable the application's own fallback navigation is used.
 */
export function SiteHeader({ settings }: { settings: SiteSettings | null }) {
  const tagline = settings?.tagline?.trim() || 'Our heritage. Our people. Our future.'

  return (
    <header>
      <div className="utility">
        <div className="shell">
          <span>{tagline}</span>

          <div>
            <Link href="/portal">Members Login</Link>
            <GlobalSearch />
          </div>
        </div>
      </div>

      <div className="shell head">
        <Link href="/" className="logo-link" aria-label="Bainbo Taria Awo Club — home">
          <Logo settings={settings} />
        </Link>

        <PrimaryNav navItems={settings?.navItems ?? null} />

        <div className="actions">
          <Link href="/support">Support</Link>

          <ButtonLink href="/membership" variant="gold">
            Join BTA
          </ButtonLink>
        </div>

        <MobileNav navItems={settings?.navItems ?? null} />
      </div>
    </header>
  )
}
