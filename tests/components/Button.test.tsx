import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

// imports de composants
import Button from "@/components/Button"

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Log In</Button>)

    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument()
  })

  it("is a submit button by default", () => {
    render(<Button>Log In</Button>)

    expect(screen.getByRole("button", { name: "Log In" })).toHaveAttribute(
      "type",
      "submit",
    )
  })

  it("accepts another type when provided", () => {
    render(<Button type="button">Cancel</Button>)

    expect(screen.getByRole("button", { name: "Cancel" })).toHaveAttribute(
      "type",
      "button",
    )
  })

  it("does not submit its form when disabled", async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn((e) => e.preventDefault())
    render(
      <form onSubmit={handleSubmit}>
        <Button disabled>Log In</Button>
      </form>,
    )

    const button = screen.getByRole("button", { name: "Log In" })
    expect(button).toBeDisabled()

    await user.click(button)
    expect(handleSubmit).not.toHaveBeenCalled()
  })
})
