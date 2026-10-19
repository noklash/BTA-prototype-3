'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { formatNaira } from '@/lib/demo/format'
import { DEMO_MEMBER_ID } from '@/lib/demo/data'
import { useDemo } from '@/lib/demo/store'
import type { Member, MembershipCategory, Transaction } from '@/lib/demo/types'

import { FieldError, FormFeedback } from './form-field'
import { Avatar, Badge, DemoNotice, Metric, MetricGrid, Panel, StatusBadge, Tracker } from './ui'

const MEMBERSHIP_CATEGORIES: MembershipCategory[] = [
  'Full member',
  'Associate member',
  'Diaspora member',
  'Student member',
  'Patron',
]

/**
 * Simulated sign-in.
 *
 * There is no authentication provider in this project. The form picks a
 * demonstration member so the portal can show different membership categories,
 * dues statuses and locations. It never accepts or stores a password.
 */
export function PortalLogin() {
  const { data, session, login, hydrated } = useDemo()
  const router = useRouter()
  const [memberId, setMemberId] = useState(DEMO_MEMBER_ID)

  useEffect(() => {
    if (hydrated && session) {
      router.replace('/portal')
    }
  }, [hydrated, session, router])

  return (
    <Panel tone="mist">
      <DemoNotice>
        <strong>Simulated sign-in.</strong> No password is requested and no authentication service
        is connected. Choose a demonstration member to explore the portal.
      </DemoNotice>

      <label htmlFor="portal-member">
        <span>Sign in as</span>
        <select
          id="portal-member"
          value={memberId}
          onChange={(event) => setMemberId(event.target.value)}
        >
          {data.members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name} — {member.category} ({member.location})
            </option>
          ))}
        </select>
      </label>

      <div className="cta-row" style={{ marginTop: 24 }}>
        <button
          type="button"
          className="btn primary"
          onClick={() => {
            login(memberId)
            router.push('/portal')
          }}
        >
          Sign in
        </button>
      </div>
    </Panel>
  )
}

/* -------------------------------------------------------------------------- */

/**
 * Profile viewing and editing.
 *
 * Edits are written back to the shared demonstration store, so the change is
 * visible in the portal header and the admin member table in the same browser.
 */
