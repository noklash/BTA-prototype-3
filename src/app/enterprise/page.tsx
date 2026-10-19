import type { Metadata } from 'next'

import { EditorialPageRoute } from '@/components/editorial-page'
import { getEditorialPageByKind } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Enterprise',
  description: 'Buy BTA. Support a BTA business — a prototype member directory for trusted services, expertise and enterprise.',
  alternates: { canonical: '/enterprise' },
}

export default async function EnterprisePage() {
  const result = await getEditorialPageByKind('enterprise')

  return <EditorialPageRoute result={result} label="Enterprise" />
}