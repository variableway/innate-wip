import { describe, expect, it } from "vitest"
import { getWriting, getWritingMeta } from "../lib/content"
import { writingFiles } from "../lib/content/bundled-files"
import { parseFrontmatter } from "../lib/content/parser"
import { fallbackSlug, parseWritingFile } from "../lib/content/parse-post"

describe("writing content vault", () => {
  it("loads published posts from nested folders", () => {
    const posts = getWritingMeta({ status: "published" })
    expect(posts.length).toBeGreaterThan(0)
    expect(posts.every((post) => post.slug && post.title)).toBe(true)
    expect(
      Object.keys(writingFiles).some((filePath) => filePath.includes("/demo/"))
    ).toBe(true)
  })

  it("resolves a known slug from content/demo", () => {
    expect(getWriting("first-weekly-log")?.title).toMatch(/Weekly Log/)
  })

  it("keeps category and tags from frontmatter", () => {
    const post = getWriting("building-static-site")
    expect(post?.category).toBe("article")
    expect(post?.tags).toEqual(
      expect.arrayContaining(["static-site", "nextjs", "performance"])
    )
  })
})

describe("parseFrontmatter labels", () => {
  it("treats label / labels as tags", () => {
    const { meta } = parseFrontmatter(`---
title: Labeled
tags: [alpha]
label: beta
labels: [gamma, alpha]
---
body
`)
    expect(meta.tags).toEqual(["alpha", "beta", "gamma"])
  })
})

describe("nested path fallbacks", () => {
  it("builds a url-safe slug from three folder levels", () => {
    expect(
      fallbackSlug("/vault/content/demo/nested/deep/note.md")
    ).toBe("demo-nested-deep-note")
  })

  it("uses the first folder as category when frontmatter omits it", () => {
    const post = parseWritingFile(
      "/vault/content/demo/nested/deep/note.md",
      "---\ntitle: Deep\n---\nHi\n"
    )
    expect(post.category).toBe("demo")
    expect(post.slug).toBe("demo-nested-deep-note")
  })
})
