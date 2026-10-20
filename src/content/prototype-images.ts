/**
 * Exact image URLs from the BTA prototype (BTA-prototype-2/src/app/data.ts).
 *
 * These are the Unsplash URLs the prototype uses. They are used as defaults
 * when the CMS image field is not set, so the rendered site always shows the
 * prototype's exact imagery even when editors haven't uploaded assets yet.
 */
export const PROTOTYPE_IMAGES = {
  hero:
    'https://images.unsplash.com/photo-1723129572165-9ceca925c459?auto=format&fit=crop&w=1800&q=88',
  river:
    'https://images.unsplash.com/photo-1725273950282-26b7c1b09876?auto=format&fit=crop&w=1600&q=85',
  boats:
    'https://images.unsplash.com/photo-1691743441331-d8b3bacf634f?auto=format&fit=crop&w=1400&q=85',
  people:
    'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&w=1400&q=85',
  elder:
    'https://images.unsplash.com/photo-1657356217673-4f7000f768b4?auto=format&fit=crop&w=1200&q=85',
  community:
    'https://images.unsplash.com/photo-1714575628092-aefd4e5d4291?auto=format&fit=crop&w=1400&q=85',
} as const;

export type PrototypeImageKey = keyof typeof PROTOTYPE_IMAGES;

/**
 * Returns the exact prototype image URL for a given key, or null when the key
 * is unknown.
 */
export function prototypeImage(key: PrototypeImageKey | null | undefined): string | null {
  if (!key) {
    return null;
  }
  return PROTOTYPE_IMAGES[key] ?? null;
}

/**
 * Placeholder portraits for the leadership directory.
 *
 * The committee members are fictional, so these are photographs of real people
 * used as illustrations of the roles — chosen to represent a mature club — and
 * not pictures of the named members. They are only used when no CMS image is
 * set, and the page states that the people and photographs are illustrative.
 */
export const PROTOTYPE_PORTRAITS = {
  georgewill:
    'https://images.unsplash.com/photo-1564541558234-ef406c118d0c?auto=format&fit=crop&w=700&h=875&q=80',
  nwosu: 'https://images.unsplash.com/photo-1654027678170-2f16d4e87787?auto=format&fit=crop&w=700&h=875&q=80',
  ogan: 'https://images.unsplash.com/photo-1748343953815-6174e3821377?auto=format&fit=crop&w=700&h=875&q=80',
  briggs: 'https://images.unsplash.com/photo-1656959706608-ad47bee4619d?auto=format&fit=crop&w=700&h=875&q=80',
  tariah: 'https://images.unsplash.com/photo-1678225892094-97b21e4fb8f1?auto=format&fit=crop&w=700&h=875&q=80',
  'kalabari-obi':
    'https://images.unsplash.com/photo-1621165486204-5a5797521c90?auto=format&fit=crop&w=700&h=875&q=80',
} as const;

export type PrototypePortraitKey = keyof typeof PROTOTYPE_PORTRAITS;

/** Returns the placeholder portrait URL for a key, or null when unknown. */
export function prototypePortrait(key: PrototypePortraitKey | null | undefined): string | null {
  if (!key) {
    return null;
  }
  return PROTOTYPE_PORTRAITS[key] ?? null;
}