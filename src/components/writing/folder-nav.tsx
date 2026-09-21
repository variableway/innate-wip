import { Folder } from "lucide-react"
import { cn } from "@innate/ui"
import type { FolderNode } from "../../lib/writing/folder-tree"

export function FolderNav({
  nodes,
  activeId,
  onSelect,
  depth = 0,
}: {
  nodes: FolderNode[]
  activeId: string | null
  onSelect: (id: string) => void
  depth?: number
}) {
  if (nodes.length === 0) return null
  return (
    <ul className="flex flex-col gap-0.5">
      {nodes.map((node) => (
        <li key={node.id}>
          <button
            type="button"
            onClick={() => onSelect(node.id)}
            data-active={activeId === node.id}
            style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}
            className={cn(
              "hover:bg-sidebar-accent flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-sm",
              "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium"
            )}
          >
            <Folder className="size-4 shrink-0" data-icon="inline-start" />
            <span className="min-w-0 flex-1 truncate text-left">{node.name}</span>
            <span className="text-muted-foreground text-xs tabular-nums">{node.count}</span>
          </button>
          {node.children.length > 0 ? (
            <FolderNav
              nodes={node.children}
              activeId={activeId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ) : null}
        </li>
      ))}
    </ul>
  )
}
