import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { EditorialPageRoute } from '@/components/editorial-page'
import { getEditorialPageByKind } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Blue Economy',
    description: 'Protecting the river, together — the river sustains this community and the Blue Economy programme keeps it productive.',
    path: "/blue-economy",
  }),
}

export default async function BlueEconomyPage() {
  const result = await getEditorialPageByKind('blue')

  return <EditorialPageRoute result={result} label="Blue Economy" prototypeKey="river" />
}