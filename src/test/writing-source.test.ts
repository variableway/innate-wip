import { describe, expect, it } from "vitest"
import { resolveWritingSource, selectWritingFiles } from "../lib/content/writing-source"

describe("writing source", () => {
  const bundles = {
    localUseCases: { "/app/use-cases/local.md": "local" },
    docsUseCases: { "/repo/docs/use-cases/01.md": "uc" },
    docs: {
      "/repo/docs/use-cases/01.md": "uc",
      "/repo/docs/modules/overview.md": "mod",
    },
  }

  it("defaults to use-cases", () => {
    expect(resolveWritingSource(undefined)).toBe("use-cases")
    expect(resolveWritingSource("docs")).toBe("docs")
  })

  it("selects use-cases files only", () => {
    expect(selectWritingFiles("use-cases", bundles)).toEqual({
      "/repo/docs/use-cases/01.md": "uc",
      "/app/use-cases/local.md": "local",
    })
  })

  it("selects the full docs tree", () => {
    expect(selectWritingFiles("docs", bundles)).toEqual(bundles.docs)
  })
})
