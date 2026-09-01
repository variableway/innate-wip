import { renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { useIsMobile } from "../hooks/use-mobile"

const originalInnerWidth = window.innerWidth

function setInnerWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  })
}

afterEach(() => {
  setInnerWidth(originalInnerWidth)
})

describe("useIsMobile", () => {
  it("returns false on desktop widths", () => {
    setInnerWidth(1024)

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it("returns true below the mobile breakpoint", () => {
    setInnerWidth(500)

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })
})
