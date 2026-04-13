// Layout configuration for different pages

export type LayoutType = "complex" | "simple"

export interface PageLayoutConfig {
  layout: LayoutType
  showLeftBar: boolean
  showSidebar: boolean
  showHeader: boolean
  headerVariant?: "full" | "simple"
  sidebarVariant?: "channels" | "course-categories" | "course-sections" | "none"
}

// Page-specific layout configuration
export const pageLayoutConfig: Record<string, PageLayoutConfig> = {
  // Complex layout pages (LeftBar + Sidebar + Header)
  "/": {
    layout: "complex",
    showLeftBar: true,
    showSidebar: true,
    showHeader: false,
    headerVariant: "full",
    sidebarVariant: "channels",
  },
  
  // Making module pages
  "/making": {
    layout: "complex",
    showLeftBar: true,
    showSidebar: true,
    showHeader: false,
    headerVariant: "full",
    sidebarVariant: "channels",
  },
  "/making/issues": {
    layout: "complex",
    showLeftBar: true,
    showSidebar: true,
    showHeader: false,
    headerVariant: "full",
    sidebarVariant: "channels",
  },

  // Writing module pages
  "/writing": {
    layout: "complex",
    showLeftBar: true,
    showSidebar: true,
    showHeader: false,
    headerVariant: "full",
    sidebarVariant: "channels",
  },
  "/making/weekly": {
    layout: "complex",
    showLeftBar: true,
    showSidebar: true,
    showHeader: false,
    headerVariant: "full",
    sidebarVariant: "channels",
  },

  // Default fallback
  default: {
    layout: "complex",
    showLeftBar: true,
    showSidebar: true,
    showHeader: false,
    headerVariant: "full",
    sidebarVariant: "channels",
  },
}

// Get layout config for a pathname
export function getLayoutConfig(pathname: string): PageLayoutConfig {
  // Check exact match first
  if (pageLayoutConfig[pathname]) {
    return pageLayoutConfig[pathname]
  }
  
  // Check parent routes (for dynamic routes like /making/weekly/[id])
  for (const [route, config] of Object.entries(pageLayoutConfig)) {
    if (route !== "default" && pathname.startsWith(route + "/")) {
      return config
    }
  }
  
  return pageLayoutConfig.default
}
