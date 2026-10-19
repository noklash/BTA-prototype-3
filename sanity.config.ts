/**
 * Sanity Studio configuration.
 *
 * This file is loaded in three places:
 *  - `npm run dev` / `npm run build`, through `src/app/studio/[[...tool]]`
 *    which embeds the Studio at `/studio`.
 *  - `npx sanity ...`, through `sanity.cli.ts`.
 *
 * It must therefore never throw on import. A missing project id results in an
 * empty string here and a friendly setup message on `/studio` (see
 * `src/app/studio/[[...tool]]/studio-route.tsx`) rather than a crashed build.
 */
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import {
  getSanityDataset,
  getSanityProjectId,
  SINGLETON_DOCUMENT_TYPES,
} from './src/lib/sanity/env'
import { schemaTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export const studioConfig = defineConfig({
  name: 'heritage-circle',
  title: 'The Heritage Circle',
  projectId: getSanityProjectId() ?? '',
  dataset: getSanityDataset() ?? '',
  basePath: '/studio',
  plugins: [
    structureTool({ name: 'content', title: 'Content', structure }),
    // GROQ playground, handy when extending the queries in
    // src/lib/sanity/queries.ts. Read-only for public datasets.
    visionTool({ defaultApiVersion: '2025-02-19' }),
  ],
  schema: { types: schemaTypes },
  document: {
    // Singletons are edited through their pinned pane, never created from the
    // global "+" menu.
    newDocumentOptions: (previous, { creationContext }) =>
      creationContext.type === 'global'
        ? previous.filter((template) => !SINGLETON_DOCUMENT_TYPES.includes(template.templateId))
        : previous,
  },
})

export default studioConfig
