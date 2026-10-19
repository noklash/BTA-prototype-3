import type { Metadata } from 'next'

import { MemberDirectory } from '@/components/demo/portal'
import { AppHead } from '@/components/demo/ui'

export const metadata: Metadata = {
  title: 'Members’ directory · Members’ Portal',
  description: 'An opt-in, privacy-conscious members’ directory.',
  alternates: { canonical: '/portal/directory' },
  robots: { index: false, follow: false },
}

export default function PortalDirectoryPage() {
  return (
    <>
      <AppHead
        eyebrow="Members’ portal"
        title="Members’ directory"
        description="Only members who opted in are listed, and only non-sensitive fields are ever shown."
      />
      <MemberDirectory />
    </>
  )
}
