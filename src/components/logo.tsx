import type { SiteSettings } from '@/types/content'

import { SanityImage } from './sanity-image'

/**
 * The organisation mark: the CMS logo when one has been uploaded, otherwise
 * the design system's circular gold-rail mark. The short name (`BTA`) and the
 * full name (`BAINBO TARIA AWO`) come from `siteSettings`, so the header
 * never invents a brand line. `light` is the footer variant on the navy
 * background.
 */
export function Logo({
  settings,
  light = false,
}: {
  settings: SiteSettings | null
  light?: boolean
}) {
  const hasLogo = Boolean(settings?.logo?.asset?._ref)
  const shortName = settings?.shortName?.trim() || 'BTA'
  const fullName = settings?.tagline?.trim() || 'BAINBO TARIA AWO'

  return (
    <span className={light ? 'logo light' : 'logo'}>
      <span className="logo-mark" aria-hidden="true">
        {hasLogo ? (
          <SanityImage
            image={settings?.logo ?? null}
            alt=""
            widths={[41, 82]}
            sizes="41px"
            className="h-full w-full object-contain"
          />
        ) : (
          <>
            <i />
            <i />
            <i />
          </>
        )}
      </span>

      <span>
        <b>{shortName}</b>
        <small>{fullName}</small>
      </span>
    </span>
  )
}