import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"

describe("Card", () => {
  it("renders the composed card structure with data slots", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>指标总览</CardTitle>
          <CardDescription>最近 30 天</CardDescription>
        </CardHeader>
        <CardContent>内容区</CardContent>
        <CardFooter>页脚</CardFooter>
      </Card>
    )

    expect(container.querySelector('[data-slot="card"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="card-header"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="card-title"]')?.textContent).toBe(
      "指标总览"
    )
    expect(
      container.querySelector('[data-slot="card-description"]')?.textContent
    ).toBe("最近 30 天")
    expect(container.querySelector('[data-slot="card-content"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="card-footer"]')).not.toBeNull()
  })

  it("exposes the size variant via data-size", () => {
    const { container } = render(<Card size="sm">紧凑卡片</Card>)

    const card = container.querySelector('[data-slot="card"]')
    expect(card?.getAttribute("data-size")).toBe("sm")
  })
})
