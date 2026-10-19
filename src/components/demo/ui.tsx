import type { ReactNode } from 'react'

import { initials, progressPercent } from '@/lib/demo/format'
import type { ProjectStage } from '@/lib/demo/types'

/**
 * Presentational building blocks for the Prototype 3 areas.
 *
 * These are deliberately server-safe (no hooks, no browser APIs) so public
 * pages can render them directly. The design reuses the classes added to
 * `globals.css` under the "PROTOTYPE 3" heading.
 */

/** A small status pill. Tones map to the demonstration statuses in use. */
export function Badge({
  children,
  tone = 'default',
  className = '',
}: {
  children: ReactNode
  tone?: 'default' | 'dark' | 'paid' | 'due' | 'overdue' | 'gold'
  className?: string
}) {
  const toneClass = tone === 'default' ? '' : ` ${tone}`
  return <span className={`badge${toneClass} ${className}`.trim()}>{children}</span>
}

/** Maps a dues/transaction status to a badge tone. */
export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'Paid' || status === 'Active' || status === 'Published' || status === 'Completed'
      ? 'paid'
      : status === 'Overdue' || status === 'Lapsed'
        ? 'overdue'
        : status === 'Due' || status === 'Pending' || status === 'Closing soon'
          ? 'due'
          : 'default'

  return <Badge tone={tone}>{status}</Badge>
}

/** A progress bar with a label on each side. */
export function Tracker({
  raised,
  target,
  formatValue,
  leftLabel,
  rightLabel,
}: {
  raised: number
  target: number
  formatValue: (value: number) => string
  leftLabel?: string
  rightLabel?: string
}) {
  const percent = progressPercent(raised, target)

  return (
    <div className="tracker">
      <div className="tracker-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <i style={{ width: `${percent}%` }} />
      </div>
      <small>
        <span>
          {leftLabel ? `${leftLabel}: ` : ''}
          {formatValue(raised)}
        </span>
        <span>
          {rightLabel ? `${rightLabel} · ` : ''}
          {percent}%
        </span>
      </small>
    </div>
  )
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return <div className="metric-grid">{children}</div>
}

export function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <b>{value}</b>
      <span>{label}</span>
    </div>
  )
}

export function Panel({
  children,
  tone,
  className = '',
}: {
  children: ReactNode
  tone?: 'mist' | 'dark'
  className?: string
}) {
  const toneClass = tone ? ` ${tone}` : ''
  return <div className={`panel${toneClass} ${className}`.trim()}>{children}</div>
}

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <p className="demo-strip" role="note">
      {children}
    </p>
  )
}

/**
 * The illustrative project-location board. There is no mapping service in this
 * project, so the marker position is relative and clearly labelled as a sketch.
 */
export function MapBoard({
  x,
  y,
  note,
  highlight = false,
}: {
  x: number
  y: number
  note: string
  highlight?: boolean
}) {
  return (
    <div className="map-board" aria-hidden="true">
      <div className="water" />
      <span className={`pin${highlight ? ' highlight' : ''}`} style={{ left: `${x}%`, top: `${y}%` }} />
      <small>{note}</small>
    </div>
  )
}

export function BeforeAfter({
  title,
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
}: {
  title: string
  beforeImage: string
  afterImage: string
  beforeLabel: string
  afterLabel: string
}) {
  return (
    <div>
      <h3 style={{ marginBottom: 0 }}>{title}</h3>
      <div className="before-after">
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element -- prototype illustration, fixed size */}
          <img src={beforeImage} alt={beforeLabel} loading="lazy" decoding="async" />
          <figcaption>{beforeLabel}</figcaption>
        </figure>
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element -- prototype illustration, fixed size */}
          <img src={afterImage} alt={afterLabel} loading="lazy" decoding="async" />
          <figcaption>{afterLabel}</figcaption>
        </figure>
      </div>
    </div>
  )
}

export function Avatar({ name }: { name: string }) {
  return (
    <span className="avatar" aria-hidden="true">
      {initials(name)}
    </span>
  )
}

const STAGE_TONE: Record<ProjectStage, 'default' | 'due' | 'paid' | 'dark'> = {
  Proposed: 'default',
  Approved: 'due',
  Ongoing: 'dark',
  Completed: 'paid',
}

export function StageBadge({ stage }: { stage: ProjectStage }) {
  return <Badge tone={STAGE_TONE[stage]}>{stage}</Badge>
}

/** The heading block used inside the portal and admin page bodies. */
export function AppHead({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="app-head">
      <div>
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>

      {actions ? <div className="actions">{actions}</div> : null}
    </div>
  )
}
