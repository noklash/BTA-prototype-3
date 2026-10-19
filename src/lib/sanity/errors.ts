/**
 * Error types for the Sanity content layer.
 *
 * Kept in their own module so that `env.ts`, `client.ts` and `fetch.ts` can all
 * depend on them without creating an import cycle.
 */

/** Thrown when the Sanity environment variables are missing or only partially set. */
export class SanityConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SanityConfigError'
  }
}
