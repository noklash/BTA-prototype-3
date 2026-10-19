import { ContentPanel } from '@/components/demo/admin'
import { AppHead } from '@/components/demo/ui'

export const metadata = { title: 'Content & announcements' }

export default function AdminContentPage() {
  return (
    <>
      <AppHead
        eyebrow="Administration"
        title="Content & announcements"
        description="Meeting notices, agendas, minutes, circulars and contributed knowledge, with publishing controls."
      />
      <ContentPanel />
    </>
  )
}
