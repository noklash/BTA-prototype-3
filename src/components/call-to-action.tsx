import type { CallToAction } from '@/types/content'

import { ButtonLink } from './ui/button-link'

/**
 * The partner band: two CTAs side by side — a primary (gold) button and a
 * secondary (outline) button.
 */
export function PartnerBand({
  eyebrow,
  heading,
  body,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string
  heading: string
  body: string
  primaryCta: CallToAction
  secondaryCta: CallToAction
}) {
  return (
    <section className="partner-home">
      <div className="shell">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{heading}</h2>
        </div>

        <p>{body}</p>

        <div className="cta-row">
          <ButtonLink href={primaryCta.buttonHref ?? '/membership'} variant="primary">
            {primaryCta.buttonLabel ?? 'Partner with us'}
          </ButtonLink>
          <ButtonLink href={secondaryCta.buttonHref ?? '/support'} variant="outline">
            {secondaryCta.buttonLabel ?? 'Support BTA'}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

/**
 * The single-CTA band driven by the home page's `membershipCta` fields.
 */
export function CallToActionBand({ cta }: { cta: CallToAction }) {
  return (
    <section className="partner-home">
      <div className="shell">
        <div>
          <span className="eyebrow">Become a member</span>
          <h2>{cta.heading}</h2>
        </div>

        {cta.body ? <p>{cta.body}</p> : null}

        <div>
          <ButtonLink href={cta.buttonHref ?? '/membership'} variant="gold">
            {cta.buttonLabel ?? 'Membership details'}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}