import { ProjectsTable } from '@/components/demo/admin'
import { AppHead } from '@/components/demo/ui'

export const metadata = { title: 'Projects & progress' }

export default function AdminProjectsPage() {
  return (
    <>
      <AppHead
        eyebrow="Administration"
        title="Projects & progress"
        description="Update project stages and see funding progress across the project bank."
      />
      <ProjectsTable />
    </>
  )
}
