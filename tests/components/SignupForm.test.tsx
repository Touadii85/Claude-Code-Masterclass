import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

// imports de composants
import SignupForm from "@/components/SignupForm"

describe("SignupForm", () => {
  let logSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // on espionne console.log sans polluer la sortie des tests
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  it("renders the email field, the password field and the submit button", () => {
    render(<SignupForm />)

    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument()
  })

  it("masks the password by default", () => {
    render(<SignupForm />)

    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    )
  })

  it("logs the credentials when the form is valid", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.type(screen.getByLabelText("Password"), "secret")
    await user.click(screen.getByRole("button", { name: "Sign Up" }))

    expect(logSpy).toHaveBeenCalledWith("Email:", "user@example.com")
    expect(logSpy).toHaveBeenCalledWith("Password:", "secret")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("submits when the user presses the Enter key", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.type(screen.getByLabelText("Password"), "secret{Enter}")

    expect(logSpy).toHaveBeenCalledWith("Email:", "user@example.com")
  })

  it("blocks the submission and shows errors when both fields are empty", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.click(screen.getByRole("button", { name: "Sign Up" }))

    expect(screen.getByText("Email is required")).toBeInTheDocument()
    expect(screen.getByText("Password is required")).toBeInTheDocument()
    expect(logSpy).not.toHaveBeenCalled()
  })

  it("rejects an invalid email format", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    await user.type(screen.getByLabelText("Email"), "not-an-email")
    await user.type(screen.getByLabelText("Password"), "secret")
    await user.click(screen.getByRole("button", { name: "Sign Up" }))

    expect(screen.getByText("Invalid email format")).toBeInTheDocument()
    expect(logSpy).not.toHaveBeenCalled()
  })

  it("toggles the password visibility", async () => {
    const user = userEvent.setup()
    render(<SignupForm />)

    const input = screen.getByLabelText("Password")

    await user.click(screen.getByRole("button", { name: "Show password" }))
    expect(input).toHaveAttribute("type", "text")

    await user.click(screen.getByRole("button", { name: "Hide password" }))
    expect(input).toHaveAttribute("type", "password")
  })

  it("links to the login page", () => {
    render(<SignupForm />)

    const link = screen.getByRole("link", { name: "Log in" })
    expect(link).toHaveAttribute("href", "/login")
  })
})
