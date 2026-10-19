'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import { AppFrame } from '@/components/demo/app-shell'
import { SignOutButton } from '@/components/demo/portal'
import { DemoNotice, Panel } from '@/components/demo/ui'
import { ButtonLink } from '@/components/ui/button-link'
import { Section } from '@/components/ui/section'
import { useDemo } from '@/lib/demo/store'

const PORTAL_NAV = [
  { href: '/portal', label: 'Dashboard', exact: true },
  { href: '/portal/profile', label: 'My profile' },
  { href: '/portal/dues', label: 'Dues & receipts' },
  { href: '/portal/meetings', label: 'Meetings & records' },
  { href: '/portal/directory', label: 'Members’ directory' },
]

/**
 * Route guard and internal navigation for the members' portal.
 *
 * The portal is a demonstration and has no real authentication, so the "guard"
 * is simply the simulated session held in the demonstration store. It exists so
 * the portal cannot be mistaken for a public page.
 */
export default function PortalLayout({ children }: { children: ReactNode }) {
  const { hydrated, session, currentMember } = useDemo()

  if (!hydrated) {
    return (
      <Section>
        <Panel tone="mist">
          <h2>Loading the portal…</h2>
          <p>Reading your demonstration session from this browser.</p>
        </Panel>
      </Section>
    )
  }

  if (!session || !currentMember) {
    return (
      <Section>
        <Panel tone="mist">
          <DemoNotice>
            <strong>Members’ portal — demonstration.</strong> There is no real authentication. Sign
            in with a demonstration member to explore the portal.
          </DemoNotice>
          <h2>You are not signed in</h2>
          <p>
            The members’ portal shows a member’s own record, dues and meeting documents. Sign in with
            one of the demonstration members to continue.
          </p>
          <div className="cta-row" style={{ marginTop: 20 }}>
            <ButtonLink href="/portal/login">Go to sign in</ButtonLink>
            <Link
              href="/"
              className="text-sm font-semibold text-[var(--mid)] underline underline-offset-4 hover:text-[var(--navy)]"
            >
              Back to the public site
            </Link>
          </div>
        </Panel>
      </Section>
    )
  }

  return (
    <AppFrame
      label="Members’ portal"
      nav={PORTAL_NAV}
      sideFoot={
        <>
          <p style={{ marginTop: 0 }}>
            Signed in as
            <br />
            <strong>{currentMember.name}</strong>
          </p>
          <SignOutButton />
        </>
      }
    >
      {children}
    </AppFrame>
  )
}
