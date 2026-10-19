import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { DemoProvider } from '@/lib/demo/store'
import { getSiteSettingsForLayout } from '@/lib/sanity/content'
import { valueOrNull } from '@/lib/sanity/fetch'
import { BRAND_DESCRIPTION, BRAND_NAME, getSiteUrl } from '@/lib/site'

import './globals.css'

/**
 * Two typefaces only: Cormorant Garamond for display type and Manrope for
 * everything else — the pairing the design system in `globals.css` expects
 * (`--serif` / `--sans`). Both are self-hosted by `next/font`, so there is no
 * render-blocking request to a third-party font CDN and no layout shift.
 */
const bodyFont = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body',
})

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display-family',
})

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: `${BRAND_NAME} — Community association`,
    template: `%s · ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: BRAND_NAME,
    title: BRAND_NAME,
    description: BRAND_DESCRIPTION,
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#061d35',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Shared by the header, the footer and every page. The result is memoised for
  // the duration of the request (see `getSiteSettingsForLayout`) and cached by
  // Next.js for `DEFAULT_REVALIDATE_SECONDS`.
  const settings = valueOrNull(await getSiteSettingsForLayout())

  return (
    // `data-scroll-behavior` declares the smooth scrolling that `globals.css`
    // sets on `html`; Next.js warns during development when smooth scrolling is
    // declared in CSS without this attribute (see the Next.js 16 upgrade guide).
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
      className={`${bodyFont.variable} ${displayFont.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <SiteHeader settings={settings} />

        <main id="main-content" className="flex-1">
          {/* The demonstration store lets public forms, the members' portal and
              the admin area share one mock dataset (see src/lib/demo/store.tsx). */}
          <DemoProvider>{children}</DemoProvider>
        </main>

        <SiteFooter settings={settings} />
      </body>
    </html>
  )
}
