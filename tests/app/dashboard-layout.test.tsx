import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { redirect } from "next/navigation"
import { useUser } from "@/hooks/useUser"

// import du layout à tester
import HeistsLayout from "@/app/(dashboard)/layout"

vi.mock("@/hooks/useUser", () => ({ useUser: vi.fn() }))

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}))

// Navbar a ses propres dépendances (Firebase) : on la mock pour isoler ce test
vi.mock("@/components/Navbar", () => ({
  default: () => <nav>Mocked Navbar</nav>,
}))

describe("(dashboard) layout", () => {
  beforeEach(() => {
    vi.mocked(redirect).mockClear()
  })

  it("shows the loading spinner while loading is true", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: true })

    render(
      <HeistsLayout>
        <div>Dashboard content</div>
      </HeistsLayout>,
    )

    expect(screen.getByRole("status")).toBeInTheDocument()
    expect(screen.queryByText("Dashboard content")).not.toBeInTheDocument()
  })

  it("does not redirect while loading is true", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: true })

    render(
      <HeistsLayout>
        <div>Dashboard content</div>
      </HeistsLayout>,
    )

    expect(redirect).not.toHaveBeenCalled()
  })

  it("renders the Navbar and the content for an authenticated user", () => {
    vi.mocked(useUser).mockReturnValue({
      user: { uid: "1", email: null, displayName: null },
      loading: false,
    })

    render(
      <HeistsLayout>
        <div>Dashboard content</div>
      </HeistsLayout>,
    )

    expect(screen.getByText("Mocked Navbar")).toBeInTheDocument()
    expect(screen.getByText("Dashboard content")).toBeInTheDocument()
    expect(redirect).not.toHaveBeenCalled()
  })

  it("redirects an unauthenticated user to /login", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: false })

    render(
      <HeistsLayout>
        <div>Dashboard content</div>
      </HeistsLayout>,
    )

    expect(redirect).toHaveBeenCalledWith("/login")
  })
})
