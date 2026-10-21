import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { PortalLogin } from '@/components/demo/portal'
import { DemoNotice } from '@/components/demo/ui'
import { PageHero } from '@/components/page-hero'
import { Section } from '@/components/ui/section'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Members’ Portal — Sign in',
    description: 'Demonstration sign-in for the Bainbo Taria Awo   members’ portal.',
    path: "/portal/login",
    noIndex: true,
  }),
}

export default function PortalLoginPage() {
  return (
    <>
      <PageHero
        eyebrow="Members’ portal"
        title="Welcome back."
        intro="This is a demonstration portal. Sign in with a fictional member to see a dashboard, profile, dues, meeting records and the members’ directory."
        prototypeKey="people"
      />

      <Section className="form-page">
        <div>
          <span className="eyebrow">Demonstration</span>
          <h2>Sign in</h2>
          <p>
            Choose any demonstration member. Their category, location and dues status change what you
            see, so it is worth trying more than one.
          </p>

          <DemoNotice>
            No password field is shown because no authentication exists in this prototype. A real
            deployment would integrate a vetted identity provider and store credentials securely.
          </DemoNotice>
        </div>

        <PortalLogin />
      </Section>
    </>
  )
}
