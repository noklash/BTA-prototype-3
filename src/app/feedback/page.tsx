import type { Metadata } from 'next'

import { FeedbackBoard } from '@/components/demo/directories'
import { FeedbackForm } from '@/components/demo/public-forms'
import { DemoNotice } from '@/components/demo/ui'
import { DemonstrationNote } from '@/components/demonstration-note'
import { PageHero } from '@/components/page-hero'
import { Section, SectionHeading } from '@/components/ui/section'

export const metadata: Metadata = {
  title: 'Feedback & Engagement',
  description:
    'Send suggestions, survey responses, project proposals or general feedback, and follow how each entry is handled.',
  alternates: { canonical: '/feedback' },
}

export default function FeedbackPage() {
  return (
    <>
      <PageHero
        eyebrow="Feedback and engagement"
        title="Tell us what you think."
        intro="Suggestions, survey responses, project proposals and general feedback all arrive in one place, and each one carries a moderation status so you can see how it was handled."
        prototypeKey="community"
      />

      <DemonstrationNote />

      <Section className="form-page">
        <div>
          <span className="eyebrow">Send feedback</span>
          <h2>Have your say</h2>
          <p>
            Choose the type of feedback, give it a short subject and write your message. Entries
            appear in the moderation board below and in the demonstration admin area.
          </p>

          <DemoNotice>
            Moderation states are illustrative. A real deployment would connect this form to a
            review workflow with named moderators.
          </DemoNotice>
        </div>

        <FeedbackForm />
      </Section>

      <Section className="model">
        <SectionHeading
          eyebrow="Moderation"
          title="How entries are handled"
          description="Every entry is Submitted, then moves to Under review, and is published when it is safe and useful to do so."
        />

        <ol className="steps-grid">
          <li>
            <small>01</small>
            <p>
              <strong>Submitted.</strong> The entry is recorded and acknowledged.
            </p>
          </li>
          <li>
            <small>02</small>
            <p>
              <strong>Under review.</strong> A named committee member assesses it.
            </p>
          </li>
          <li>
            <small>03</small>
            <p>
              <strong>Published.</strong> The outcome (and a response where useful) is shared.
            </p>
          </li>
          <li>
            <small>04</small>
            <p>
              <strong>Rejected.</strong> Not everything can proceed; the reason is recorded.
            </p>
          </li>
        </ol>
      </Section>

      <Section>
        <SectionHeading eyebrow="Board" title="Recent entries" />

        <FeedbackBoard />
      </Section>
    </>
  )
}
