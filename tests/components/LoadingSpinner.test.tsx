import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

// imports de composants
import LoadingSpinner from "@/components/LoadingSpinner"

describe("LoadingSpinner", () => {
  it("renders without errors", () => {
    render(<LoadingSpinner />)

    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("displays the Clock icon", () => {
    const { container } = render(<LoadingSpinner />)

    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("applies the spinner CSS class to the container", () => {
    render(<LoadingSpinner />)

    expect(screen.getByRole("status").className).toMatch(/spinner/)
  })

  it("gives the icon its fixed size via the icon class", () => {
    const { container } = render(<LoadingSpinner />)

    expect(container.querySelector("svg")?.getAttribute("class")).toMatch(
      /icon/,
    )
  })
})
