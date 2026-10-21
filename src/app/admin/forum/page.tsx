import type { Metadata } from 'next'

import { ForumCommentsTable } from '@/components/demo/admin'
import { AppHead, DemoNotice } from '@/components/demo/ui'

export const metadata: Metadata = {
  title: 'Forum',
  description: 'Moderate the discussion under the forum articles.',
  robots: { index: false, follow: false },
}

/**
 * Forum moderation.
 *
 * The articles are published from Sanity Studio; this panel handles the member
 * comments and replies underneath them.
 */
export default function AdminForumPage() {
  return (
    <>
      <AppHead
        eyebrow="Administration"
        title="Forum discussion"
        description="Comments and replies posted by members under the Knowledge & Ideas Forum articles."
      />

      <DemoNotice>
        <strong>Demonstration moderation.</strong> Hiding a comment keeps it in the record and can be
        undone. The articles themselves are published in Sanity Studio.
      </DemoNotice>

      <ForumCommentsTable />
    </>
  )
}