export function ProfileEditor() {
  const { currentMember, updateProfile } = useDemo()

  // `draft` is null until the member edits something, so the form always shows
  // the latest store value until an edit is in progress (no syncing effect).
  const [draft, setDraft] = useState<Member | null>(null)
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email', string>>>({})
  const [saved, setSaved] = useState<string | null>(null)

  if (!currentMember) {
    return <DemoNotice>Your profile could not be loaded.</DemoNotice>
  }

  const member = currentMember
  const value: Member = draft ?? currentMember

  function save() {
    const nextErrors: typeof errors = {}
    if (value.name.trim().length < 2) {
      nextErrors.name = 'Please enter your name.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setSaved(null)
      return
    }

    updateProfile({
      name: value.name.trim(),
      profession: value.profession.trim(),
      location: value.location.trim(),
      email: value.email.trim(),
      phone: value.phone.trim(),
      category: value.category,
      directoryVisible: value.directoryVisible,
    })
    setSaved('Your profile has been updated in this browser. Nothing was sent to a server.')
  }

  return (
    <div className="split">
      <Panel>
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            save()
          }}
        >
          <label htmlFor="profile-name">
            <span>Full name</span>
            <input
              id="profile-name"
              value={value.name}
              onChange={(event) => setDraft({ ...value, name: event.target.value })}
              aria-invalid={errors.name ? true : undefined}
            />
            <FieldError id="profile-name-error" message={errors.name} />
          </label>

          <label htmlFor="profile-email">
            <span>Email address (private)</span>
            <input
              id="profile-email"
              type="email"
              value={value.email}
              onChange={(event) => setDraft({ ...value, email: event.target.value })}
              aria-invalid={errors.email ? true : undefined}
            />
            <FieldError id="profile-email-error" message={errors.email} />
          </label>

          <label htmlFor="profile-phone">
            <span>Phone (private)</span>
            <input
              id="profile-phone"
              value={value.phone}
              onChange={(event) => setDraft({ ...value, phone: event.target.value })}
            />
          </label>

          <label htmlFor="profile-profession">
            <span>Profession</span>
            <input
              id="profile-profession"
              value={value.profession}
              onChange={(event) => setDraft({ ...value, profession: event.target.value })}
            />
          </label>

          <label htmlFor="profile-location">
            <span>Location</span>
            <input
              id="profile-location"
              value={value.location}
              onChange={(event) => setDraft({ ...value, location: event.target.value })}
            />
          </label>

          <label htmlFor="profile-category">
            <span>Membership category</span>
            <select
              id="profile-category"
              value={value.category}
              onChange={(event) =>
                setDraft({ ...value, category: event.target.value as MembershipCategory })
              }
            >
              {MEMBERSHIP_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="profile-directory" className="check-field wide">
            <input
              id="profile-directory"
              type="checkbox"
              checked={value.directoryVisible}
              onChange={(event) => setDraft({ ...value, directoryVisible: event.target.checked })}
            />
            <span>Show me in the members’ directory (name, category, profession and location only)</span>
          </label>

          <div className="form-actions wide">
            <button type="submit" className="btn primary">
              Save changes
            </button>
          </div>

          <FormFeedback message={saved} />
        </form>
      </Panel>

      <Panel tone="mist">
        <h3>Membership record</h3>
        <dl className="definition-list" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <dt>Member number</dt>
            <dd>{member.id.toUpperCase()}</dd>
          </div>
          <div>
            <dt>Joined</dt>
            <dd>{member.joinedOn}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <StatusBadge status={member.status} />
            </dd>
          </div>
          <div>
            <dt>Dues</dt>
            <dd>
              <StatusBadge status={member.duesStatus} />
            </dd>
          </div>
        </dl>
      </Panel>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

/** Dues status, payment history and a simulated checkout with a receipt. */
export function DuesPanel() {
  const { currentMember, data, payDues } = useDemo()
  const [receipt, setReceipt] = useState<Transaction | null>(null)

  const invoices = useMemo(
    () => (currentMember ? data.duesInvoices.filter((invoice) => invoice.memberId === currentMember.id) : []),
    [currentMember, data.duesInvoices],
  )

  const payments = useMemo(
    () =>
      currentMember
        ? data.transactions.filter(
            (transaction) => transaction.memberId === currentMember.id && transaction.kind === 'Dues',
          )
        : [],
    [currentMember, data.transactions],
  )

  if (!currentMember) {
    return <DemoNotice>Your dues information could not be loaded.</DemoNotice>
  }

  const outstanding = invoices.filter((invoice) => invoice.status !== 'Paid')
  const paidTotal = payments.reduce((sum, payment) => sum + payment.amountNgn, 0)
  const dueTotal = outstanding.reduce((sum, invoice) => sum + invoice.amountNgn, 0)
  const target = paidTotal + dueTotal

  return (
    <div className="stack">
      <Panel>
        <h3>Where you stand</h3>
        <p>
          Dues status: <StatusBadge status={currentMember.duesStatus} />
        </p>
        <Tracker
          raised={paidTotal}
          target={target || paidTotal || 1}
          formatValue={formatNaira}
          leftLabel="Paid"
          rightLabel="Of assessed dues"
        />
      </Panel>

      <Panel>
        <h3>Invoices</h3>
        {invoices.length === 0 ? (
          <p>No invoices have been raised for this member.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Invoice</th>
                  <th scope="col">Period</th>
                  <th scope="col" className="num">
                    Amount
                  </th>
                  <th scope="col">Due</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="muted">{invoice.invoiceNo}</td>
                    <td>{invoice.period}</td>
                    <td className="num">{formatNaira(invoice.amountNgn)}</td>
                    <td className="muted">{invoice.dueDate}</td>
                    <td>
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td>
                      {invoice.status === 'Paid' ? (
                        <span className="muted">Settled</span>
                      ) : (
                        <button
                          type="button"
                          className="btn gold"
                          onClick={() => setReceipt(payDues(invoice.id))}
                        >
                          Pay (simulated)
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {receipt ? (
        <Panel tone="mist">
          <Badge tone="gold">Demonstration receipt</Badge>
          <div className="receipt" style={{ marginTop: 16 }}>
            <h3>Dues receipt (sample)</h3>
            <dl>
              <dt>Receipt number</dt>
              <dd>{receipt.receiptNo}</dd>
              <dt>Reference</dt>
              <dd>{receipt.reference}</dd>
              <dt>Description</dt>
              <dd>{receipt.description}</dd>
              <dt>Amount</dt>
              <dd>{formatNaira(receipt.amountNgn)}</dd>
              <dt>Date</dt>
              <dd>{receipt.date}</dd>
              <dt>Method</dt>
              <dd>{receipt.method}</dd>
            </dl>
          </div>
          <DemoNotice>No payment provider is connected; no money has been transferred.</DemoNotice>
        </Panel>
      ) : null}

      <Panel>
        <h3>Payment history</h3>
        {payments.length === 0 ? (
          <p>No payments have been recorded yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Description</th>
                  <th scope="col" className="num">
                    Amount
                  </th>
                  <th scope="col">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="muted">{payment.date}</td>
                    <td>{payment.description}</td>
                    <td className="num">{formatNaira(payment.amountNgn)}</td>
                    <td className="muted">{payment.receiptNo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

/** Signs out of the simulated session. */
export function SignOutButton() {
  const { logout } = useDemo()
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => {
        logout()
        router.push('/portal/login')
      }}
    >
      Sign out
    </button>
  )
}

/* -------------------------------------------------------------------------- */

/** The portal dashboard: a member's own summary of the platform. */
export function PortalDashboard() {
  const { currentMember, data, stats } = useDemo()

  if (!currentMember) {
    return <DemoNotice>Your dashboard could not be loaded.</DemoNotice>
  }

  const invoices = data.duesInvoices.filter((invoice) => invoice.memberId === currentMember.id)
  const outstanding = invoices.filter((invoice) => invoice.status !== 'Paid')
  const outstandingTotal = outstanding.reduce((sum, invoice) => sum + invoice.amountNgn, 0)
  const notices = data.meetings.filter((meeting) => meeting.status === 'Published')
  const volunteer = data.volunteers.find((item) => item.name === currentMember.name) ?? null

  return (
    <div className="stack">
      <MetricGrid>
        <Metric value={currentMember.category.replace(' member', '')} label="Membership category" />
        <Metric value={currentMember.duesStatus} label="Dues status" />
        <Metric value={formatNaira(outstandingTotal)} label="Outstanding dues" />
        <Metric value={String(stats.ongoingProjects)} label="Projects underway" />
      </MetricGrid>

      <div className="split">
        <Panel>
          <h3>Your next meeting</h3>
          {notices.length > 0 ? (
            <ul className="timeline">
              {notices.slice(0, 3).map((meeting) => (
                <li key={meeting.id}>
                  <small>
                    {meeting.kind} · {meeting.date}
                  </small>
                  <b>{meeting.title}</b>
                  <p>{meeting.summary}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No meeting records have been published yet.</p>
          )}
        </Panel>

        <div className="panel-stack">
          <Panel tone="mist">
            <h3>Volunteer profile</h3>
            {volunteer ? (
              <p>
                You are registered as a {volunteer.category} volunteer, available{' '}
                {volunteer.availability}. Current status: <StatusBadge status={volunteer.status} />.
              </p>
            ) : (
              <p>
                You are not yet in the volunteer skills database.{' '}
                <a href="/volunteer">Register your skills</a>.
              </p>
            )}
          </Panel>

          <Panel>
            <h3>Quick actions</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
              <li>
                <a href="/portal/profile">View and edit your profile</a>
              </li>
              <li>
                <a href="/portal/dues">Pay dues and view receipts</a>
              </li>
              <li>
                <a href="/portal/directory">Open the members’ directory</a>
              </li>
              <li>
                <a href="/donate">Make a simulated contribution</a>
              </li>
              <li>
                <a href="/feedback">Send feedback</a>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

/**
 * The opt-in members' directory.
 *
 * Only members who have agreed to appear are listed, and only non-sensitive
 * fields are ever shown; email and phone are never rendered here.
 */
export function MemberDirectory() {
  const { data, currentMember } = useDemo()
  const [query, setQuery] = useState('')

  const visible = data.members.filter((member) => member.directoryVisible)
  const filtered = visible.filter((member) =>
    `${member.name} ${member.profession} ${member.location} ${member.category}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  )

  return (
    <div>
      <div className="filter-bar">
        <input
          type="search"
          placeholder="Search the directory by name, profession or location"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search the members' directory"
        />
      </div>

      <DemoNotice>
        Privacy-conscious view: only name, category, profession and location are shown, and only for
        members who opted in. Email addresses and phone numbers are never displayed.
        {currentMember && !currentMember.directoryVisible
          ? ' You are currently hidden from the directory.'
          : ''}
      </DemoNotice>

      {filtered.length === 0 ? (
        <p className="state-message">No members match your search.</p>
      ) : (
        <div className="row-list">
          {filtered.map((member) => (
            <div key={member.id}>
              <div>
                <Avatar name={member.name} />
              </div>
              <div>
                <small>{member.category}</small>
                <h3>{member.name}</h3>
                <p>
                  {member.profession} · {member.location}
                </p>
              </div>
              <div>
                <StatusBadge status={member.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
