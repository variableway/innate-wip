import { describe, expect, it } from "vitest"
import {
  extractMermaidChart,
  normalizeBlogMarkdown,
} from "../lib/content/mdx-source"

describe("normalizeBlogMarkdown", () => {
  it("converts MermaidBlock children into a mermaid fence", () => {
    const out = normalizeBlogMarkdown(`<MermaidBlock>
graph TD
    A --> B
</MermaidBlock>`)
    expect(out).toContain("```mermaid")
    expect(out).toContain("A --> B")
    expect(out).not.toContain("<MermaidBlock>")
  })

  it("converts MermaidBlock chart prop into a mermaid fence", () => {
    const out = normalizeBlogMarkdown(
      "<MermaidBlock chart={`graph LR\n    Start --> End\n`} />"
    )
    expect(out).toContain("```mermaid")
    expect(out).toContain("Start --> End")
  })

  it("does not treat inline-code <MermaidBlock> as a tag", () => {
    const source = `You can also use the \`<MermaidBlock>\` component directly. Write the diagram as children for clean formatting:

<MermaidBlock>
graph TD
    A[MDX Source] --> B[Compile]
    B --> C[React Component]
</MermaidBlock>`
    const out = normalizeBlogMarkdown(source)
    expect(out).toContain("`<MermaidBlock>`")
    expect(out).toContain("component directly")
    expect(out).toMatch(/```mermaid\ngraph TD/)
    expect(out).not.toContain("</MermaidBlock>")
    expect(out).not.toMatch(/<MermaidBlock>(?!`)/)
  })
})

describe("extractMermaidChart", () => {
  it("drops prose before the diagram type", () => {
    const raw = `\` component directly. Write the diagram as children for clean formatting:

<MermaidBlock>
graph TD
    A --> B`
    expect(extractMermaidChart(raw)).toBe("graph TD\n    A --> B")
  })
})
