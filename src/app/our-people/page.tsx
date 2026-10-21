import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { LeadershipTeaser } from '@/components/demo/leadership'
import { EditorialPageRoute } from '@/components/editorial-page'
import { getEditorialPageByKind } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Our People',
    description: 'The people behind Bainbo Taria Awo   — the volunteer committee and programme leads.',
    path: "/our-people",
  }),
}

export default async function OurPeoplePage() {
  const result = await getEditorialPageByKind('people')

  return (
    <EditorialPageRoute
      result={result}
      label="Our People"
      prototypeKey="people"
      after={<LeadershipTeaser />}
    />
  )
}
