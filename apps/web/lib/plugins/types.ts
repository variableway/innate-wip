export type PluginLoadMode = "route" | "iframe"

export interface PluginNavItem {
  id: string
  label: string
  href: string
  icon?: string
  order?: number
}

export interface SitePlugin {
  id: string
  name: string
  description?: string
  enabled: boolean
  loadMode: PluginLoadMode
  /** For loadMode === "iframe" */
  iframeSrc?: string
  nav: {
    sectionLabel: string
    sectionIcon?: string
    items: PluginNavItem[]
  }
  homeTile?: {
    title: string
    description: string
    href: string
  }
}
