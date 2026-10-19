/**
 * Content limits that both the Studio schema and the website need to agree on.
 *
 * This module has no imports on purpose: it is loaded by the Sanity CLI bundle
 * (through the schema) and by Next.js pages, so it must stay dependency-free and
 * use a relative import path from the schema files.
 */

/** How many initiatives the home page is designed to highlight. */
export const MAX_FEATURED_ACTIVITIES = 3

/** How many values the about page grid is designed to hold. */
export const MAX_ABOUT_VALUES = 6

/** How many stat items the home page stats bar supports. */
export const MAX_HOME_STATS = 4

/** How many model pillars the home page model grid supports. */
export const MAX_MODEL_PILLARS = 8

/** How many initiative cards the home page initiatives section supports. */
export const MAX_HOME_INITIATIVES = 5

/** How many editorial articles an editorial page supports. */
export const MAX_EDITORIAL_ARTICLES = 8

/** How many vision grid items the vision page supports. */
export const MAX_VISION_ITEMS = 11

/** How many business entries the business hub supports. */
export const MAX_BUSINESS_ENTRIES = 10

/** How many library resources the library page supports. */
export const MAX_LIBRARY_RESOURCES = 10

/** How many detail page what-to-expect items. */
export const MAX_WHAT_TO_EXPECT = 5
