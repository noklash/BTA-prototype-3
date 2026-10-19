/**
 * Validation helpers shared by several schema types.
 */
import type { CustomValidator } from 'sanity'

/**
 * Accepts either a site-relative path (`/membership`) or an absolute `https://`
 * URL. Deliberately rejects `javascript:` and bare fragments so that a link
 * managed in the Studio can never introduce a script URL.
 */
export const validateInternalOrExternalLink: CustomValidator<string | undefined> = (value) => {
  if (!value) {
    return 'A link is required.'
  }

  if (value.startsWith('/')) {
    return true
  }

  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    return 'Enter a path starting with "/" (for example /membership) or a full https:// URL.'
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return 'Only http and https links are allowed.'
  }

  return true
}

/**
 * Accepts the URI schemes the rich text editor is allowed to produce.
 */
export const validateRichTextHref: CustomValidator<string | undefined> = (value) => {
  if (!value) {
    return 'A URL is required.'
  }

  if (value.startsWith('/') || value.startsWith('#')) {
    return true
  }

  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    return 'Enter an absolute URL, a site path starting with "/", or an anchor starting with "#".'
  }

  const allowed = ['http:', 'https:', 'mailto:', 'tel:']
  return allowed.includes(parsed.protocol)
    ? true
    : `Only ${allowed.join(', ')} links are allowed.`
}
