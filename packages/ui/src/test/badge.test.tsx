import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Badge } from "../components/ui/badge"

describe("Badge", () => {
  it("renders a span with default variant classes", () => {
    render(<Badge>Stable</Badge>)

    const badge = screen.getByText("Stable")
    expect(badge.tagName).toBe("SPAN")
    expect(badge.className).toContain("bg-primary")
    expect(badge.className).toContain("text-primary-foreground")
  })

  it("applies the muted variant classes", () => {
    render(<Badge variant="muted">草稿</Badge>)

    const badge = screen.getByText("草稿")
    expect(badge.className).toContain("bg-muted")
    expect(badge.className).toContain("text-muted-foreground")
  })

  it("renders as an anchor via the render prop", () => {
    render(<Badge render={<a href="/changelog" />}>v0.1</Badge>)

    const link = screen.getByRole("link", { name: "v0.1" })
    expect(link.tagName).toBe("A")
    expect(link.getAttribute("href")).toBe("/changelog")
  })
})
