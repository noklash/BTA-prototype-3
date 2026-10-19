import type { Metadata } from 'next'

import { EditorialPageRoute } from '@/components/editorial-page'
import { getEditorialPageByKind } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'BTA 2035',
  description: 'Our long-term framework for a stronger institution and the heritage we pass forward.',
  alternates: { canonical: '/about/bta-2035' },
}

export default async function VisionPage() {
  const result = await getEditorialPageByKind('vision')

  return <EditorialPageRoute result={result} label="BTA 2035" />
}