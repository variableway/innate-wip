/** 这就是 writing 站：`/` 是工作区，`/$slug` 是单篇。旧路径 `/writing` 仍指向同一页。 */
export const BASE_PATH = "/"

export function withBasePath(path: string): string {
  if (!path || path === "/" || path === "/writing" || path === "/landing") {
    return "/"
  }
  if (path.startsWith("/writing/")) return path.slice("/writing".length)
  if (path.startsWith("/")) return path
  return `/${path}`
}
