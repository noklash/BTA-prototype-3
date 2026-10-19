'use client'

import { useMemo, useState } from 'react'

import { formatNaira, progressPercent } from '@/lib/demo/format'
import { useDemo } from '@/lib/demo/store'
import type { Application, BusinessListing, KnowledgeResource, Member, MeetingRecord, ModerationStatus, ProjectStage, Volunteer } from '@/lib/demo/types'

import { Avatar, Badge, DemoNotice, Metric, MetricGrid, Panel, StatusBadge, Tracker } from './ui'

/**
 * The demonstration administrative area.
 *
 * Every panel reads from, and writes to, the shared demonstration store, so a
 * change made here (a status, a stage, a dues state) is reflected in the
 * members' portal and the public directories in the same browser. Everything is
 * simulated and labelled as such.
 */

function StatusSelect<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: readonly T[]
  onChange: (value: T) => void
  label: string
}) {
  return (
    <select
      className="inline-select"
      value={value}
      aria-label={label}
      onChange={(event) => onChange(event.target.value as T)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

function SearchBox({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
}) {
  return (
    <div className="filter-bar">
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
      />
    </div>
  )
}

function includes(query: string, ...fields: (string | null | undefined)[]): boolean {
  if (query.trim().length === 0) {
    return true
  }
  return fields.join(' ').toLowerCase().includes(query.trim().toLowerCase())
}

/* -------------------------------------------------------------------------- */

export function AdminOverview() {
  const { data, stats, reset } = useDemo()

  return (
    <div className="stack">
      <DemoNotice>
        <strong>Demonstration admin.</strong> All records are illustrative. Changes are held in this
        browser and can be reset at any time.
      </DemoNotice>

      <MetricGrid>
        <Metric value={String(stats.members)} label="Members" />
        <Metric value={String(stats.projects)} label="Projects" />
        <Metric value={String(data.feedback.filter((f) => f.status !== 'Published').length)} label="Feedback awaiting action" />
        <Metric value={String(data.applications.filter((a) => a.status === 'Submitted').length)} label="New applications" />
      </MetricGrid>

      <div className="split">
        <Panel>
          <h3>Recent activity</h3>
          <ul className="timeline">
            {data.activity.slice(0, 8).map((entry) => (
              <li key={entry.id}>
                <small>
                  {entry.date} · {entry.actor}
                </small>
                <b>{entry.action}</b>
                <p>{entry.target}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="panel-stack">
          <Panel tone="mist">
            <h3>Queues</h3>
            <dl className="definition-list" style={{ gridTemplateColumns: '1fr auto' }}>
              <dt>Business listings pending</dt>
              <dd>{data.businesses.filter((b) => b.status === 'Pending review').length}</dd>
              <dt>Volunteers registered</dt>
              <dd>{data.volunteers.length}</dd>
              <dt>Partnership enquiries</dt>
              <dd>{data.partnerships.length}</dd>
              <dt>Diaspora registrations</dt>
              <dd>{data.diasporaRegistrations.length}</dd>
            </dl>
          </Panel>

          <Panel>
            <h3>Reset the demonstration</h3>
            <p>Restore the original mock dataset and sign out, clearing any changes made here.</p>
            <button
              type="button"
              className="btn outline"
              onClick={() => {
                if (window.confirm('Reset all demonstration data in this browser?')) {
                  reset()
                }
              }}
            >
              Reset demonstration data
            </button>
          </Panel>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

export function MembersTable() {
  const { data, setMemberDuesStatus } = useDemo()
  const [query, setQuery] = useState('')

  const filtered = data.members.filter((member) =>
    includes(query, member.name, member.category, member.location, member.profession, member.status),
  )

  return (
    <div>
      <SearchBox value={query} onChange={setQuery} placeholder="Search members" label="Search members" />

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Member</th>
              <th scope="col">Category</th>
              <th scope="col">Location</th>
              <th scope="col">Status</th>
              <th scope="col">Directory</th>
              <th scope="col">Dues</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr key={member.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={member.name} />
                    <span>
                      {member.name}
                      <br />
                      <span className="muted">{member.profession}</span>
                    </span>
                  </div>
                </td>
                <td className="muted">{member.category}</td>
                <td className="muted">{member.location}</td>
                <td>
                  <StatusBadge status={member.status} />
                </td>
                <td className="muted">{member.directoryVisible ? 'Visible' : 'Hidden'}</td>
                <td>
                  <StatusSelect<Member['duesStatus']>
                    value={member.duesStatus}
                    options={['Paid', 'Due', 'Overdue']}
                    onChange={(status) => setMemberDuesStatus(member.id, status)}
                    label={`Dues status for ${member.name}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

export function ContentPanel() {
  const { data, setMeetingStatus, setKnowledgeStatus } = useDemo()

  return (
    <div className="stack">
      <Panel>
        <h3>Meeting records and announcements</h3>
        <p>Publish or hold records back. Drafts are never shown to members in the portal.</p>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Kind</th>
                <th scope="col">Title</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.meetings.map((meeting) => (
                <tr key={meeting.id}>
                  <td>
                    <Badge>{meeting.kind}</Badge>
                  </td>
                  <td>{meeting.title}</td>
                  <td className="muted">{meeting.date}</td>
                  <td>
                    <StatusSelect<MeetingRecord['status']>
                      value={meeting.status}
                      options={['Published', 'Draft']}
                      onChange={(status) => setMeetingStatus(meeting.id, status)}
                      label={`Status for ${meeting.title}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel>
        <h3>Knowledge contributions</h3>
        <p>Move contributed knowledge through the review workflow.</p>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Kind</th>
                <th scope="col">Title</th>
                <th scope="col">Author</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.knowledge.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Badge>{item.kind}</Badge>
                  </td>
                  <td>{item.title}</td>
                  <td className="muted">{item.author}</td>
                  <td>
                    <StatusSelect<KnowledgeResource['status']>
                      value={item.status}
                      options={['Submitted', 'In review', 'Published']}
                      onChange={(status) => setKnowledgeStatus(item.id, status)}
                      label={`Status for ${item.title}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

export function ProjectsTable() {
  const { data, setProjectStage } = useDemo()

  return (
    <Panel>
      <h3>Projects and progress</h3>
      <p>Change a project stage; the public project bank and tracker update in this browser.</p>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Project</th>
              <th scope="col">Category</th>
              <th scope="col">Stage</th>
              <th scope="col" className="num">
                Target
              </th>
              <th scope="col" className="num">
                Raised
              </th>
              <th scope="col">Progress</th>
            </tr>
          </thead>
          <tbody>
            {data.projects.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td className="muted">{project.category}</td>
                <td>
                  <StatusSelect<ProjectStage>
                    value={project.stage}
                    options={['Proposed', 'Approved', 'Ongoing', 'Completed']}
                    onChange={(stage) => setProjectStage(project.id, stage)}
                    label={`Stage for ${project.name}`}
                  />
                </td>
                <td className="num">{formatNaira(project.fundingTargetNgn)}</td>
                <td className="num">{formatNaira(project.raisedNgn)}</td>
                <td style={{ minWidth: 160 }}>
                  <Tracker
                    raised={project.raisedNgn}
                    target={project.fundingTargetNgn}
                    formatValue={(value) => `${progressPercent(value, project.fundingTargetNgn)}%`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

/* -------------------------------------------------------------------------- */

export function DuesTable() {
  const { data } = useDemo()

  const dues = data.transactions.filter((transaction) => transaction.kind === 'Dues')
  const contributions = data.transactions.filter((transaction) => transaction.kind === 'Contribution')
  const duesTotal = dues.reduce((sum, transaction) => sum + transaction.amountNgn, 0)
  const contributionTotal = contributions.reduce((sum, transaction) => sum + transaction.amountNgn, 0)

  const memberName = (id: string | null) =>
    id ? data.members.find((member) => member.id === id)?.name ?? 'Unknown member' : 'Supporter'

  return (
    <div className="stack">
      <MetricGrid>
        <Metric value={formatNaira(duesTotal)} label="Dues received (simulated)" />
        <Metric value={formatNaira(contributionTotal)} label="Contributions (simulated)" />
        <Metric value={String(data.duesInvoices.filter((i) => i.status !== 'Paid').length)} label="Outstanding invoices" />
        <Metric value={String(dues.length + contributions.length)} label="Transactions recorded" />
      </MetricGrid>

      <Panel>
        <h3>Invoices</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Invoice</th>
                <th scope="col">Member</th>
                <th scope="col">Period</th>
                <th scope="col" className="num">
                  Amount
                </th>
                <th scope="col">Due</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.duesInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="muted">{invoice.invoiceNo}</td>
                  <td>{memberName(invoice.memberId)}</td>
                  <td>{invoice.period}</td>
                  <td className="num">{formatNaira(invoice.amountNgn)}</td>
                  <td className="muted">{invoice.dueDate}</td>
                  <td>
                    <StatusBadge status={invoice.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel>
        <h3>Transaction log</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Kind</th>
                <th scope="col">Party</th>
                <th scope="col">Description</th>
                <th scope="col" className="num">
                  Amount
                </th>
                <th scope="col">Reference</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="muted">{transaction.date}</td>
                  <td>
                    <Badge tone={transaction.kind === 'Dues' ? 'default' : 'gold'}>{transaction.kind}</Badge>
                  </td>
                  <td>{memberName(transaction.memberId)}</td>
                  <td className="muted">{transaction.description}</td>
                  <td className="num">{formatNaira(transaction.amountNgn)}</td>
                  <td className="muted">{transaction.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

export function ApplicationsTable() {
  const { data, setApplicationStatus } = useDemo()

  const opportunityTitle = (id: string) =>
    data.opportunities.find((opportunity) => opportunity.id === id)?.title ?? 'Unknown opportunity'

  return (
    <Panel>
      <h3>Scholarship and opportunity applications</h3>
      <p>Move an application through the review stages. Applicants see the status in the portal.</p>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Applicant</th>
              <th scope="col">Opportunity</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.applications.map((application) => (
              <tr key={application.id}>
                <td>{application.applicantName}</td>
                <td className="muted">{opportunityTitle(application.opportunityId)}</td>
                <td className="muted">{application.date}</td>
                <td>
                  <StatusSelect<Application['status']>
                    value={application.status}
                    options={['Submitted', 'Under review', 'Shortlisted', 'Not taken forward']}
                    onChange={(status) => setApplicationStatus(application.id, status)}
                    label={`Status for ${application.applicantName}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

/* -------------------------------------------------------------------------- */

export function VolunteersTable() {
  const { data, setVolunteerStatus } = useDemo()

  return (
    <Panel>
      <h3>Volunteer registrations</h3>
      <p>Match volunteers to projects. Contact details are never shown publicly.</p>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Volunteer</th>
              <th scope="col">Category</th>
              <th scope="col">Skills</th>
              <th scope="col">Mode</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.volunteers.map((volunteer) => (
              <tr key={volunteer.id}>
                <td>
                  {volunteer.name}
                  <br />
                  <span className="muted">
                    {volunteer.profession} · {volunteer.location}
                  </span>
                </td>
                <td className="muted">{volunteer.category}</td>
                <td className="muted">{volunteer.skills.join(', ')}</td>
                <td className="muted">{volunteer.mode}</td>
                <td>
                  <StatusSelect<Volunteer['status']>
                    value={volunteer.status}
                    options={['Registered', 'Pending', 'Matched']}
                    onChange={(status) => setVolunteerStatus(volunteer.id, status)}
                    label={`Status for ${volunteer.name}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

/* -------------------------------------------------------------------------- */

export function BusinessesTable() {
  const { data, setBusinessStatus } = useDemo()
  const [query, setQuery] = useState('')

  const filtered = data.businesses.filter((business) =>
    includes(query, business.name, business.category, business.location, business.status),
  )

  return (
    <div>
      <SearchBox value={query} onChange={setQuery} placeholder="Search listings" label="Search listings" />

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Business</th>
              <th scope="col">Category</th>
              <th scope="col">Location</th>
              <th scope="col">Owner</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((business) => (
              <tr key={business.id}>
                <td>
                  {business.name}
                  {business.diasporaOwned ? (
                    <>
                      {' '}
                      <Badge>Diaspora</Badge>
                    </>
                  ) : null}
                </td>
                <td className="muted">{business.category}</td>
                <td className="muted">{business.location}</td>
                <td className="muted">{business.owner}</td>
                <td>
                  <StatusSelect<BusinessListing['status']>
                    value={business.status}
                    options={['Published', 'Pending review']}
                    onChange={(status) => setBusinessStatus(business.id, status)}
                    label={`Status for ${business.name}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

export function FeedbackTable() {
  const { data, setFeedbackStatus } = useDemo()

  return (
    <Panel>
      <h3>Feedback and proposals</h3>
      <p>Moderate entries submitted from the public feedback form and the knowledge hub.</p>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Kind</th>
              <th scope="col">Subject</th>
              <th scope="col">Submitted by</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.feedback.map((entry) => (
              <tr key={entry.id}>
                <td className="muted">{entry.kind}</td>
                <td>{entry.subject}</td>
                <td className="muted">{entry.submittedBy}</td>
                <td className="muted">{entry.date}</td>
                <td>
                  <StatusSelect<ModerationStatus>
                    value={entry.status}
                    options={['Submitted', 'Under review', 'Published']}
                    onChange={(status) => setFeedbackStatus(entry.id, status)}
                    label={`Status for ${entry.subject}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

/* -------------------------------------------------------------------------- */

export function PartnershipsTable() {
  const { data } = useDemo()

  return (
    <Panel>
      <h3>Partnership enquiries</h3>
      <p>
        Enquiries submitted from the partner page. No real organisation is contacted and no
        partnership exists.
      </p>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Organisation</th>
              <th scope="col">Type</th>
              <th scope="col">Priority</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.partnerships.map((enquiry) => (
              <tr key={enquiry.id}>
                <td>
                  {enquiry.organisation}
                  <br />
                  <span className="muted">{enquiry.contactName}</span>
                </td>
                <td className="muted">{enquiry.type}</td>
                <td className="muted">{enquiry.priority}</td>
                <td className="muted">{enquiry.date}</td>
                <td>
                  <StatusBadge status={enquiry.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}

/* -------------------------------------------------------------------------- */

export function RolesPanel() {
  const { data } = useDemo()

  const recent = useMemo(() => data.activity.slice(0, 12), [data.activity])

  return (
    <div className="stack">
      <div className="panel-grid cols-3">
        {data.adminRoles.map((role) => (
          <div key={role.id}>
            <h3>{role.name}</h3>
            <p>{role.description}</p>
            <p style={{ marginTop: 10 }}>
              <Badge>{role.holders} {role.holders === 1 ? 'holder' : 'holders'}</Badge>
            </p>
            <p className="muted" style={{ marginTop: 8 }}>
              {role.permissions.join(' · ')}
            </p>
          </div>
        ))}
      </div>

      <Panel>
        <h3>Activity history</h3>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Actor</th>
                <th scope="col">Action</th>
                <th scope="col">Target</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((entry) => (
                <tr key={entry.id}>
                  <td className="muted">{entry.date}</td>
                  <td>{entry.actor}</td>
                  <td className="muted">{entry.action}</td>
                  <td>{entry.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
