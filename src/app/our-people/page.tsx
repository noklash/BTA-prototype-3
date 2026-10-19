import type { Metadata } from 'next'

import { EditorialPageRoute } from '@/components/editorial-page'
import { getEditorialPageByKind } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Our People',
  description: 'The people behind Bainbo Taria Awo Club — the volunteer committee and programme leads.',
  alternates: { canonical: '/our-people' },
}

export default async function OurPeoplePage() {
  const result = await getEditorialPageByKind('people')

  return <EditorialPageRoute result={result} label="Our People" prototypeKey="people" />
}