"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@allone/utils"
import { CheckSquare, Calendar, Hammer, FolderGit2, Lightbulb } from "lucide-react"
import { InnateLogoIcon } from "./innate-logo"

// Making category with sub-items
const makingCategory = {
  id: "making",
  label: "Making",
  icon: Hammer,
  href: "/making",
  subItems: [
    {
      id: "projects",
      label: "项目",
      icon: FolderGit2,
      href: "/making/projects",
    },
    {
      id: "weekly",
      label: "周记录",
      icon: Calendar,
      href: "/making/weekly",
    },
    {
      id: "insights",
      label: "Insights",
      icon: Lightbulb,
      href: "/making/insights",
    },
    {
      id: "issues",
      label: "做什么",
      icon: CheckSquare,
      href: "/making/issues",
    },
  ],
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-card flex flex-col self-stretch">
      {/* Brand */}
      <div className="p-3">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/"
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-secondary"
          )}
        >
          <InnateLogoIcon className="h-4 w-4" />
          <span>Innate</span>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-border" />

      {/* Making Category */}
      <div className="p-3 flex-1">
        <h3 className="text-xs font-medium text-muted-foreground px-3 mb-2">
          Category
        </h3>
        <nav className="flex flex-col gap-1">
          {/* Main Making Item */}
          <Link
            href={makingCategory.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === makingCategory.href
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <makingCategory.icon className="h-4 w-4" />
            <span>{makingCategory.label}</span>
          </Link>

          {/* Sub Items */}
          <div className="ml-4 mt-1 space-y-1">
            {makingCategory.subItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                    pathname === item.href || pathname.startsWith(item.href + "/")
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </aside>
  )
}
