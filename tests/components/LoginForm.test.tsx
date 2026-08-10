import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

// imports de composants
import LoginForm from "@/components/LoginForm"

describe("LoginForm", () => {
  let logSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // on espionne console.log sans polluer la sortie des tests
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  it("renders the email field, the password field and the submit button", () => {
    render(<LoginForm />)

    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument()
  })

  it("masks the password by default", () => {
    render(<LoginForm />)

    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    )
  })

  it("logs the credentials when the form is valid", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.type(screen.getByLabelText("Password"), "secret")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    expect(logSpy).toHaveBeenCalledWith("Email:", "user@example.com")
    expect(logSpy).toHaveBeenCalledWith("Password:", "secret")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("submits when the user presses the Enter key", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.type(screen.getByLabelText("Password"), "secret{Enter}")

    expect(logSpy).toHaveBeenCalledWith("Email:", "user@example.com")
  })

  it("blocks the submission and shows errors when both fields are empty", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.click(screen.getByRole("button", { name: "Log In" }))

    expect(screen.getByText("Email is required")).toBeInTheDocument()
    expect(screen.getByText("Password is required")).toBeInTheDocument()
    expect(logSpy).not.toHaveBeenCalled()
  })

  it("blocks the submission when only the password is filled in", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Password"), "secret")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    expect(screen.getByText("Email is required")).toBeInTheDocument()
    expect(logSpy).not.toHaveBeenCalled()
  })

  it("blocks the submission when only the email is filled in", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    expect(screen.getByText("Password is required")).toBeInTheDocument()
    expect(logSpy).not.toHaveBeenCalled()
  })

  it("rejects an invalid email format", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "not-an-email")
    await user.type(screen.getByLabelText("Password"), "secret")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    expect(screen.getByText("Invalid email format")).toBeInTheDocument()
    expect(logSpy).not.toHaveBeenCalled()
  })

  it("links to the signup page", () => {
    render(<LoginForm />)

    const link = screen.getByRole("link", { name: "Sign up" })
    expect(link).toHaveAttribute("href", "/signup")
  })
})
