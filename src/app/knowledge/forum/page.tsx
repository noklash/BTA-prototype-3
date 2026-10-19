import type { Metadata } from 'next'

import { DetailPageRoute } from '@/components/detail-page'
import { getDetailPageByTypeAndSlug } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Knowledge Forum',
  description: 'The BTA Knowledge & Ideas Forum — practical knowledge shared by members, for members.',
  alternates: { canonical: '/knowledge/forum' },
}

export default async function ForumPage() {
  const result = await getDetailPageByTypeAndSlug('forum', 'knowledge-forum')

  return <DetailPageRoute result={result} label="Knowledge Forum" />
}