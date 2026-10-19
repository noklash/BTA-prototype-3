/**
 * CLI configuration, used by `npx sanity …` commands such as
 * `npx sanity deploy`, `npx sanity dataset export` and `npx sanity documents`.
 *
 * The CLI loads `.env` and `.env.local` from the project root before every command
 * (a global prerun hook calls Vite's `loadEnv` with an empty prefix), so a filled-in
 * `.env.local` is enough for both the website and the CLI. Run the CLI from this
 * directory so the project root is found. Variables already set in your shell take
 * precedence over the files.
 */
import { defineCliConfig } from 'sanity/cli'

import { getSanityDataset, getSanityProjectId } from './src/lib/sanity/env'

export default defineCliConfig({
  api: {
    projectId: getSanityProjectId() ?? '',
    dataset: getSanityDataset() ?? '',
  },
  // Uncomment after the first `npx sanity deploy` if you also want a hosted
  // Studio in addition to the embedded one at /studio.
  // studioHost: 'heritage-circle',
})
