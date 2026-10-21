import { buildMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

import { CommunityNeedsForm } from '@/components/demo/community-needs-form'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { Section } from '@/components/ui/section'
import { ContentErrorState, StateMessage } from '@/components/ui/state-message'
import { getCommunityNeeds } from '@/lib/sanity/content'

export const revalidate = 120

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Community Needs',
    description: 'Make local needs visible for review by the appropriate Bainbo Taria Awo   committee.',
    path: "/community-needs",
  }),
}

export default async function CommunityNeedsPage() {
  const result = await getCommunityNeeds()

  if (!result.ok) {
    return (
      <Section>
        <ContentErrorState reason={result.reason} message={result.message} />
      </Section>
    )
  }

  if (!result.value) {
    return (
      <Section>
        <StateMessage
          title="The community needs register is not published yet"
          description="Its content is managed in Sanity Studio. Publish the community needs page to accept entries here."
        />
      </Section>
    )
  }

  const page = result.value
  const fields = page.fields ?? []

  return (
    <>
      <PageHero
        eyebrow={page.pageHero?.eyebrow ?? 'Community Needs Register'}
        title={page.pageHero?.title ?? 'What does your community need?'}
        intro={page.pageHero?.intro ?? undefined}
        image={page.pageHero?.image ?? null}
      />

      {page.note ? <DemonstrationNote /> : null}

      <Section className="form-page">
        <div className="shell">
          <div>
            {page.formTitle ? <h2>{page.formTitle}</h2> : null}
            {page.formDescription ? <p>{page.formDescription}</p> : null}
          </div>

          <CommunityNeedsForm fields={fields} submitLabel={page.submitLabel ?? 'Submit'} />
        </div>
      </Section>
    </>
  )
}
