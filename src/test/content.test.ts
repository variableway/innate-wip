import { describe, expect, it } from "vitest"
import { getWritingMeta } from "../lib/content"
import { writingFiles } from "#writing-files"
import { parseFrontmatter } from "../lib/content/parser"
import { fallbackSlug, parseWritingFile } from "../lib/content/parse-post"

describe("writing content vault", () => {
  it("loads only use-cases markdown by default", () => {
    const posts = getWritingMeta({ status: "published" })
    const files = Object.keys(writingFiles)
    expect(files.length).toBeGreaterThan(0)
    expect(files.every((filePath) => filePath.includes("/use-cases/"))).toBe(true)
    expect(files.some((filePath) => filePath.includes("/demo/"))).toBe(false)
    expect(files.some((filePath) => filePath.includes("/docs/modules/"))).toBe(false)
    expect(posts.length).toBeGreaterThan(0)
    expect(posts.every((post) => post.slug && post.title)).toBe(true)
    expect(posts.every((post) => post.vault === "use-cases")).toBe(true)
  })

  it("titles use-case pages from the first heading", () => {
    const post = getWritingMeta().find((item) =>
      item.slug.includes("01-empty-webshell")
    )
    expect(post?.title).toMatch(/空白的 Web Shell/)
    expect(post?.vault).toBe("use-cases")
    expect(post?.folder).toBe("")
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
    expect(fallbackSlug("/vault/content/demo/nested/deep/note.md")).toBe(
      "content-demo-nested-deep-note"
    )
    expect(fallbackSlug("/repo/docs/use-cases/01-empty-webshell.md")).toBe(
      "use-cases-01-empty-webshell"
    )
    expect(fallbackSlug("/repo/docs/use-cases/01-empty-webshell.md", "docs")).toBe(
      "docs-use-cases-01-empty-webshell"
    )
  })

  it("uses the first folder as category when frontmatter omits it", () => {
    const post = parseWritingFile(
      "/vault/content/demo/nested/deep/note.md",
      "---\ntitle: Deep\n---\nHi\n"
    )
    expect(post.category).toBe("demo")
    expect(post.vault).toBe("content")
    expect(post.folder).toBe("demo/nested/deep")
    expect(post.slug).toBe("content-demo-nested-deep-note")
  })
})
