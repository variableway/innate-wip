import { describe, expect, it } from "vitest"
import { BASE_PATH, withBasePath } from "../lib/base-path"

describe("withBasePath", () => {
  it("treats writing aliases as the workspace root", () => {
    expect(withBasePath("/")).toBe("/")
    expect(withBasePath("/writing")).toBe("/")
    expect(withBasePath("/landing")).toBe("/")
    expect(withBasePath("")).toBe(BASE_PATH)
  })

  it("keeps note slugs at the site root", () => {
    expect(withBasePath("/demo-mdx")).toBe("/demo-mdx")
    expect(withBasePath("/writing/demo-mdx")).toBe("/demo-mdx")
  })
})
