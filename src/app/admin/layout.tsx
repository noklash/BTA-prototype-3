import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { AppFrame } from '@/components/demo/app-shell'

export const metadata: Metadata = {
  title: {
    default: 'Admin',
    template: '%s · Admin · Bainbo Taria Awo Club',
  },
  robots: { index: false, follow: false },
}

const ADMIN_NAV = [
  { href: '/admin', label: 'Overview', exact: true },
  { href: '/admin/members', label: 'Membership' },
  { href: '/admin/content', label: 'Content & announcements' },
  { href: '/admin/projects', label: 'Projects & progress' },
  { href: '/admin/dues', label: 'Dues & transactions' },
  { href: '/admin/scholarships', label: 'Scholarships' },
  { href: '/admin/volunteers', label: 'Volunteers' },
  { href: '/admin/businesses', label: 'Businesses' },
  { href: '/admin/feedback', label: 'Feedback & proposals' },
  { href: '/admin/partnerships', label: 'Partnerships' },
  { href: '/admin/roles', label: 'Roles & activity' },
]

/**
 * The demonstration administrative area.
 *
 * It is intentionally not gated behind the members' sign-in: the committee
 * asked for an administrative dashboard to be *demonstrated*, and there is no
 * real authorization layer to enforce. The layout marks itself `noindex` and
 * every page carries a demonstration notice.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppFrame
      label="Administration"
      nav={ADMIN_NAV}
      sideFoot={
        <p style={{ marginTop: 0 }}>
          Demonstration area. All records are illustrative and held in this browser only.
        </p>
      }
    >
      {children}
    </AppFrame>
  )
}
