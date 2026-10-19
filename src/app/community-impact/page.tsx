import type { Metadata } from 'next'

import { EditorialPageRoute } from '@/components/editorial-page'
import { getEditorialPageByKind } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Community Impact',
  description: 'Goodwill, made measurable — we identify needs, assess priorities and deliver with transparent reporting.',
  alternates: { canonical: '/community-impact' },
}

export default async function CommunityImpactPage() {
  const result = await getEditorialPageByKind('community')

  return <EditorialPageRoute result={result} label="Community Impact" />
}