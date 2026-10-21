/**
 * Studio icons.
 *
 * Small line icons drawn in the website's own style — a single gold stroke on
 * transparent — so the CMS desk reads as an extension of the site rather than
 * a different product. They are plain SVG components, so they work in the desk,
 * in the structure and in a document preview.
 */
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function icon(path: React.ReactNode) {
  return function Icon(props: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {path}
      </svg>
    )
  }
}

/** The organisation mark: a circle with three gold strokes. */
export const MarkIcon = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M6.5 10.5 17 8" />
    <path d="M6.5 13.5 17 11" />
    <path d="M6.5 16.5 17 14" />
  </>,
)

/** A page: the editorial and singleton documents. */
export const PageIcon = icon(
  <>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4" />
    <path d="M9 12h6M9 16h4" />
  </>,
)

/** A long read: an article or a thread. */
export const ArticleIcon = icon(
  <>
    <path d="M4 5h11a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3z" />
    <path d="M18 8h2v11H7" />
    <path d="M8 9h6M8 13h6" />
  </>,
)

/** A conversation: the forum. */
export const ForumIcon = icon(
  <>
    <path d="M4 5h16v11H9l-5 4z" />
    <path d="M8 10h8M8 13h5" />
  </>,
)

/** A calendar: events. */
export const CalendarIcon = icon(
  <>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </>,
)

/** A building: partners and businesses. */
export const BusinessIcon = icon(
  <>
    <path d="M4 21V6l7-3 7 3v15" />
    <path d="M9 21v-5h6v5" />
    <path d="M8 9h1M13 9h1M8 13h1" />
  </>,
)

/** A settings cog: the site settings. */
export const SettingsIcon = icon(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" />
  </>,
)

/** A person: the community. */
export const PeopleIcon = icon(
  <>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 6.5a3 3 0 0 1 0 6M17 20a5.5 5.5 0 0 0-2-4.3" />
  </>,
)
