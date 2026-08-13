import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import HeistCardSkeleton from "@/components/HeistCardSkeleton"

describe("HeistCardSkeleton", () => {
  it("renders an accessible loading status", () => {
    render(<HeistCardSkeleton />)
    expect(
      screen.getByRole("status", { name: /loading heist/i }),
    ).toBeInTheDocument()
  })

  it("renders no interactive link", () => {
    render(<HeistCardSkeleton />)
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })
})
