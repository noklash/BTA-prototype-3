'use client'

import { useState } from 'react'

import { formatNaira } from '@/lib/demo/format'
import { useDemo } from '@/lib/demo/store'
import type { Contribution } from '@/lib/demo/types'
import { validAmount } from '@/lib/demo/validate'

import { FieldError } from './form-field'
import { Badge, DemoNotice, Panel, Tracker } from './ui'

const PRESET_AMOUNTS = [5000, 10000, 25000, 50000, 100000]

type Step = 'choose' | 'review' | 'done'

/**
 * The simulated contribution flow: choose a category and amount, review the
 * contribution, then complete a *simulated* checkout and see an illustrative
 * receipt.
 *
 * No payment provider is connected. The confirmation says so explicitly, and
 * the receipt is labelled a demonstration.
 */
export function DonationFlow({
  categories,
  fundingTargetNgn,
  fundedNgn,
}: {
  categories: readonly { id: string; label: string; description: string }[]
  fundingTargetNgn: number
  fundedNgn: number
}) {
  const { makeContribution } = useDemo()

  const [step, setStep] = useState<Step>('choose')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '')
  const [amount, setAmount] = useState('')
  const [name, setName] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [errors, setErrors] = useState<{ category?: string; amount?: string; name?: string }>({})
  const [contribution, setContribution] = useState<Contribution | null>(null)

  const selected = categories.find((category) => category.id === categoryId) ?? categories[0] ?? null

  function review() {
    const nextErrors: typeof errors = {}
    if (!selected) {
      nextErrors.category = 'Choose a category.'
    }
    const amountError = validAmount(amount)
    if (amountError) {
      nextErrors.amount = amountError
    }
    if (!anonymous && name.trim().length < 2) {
      nextErrors.name = 'Enter your name, or choose to contribute anonymously.'
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setStep('review')
    }
  }

  function complete() {
    if (!selected) {
      return
    }
    const result = makeContribution({
      categoryId: selected.id,
      amountNgn: Math.round(Number(amount)),
      contributorName: anonymous ? 'A member (anonymous)' : name.trim(),
      anonymous,
    })
    setContribution(result)
    setStep('done')
  }

  function startAgain() {
    setStep('choose')
    setAmount('')
    setName('')
    setAnonymous(false)
    setErrors({})
    setContribution(null)
  }

  if (step === 'done' && contribution && selected) {
    return (
      <Panel tone="mist">
        <Badge tone="gold">Demonstration receipt</Badge>
        <h2 style={{ marginTop: 16 }}>Thank you</h2>
        <p>
          Your simulated contribution has been recorded in this browser. No money has changed hands
          and no payment provider is connected.
        </p>

        <div className="receipt" style={{ marginTop: 22 }}>
          <h3>Contribution receipt (sample)</h3>
          <span className="muted" style={{ fontSize: 11, color: 'var(--muted)' }}>
            Not a valid accounting document
          </span>
          <dl>
            <dt>Receipt number</dt>
            <dd>{contribution.receiptNo}</dd>
            <dt>Reference</dt>
            <dd>{contribution.reference}</dd>
            <dt>Category</dt>
            <dd>{selected.label}</dd>
            <dt>Contributor</dt>
            <dd>{contribution.contributorName}</dd>
            <dt>Amount</dt>
            <dd>{formatNaira(contribution.amountNgn)}</dd>
            <dt>Date</dt>
            <dd>{contribution.date}</dd>
            <dt>Method</dt>
            <dd>Simulated checkout</dd>
          </dl>
        </div>

        <div className="cta-row" style={{ marginTop: 24 }}>
          <button type="button" className="btn outline" onClick={startAgain}>
            Make another contribution
          </button>
        </div>
      </Panel>
    )
  }

  if (step === 'review' && selected) {
    return (
      <Panel tone="mist">
        <span className="eyebrow">Step 2 of 2 · Review</span>
        <h2 style={{ marginTop: 14 }}>Review your contribution</h2>

        <dl className="definition-list" style={{ marginTop: 18 }}>
          <div>
            <dt>Category</dt>
            <dd>{selected.label}</dd>
          </div>
          <div>
            <dt>Amount</dt>
            <dd>{formatNaira(Math.round(Number(amount)))}</dd>
          </div>
          <div>
            <dt>Contributor</dt>
            <dd>{anonymous ? 'Anonymous' : name.trim()}</dd>
          </div>
          <div>
            <dt>Payment</dt>
            <dd>Simulated checkout (no provider connected)</dd>
          </div>
        </dl>

        <DemoNotice>
          Completing this step simulates a checkout. No card details are collected and no funds are
          transferred.
        </DemoNotice>

        <div className="cta-row">
          <button type="button" className="btn primary" onClick={complete}>
            Complete simulated checkout
          </button>
          <button
            type="button"
            className="btn outline"
            onClick={() => setStep('choose')}
          >
            Go back and edit
          </button>
        </div>
      </Panel>
    )
  }

  return (
    <Panel tone="mist">
      <span className="eyebrow">Step 1 of 2 · Choose</span>
      <h2 style={{ marginTop: 14 }}>Choose a cause</h2>
      <p>Every category below maps to a live demonstration project in the project bank.</p>

      <div className="chip-row" style={{ marginTop: 18 }}>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={category.id === categoryId ? 'chip active' : 'chip'}
            aria-pressed={category.id === categoryId}
            onClick={() => setCategoryId(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      {selected ? <p style={{ marginTop: 14 }}>{selected.description}</p> : null}
      <FieldError id="donation-category-error" message={errors.category} />

      <div style={{ marginTop: 26 }}>
        <Tracker raised={fundedNgn} target={fundingTargetNgn} formatValue={formatNaira} leftLabel="Raised" rightLabel="Across all projects" />
      </div>

      <div style={{ marginTop: 26 }}>
        <p className="fieldset-label">Amount</p>
        <div className="chip-row">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={amount === String(preset) ? 'chip active' : 'chip'}
              onClick={() => setAmount(String(preset))}
            >
              {formatNaira(preset)}
            </button>
          ))}
        </div>

        <label htmlFor="donation-amount" style={{ display: 'block', marginTop: 16 }}>
          <span style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            Or enter an amount (₦)
          </span>
          <input
            id="donation-amount"
            name="amount"
            type="number"
            min={1}
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-invalid={errors.amount ? true : undefined}
            style={{ width: '100%', padding: '12px 0', border: 0, borderBottom: '1px solid #aebbc5', background: 'transparent' }}
          />
        </label>
        <FieldError id="donation-amount-error" message={errors.amount} />
      </div>

      <div style={{ marginTop: 22 }}>
        <label htmlFor="donation-name" style={{ display: 'block' }}>
          <span style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            Your name (optional)
          </span>
          <input
            id="donation-name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={anonymous}
            aria-invalid={errors.name ? true : undefined}
            style={{ width: '100%', padding: '12px 0', border: 0, borderBottom: '1px solid #aebbc5', background: 'transparent', opacity: anonymous ? 0.5 : 1 }}
          />
        </label>
        <FieldError id="donation-name-error" message={errors.name} />

        <label htmlFor="donation-anonymous" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 }}>
          <input
            id="donation-anonymous"
            name="anonymous"
            type="checkbox"
            checked={anonymous}
            onChange={(event) => setAnonymous(event.target.checked)}
            style={{ width: 'auto' }}
          />
          <span style={{ fontSize: 11, fontWeight: 600 }}>Contribute anonymously</span>
        </label>
      </div>

      <div className="cta-row" style={{ marginTop: 26 }}>
        <button type="button" className="btn primary" onClick={review}>
          Review contribution
        </button>
      </div>
    </Panel>
  )
}
