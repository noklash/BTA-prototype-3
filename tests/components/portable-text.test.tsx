import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RichText } from '@/components/portable-text'
import type { RichTextValue } from '@/types/content'

/** Builds a single unstyled paragraph block. */
function paragraph(text: string, style: string = 'normal'): RichTextValue[number] {
  return {
    _type: 'block',
    _key: `block-${style}-${text}`,
    style,
    children: [{ _type: 'span', _key: `span-${text}`, text }],
  }
}

describe('RichText', () => {
  it('renders nothing when the field is empty', () => {
    expect(render(<RichText value={null} />).container).toBeEmptyDOMElement()
    expect(render(<RichText value={undefined} />).container).toBeEmptyDOMElement()
    expect(render(<RichText value={[]} />).container).toBeEmptyDOMElement()
  })

  it('maps each declared block style onto semantic HTML', () => {
    render(
      <RichText
        value={[
          paragraph('Body copy'),
          paragraph('Our history', 'h3'),
          paragraph('From the archive', 'h4'),
          paragraph('Preservation is stewardship', 'blockquote'),
        ]}
      />,
    )

    expect(screen.getByText('Body copy').tagName).toBe('P')
    expect(screen.getByRole('heading', { level: 3, name: 'Our history' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 4, name: 'From the archive' })).toBeInTheDocument()
    expect(screen.getByText('Preservation is stewardship').tagName).toBe('BLOCKQUOTE')
  })

  it('renders bulleted and numbered lists', () => {
    render(
      <RichText
        value={[
          {
            _type: 'block',
            _key: 'bullet-1',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [{ _type: 'span', _key: 'span-1', text: 'First point' }],
          },
          {
            _type: 'block',
            _key: 'bullet-2',
            style: 'normal',
            listItem: 'bullet',
            level: 1,
            children: [{ _type: 'span', _key: 'span-2', text: 'Second point' }],
          },
          {
            _type: 'block',
            _key: 'number-1',
            style: 'normal',
            listItem: 'number',
            level: 1,
            children: [{ _type: 'span', _key: 'span-3', text: 'Step one' }],
          },
        ]}
      />,
    )

    expect(screen.getAllByRole('list')).toHaveLength(2)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText('First point')).toBeInTheDocument()
    expect(screen.getByText('Step one')).toBeInTheDocument()
  })

  it('renders strong and emphasis marks', () => {
    render(
      <RichText
        value={[
          {
            _type: 'block',
            _key: 'marks',
            style: 'normal',
            children: [
              { _type: 'span', _key: 'span-1', text: 'Important', marks: ['strong'] },
              { _type: 'span', _key: 'span-2', text: ' and ' },
              { _type: 'span', _key: 'span-3', text: 'notable', marks: ['em'] },
            ],
          },
        ]}
      />,
    )

    expect(screen.getByText('Important').tagName).toBe('STRONG')
    expect(screen.getByText('notable').tagName).toBe('EM')
  })

  it('routes internal links through the Next.js router', () => {
    render(
      <RichText
        value={[
          {
            _type: 'block',
            _key: 'link-block',
            style: 'normal',
            markDefs: [{ _key: 'link-1', _type: 'link', href: '/membership' }],
            children: [
              { _type: 'span', _key: 'span-1', text: 'Join the circle', marks: ['link-1'] },
            ],
          },
        ]}
      />,
    )

    const link = screen.getByRole('link', { name: 'Join the circle' })
    expect(link).toHaveAttribute('href', '/membership')
    expect(link).not.toHaveAttribute('target')
  })

  it('opens external links safely', () => {
    render(
      <RichText
        value={[
          {
            _type: 'block',
            _key: 'external-block',
            style: 'normal',
            markDefs: [
              { _key: 'link-1', _type: 'link', href: 'https://example.org/gazette' },
            ],
            children: [{ _type: 'span', _key: 'span-1', text: 'the gazette', marks: ['link-1'] }],
          },
        ]}
      />,
    )

    const link = screen.getByRole('link', { name: 'the gazette' })
    expect(link).toHaveAttribute('href', 'https://example.org/gazette')
    expect(link).toHaveAttribute('rel', 'noreferrer noopener')
    expect(link).not.toHaveAttribute('target')
  })

  it('opens a new tab only when the editor asked for it', () => {
    render(
      <RichText
        value={[
          {
            _type: 'block',
            _key: 'new-tab-block',
            style: 'normal',
            markDefs: [
              { _key: 'link-1', _type: 'link', href: '/events', openInNewTab: true },
            ],
            children: [{ _type: 'span', _key: 'span-1', text: 'event list', marks: ['link-1'] }],
          },
        ]}
      />,
    )

    const link = screen.getByRole('link', { name: 'event list' })
    expect(link).toHaveAttribute('href', '/events')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders the text without an anchor when a link has no destination', () => {
    render(
      <RichText
        value={[
          {
            _type: 'block',
            _key: 'broken-link-block',
            style: 'normal',
            markDefs: [{ _key: 'link-1', _type: 'link' }],
            children: [{ _type: 'span', _key: 'span-1', text: 'Read more', marks: ['link-1'] }],
          },
        ]}
      />,
    )

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText('Read more')).toBeInTheDocument()
  })
})
