import type { Metadata } from 'next'

import { EditorialPageRoute } from '@/components/editorial-page'
import { getEditorialPageByKind } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Knowledge',
  description: 'Practical knowledge sessions across finance, technology, career and care, led by members for members.',
  alternates: { canonical: '/knowledge' },
}

export default async function KnowledgePage() {
  const result = await getEditorialPageByKind('knowledge')

  return <EditorialPageRoute result={result} label="Knowledge" />
}