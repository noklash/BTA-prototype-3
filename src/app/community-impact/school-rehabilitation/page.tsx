import type { Metadata } from 'next'

import { DetailPageRoute } from '@/components/detail-page'
import { getDetailPageByTypeAndSlug } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'School Rehabilitation',
  description: 'Repairing classrooms and restoring the school garden with community labour.',
  alternates: { canonical: '/community-impact/school-rehabilitation' },
}

export default async function ProjectPage() {
  const result = await getDetailPageByTypeAndSlug('project', 'school-rehabilitation')

  return <DetailPageRoute result={result} label="School Rehabilitation" />
}