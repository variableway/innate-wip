import { siteFeatures } from "@/lib/site-features"
import type { SitePlugin } from "./types"

/**
 * Build-time plugin registry.
 * Flip `enabled` (via siteFeatures) to show sections in sidebar/header — no JSX edits.
 * See docs/solution/plugin-mode.md.
 */
export const plugins: SitePlugin[] = [
  {
    id: "making",
    name: "Making",
    description: "Projects, weekly reports, insights & issues",
    enabled: siteFeatures.making,
    loadMode: "route",
    nav: {
      sectionLabel: "Making",
      sectionIcon: "hammer",
      items: [
        {
          id: "projects",
          label: "Projects",
          href: "/making/projects",
          icon: "folder-git-2",
          order: 1,
        },
        {
          id: "weekly",
          label: "Weekly",
          href: "/making/weekly",
          icon: "calendar",
          order: 2,
        },
        {
          id: "insights",
          label: "Insights",
          href: "/making/insights",
          icon: "lightbulb",
          order: 3,
        },
        {
          id: "issues",
          label: "Issues",
          href: "/making/issues",
          icon: "check-square",
          order: 4,
        },
      ],
    },
    homeTile: {
      title: "Making",
      description: "Projects, weekly reports, insights & issues",
      href: "/making",
    },
  },
  {
    id: "cheatsheets",
    name: "Cheatsheets",
    enabled: siteFeatures.cheatsheets,
    loadMode: "route",
    nav: {
      sectionLabel: "Cheatsheets",
      sectionIcon: "file-text",
      items: [
        {
          id: "cheatsheets",
          label: "Cheatsheets",
          href: "/cheatsheets",
          icon: "book-open",
          order: 1,
        },
        {
          id: "betterstack",
          label: "Better Stack Guides",
          href: "/betterstack-guides",
          icon: "file-text",
          order: 2,
        },
      ],
    },
    homeTile: {
      title: "Cheatsheets",
      description: "Quick reference guides",
      href: "/cheatsheets",
    },
  },
  {
    id: "awesome",
    name: "Awesome",
    enabled: siteFeatures.awesome,
    loadMode: "route",
    nav: {
      sectionLabel: "Awesome",
      sectionIcon: "tag",
      items: [
        {
          id: "all",
          label: "All Items",
          href: "/awesome",
          icon: "tag",
          order: 1,
        },
      ],
    },
    homeTile: {
      title: "Awesome",
      description: "Curated lists",
      href: "/awesome",
    },
  },
]

export function getEnabledPlugins(): SitePlugin[] {
  return plugins.filter((p) => p.enabled)
}

export function getPluginById(id: string): SitePlugin | undefined {
  return plugins.find((p) => p.id === id)
}

export function getEnabledHomeTiles() {
  return getEnabledPlugins()
    .filter((p) => p.homeTile)
    .map((p) => p.homeTile!)
}
