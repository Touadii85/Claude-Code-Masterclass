import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { redirect } from "next/navigation"
import { useUser } from "@/hooks/useUser"

// import du layout à tester
import RootLayout from "@/app/(public)/layout"

vi.mock("@/hooks/useUser", () => ({ useUser: vi.fn() }))

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}))

describe("(public) layout", () => {
  beforeEach(() => {
    vi.mocked(redirect).mockClear()
  })

  it("shows the loading spinner while loading is true", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: true })

    render(
      <RootLayout>
        <div>Public content</div>
      </RootLayout>,
    )

    expect(screen.getByRole("status")).toBeInTheDocument()
    expect(screen.queryByText("Public content")).not.toBeInTheDocument()
  })

  it("does not redirect while loading is true", () => {
    vi.mocked(useUser).mockReturnValue({
      user: { uid: "1", email: null, displayName: null },
      loading: true,
    })

    render(
      <RootLayout>
        <div>Public content</div>
      </RootLayout>,
    )

    expect(redirect).not.toHaveBeenCalled()
  })

  it("renders the public content for an unauthenticated user", () => {
    vi.mocked(useUser).mockReturnValue({ user: null, loading: false })

    render(
      <RootLayout>
        <div>Public content</div>
      </RootLayout>,
    )

    expect(screen.getByText("Public content")).toBeInTheDocument()
    expect(redirect).not.toHaveBeenCalled()
  })

  it("redirects an authenticated user to /heists", () => {
    vi.mocked(useUser).mockReturnValue({
      user: { uid: "1", email: null, displayName: null },
      loading: false,
    })

    render(
      <RootLayout>
        <div>Public content</div>
      </RootLayout>,
    )

    expect(redirect).toHaveBeenCalledWith("/heists")
  })
})
