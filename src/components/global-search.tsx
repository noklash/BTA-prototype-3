'use client'

import Link from 'next/link'
import { useId, useState } from 'react'

import { DEMO_DATA } from '@/lib/demo/data'

import { CloseIcon, SearchIcon } from './ui/icons'

interface SearchEntry {
  title: string
  description: string
  href: string
  kind: string
}

/**
 * The demonstration search index.
 *
 * It is built from the same dataset the pages render, so a search result always
 * points at a page that exists. Editorial Sanity content is added through the
 * static entries below; the CMS-driven pages remain reachable even when the
 * Content Lake is unavailable.
 */
const STATIC_ENTRIES: SearchEntry[] = [
  {
    title: 'About BTA',
    description: 'Who we are, our story, leadership and the BTA 2035 vision.',
    href: '/about',
    kind: 'Page',
  },
  {
    title: 'Membership',
    description: 'Categories, subscriptions and how to express your interest.',
    href: '/membership',
    kind: 'Page',
  },
  {
    title: 'Events & media',
    description: 'Meetings, forums and gatherings, plus news from across BTA.',
    href: '/events',
    kind: 'Page',
  },
  {
    title: 'Business hub',
    description: 'The member business and investment directory.',
    href: '/enterprise/business-hub',
    kind: 'Page',
  },
  {
    title: 'Knowledge library',
    description: 'Articles, research, webinars and reports shared by members.',
    href: '/library',
    kind: 'Page',
  },
  {
    title: 'Transparency',
    description: 'Illustrative statements, budgets and expenditure reports.',
    href: '/transparency',
    kind: 'Page',
  },
  {
    title: 'Diaspora hub',
    description: 'Register your interest and connect with the association from abroad.',
    href: '/diaspora',
    kind: 'Page',
  },
  {
    title: 'Youth & scholarships',
    description: 'Scholarships, internships, mentoring and training opportunities.',
    href: '/youth',
    kind: 'Page',
  },
  {
    title: 'Volunteer skills',
    description: 'Join the professional skills database or offer practical support.',
    href: '/volunteer',
    kind: 'Page',
  },
  {
    title: 'Feedback & proposals',
    description: 'Suggestions, survey responses and community project proposals.',
    href: '/feedback',
    kind: 'Page',
  },
  {
    title: 'Community needs',
    description: 'Submit a local need for review by the appropriate committee.',
    href: '/community-needs',
    kind: 'Page',
  },
  {
    title: 'Platform roadmap',
    description: 'What is demonstrated, simulated and planned for production.',
    href: '/roadmap',
    kind: 'Page',
  },
]

const SEARCH_INDEX: SearchEntry[] = [
  ...STATIC_ENTRIES,
  ...DEMO_DATA.projects.map((project) => ({
    title: project.name,
    description: `${project.category} · ${project.location}`,
    href: `/projects/${project.slug}`,
    kind: 'Project',
  })),
  ...DEMO_DATA.knowledge
    .filter((item) => item.status === 'Published')
    .map((item) => ({
      title: item.title,
      description: `${item.kind} · ${item.author}`,
      href: `/library/${item.slug}`,
      kind: 'Knowledge',
    })),
  ...DEMO_DATA.opportunities.map((opportunity) => ({
    title: opportunity.title,
    description: `${opportunity.kind} · ${opportunity.provider}`,
    href: `/youth/${opportunity.slug}`,
    kind: 'Opportunity',
  })),
  ...DEMO_DATA.businesses
    .filter((business) => business.status === 'Published')
    .map((business) => ({
      title: business.name,
      description: `${business.category} · ${business.location}`,
      href: `/enterprise/business-hub/${business.slug}`,
      kind: 'Business',
    })),
]

function search(query: string): SearchEntry[] {
  const term = query.trim().toLowerCase()
  if (term.length < 2) {
    return []
  }

  return SEARCH_INDEX.filter((entry) =>
    `${entry.title} ${entry.description} ${entry.kind}`.toLowerCase().includes(term),
  ).slice(0, 8)
}

/**
 * The global search modal.
 *
 * The toggle and panel follow the reference header's utility strip: a small
 * "Search" button that opens a centred dialog. Only this island is interactive;
 * the header and the rest of the page remain server-rendered HTML.
 */
export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const dialogId = useId()

  const results = search(query)

  function close() {
    setOpen(false)
    setQuery('')
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <SearchIcon size={13} />
        Search
      </button>

      {open ? (
        <div
          className="modal"
          role="presentation"
          onClick={close}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              close()
            }
          }}
        >
          <div
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" onClick={close} aria-label="Close search">
              <CloseIcon size={20} />
            </button>

            <span className="eyebrow">Global search</span>

            <h2>What are you looking for?</h2>

            <label>
              <SearchIcon size={18} />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search initiatives, events, knowledge…"
                aria-label="Search"
              />
            </label>

            {results.length > 0 ? (
              <ul className="search-results">
                {results.map((result) => (
                  <li key={`${result.kind}-${result.href}`}>
                    <Link href={result.href} onClick={close}>
                      <span>{result.kind}</span>
                      <b>{result.title}</b>
                      <small>{result.description}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                {query.trim().length >= 2
                  ? 'No pages match that search. Try a project, a business or a knowledge topic.'
                  : 'Try “Blue Economy”, “membership” or “community projects”.'}
              </p>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
