import { FeedbackTable } from '@/components/demo/admin'
import { AppHead } from '@/components/demo/ui'

export const metadata = { title: 'Feedback & proposals' }

export default function AdminFeedbackPage() {
  return (
    <>
      <AppHead
        eyebrow="Administration"
        title="Feedback & proposals"
        description="Moderate suggestions, survey responses, project proposals and knowledge contributions."
      />
      <FeedbackTable />
    </>
  )
}
