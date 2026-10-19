import type { Metadata } from 'next'

import { AppHead, Badge, DemoNotice, Panel } from '@/components/demo/ui'
import { DEMO_DATA } from '@/lib/demo/data'

export const metadata: Metadata = {
  title: 'Meetings & records · Members’ Portal',
  description: 'Meeting notices, agendas, approved minutes and official circulars.',
  alternates: { canonical: '/portal/meetings' },
  robots: { index: false, follow: false },
}

const KINDS = ['Notice', 'Agenda', 'Minutes', 'Circular'] as const

export default function PortalMeetingsPage() {
  const published = DEMO_DATA.meetings.filter((meeting) => meeting.status === 'Published')

  return (
    <>
      <AppHead
        eyebrow="Members’ portal"
        title="Meetings & records"
        description="Notices, agendas, approved minutes and official circulars, newest first."
      />

      <DemoNotice>
        Meeting documents are illustrative records created for the prototype. They are not the
        minutes of any real meeting.
      </DemoNotice>

      <div className="stack">
        {KINDS.map((kind) => {
          const records = published.filter((meeting) => meeting.kind === kind)
          if (records.length === 0) {
            return null
          }
          return (
            <Panel key={kind}>
              <h3>{kind === 'Minutes' ? 'Approved minutes' : `${kind}s`}</h3>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Title</th>
                      <th scope="col">Reference</th>
                      <th scope="col">Document</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id}>
                        <td className="muted">{record.date}</td>
                        <td>
                          {record.title}
                          <br />
                          <span className="muted">{record.summary}</span>
                        </td>
                        <td className="muted">{record.documentRef}</td>
                        <td>
                          <Badge>{kind}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          )
        })}
      </div>
    </>
  )
}
