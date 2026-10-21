/**
 * Studio structure.
 *
 * The desk mirrors the structure of the website: the single pages an editor
 * changes most often come first, then the repeatable content grouped the way
 * the site groups it — pages, the forum, and the event calendar. A document
 * that is a singleton is pinned to its id, so there is never more than one of
 * it and the editor always lands on the right one.
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
      // The pages the site is built from
      S.listItem()
        .title('Site')
        .id('site')
        .child(
          S.list()
            .title('Site')
            .id('site-list')
            .items([
              singletonPane(S, 'siteSettings', 'Site settings'),
              singletonPane(S, 'homepage', 'Home page'),
              singletonPane(S, 'aboutPage', 'About page'),
              singletonPane(S, 'eventsPage', 'Events page'),
              singletonPane(S, 'businessHub', 'Business Hub'),
              singletonPane(S, 'libraryPage', 'Knowledge Library'),
              singletonPane(S, 'communityNeeds', 'Community Needs'),
              singletonPane(S, 'membershipPage', 'Membership page'),
            ]),
        ),

      S.divider(),

      // Editorial pages and the detail pages behind them
      S.listItem()
        .title('Pages')
        .id('pages')
        .child(
          S.list()
            .title('Pages')
            .id('pages-list')
            .items([
              S.documentTypeListItem('editorialPage').title('Editorial pages'),
              S.documentTypeListItem('detailPage').title('Detail pages'),
            ]),
        ),

      // The Knowledge & Ideas Forum
      S.listItem()
        .title('Forum')
        .id('forum')
        .child(
          S.list()
            .title('Forum')
            .id('forum-list')
            .items([
              S.documentTypeListItem('forumThread').title('Forum threads'),
              S.divider(),
              S.documentTypeListItem('detailPage')
                .title('Forum landing page')
                .child(
                  S.documentList()
                    .title('Forum landing page')
                    .filter('_type == "detailPage" && type == "forum"'),
                ),
            ]),
        ),

      // The event calendar and the activities on the home page
      S.listItem()
        .title('Events')
        .id('events')
        .child(
          S.list()
            .title('Events')
            .id('events-list')
            .items([
              S.documentTypeListItem('event').title('Events'),
              S.documentTypeListItem('featuredActivity').title('Featured activities'),
            ]),
        ),
    ])
