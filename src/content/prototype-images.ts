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