import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Input } from "../components/ui/input"

describe("Input", () => {
  it("renders with the input data slot and merges className", () => {
    render(<Input className="pl-8" placeholder="搜索记录" />)

    const input = screen.getByPlaceholderText("搜索记录")
    expect(input.getAttribute("data-slot")).toBe("input")
    expect(input.className).toContain("pl-8")
    expect(input.className).toContain("h-8")
  })

  it("accepts user input", () => {
    render(<Input defaultValue="" aria-label="名称" />)

    const input = screen.getByLabelText("名称")
    fireEvent.change(input, { target: { value: "华东工厂能耗台账" } })
    expect(input).toHaveProperty("value", "华东工厂能耗台账")
  })

  it("forwards the disabled state", () => {
    render(<Input disabled placeholder="只读" />)

    expect(screen.getByPlaceholderText("只读")).toHaveProperty("disabled", true)
  })
})
