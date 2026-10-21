'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { formatNaira } from '@/lib/demo/format'
import { useDemo } from '@/lib/demo/store'

import { ArrowRightIcon } from '@/components/ui/icons'

import { StageBadge, StatusBadge, Tracker } from './ui'

/**
 * Filterable directories for the Prototype 3 platform.
 *
 * Each directory reads the shared demonstration store (rather than receiving a
 * static copy) so that a status change made in the admin area is reflected here
 * immediately, in the same browser.
 */

function useFilterState() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  return { query, setQuery, filter, setFilter }
}

function matches(text: string, query: string): boolean {
  return query.trim().length === 0 || text.toLowerCase().includes(query.trim().toLowerCase())
}

/* -------------------------------------------------------------------------- */

/**
 * The project bank directory.
 *
 * The stories (title, summary, location, category) come from the CMS and are
 * passed in by the server-rendered page; the figures (stage, budget, funding
 * raised) come from the demonstration store, so a stage change made in the
 * admin area is reflected here immediately, in the same browser.
 */
export function ProjectDirectory({
  overrides = [],
}: {
  overrides?: { slug: string; name: string; summary: string; location: string; category: string }[]
}) {
  const { data } = useDemo()
  const { query, setQuery, filter, setFilter } = useFilterState()

  const bySlug = useMemo(
    () => new Map(overrides.map((project) => [project.slug, project])),
    [overrides],
  )

  const projects = useMemo(
    () =>
      data.projects.map((project) => {
        const override = bySlug.get(project.slug)
        return override
          ? {
              ...project,
              name: override.name,
              summary: override.summary,
              location: override.location,
              category: override.category,
            }
          : project
      }),
    [data.projects, bySlug],
  )

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((project) => project.category)))],
    [projects],
  )

  const filtered = projects.filter((project) => {
    const inCategory = filter === 'all' || filter === 'All' || project.category === filter
    return inCategory && matches(`${project.name} ${project.summary} ${project.location}`, query)
  })

  return (
    <div>
      <div className="filter-bar">
        <input
          type="search"
          placeholder="Search projects by name, location or summary"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search projects"
        />
        <div className="chip-row">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={filter === category ? 'chip active' : 'chip'}
              aria-pressed={filter === category}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="state-message">No projects match your search. Try a different term or category.</p>
      ) : (
        <div className="row-list">
          {filtered.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`}>
              <div>
                <StageBadge stage={project.stage} />
              </div>
              <div>
                <small>{project.category}</small>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <Tracker
                  raised={project.raisedNgn}
                  target={project.fundingTargetNgn}
                  formatValue={formatNaira}
                  leftLabel="Raised"
                />
              </div>
              <div>
                <ArrowRightIcon />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */

export function BusinessDirectory() {
  const { data } = useDemo()
  const { query, setQuery, filter, setFilter } = useFilterState()

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(data.businesses.map((business) => business.category)))],
    [data.businesses],
  )

  const filtered = data.businesses
    .filter((business) => business.status === 'Published')
    .filter((business) => {
      const inCategory = filter === 'all' || filter === 'All' || business.category === filter
      return inCategory && matches(`${business.name} ${business.description} ${business.location}`, query)
    })

  return (
    <div>
      <div className="filter-bar">
        <input
          type="search"
          placeholder="Search by name, service or location"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search businesses"
        />
        <div className="chip-row">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={filter === category ? 'chip active' : 'chip'}
              aria-pressed={filter === category}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="state-message">No listings match your search.</p>
      ) : (
        <div className="row-list">
          {filtered.map((business) => (
            <Link key={business.id} href={`/enterprise/business-hub/${business.slug}`}>
              <div>{business.diasporaOwned ? <span className="badge">Diaspora</span> : null}</div>
              <div>
                <small>{business.category}</small>
                <h3>{business.name}</h3>
                <p>
                  {business.location} · {business.description}
                </p>
              </div>
              <div>
                <ArrowRightIcon />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */

export function KnowledgeDirectory() {
  const { data } = useDemo()
  const { query, setQuery, filter, setFilter } = useFilterState()

  const kinds = useMemo(
    () => ['All', ...Array.from(new Set(data.knowledge.map((item) => item.kind)))],
    [data.knowledge],
  )

  const filtered = data.knowledge
    .filter((item) => item.status === 'Published')
    .filter((item) => {
      const inKind = filter === 'all' || filter === 'All' || item.kind === filter
      return inKind && matches(`${item.title} ${item.summary} ${item.author} ${item.topics.join(' ')}`, query)
    })

  return (
    <div>
      <div className="filter-bar">
        <input
          type="search"
          placeholder="Search articles, research and webinars"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search knowledge resources"
        />
        <div className="chip-row">
          {kinds.map((kind) => (
            <button
              key={kind}
              type="button"
              className={filter === kind ? 'chip active' : 'chip'}
              aria-pressed={filter === kind}
              onClick={() => setFilter(kind)}
            >
              {kind}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="state-message">No contributions match your search.</p>
      ) : (
        <div className="row-list">
          {filtered.map((item) => (
            <Link key={item.id} href={`/library/${item.slug}`}>
              <div>
                <span className="badge">{item.kind}</span>
              </div>
              <div>
                <small>{item.date}</small>
                <h3>{item.title}</h3>
                <p>
                  {item.author} · {item.authorRole}
                </p>
              </div>
              <div>
                <ArrowRightIcon />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */

export function OpportunityDirectory() {
  const { data } = useDemo()
  const { query, setQuery, filter, setFilter } = useFilterState()

  const kinds = useMemo(
    () => ['All', ...Array.from(new Set(data.opportunities.map((item) => item.kind)))],
    [data.opportunities],
  )

  const filtered = data.opportunities.filter((item) => {
    const inKind = filter === 'all' || filter === 'All' || item.kind === filter
    return inKind && matches(`${item.title} ${item.summary} ${item.provider} ${item.location}`, query)
  })

  return (
    <div>
      <div className="filter-bar">
        <input
          type="search"
          placeholder="Search scholarships, internships and training"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search opportunities"
        />
        <div className="chip-row">
          {kinds.map((kind) => (
            <button
              key={kind}
              type="button"
              className={filter === kind ? 'chip active' : 'chip'}
              aria-pressed={filter === kind}
              onClick={() => setFilter(kind)}
            >
              {kind}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="state-message">No opportunities match your search.</p>
      ) : (
        <div className="row-list">
          {filtered.map((item) => (
            <Link key={item.id} href={`/youth/${item.slug}`}>
              <div>
                <StatusBadge status={item.status} />
              </div>
              <div>
                <small>
                  {item.kind} · closes {item.deadline}
                </small>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </div>
              <div>
                <ArrowRightIcon />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */

/**
 * The moderation board shown on the feedback page.
 *
 * It reads the shared store, so an entry submitted through the form above (or a
 * status changed in the admin area) is reflected here immediately in the same
 * browser.
 */
export function FeedbackBoard() {
  const { data } = useDemo()

  if (data.feedback.length === 0) {
    return <p className="state-message">No feedback has been recorded yet.</p>
  }

  return (
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
                <StatusBadge status={entry.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
