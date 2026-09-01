"use client"

import * as React from "react"
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "../../lib/utils"

function Menubar({ className, ...props }: MenubarPrimitive.Props) {
  return <MenubarPrimitive data-slot="menubar" className={cn("flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs", className)} {...props} />
}

const MenubarMenu = MenuPrimitive.Root
const MenubarGroup = MenuPrimitive.Group
const MenubarPortal = MenuPrimitive.Portal
const MenubarSub = MenuPrimitive.SubmenuRoot
const MenubarRadioGroup = MenuPrimitive.RadioGroup

function MenubarTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="menubar-trigger" className={cn("flex cursor-default items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-popup-open:bg-accent data-popup-open:text-accent-foreground", className)} {...props} />
}

function MenubarContent({ align = "start", side = "bottom", sideOffset = 6, className, ...props }: MenuPrimitive.Popup.Props & Pick<MenuPrimitive.Positioner.Props, "align" | "side" | "sideOffset">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner align={align} side={side} sideOffset={sideOffset} className="z-50">
        <MenuPrimitive.Popup data-slot="menubar-content" className={cn("z-50 min-w-32 origin-(--transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden", className)} {...props} />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function MenubarItem({ className, inset, variant = "default", ...props }: MenuPrimitive.Item.Props & { inset?: boolean; variant?: "default" | "destructive" }) {
  return <MenuPrimitive.Item data-slot="menubar-item" data-inset={inset} data-variant={variant} className={cn("relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-[variant=destructive]:text-destructive data-inset:pl-8", className)} {...props} />
}

function MenubarCheckboxItem({ className, children, checked, ...props }: MenuPrimitive.CheckboxItem.Props) {
  return (
    <MenuPrimitive.CheckboxItem className={cn("relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground", className)} checked={checked} {...props}>
      <span className="absolute left-2 flex size-3.5 items-center justify-center"><MenuPrimitive.CheckboxItemIndicator><CheckIcon className="size-4" /></MenuPrimitive.CheckboxItemIndicator></span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function MenubarRadioItem({ className, children, ...props }: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem className={cn("relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground", className)} {...props}>
      <span className="absolute left-2 flex size-3.5 items-center justify-center"><MenuPrimitive.RadioItemIndicator><CircleIcon className="size-2 fill-current" /></MenuPrimitive.RadioItemIndicator></span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function MenubarLabel({ className, inset, ...props }: MenuPrimitive.GroupLabel.Props & { inset?: boolean }) {
  return <MenuPrimitive.GroupLabel className={cn("px-2 py-1.5 text-sm font-medium data-[inset=true]:pl-8", className)} data-inset={inset} {...props} />
}

function MenubarSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return <MenuPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
}

function MenubarShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />
}

function MenubarSubTrigger({ className, inset, children, ...props }: MenuPrimitive.SubmenuTrigger.Props & { inset?: boolean }) {
  return <MenuPrimitive.SubmenuTrigger className={cn("flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-8", className)} data-inset={inset} {...props}>{children}<ChevronRightIcon className="ml-auto size-4" /></MenuPrimitive.SubmenuTrigger>
}

function MenubarSubContent(props: React.ComponentProps<typeof MenubarContent>) {
  return <MenubarContent {...props} />
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
