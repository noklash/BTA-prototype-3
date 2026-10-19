import { AdminOverview } from '@/components/demo/admin'
import { AppHead } from '@/components/demo/ui'

export default function AdminOverviewPage() {
  return (
    <>
      <AppHead
        eyebrow="Administration"
        title="Overview"
        description="Membership, projects, dues, feedback and applications in one demonstration dashboard."
      />
      <AdminOverview />
    </>
  )
}
