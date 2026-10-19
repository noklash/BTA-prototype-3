import Link from 'next/link'

import type { SiteSettings } from '@/types/content'

import { Logo } from './logo'
import { NewsletterForm } from './newsletter-form'
import { DEMONSTRATION_NOTICE } from '@/lib/site'

const EXPLORE_LINKS = [
  { href: '/about', label: 'About BTA' },
  { href: '/our-people', label: 'Our People' },
  { href: '/heritage', label: 'Heritage' },
  { href: '/events', label: 'Events' },
] as const

const WORK_LINKS = [
  { href: '/knowledge', label: 'Knowledge' },
  { href: '/enterprise', label: 'Enterprise' },
  { href: '/community-impact', label: 'Community Impact' },
  { href: '/blue-economy', label: 'Blue Economy' },
] as const

const PARTICIPATE_LINKS = [
  { href: '/membership', label: 'Join BTA' },
  { href: '/partner', label: 'Partner' },
  { href: '/support', label: 'Support' },
  { href: '/portal', label: 'Members Login' },
] as const

/**
 * Prototype 3 platform routes. They sit on their own compact line so the three
 * editorial footer columns stay identical to the approved reference while every
 * new area remains reachable from every page.
 */
const PLATFORM_LINKS = [
  { href: '/projects', label: 'Projects' },
  { href: '/donate', label: 'Donate' },
  { href: '/transparency', label: 'Transparency' },
  { href: '/diaspora', label: 'Diaspora' },
  { href: '/youth', label: 'Youth' },
  { href: '/volunteer', label: 'Volunteer' },
  { href: '/feedback', label: 'Feedback' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/admin', label: 'Admin' },
] as const

const STATEMENT =
  'Connecting generations, sharing knowledge, creating opportunities and building a lasting legacy.'

/**
 * Site footer: the navy band with the closing statement, the three reference
 * link columns, the newsletter field and the copyright strip.
 *
 * Editorial values (statement, contact details) come from `siteSettings`.
 * Application routes are declared here because they are not editorial content.
 */
export function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear()
  const footerText = settings?.footerText?.trim() || STATEMENT

  return (
    <footer>
      <div className="shell footer-grid">
        <div>
          <Link href="/" className="logo-link" aria-label="Bainbo Taria Awo Club — home">
            <Logo light settings={settings} />
          </Link>

          <p className="footer-statement">{footerText}</p>
        </div>

        <div className="footlinks">
          <div>
            <b>Explore</b>
            {EXPLORE_LINKS.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>

          <div>
            <b>Our work</b>
            {WORK_LINKS.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>

          <div>
            <b>Participate</b>
            {PARTICIPATE_LINKS.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="newsletter">
          <b>Stay connected</b>

          <p>Occasional institutional updates.</p>

          <NewsletterForm />
        </div>
      </div>

      <div className="shell platform-strip">
        <b>Platform</b>
        {PLATFORM_LINKS.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="shell copyright">
        <div>
          <span>
            All Rights Reserved © {year} BAINBO TARIA AWO (BTA) built by DIFURRENT LTD.
          </span>

          <span className="footer-notice">{DEMONSTRATION_NOTICE}</span>
        </div>

        <span>
          <Link href="/governance">Governance</Link>
          {' · Privacy · Terms'}
        </span>
      </div>
    </footer>
  )
}
