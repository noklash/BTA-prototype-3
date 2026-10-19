import { DuesTable } from '@/components/demo/admin'
import { AppHead } from '@/components/demo/ui'

export const metadata = { title: 'Dues & transactions' }

export default function AdminDuesPage() {
  return (
    <>
      <AppHead
        eyebrow="Administration"
        title="Dues & transactions"
        description="Invoices, dues received and recorded contributions. All amounts are simulated."
      />
      <DuesTable />
    </>
  )
}
