"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@allone/utils"
import {
  Home,
  Hammer,
  PenLine,
  Plus,
} from "lucide-react"
import { InnateLogoIcon } from "./innate-logo"

interface LeftBarItem {
  id: string
  icon: React.ReactNode
  label: string
  href: string
}

// Simplified LeftBar - core navigation only
const leftBarItems: LeftBarItem[] = [
  {
    id: "innate",
    icon: <InnateLogoIcon />,
    label: "Innate",
    href: "/",
  },
  {
    id: "making",
    icon: <Hammer className="h-5 w-5" />,
    label: "Making",
    href: "/making",
  },
  {
    id: "writing",
    icon: <PenLine className="h-5 w-5" />,
    label: "Writing",
    href: "/writing",
  },
]

export function LeftBar() {
  const pathname = usePathname()

  return (
    <div className="w-14 bg-card flex flex-col items-center py-3 gap-1 h-full">
      {/* Navigation Items */}
      {leftBarItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center transition-colors relative",
            pathname === item.href || pathname.startsWith(item.href + "/")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
          title={item.label}
        >
          {item.icon}
        </Link>
      ))}

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <div className="w-6 h-px bg-border" />
        <button
          className="w-9 h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center transition-colors"
          title="Create"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
