import type { Metadata } from 'next'

import { EditorialPageRoute } from '@/components/editorial-page'
import { getEditorialPageByKind } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Leadership & Governance',
  description: 'Clear governance, responsible leadership and accessible institutional records strengthen Bainbo Taria Awo Club.',
  alternates: { canonical: '/about/leadership' },
}

export default async function LeadershipPage() {
  const result = await getEditorialPageByKind('governance')

  return <EditorialPageRoute result={result} label="Leadership" />
}