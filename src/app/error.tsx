'use client'

import { useEffect } from 'react'

import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'

/**
 * Route-level error boundary.
 *
 * Catches rendering errors that are not part of the content layer's own error
 * handling (which renders an accurate state instead of throwing). The message is
 * deliberately generic: the real error is available through `digest` in the
 * server logs, and rendering it here could expose implementation details.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[route-error]', error.message, error.digest)
  }, [error])

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Something went wrong"
        title="This page could not be displayed"
        description="The error has been logged. You can try again, or return to the home page."
      />
      <div className="button-row">
        <button type="button" onClick={reset} className="btn primary">
          Try again
        </button>
        <ButtonLink href="/" variant="outline">
          Back to the home page
        </ButtonLink>
      </div>
      {error.digest ? (
        <p className="form-hint">
          Reference for support: <code>{error.digest}</code>
        </p>
      ) : null}
    </Section>
  )
}
