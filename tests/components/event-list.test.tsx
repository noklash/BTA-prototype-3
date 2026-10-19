import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EventList, PartitionedEventList } from '@/components/event-list'
import type { EventSummary } from '@/types/content'

const NOW = new Date('2026-06-01T12:00:00.000Z')

function event(overrides: Partial<EventSummary> & { _id: string }): EventSummary {
  return {
    title: `Event ${overrides._id}`,
    slug: `event-${overrides._id}`,
    summary: null,
    startDateTime: '2026-07-01T10:00:00.000Z',
    location: 'The Old Library Hall',
    coverImage: null,
    status: 'published',
    category: 'knowledge',
    ...overrides,
  }
}

describe('EventList', () => {
  it('links each row to the event detail page', () => {
    render(<EventList events={[event({ _id: 'a', slug: 'spring-fete' })]} />)

    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/events/spring-fete')
  })

  it('renders the title, category and location in the row', () => {
    render(<EventList events={[event({ _id: 'a', title: 'Spring Fete', category: 'knowledge' } )]} />)

    expect(screen.getByRole('heading', { name: 'Spring Fete' })).toBeInTheDocument()
    expect(screen.getByText('knowledge')).toBeInTheDocument()
    expect(screen.getByText(/The Old Library Hall/)).toBeInTheDocument()
  })

  it('renders the machine-readable datetime on the date block', () => {
    render(<EventList events={[event({ _id: 'a' })]} />)

    const time = screen.getByText('01', { selector: 'time b' }).closest('time')
    expect(time).toHaveAttribute('datetime', '2026-07-01T10:00:00.000Z')
  })

  it('says the date is to be confirmed instead of showing a broken block', () => {
    render(<EventList events={[event({ _id: 'a', startDateTime: '' })]} />)

    expect(screen.getByText('Date to be confirmed')).toBeInTheDocument()
  })

  it('omits the location line when the event has no location', () => {
    render(<EventList events={[event({ _id: 'a', location: null })]} />)

    expect(screen.getByRole('heading', { name: 'Event a' })).toBeInTheDocument()
    expect(screen.queryByText(/The Old Library Hall/)).not.toBeInTheDocument()
  })

  it('renders nothing for an empty list', () => {
    const { container } = render(<EventList events={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})

describe('PartitionedEventList', () => {
  it('separates upcoming events from past events', () => {
    render(
      <PartitionedEventList
        now={NOW}
        events={[
          event({ _id: 'future', title: 'Summer Fete', startDateTime: '2026-08-01T10:00:00.000Z' }),
          event({ _id: 'past', title: 'Winter Lecture', startDateTime: '2026-01-15T18:00:00.000Z' }),
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Upcoming events' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Past events' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Summer Fete' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Winter Lecture' })).toBeInTheDocument()
  })

  it('shows the empty state when there are no upcoming events', () => {
    render(
      <PartitionedEventList
        now={NOW}
        events={[event({ _id: 'past', startDateTime: '2026-01-15T18:00:00.000Z' })]}
      />,
    )

    expect(screen.getByText('No events are scheduled right now')).toBeInTheDocument()
    // The archive is still reachable.
    expect(screen.getByRole('heading', { name: 'Past events' })).toBeInTheDocument()
  })

  it('counts the archived events with correct pluralisation', () => {
    render(
      <PartitionedEventList
        now={NOW}
        events={[event({ _id: 'past-1', startDateTime: '2026-01-15T18:00:00.000Z' })]}
      />,
    )

    expect(screen.getByText('1 previous gathering from our archive.')).toBeInTheDocument()
  })

  it('hides the archive section entirely when there is nothing in it', () => {
    render(<PartitionedEventList now={NOW} events={[event({ _id: 'future' })]} />)

    expect(screen.queryByRole('heading', { name: 'Past events' })).not.toBeInTheDocument()
  })

  it('handles a completely empty programme', () => {
    render(<PartitionedEventList now={NOW} events={[]} />)

    expect(screen.getByText('No events are scheduled right now')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Past events' })).not.toBeInTheDocument()
  })
})
