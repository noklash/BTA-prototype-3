import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { DetailPageRoute } from '@/components/detail-page'
import { getDetailPageByTypeAndSlug } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Blue Economy Centre',
    description: 'Training, equipment storage and community research for the river economy.',
    path: "/blue-economy/centre",
  }),
}

export default async function CentrePage() {
  const result = await getDetailPageByTypeAndSlug('centre', 'blue-economy-centre')

  return <DetailPageRoute result={result} label="Blue Economy Centre" prototypeKey="river" />
}