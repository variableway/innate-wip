/**
 * Site feature visibility — Content-first simplification.
 *
 * Non-Content surfaces (Making, Cheatsheets, Awesome, Guides) stay as routes
 * but are hidden from nav / homepage until re-enabled via Plugin mode.
 * See docs/solution/plugin-mode.md.
 */
export const siteFeatures = {
  /** Writing, Collections — core Content */
  content: true,
  /** Unified discovery feed */
  feed: true,
  /** Making hub (projects / weekly / insights / issues) — plugin candidate */
  making: false,
  /** Reference cheatsheets */
  cheatsheets: false,
  /** Better Stack guides */
  betterstackGuides: false,
  /** Awesome curated lists */
  awesome: false,
} as const

export type SiteFeatureKey = keyof typeof siteFeatures

export function isFeatureEnabled(key: SiteFeatureKey): boolean {
  return siteFeatures[key]
}
