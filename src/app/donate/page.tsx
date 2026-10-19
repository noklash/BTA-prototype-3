import type { Metadata } from 'next'

import { DonationFlow } from '@/components/demo/donation-flow'
import { DemoNotice, Metric, MetricGrid } from '@/components/demo/ui'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { ButtonLink } from '@/components/ui/button-link'
import { Section, SectionHeading } from '@/components/ui/section'
import { DEMO_DATA, computeDemoStats } from '@/lib/demo/data'
import { formatCompactNaira } from '@/lib/demo/format'

export const metadata: Metadata = {
  title: 'Contribute',
  description:
    'Choose a cause, enter an amount and complete a simulated contribution. No payment provider is connected in this prototype.',
  alternates: { canonical: '/donate' },
}

export default function DonatePage() {
  const stats = computeDemoStats()

  return (
    <>
      <PageHero
        eyebrow="Support BTA"
        title="Give where it counts."
        intro="Choose a cause, decide an amount and review your contribution. The checkout is simulated: no card details are collected and no funds move."
        prototypeKey="hero"
      />

      <DemonstrationNote />

      <Section>
        <MetricGrid>
          <Metric value={formatCompactNaira(stats.fundedNgn)} label="Illustrative funds raised" />
          <Metric value={formatCompactNaira(stats.fundingTargetNgn)} label="Combined target" />
          <Metric value={String(stats.projects)} label="Projects in the bank" />
          <Metric value={String(DEMO_DATA.donationCategories.length)} label="Giving categories" />
        </MetricGrid>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Step by step"
          title="Make a contribution"
          description="Select a category, enter an amount and review before completing a simulated checkout."
        />

        <DemoNotice>
          Payment providers (card, transfer, direct debit) are future integrations. This prototype
          only demonstrates the intended user experience.
        </DemoNotice>

        <DonationFlow
          categories={DEMO_DATA.donationCategories.map((category) => ({
            id: category.id,
            label: category.label,
            description: category.description,
          }))}
          fundingTargetNgn={stats.fundingTargetNgn}
          fundedNgn={stats.fundedNgn}
        />
      </Section>

      <Section className="model">
        <SectionHeading
          eyebrow="Accountability"
          title="See where the money goes"
          description="Project budgets, expenditure summaries and progress updates are published in the transparency area."
        />

        <div className="button-row">
          <ButtonLink href="/transparency">View transparency reports</ButtonLink>
          <ButtonLink href="/projects" variant="outline">
            Browse the project bank
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}
