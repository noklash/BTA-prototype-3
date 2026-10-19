import { RolesPanel } from '@/components/demo/admin'
import { AppHead } from '@/components/demo/ui'

export const metadata = { title: 'Roles & activity' }

export default function AdminRolesPage() {
  return (
    <>
      <AppHead
        eyebrow="Administration"
        title="Roles & activity"
        description="Committee roles, permissions and a record of administrative activity."
      />
      <RolesPanel />
    </>
  )
}
