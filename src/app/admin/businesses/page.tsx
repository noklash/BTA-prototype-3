import { BusinessesTable } from '@/components/demo/admin'
import { AppHead } from '@/components/demo/ui'

export const metadata = { title: 'Businesses' }

export default function AdminBusinessesPage() {
  return (
    <>
      <AppHead
        eyebrow="Administration"
        title="Businesses"
        description="Review and publish listings submitted to the business and investment directory."
      />
      <BusinessesTable />
    </>
  )
}
