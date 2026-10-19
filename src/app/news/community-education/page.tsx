import type { Metadata } from 'next'

import { DetailPageRoute } from '@/components/detail-page'
import { getDetailPageByTypeAndSlug } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  title: 'Community Education',
  description: 'A look at how local schools and the association work together.',
  alternates: { canonical: '/news/community-education' },
}

export default async function ArticlePage() {
  const result = await getDetailPageByTypeAndSlug('article', 'community-education')

  return <DetailPageRoute result={result} label="Community Education" />
}