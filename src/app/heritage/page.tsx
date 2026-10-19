import type { Metadata } from 'next'

import { EditorialPageRoute } from '@/components/editorial-page'
import { getEditorialPageByKind } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Heritage',
  description: 'Preserving what we know — recording the stories, experiences and knowledge of our elders before they are lost.',
  alternates: { canonical: '/heritage' },
}

export default async function HeritagePage() {
  const result = await getEditorialPageByKind('heritage')

  return <EditorialPageRoute result={result} label="Heritage" prototypeKey="boats" />
}