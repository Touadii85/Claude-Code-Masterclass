import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase/config"

// imports de composants
import LoginForm from "@/components/LoginForm"

vi.mock("@/lib/firebase/config", () => ({ auth: {} }))

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: vi.fn(),
}))

describe("LoginForm", () => {
  beforeEach(() => {
    // évite qu'un appel d'un test précédent ne fausse les assertions "not toHaveBeenCalled"
    vi.mocked(signInWithEmailAndPassword).mockClear()
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

  it("authenticates the user and shows a success message on valid submission", async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce(
      {} as Awaited<ReturnType<typeof signInWithEmailAndPassword>>,
    )
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.type(screen.getByLabelText("Password"), "secret")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "user@example.com",
      "secret",
    )
    expect(await screen.findByText("Login successful")).toBeInTheDocument()
  })

  it("shows an error message when the credentials are rejected", async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce(
      Object.assign(new Error("Firebase: Error"), {
        code: "auth/user-not-found",
      }),
    )
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.type(screen.getByLabelText("Password"), "wrong")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No account found with this email address.",
    )
  })

  it("shows a loading state while the request is in progress", async () => {
    let resolveSignIn: () => void = () => {}
    vi.mocked(signInWithEmailAndPassword).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveSignIn = () =>
          resolve({} as Awaited<ReturnType<typeof signInWithEmailAndPassword>>)
      }),
    )
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.type(screen.getByLabelText("Password"), "secret")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    expect(screen.getByRole("button", { name: "Logging In..." })).toBeDisabled()
    expect(screen.getByLabelText("Email")).toBeDisabled()
    expect(screen.getByLabelText("Password")).toBeDisabled()

    resolveSignIn()
    await screen.findByText("Login successful")
  })

  it("does not navigate away after a successful login", async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce(
      {} as Awaited<ReturnType<typeof signInWithEmailAndPassword>>,
    )
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.type(screen.getByLabelText("Password"), "secret")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    await screen.findByText("Login successful")
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
  })

  it("submits when the user presses the Enter key", async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce(
      {} as Awaited<ReturnType<typeof signInWithEmailAndPassword>>,
    )
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.type(screen.getByLabelText("Password"), "secret{Enter}")

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      "user@example.com",
      "secret",
    )
  })

  it("blocks the submission and shows errors when both fields are empty", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.click(screen.getByRole("button", { name: "Log In" }))

    expect(screen.getByText("Email is required")).toBeInTheDocument()
    expect(screen.getByText("Password is required")).toBeInTheDocument()
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled()
  })

  it("blocks the submission when only the password is filled in", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Password"), "secret")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    expect(screen.getByText("Email is required")).toBeInTheDocument()
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled()
  })

  it("blocks the submission when only the email is filled in", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "user@example.com")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    expect(screen.getByText("Password is required")).toBeInTheDocument()
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled()
  })

  it("rejects an invalid email format", async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText("Email"), "not-an-email")
    await user.type(screen.getByLabelText("Password"), "secret")
    await user.click(screen.getByRole("button", { name: "Log In" }))

    expect(screen.getByText("Invalid email format")).toBeInTheDocument()
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled()
  })

  it("links to the signup page", () => {
    render(<LoginForm />)

    const link = screen.getByRole("link", { name: "Sign up" })
    expect(link).toHaveAttribute("href", "/signup")
  })
})
