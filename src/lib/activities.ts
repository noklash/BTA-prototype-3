/**
 * Helpers for the "featured activities" references on the home page.
 *
 * A reference can dangle when an editor deletes the activity it points at, in
 * which case GROQ returns `null` in that array slot. These helpers normalise the
 * raw query result into something a component can render.
 */
import type { FeaturedActivity } from '@/types/content'

/** The fields that must be present for an activity to be renderable. */
function isRenderableActivity(value: unknown): value is FeaturedActivity {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Partial<FeaturedActivity>
  return (
    typeof candidate._id === 'string' &&
    typeof candidate.title === 'string' &&
    candidate.title.trim().length > 0 &&
    typeof candidate.slug === 'string' &&
    candidate.slug.trim().length > 0
  )
}

/**
 * Drops dangling references, sorts by `displayOrder` (lowest first, ties keep
 * the order chosen on the home page because `Array.prototype.sort` is stable),
 * and applies an optional limit.
 */
export function selectFeaturedActivities(
  activities: readonly (FeaturedActivity | null)[] | null | undefined,
  limit?: number,
): FeaturedActivity[] {
  const renderable = (activities ?? []).filter(isRenderableActivity)

  const sorted = [...renderable].sort((a, b) => orderOf(a) - orderOf(b))

  return typeof limit === 'number' ? sorted.slice(0, Math.max(0, limit)) : sorted
}

/** Activities without a `displayOrder` are pushed to the end. */
function orderOf(activity: FeaturedActivity): number {
  return typeof activity.displayOrder === 'number' && Number.isFinite(activity.displayOrder)
    ? activity.displayOrder
    : Number.MAX_SAFE_INTEGER
}
