import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { DetailPageRoute } from '@/components/detail-page'
import { getDetailPageByTypeAndSlug } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Oral History Project',
    description: 'Recording the stories, experiences and knowledge of our elders before they are lost.',
    path: "/heritage/oral-history",
  }),
}

export default async function OralHistoryPage() {
  const result = await getDetailPageByTypeAndSlug('oral', 'oral-history')

  return <DetailPageRoute result={result} label="Oral History" prototypeKey="elder" />
}