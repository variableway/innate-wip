import { describe, expect, it } from "vitest"
import { resolveWritingSource } from "../lib/content/writing-source"

describe("writing source", () => {
  it("defaults to use-cases", () => {
    expect(resolveWritingSource(undefined)).toBe("use-cases")
    expect(resolveWritingSource("docs")).toBe("docs")
  })
})
