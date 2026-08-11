import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import userEvent from "@testing-library/user-event"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { useUser } from "@/hooks/useUser"

// imports de composants
import Navbar from "@/components/Navbar"

vi.mock("@/lib/firebase/config", () => ({ auth: {} }))

vi.mock("firebase/auth", () => ({
  signOut: vi.fn(),
}))

vi.mock("@/hooks/useUser", () => ({
  useUser: vi.fn(),
}))

describe("Navbar", () => {
  beforeEach(() => {
    vi.mocked(useUser).mockReturnValue({
      user: null,
      loading: false,
      signOut: vi.fn(),
    })
  })

  it("renders the main heading", () => {
    render(<Navbar />)

    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it("renders the Create Heist link", () => {
    render(<Navbar />)

    const createLink = screen.getByRole("link", { name: /create heist/i })
    expect(createLink).toBeInTheDocument()
    expect(createLink).toHaveAttribute("href", "/heists/create")
  })

  it("shows the logout button when a user is authenticated", () => {
    vi.mocked(useUser).mockReturnValue({
      user: {
        uid: "123",
        email: "test@example.com",
        displayName: "Agent Purple",
      },
      loading: false,
      signOut: vi.fn(),
    })

    render(<Navbar />)

    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument()
  })

  it("hides the logout button when no user is authenticated", () => {
    render(<Navbar />)

    expect(
      screen.queryByRole("button", { name: /logout/i }),
    ).not.toBeInTheDocument()
  })

  it("calls signOut when the logout button is clicked", async () => {
    vi.mocked(useUser).mockReturnValue({
      user: {
        uid: "123",
        email: "test@example.com",
        displayName: "Agent Purple",
      },
      loading: false,
      signOut: vi.fn(),
    })
    const clickUser = userEvent.setup()

    render(<Navbar />)
    await clickUser.click(screen.getByRole("button", { name: /logout/i }))

    expect(signOut).toHaveBeenCalledWith(auth)
  })
})
