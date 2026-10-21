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

/**
 * The Studio is themed with the same palette as the website, so editing feels
 * like an extension of the site rather than a different product.
 *
 * Navy carries the chrome, gold marks the accent, and the mist/line tones come
 * from the site tokens in `src/app/globals.css`.
 */
const studioTheme = {
  colors: {
    background: '#ffffff',
    text: '#11263a',
    textMuted: '#607181',
    textCard: '#11263a',
    textInput: '#11263a',
    spotlight: '#061d35',
    base: '#f3f6f7',
    primary: '#0a3157',
    positive: '#145587',
    caution: '#d5a62e',
    critical: '#9d2b23',
    input: '#f3f6f7',
    inputBorder: '#d9e1e6',
  },
}

export const studioConfig = defineConfig({
  name: 'heritage-circle',
  title: 'Bainbo Taria Awo  ',
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
  workspace: {
    name: 'default',
    title: 'Bainbo Taria Awo  ',
    basePath: '/studio',
    theme: studioTheme,
  },
})

export default studioConfig
