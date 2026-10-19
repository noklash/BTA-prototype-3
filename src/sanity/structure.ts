/**
 * Studio structure.
 *
 * The single-instance pages are pinned to fixed document ids and listed
 * first, so an editor can reach the copy they change most often in one click.
 * Repeatable content (events, featured activities, editorial/detail pages) is
 * listed underneath.
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
      // Singletons
      singletonPane(S, 'siteSettings', 'Site settings'),
      singletonPane(S, 'homepage', 'Home page'),
      singletonPane(S, 'aboutPage', 'About page'),
      singletonPane(S, 'eventsPage', 'Events page'),
      singletonPane(S, 'businessHub', 'Business Hub'),
      singletonPane(S, 'libraryPage', 'Knowledge Library'),
      singletonPane(S, 'communityNeeds', 'Community Needs'),
      singletonPane(S, 'membershipPage', 'Membership page'),
      S.divider(),
      // Repeatable documents
      S.documentTypeListItem('editorialPage').title('Editorial pages'),
      S.documentTypeListItem('detailPage').title('Detail pages'),
      S.documentTypeListItem('event').title('Events'),
      S.documentTypeListItem('featuredActivity').title('Featured activities'),
    ])