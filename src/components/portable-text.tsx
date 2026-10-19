import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Link from 'next/link'

import type { RichTextValue } from '@/types/content'

interface LinkAnnotation {
  href?: string
  openInNewTab?: boolean
}

/**
 * Maps the deliberately small rich text schema
 * (`src/sanity/schemaTypes/objects/richText.ts`) onto semantic HTML.
 *
 * Every style and mark declared in the schema has an entry here; anything else
 * would render as unstyled markup, which is why the schema keeps the set small.
 * The typography lives in the `.rich-text` rules of `globals.css`.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  listItem: ({ children }) => <li>{children}</li>,
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => {
      const { href, openInNewTab } = (value ?? {}) as LinkAnnotation

      if (!href) {
        return <>{children}</>
      }

      const isExternal = /^https?:\/\//i.test(href)

      if (isExternal || openInNewTab) {
        return (
          <a href={href} rel="noreferrer noopener" target={openInNewTab ? '_blank' : undefined}>
            {children}
          </a>
        )
      }

      return <Link href={href}>{children}</Link>
    },
  },
}

/** Renders a Sanity rich text value, or nothing when the field is empty. */
export function RichText({
  value,
  className = '',
}: {
  value: RichTextValue | null | undefined
  className?: string
}) {
  if (!value || value.length === 0) {
    return null
  }

  return (
    <div className={`rich-text ${className}`.trim()}>
      <PortableText value={value} components={components} />
    </div>
  )
}
