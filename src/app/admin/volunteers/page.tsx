import { VolunteersTable } from '@/components/demo/admin'
import { AppHead } from '@/components/demo/ui'

export const metadata = { title: 'Volunteers' }

export default function AdminVolunteersPage() {
  return (
    <>
      <AppHead
        eyebrow="Administration"
        title="Volunteers"
        description="The professional skills database, with matching status for each volunteer."
      />
      <VolunteersTable />
    </>
  )
}
