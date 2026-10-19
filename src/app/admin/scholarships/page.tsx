import { ApplicationsTable } from '@/components/demo/admin'
import { AppHead } from '@/components/demo/ui'

export const metadata = { title: 'Scholarships' }

export default function AdminScholarshipsPage() {
  return (
    <>
      <AppHead
        eyebrow="Administration"
        title="Scholarships & opportunities"
        description="Review applications for scholarships, internships, mentoring and training."
      />
      <ApplicationsTable />
    </>
  )
}
