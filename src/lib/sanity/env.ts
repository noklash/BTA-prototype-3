/**
 * Sanity project configuration that is safe to use from both the Next.js
 * server and the browser bundle.
 *
 * Every value is read through a *static* `process.env.X` lookup so that Next.js
 * can inline the `NEXT_PUBLIC_*` values at build time. The private read token is
 * intentionally never returned by `getPublicSanityConfig`.
 */
import { SanityConfigError } from './errors'

/** Default Content Lake API version, used when `NEXT_PUBLIC_SANITY_API_VERSION` is unset. */
export const SANITY_API_VERSION_FALLBACK = '2025-02-19'

/** Environment variable names, exported so error messages and docs cannot drift apart. */
export const SANITY_ENV_KEYS = {
  projectId: 'NEXT_PUBLIC_SANITY_PROJECT_ID',
  dataset: 'NEXT_PUBLIC_SANITY_DATASET',
  apiVersion: 'NEXT_PUBLIC_SANITY_API_VERSION',
  readToken: 'SANITY_API_READ_TOKEN',
} as const

/**
 * Document types that must only ever exist once, mapped to the fixed document
 * id they are pinned to. They are exposed as single-item panes in the Studio
 * structure and hidden from the global "create new document" menu.
 */
export const SINGLETON_DOCUMENT_IDS = {
  siteSettings: 'siteSettings',
  homepage: 'homepage',
  aboutPage: 'aboutPage',
  eventsPage: 'eventsPage',
  businessHub: 'businessHub',
  libraryPage: 'libraryPage',
  communityNeeds: 'communityNeeds',
  membershipPage: 'membershipPage',
} as const

export type SingletonDocumentType = keyof typeof SINGLETON_DOCUMENT_IDS

export const SINGLETON_DOCUMENT_TYPES: readonly string[] = Object.keys(SINGLETON_DOCUMENT_IDS)

/** Returns the pinned document id for a singleton type name. */
export function getSingletonDocumentId(typeName: string): string | undefined {
  return Object.prototype.hasOwnProperty.call(SINGLETON_DOCUMENT_IDS, typeName)
    ? SINGLETON_DOCUMENT_IDS[typeName as SingletonDocumentType]
    : undefined
}

export interface PublicSanityConfig {
  projectId: string
  dataset: string
  apiVersion: string
}

export interface SanityServerConfig extends PublicSanityConfig {
  token: string | undefined
}

function nonEmpty(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed && trimmed.length > 0 ? trimmed : undefined
}

export function getSanityProjectId(): string | undefined {
  return nonEmpty(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
}

export function getSanityDataset(): string | undefined {
  return nonEmpty(process.env.NEXT_PUBLIC_SANITY_DATASET)
}

export function getSanityApiVersion(): string {
  return nonEmpty(process.env.NEXT_PUBLIC_SANITY_API_VERSION) ?? SANITY_API_VERSION_FALLBACK
}

/**
 * Optional read token for datasets that are not publicly readable. Used by the
 * server-side client only; it is never part of `NEXT_PUBLIC_*` and therefore
 * never reaches the browser bundle.
 */
export function getSanityReadToken(): string | undefined {
  return nonEmpty(process.env.SANITY_API_READ_TOKEN)
}

/** Returns the sanitised project configuration, or `null` when it is incomplete. */
export function getPublicSanityConfig(): PublicSanityConfig | null {
  const projectId = getSanityProjectId()
  const dataset = getSanityDataset()
  if (!projectId || !dataset) {
    return null
  }
  return { projectId, dataset, apiVersion: getSanityApiVersion() }
}

export function isSanityConfigured(): boolean {
  return getPublicSanityConfig() !== null
}

/** Message shown to editors and developers when the public configuration is incomplete. */
export const SANITY_MISSING_CONFIG_MESSAGE =
  `Sanity is not configured. Set ${SANITY_ENV_KEYS.projectId} and ${SANITY_ENV_KEYS.dataset} ` +
  '(see .env.example and docs/sanity-setup.md).'

/**
 * Returns the validated configuration or throws {@link SanityConfigError}.
 *
 * Called lazily by the Sanity client so that importing a module never fails at
 * build time — a missing configuration surfaces as a rendered error state in
 * the UI instead of a crashed build.
 */
export function assertSanityConfig(): SanityServerConfig {
  const config = getPublicSanityConfig()
  if (!config) {
    throw new SanityConfigError(SANITY_MISSING_CONFIG_MESSAGE)
  }
  return { ...config, token: getSanityReadToken() }
}
