/**
 * Studio structure.
 *
 * The desk mirrors the structure of the website, but it stays flat: an editor
 * sees every document type in one scrollable list, with the single pages first
 * because they are what changes most often. Nothing is nested more than one
 * level, so the desk never becomes a maze of sub-menus.
 */
import type { StructureResolver } from 'sanity/structure'

// Relative (not `@/…`) on purpose: everything reachable from `sanity.config.ts`
// is also bundled by the Sanity CLI, which should not depend on the Next.js
// path alias in tsconfig.json.
import { SINGLETON_DOCUMENT_IDS, type SingletonDocumentType } from '../lib/sanity/env'

function singletonPane(
  S: Parameters<StructureResolver>[0],
  typeName: SingletonDocumentType,
  title: string,
) {
  // Indexing with a literal key of the `SINGLETON_DOCUMENT_IDS` object always
  // yields a definite string, so the pinned document id is type-safe here.
  const documentId = SINGLETON_DOCUMENT_IDS[typeName]

  return S.listItem()
    .title(title)
    .id(documentId)
    .child(S.document().schemaType(typeName).documentId(documentId))
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.divider(),
      singletonPane(S, 'siteSettings', 'Site settings'),
      singletonPane(S, 'homepage', 'Home page'),
      singletonPane(S, 'aboutPage', 'About page'),
      singletonPane(S, 'eventsPage', 'Events page'),
      singletonPane(S, 'businessHub', 'Business Hub'),
      singletonPane(S, 'libraryPage', 'Knowledge Library'),
      singletonPane(S, 'communityNeeds', 'Community Needs'),
      singletonPane(S, 'membershipPage', 'Membership page'),

      S.divider(),
      S.documentTypeListItem('editorialPage').title('Editorial pages'),
      S.documentTypeListItem('detailPage').title('Detail pages'),

      S.divider(),
      S.documentTypeListItem('forumThread').title('Forum threads'),

      S.divider(),
      S.documentTypeListItem('event').title('Events'),
      S.documentTypeListItem('featuredActivity').title('Featured activities'),
    ])
