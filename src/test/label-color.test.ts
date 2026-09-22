import { describe, expect, it } from "vitest"
import {
  labelColorValue,
  labelHueIndex,
} from "../lib/writing/label-color"

describe("label color", () => {
  it("is stable for the same name", () => {
    expect(labelHueIndex("insight")).toBe(labelHueIndex("insight"))
    expect(labelColorValue("insight")).toBe(labelColorValue("insight"))
  })

  it("quantizes hues to 15-degree slots", () => {
    const index = labelHueIndex("article")
    expect(index).toBeLessThan(24)
    expect(labelColorValue("article")).toBe(
      `oklch(var(--label-l) var(--label-c) ${index * 15})`
    )
  })

  it("gives the demo categories distinct hues", () => {
    const hues = ["article", "log", "insight", "thought"].map(labelHueIndex)
    expect(new Set(hues).size).toBe(4)
  })

  it("gives common tags distinct hues", () => {
    const hues = ["mermaid", "diagrams", "charts", "visualization"].map(
      labelHueIndex
    )
    expect(new Set(hues).size).toBe(4)
  })
})
