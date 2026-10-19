import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ContentErrorState, StateMessage } from '@/components/ui/state-message'

describe('StateMessage', () => {
  it('announces an empty state politely so it does not interrupt the reader', () => {
    render(<StateMessage title="No events yet" description="New events appear here." />)

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('No events yet')
    expect(status).toHaveTextContent('New events appear here.')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('announces an error state assertively', () => {
    render(<StateMessage tone="error" title="Content is unavailable" description="Try again soon." />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Content is unavailable')
    expect(alert).toHaveTextContent('Try again soon.')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('omits the description block when none is provided', () => {
    const { container } = render(<StateMessage title="Nothing to show" />)

    expect(container.querySelectorAll('div')).toHaveLength(1)
  })

  it('renders an action in the action slot', () => {
    render(
      <StateMessage
        title="Membership is open"
        action={<a href="/membership">Express interest</a>}
      />,
    )

    expect(screen.getByRole('link', { name: 'Express interest' })).toHaveAttribute(
      'href',
      '/membership',
    )
  })
})

describe('ContentErrorState', () => {
  it('points editors at the setup instructions when Sanity is not configured', () => {
    render(<ContentErrorState reason="not-configured" message="Sanity is not configured." />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('This content could not be loaded')
    expect(alert).toHaveTextContent('Sanity is not configured.')
    expect(alert).toHaveTextContent('(not-configured)')
  })

  it('reports an outage without the setup instructions', () => {
    render(
      <ContentErrorState reason="unavailable" message="The Content Lake could not be reached." />,
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('This content could not be loaded')
    expect(alert).toHaveTextContent('The Content Lake could not be reached.')
    expect(screen.queryByText('docs/sanity-setup.md')).not.toBeInTheDocument()
  })
})
