import { postFolderId } from "./filter-posts"

export interface FolderNode {
  id: string
  name: string
  count: number
  children: FolderNode[]
}

export function buildFolderTree(
  posts: Array<{ vault?: string; folder?: string }>
): FolderNode[] {
  type Mutable = { name: string; count: number; children: Map<string, Mutable> }
  const roots = new Map<string, Mutable>()

  function bump(parts: string[]) {
    let map = roots
    for (const name of parts) {
      let node = map.get(name)
      if (!node) {
        node = { name, count: 0, children: new Map() }
        map.set(name, node)
      }
      node.count += 1
      map = node.children
    }
  }

  for (const post of posts) {
    const id = postFolderId(post)
    bump(id.split("/").filter(Boolean))
  }

  function toNodes(map: Map<string, Mutable>, prefix: string[]): FolderNode[] {
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, node]) => {
        const next = [...prefix, name]
        return {
          id: next.join("/"),
          name,
          count: node.count,
          children: toNodes(node.children, next),
        }
      })
  }

  return toNodes(roots, [])
}
