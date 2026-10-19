import type { Metadata } from 'next'

import { DuesPanel } from '@/components/demo/portal'
import { AppHead } from '@/components/demo/ui'

export const metadata: Metadata = {
  title: 'Dues & receipts · Members’ Portal',
  description: 'Demonstration dues status, payment history and simulated receipts.',
  alternates: { canonical: '/portal/dues' },
  robots: { index: false, follow: false },
}

export default function PortalDuesPage() {
  return (
    <>
      <AppHead
        eyebrow="Members’ portal"
        title="Dues & receipts"
        description="Your dues status, invoices, payment history and a simulated checkout."
      />
      <DuesPanel />
    </>
  )
}
