"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@allone/utils"
import { Home, BookOpen, Globe, Hammer, FileText, Files } from "lucide-react"
import { InnateLogoIcon } from "./innate-logo"

const mobileNavItems = [
  {
    id: "home",
    icon: InnateLogoIcon,
    label: "Home",
    href: "/",
  },
  {
    id: "making",
    icon: Hammer,
    label: "Making",
    href: "/making",
  },
  {
    id: "feed",
    icon: FileText,
    label: "Feed",
    href: "/feed",
  },
  {
    id: "learn",
    icon: BookOpen,
    label: "Learn",
    href: "/learning-library",
  },
  {
    id: "collections",
    icon: Globe,
    label: "Ideas",
    href: "/collections",
  },
  {
    id: "cheatsheets",
    icon: Files,
    label: "Cheat",
    href: "/cheatsheets",
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden safe-area-pb">
      <div className="flex items-center justify-around py-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "w-9 h-9 flex items-center justify-center rounded-full",
                isActive ? "bg-primary/10" : ""
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
