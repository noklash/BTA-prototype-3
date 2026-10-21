import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { EditorialPageRoute } from '@/components/editorial-page'
import { getEditorialPageByKind } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Our Story',
    description: "A place for Bainbo Taria Awo Club's verified history, milestones, people and records.",
    path: "/about/story",
  }),
}

export default async function StoryPage() {
  const result = await getEditorialPageByKind('story')

  return <EditorialPageRoute result={result} label="Our Story" />
}