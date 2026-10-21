import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { ProfileEditor } from '@/components/demo/portal'
import { AppHead } from '@/components/demo/ui'

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'My profile · Members’ Portal',
    description: 'View and edit your demonstration member profile.',
    path: "/portal/profile",
    noIndex: true,
  }),
}

export default function PortalProfilePage() {
  return (
    <>
      <AppHead
        eyebrow="Members’ portal"
        title="My profile"
        description="Update your details and choose whether you appear in the members’ directory."
      />
      <ProfileEditor />
    </>
  )
}
