import { MembersTable } from '@/components/demo/admin'
import { AppHead, DemoNotice } from '@/components/demo/ui'

export const metadata = { title: 'Membership' }

export default function AdminMembersPage() {
  return (
    <>
      <AppHead
        eyebrow="Administration"
        title="Membership"
        description="The member register, with categories, locations and dues status."
      />
      <DemoNotice>
        Fictional members created for the prototype. No real personal data is used.
      </DemoNotice>
      <MembersTable />
    </>
  )
}
