import { describe, expect, it } from "vitest"
import { buildFolderTree } from "../lib/writing/folder-tree"

describe("buildFolderTree", () => {
  it("nests vaults and folders with counts", () => {
    expect(
      buildFolderTree([
        { vault: "content", folder: "demo" },
        { vault: "content", folder: "demo/nested" },
        { vault: "docs", folder: "use-cases" },
      ])
    ).toEqual([
      {
        id: "content",
        name: "content",
        count: 2,
        children: [
          {
            id: "content/demo",
            name: "demo",
            count: 2,
            children: [
              {
                id: "content/demo/nested",
                name: "nested",
                count: 1,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "docs",
        name: "docs",
        count: 1,
        children: [
          {
            id: "docs/use-cases",
            name: "use-cases",
            count: 1,
            children: [],
          },
        ],
      },
    ])
  })
})
