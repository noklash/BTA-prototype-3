'use client'

import { NextStudio } from 'next-sanity/studio'

import { ButtonLink } from '@/components/ui/button-link'
import { SANITY_ENV_KEYS, isSanityConfigured } from '@/lib/sanity/env'

import { studioConfig } from '../../../../sanity.config'

/**
 * Client-side entry point for the embedded Studio.
 *
 * When the project id or dataset is missing, the Studio would render an opaque
 * configuration error. Rendering an accurate setup panel instead is both more
 * useful and consistent with how the rest of the site reports a missing
 * configuration.
 */
export function StudioRoute() {
  if (!isSanityConfigured()) {
    return (
      <section className="section">
        <div className="shell">
          <div className="state-message" data-tone="alert">
            <h3>Content Studio is not connected</h3>

            <p>
              The Studio needs a Sanity project id and dataset before it can start. Set{' '}
              <code>{SANITY_ENV_KEYS.projectId}</code> and <code>{SANITY_ENV_KEYS.dataset}</code>{' '}
              in <code>.env.local</code> and restart the development server.
            </p>

            <ol>
              <li>
                Copy <code>.env.example</code> to <code>.env.local</code>.
              </li>
              <li>
                Run <code>npx sanity init --env</code> to create a project, or paste an existing
                project id.
              </li>
              <li>
                Restart with <code>npm run dev</code>.
              </li>
            </ol>

            <p>
              The full walkthrough is in <code>docs/sanity-setup.md</code>.
            </p>

            <ButtonLink href="/">Back to the website</ButtonLink>
          </div>
        </div>
      </section>
    )
  }

  return <NextStudio config={studioConfig} />
}
