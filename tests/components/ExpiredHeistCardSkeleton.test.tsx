import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import ExpiredHeistCardSkeleton from "@/components/ExpiredHeistCardSkeleton"

describe("ExpiredHeistCardSkeleton", () => {
  it("renders an accessible loading status", () => {
    render(<ExpiredHeistCardSkeleton />)
    expect(
      screen.getByRole("status", { name: /loading expired heist/i }),
    ).toBeInTheDocument()
  })

  it("renders no interactive link", () => {
    render(<ExpiredHeistCardSkeleton />)
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })
})
