import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"

// imports de composants
import PasswordInput from "@/components/PasswordInput"

describe("PasswordInput", () => {
  it("masks the password by default", () => {
    render(
      <PasswordInput
        id="password"
        label="Password"
        value=""
        onChange={() => {}}
      />,
    )

    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    )
    expect(
      screen.getByRole("button", { name: "Show password" }),
    ).toBeInTheDocument()
  })

  it("reveals then hides the password when the toggle is clicked", async () => {
    const user = userEvent.setup()
    render(
      <PasswordInput
        id="password"
        label="Password"
        value=""
        onChange={() => {}}
      />,
    )

    const input = screen.getByLabelText("Password")

    await user.click(screen.getByRole("button", { name: "Show password" }))
    expect(input).toHaveAttribute("type", "text")

    await user.click(screen.getByRole("button", { name: "Hide password" }))
    expect(input).toHaveAttribute("type", "password")
  })

  it("stays consistent after several rapid toggles", async () => {
    const user = userEvent.setup()
    render(
      <PasswordInput
        id="password"
        label="Password"
        value=""
        onChange={() => {}}
      />,
    )

    const input = screen.getByLabelText("Password")

    // nombre impair de clics : le mot de passe doit rester visible
    await user.click(screen.getByRole("button", { name: "Show password" }))
    await user.click(screen.getByRole("button", { name: "Hide password" }))
    await user.click(screen.getByRole("button", { name: "Show password" }))

    expect(input).toHaveAttribute("type", "text")
  })

  it("keeps aria-pressed in sync with the visibility state", async () => {
    const user = userEvent.setup()
    render(
      <PasswordInput
        id="password"
        label="Password"
        value=""
        onChange={() => {}}
      />,
    )

    const toggle = screen.getByRole("button", { name: "Show password" })
    expect(toggle).toHaveAttribute("aria-pressed", "false")

    await user.click(toggle)
    expect(
      screen.getByRole("button", { name: "Hide password" }),
    ).toHaveAttribute("aria-pressed", "true")
  })

  it("shows the error message with the matching ARIA attributes", () => {
    render(
      <PasswordInput
        id="password"
        label="Password"
        value=""
        onChange={() => {}}
        error="Password is required"
      />,
    )

    const input = screen.getByLabelText("Password")
    expect(screen.getByRole("alert")).toHaveTextContent("Password is required")
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveAttribute("aria-describedby", "password-error")
  })
})
