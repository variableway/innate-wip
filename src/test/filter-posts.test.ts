import { describe, expect, it } from "vitest"
import {
  countByCategory,
  filterWritingPosts,
} from "../lib/writing/filter-posts"

const posts = [
  {
    slug: "a",
    title: "Brake job",
    excerpt: "Pads and rotors",
    category: "log",
    tags: ["receipts", "f250"],
  },
  {
    slug: "b",
    title: "Thinking tools",
    excerpt: "Notes on focus",
    category: "insight",
    tags: ["tools"],
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
