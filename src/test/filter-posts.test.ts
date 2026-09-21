import { describe, expect, it } from "vitest"
import {
  countByCategory,
  filterWritingPosts,
  postFolderId,
} from "../lib/writing/filter-posts"

const posts = [
  {
    slug: "a",
    title: "Brake job",
    excerpt: "Pads and rotors",
    category: "log",
    tags: ["receipts", "f250"],
    vault: "content",
    folder: "demo",
  },
  {
    slug: "b",
    title: "Thinking tools",
    excerpt: "Notes on focus",
    category: "insight",
    tags: ["tools"],
    vault: "docs",
    folder: "use-cases",
  },
]

describe("filterWritingPosts", () => {
  it("filters by category and query", () => {
    expect(filterWritingPosts(posts, { category: "log" }).map((p) => p.slug)).toEqual([
      "a",
    ])
    expect(filterWritingPosts(posts, { query: "focus" }).map((p) => p.slug)).toEqual([
      "b",
    ])
    expect(filterWritingPosts(posts, { tag: "receipts" }).map((p) => p.slug)).toEqual([
      "a",
    ])
    expect(filterWritingPosts(posts, { folder: "docs/use-cases" }).map((p) => p.slug)).toEqual([
      "b",
    ])
    expect(postFolderId(posts[0]!)).toBe("content/demo")
  })
})

describe("countByCategory", () => {
  it("returns sorted category counts", () => {
    expect(countByCategory(posts)).toEqual([
      { id: "insight", count: 1 },
      { id: "log", count: 1 },
    ])
  })
})
