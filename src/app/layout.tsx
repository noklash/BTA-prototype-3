import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
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
 * (`--serif` / `--sans`).
 *
 * Both are self-hosted from `src/app/fonts` with `next/font/local`, so the
 * build never downloads a font, the page never makes a third-party font
 * request, and there is no layout shift. (The woff2 files are the Latin subset
 * of the Google Fonts originals, redistributed under the SIL Open Font License;
 * see `src/app/fonts/OFL.txt`.)
 */
const bodyFont = localFont({
  src: [
    { path: './fonts/manrope-400-latin.woff2', weight: '400', style: 'normal' },
    { path: './fonts/manrope-500-latin.woff2', weight: '500', style: 'normal' },
    { path: './fonts/manrope-600-latin.woff2', weight: '600', style: 'normal' },
    { path: './fonts/manrope-700-latin.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: false,
})

const displayFont = localFont({
  src: [
    { path: './fonts/cormorant-garamond-500-latin.woff2', weight: '500', style: 'normal' },
    { path: './fonts/cormorant-garamond-600-latin.woff2', weight: '600', style: 'normal' },
    { path: './fonts/cormorant-garamond-500-italic-latin.woff2', weight: '500', style: 'italic' },
  ],
  variable: '--font-display-family',
  display: 'swap',
  fallback: ['Georgia', 'serif'],
  adjustFontFallback: false,
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
