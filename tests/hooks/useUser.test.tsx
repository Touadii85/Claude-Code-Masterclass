import { render, screen, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"

import { AuthProvider } from "@/contexts/AuthContext"
import { useUser } from "@/hooks/useUser"

vi.mock("@/lib/firebase/config", () => ({ auth: {} }))

const authStateCallbacks: Array<(user: unknown) => void> = []

vi.mock("firebase/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/auth")>()
  return {
    ...actual,
    onAuthStateChanged: vi.fn((_auth, callback) => {
      authStateCallbacks.push(callback)
      return () => {
        const index = authStateCallbacks.indexOf(callback)
        if (index > -1) authStateCallbacks.splice(index, 1)
      }
    }),
  }
})

function TestConsumer() {
  const { user, loading } = useUser()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="uid">{user?.uid ?? "none"}</span>
      <span data-testid="email">{user?.email ?? "none"}</span>
      <span data-testid="displayName">{user?.displayName ?? "none"}</span>
    </div>
  )
}

describe("useUser", () => {
  beforeEach(() => {
    authStateCallbacks.length = 0
  })

  it("starts with loading true and no user before the auth listener fires", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId("loading")).toHaveTextContent("true")
    expect(screen.getByTestId("uid")).toHaveTextContent("none")
  })

  it("returns null user and loading false when the listener fires with no user", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    act(() => authStateCallbacks[0](null))

    expect(screen.getByTestId("loading")).toHaveTextContent("false")
    expect(screen.getByTestId("uid")).toHaveTextContent("none")
  })

  it("maps uid, email and displayName when the listener fires with a user", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    act(() =>
      authStateCallbacks[0]({
        uid: "abc123",
        email: "a@b.com",
        displayName: "SwiftCrimsonFalcon",
      }),
    )

    expect(screen.getByTestId("loading")).toHaveTextContent("false")
    expect(screen.getByTestId("uid")).toHaveTextContent("abc123")
    expect(screen.getByTestId("email")).toHaveTextContent("a@b.com")
    expect(screen.getByTestId("displayName")).toHaveTextContent(
      "SwiftCrimsonFalcon",
    )
  })

  it("updates the returned user when auth state changes again, without remounting", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    )

    act(() =>
      authStateCallbacks[0]({ uid: "user-1", email: null, displayName: null }),
    )
    expect(screen.getByTestId("uid")).toHaveTextContent("user-1")

    act(() => authStateCallbacks[0](null))
    expect(screen.getByTestId("uid")).toHaveTextContent("none")
  })

  it("throws when used outside of an AuthProvider", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {})

    expect(() => render(<TestConsumer />)).toThrow(
      "useUser must be used within an AuthProvider",
    )

    consoleErrorSpy.mockRestore()
  })
})
