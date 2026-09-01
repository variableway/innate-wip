"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "../../lib/utils"

function Progress({ className, value = 0, ...props }: ProgressPrimitive.Root.Props) {
  const percent = typeof value === "number" ? Math.max(0, Math.min(100, value)) : 0

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={percent}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
