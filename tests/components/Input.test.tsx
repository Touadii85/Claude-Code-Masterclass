import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"

// imports de composants
import Input from "@/components/Input"

describe("Input", () => {
  it("renders the label and the input field", () => {
    render(<Input id="email" label="Email" value="" onChange={() => {}} />)

    expect(screen.getByLabelText("Email")).toBeInTheDocument()
  })

  it("displays the value passed as a prop", () => {
    render(
      <Input
        id="email"
        label="Email"
        value="user@example.com"
        onChange={() => {}}
      />,
    )

    expect(screen.getByLabelText("Email")).toHaveValue("user@example.com")
  })

  it("calls onChange when the user types", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input id="email" label="Email" value="" onChange={handleChange} />)

    await user.type(screen.getByLabelText("Email"), "a")

    expect(handleChange).toHaveBeenCalled()
  })

  it("shows the error message with the matching ARIA attributes", () => {
    render(
      <Input
        id="email"
        label="Email"
        value=""
        onChange={() => {}}
        error="Email is required"
      />,
    )

    const input = screen.getByLabelText("Email")
    expect(screen.getByRole("alert")).toHaveTextContent("Email is required")
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveAttribute("aria-describedby", "email-error")
  })

  it("has no error message when the error prop is omitted", () => {
    render(<Input id="email" label="Email" value="" onChange={() => {}} />)

    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })
})
