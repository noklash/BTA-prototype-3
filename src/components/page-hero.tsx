import Link from 'next/link'

import { SanityImage } from './sanity-image'
import type { SanityImageValue } from '@/types/content'
import type { PrototypeImageKey } from '@/content/prototype-images'

/**
 * The large page introduction used by every inner page: the design system's
 * `.page-hero` band with an eyebrow, the page title, an optional introduction
 * and a breadcrumb at the bottom (`Home / <eyebrow>`).
 *
 * `image` switches the band to the photographic variant with the navy
 * gradient, so a page with a CMS image gets the full-bleed treatment and a
 * page without one keeps the mist background. `prototypeKey` selects the exact
 * prototype Unsplash URL to use when no CMS image is set.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  prototypeKey,
  fallbackUrl,
}: {
  eyebrow: string
  title: string
  intro?: string
  image?: SanityImageValue | null
  prototypeKey?: PrototypeImageKey
  /** A direct image URL used when the CMS has no image for this page. */
  fallbackUrl?: string | null
}) {
  const hasImage = Boolean(image?.asset?._ref || prototypeKey || fallbackUrl)

  return (
    <section className={hasImage ? 'page-hero image' : 'page-hero'}>
      {hasImage ? (
        <SanityImage
          image={image ?? null}
          alt=""
          sizes="100vw"
          widths={[768, 1280, 1920]}
          priority
          className="h-full w-full object-cover"
          prototypeKey={prototypeKey}
          fallbackUrl={fallbackUrl}
        />
      ) : null}

      <div className="shell">
        <span className="eyebrow">{eyebrow}</span>

        <h1>{title}</h1>

        {intro ? <p>{intro}</p> : null}

        <small>
          <Link href="/">Home</Link> / {eyebrow}
        </small>
      </div>
    </section>
  )
}