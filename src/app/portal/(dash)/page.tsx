import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { PortalDashboard } from '@/components/demo/portal'
import { AppHead } from '@/components/demo/ui'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Members’ Portal',
    description: 'Demonstration members’ portal for Bainbo Taria Awo Club.',
    path: "/portal",
    noIndex: true,
  }),
}

export default function PortalDashboardPage() {
  return (
    <>
      <AppHead
        eyebrow="Members’ portal"
        title="Your dashboard"
        description="A summary of your membership, dues, meeting records and ways to take part."
      />
      <PortalDashboard />
    </>
  )
}
