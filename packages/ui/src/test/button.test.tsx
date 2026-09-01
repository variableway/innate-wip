import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Button } from "../components/ui/button"

describe("Button", () => {
  it("renders a button with default variant and size classes", () => {
    render(<Button>保存</Button>)

    const button = screen.getByRole("button", { name: "保存" })
    expect(button.tagName).toBe("BUTTON")
    expect(button.className).toContain("bg-primary")
    expect(button.className).toContain("h-7")
  })

  it("applies variant and size classes", () => {
    render(
      <Button variant="outline" size="sm">
        筛选
      </Button>
    )

    const button = screen.getByRole("button", { name: "筛选" })
    expect(button.className).toContain("border-border")
    expect(button.className).toContain("h-6")
  })

  it("renders as an anchor via the render prop", () => {
    render(
      <Button nativeButton={false} render={<a href="/docs" />}>
        文档
      </Button>
    )

    // Base UI keeps button semantics (role="button") on the rendered anchor.
    const link = screen.getByRole("button", { name: "文档" })
    expect(link.tagName).toBe("A")
    expect(link.getAttribute("href")).toBe("/docs")
    expect(link.className).toContain("bg-primary")
  })

  it("forwards the disabled state", () => {
    render(<Button disabled>提交</Button>)

    expect(screen.getByRole("button", { name: "提交" })).toHaveProperty(
      "disabled",
      true
    )
  })
})
