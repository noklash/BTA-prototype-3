import type { ReactNode } from 'react'

/**
 * The three non-content states the website can be in for a given section:
 * content is empty, content could not be loaded, or the section is a
 * demonstration.
 *
 * Having a single component means the pages never invent their own wording, and
 * an "empty" CMS is never silently disguised as real content.
 */
export function StateMessage({
  tone = 'empty',
  title,
  description,
  action,
  className = '',
}: {
  tone?: 'empty' | 'error'
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  const isError = tone === 'error'

  return (
    <div
      role={isError ? 'alert' : 'status'}
      data-tone={isError ? 'alert' : 'empty'}
      className={`state-message ${className}`.trim()}
    >
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {action}
    </div>
  )
}

/**
 * The "content could not be loaded" state, with the reason the content layer
 * reported. The reason is shown verbatim: it is a description of what went
 * wrong (for example "Sanity is not configured"), not an invented apology.
 */
export function ContentErrorState({
  reason,
  message,
  action,
}: {
  reason: string
  message: string
  action?: ReactNode
}) {
  return (
    <StateMessage
      tone="error"
      title="This content could not be loaded"
      description={
        <>
          {message} <span className="font-semibold">({reason})</span>
        </>
      }
      action={action}
    />
  )
}
