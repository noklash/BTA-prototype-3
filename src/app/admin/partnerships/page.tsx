import { PartnershipsTable } from '@/components/demo/admin'
import { AppHead } from '@/components/demo/ui'

export const metadata = { title: 'Partnerships' }

export default function AdminPartnershipsPage() {
  return (
    <>
      <AppHead
        eyebrow="Administration"
        title="Partnerships"
        description="Enquiries from agencies, foundations, sponsors and diaspora contributors."
      />
      <PartnershipsTable />
    </>
  )
}
