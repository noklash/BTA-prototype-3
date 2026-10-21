import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { EditorialPageRoute } from '@/components/editorial-page'
import { getEditorialPageByKind } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Governance',
    description: 'Clear governance, responsible leadership and accessible institutional records strengthen Bainbo Taria Awo  .',
    path: "/governance",
  }),
}

export default async function GovernancePage() {
  const result = await getEditorialPageByKind('governance')

  return <EditorialPageRoute result={result} label="Governance" />
}