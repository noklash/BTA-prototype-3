import type { Metadata } from 'next'

import { ProfileEditor } from '@/components/demo/portal'
import { AppHead } from '@/components/demo/ui'

export const metadata: Metadata = {
  title: 'My profile · Members’ Portal',
  description: 'View and edit your demonstration member profile.',
  alternates: { canonical: '/portal/profile' },
  robots: { index: false, follow: false },
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
