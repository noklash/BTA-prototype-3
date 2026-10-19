import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { MobileNav } from '@/components/mobile-nav'

/**
 * `usePathname` needs an App Router context that a unit test does not have, and
 * the real `next/link` depends on the same router. Both are replaced with the
 * smallest possible stand-ins so this test exercises the disclosure behaviour,
 * not the router.
 */
const navigation = vi.hoisted(() => ({ pathname: '/' }))

vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: any) => (
    <a href={typeof href === 'string' ? href : '#'} {...rest}>
      {children}
    </a>
  ),
}))

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About BTA' },
  { href: '/our-people', label: 'Our People' },
  { href: '/knowledge', label: 'Knowledge' },
  { href: '/enterprise', label: 'Enterprise' },
  { href: '/community-impact', label: 'Community Impact' },
  { href: '/blue-economy', label: 'Blue Economy' },
  { href: '/heritage', label: 'Heritage' },
  { href: '/events', label: 'Events & Media' },
  { href: '/partner', label: 'Partner' },
]

afterEach(() => {
  navigation.pathname = '/'
})

function toggle(): HTMLElement {
  return screen.getByRole('button', { name: /menu/i })
}

describe('MobileNav', () => {
  it('starts collapsed with the toggle describing the panel', () => {
    render(<MobileNav navItems={NAV_ITEMS} />)

    expect(toggle()).toHaveAttribute('aria-expanded', 'false')

    const panel = document.getElementById(toggle().getAttribute('aria-controls') ?? '')
    expect(panel).not.toBeNull()
    expect(panel).not.toBeVisible()
  })

  it('opens the panel and exposes the navigation links', async () => {
    const user = userEvent.setup()
    render(<MobileNav navItems={NAV_ITEMS} />)

    await user.click(toggle())

    expect(toggle()).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'About BTA' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Join BTA' })).toHaveAttribute('href', '/membership')
  })

  it('closes the panel when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(<MobileNav navItems={NAV_ITEMS} />)

    await user.click(toggle())
    expect(toggle()).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(toggle()).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the panel when the route changes', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<MobileNav navItems={NAV_ITEMS} />)

    await user.click(toggle())
    expect(toggle()).toHaveAttribute('aria-expanded', 'true')

    navigation.pathname = '/about'
    rerender(<MobileNav navItems={NAV_ITEMS} />)

    expect(toggle()).toHaveAttribute('aria-expanded', 'false')
  })
})