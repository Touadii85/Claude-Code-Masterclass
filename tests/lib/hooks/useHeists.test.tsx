import { renderHook, act, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { useUser } from "@/hooks/useUser"
import { useHeists } from "@/lib/hooks/useHeists"
import type { HeistFilter } from "@/lib/hooks/types"
import type { Heist } from "@/types/firestore"

vi.mock("@/lib/firebase/config", () => ({ db: {} }))
vi.mock("@/hooks/useUser", () => ({ useUser: vi.fn() }))

type MockSnapshot = { docs: { data: () => Heist }[] }

const unsubscribeMock = vi.fn()
let snapshotCallback: (snapshot: MockSnapshot) => void
let errorCallback: (err: Error) => void

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => ({})),
  query: vi.fn(() => ({ withConverter: vi.fn().mockReturnThis() })),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn((_query, onNext, onError) => {
    snapshotCallback = onNext
    errorCallback = onError
    return unsubscribeMock
  }),
}))

const currentUser = {
  uid: "uid-ghost",
  email: "ghost@example.com",
  displayName: "Ghost",
}

function makeHeist(overrides: Partial<Heist> = {}): Heist {
  return {
    id: "heist-1",
    title: "Steal the stapler",
    description: "Classic office prank",
    createdBy: "uid-ghost",
    createdByCodename: "Ghost",
    assignedTo: "uid-shadow",
    assignedToCodename: "Shadow",
    createdAt: new Date("2026-01-01"),
    deadline: new Date("2026-01-03"),
    finalStatus: null,
    ...overrides,
  }
}

function fireSnapshot(heists: Heist[]) {
  act(() => snapshotCallback({ docs: heists.map((h) => ({ data: () => h })) }))
}

describe("useHeists", () => {
  beforeEach(() => {
    vi.mocked(useUser).mockReturnValue({ user: currentUser, loading: false })
    unsubscribeMock.mockClear()
  })

  it("returns the heists received for the 'active' filter", async () => {
    const { result } = renderHook(() => useHeists("active"))
    expect(result.current.loading).toBe(true)

    fireSnapshot([makeHeist({ id: "heist-1", title: "Steal the stapler" })])

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.heists.map((h) => h.title)).toEqual([
      "Steal the stapler",
    ])
  })

  it("returns the heists received for the 'assigned' filter", async () => {
    const { result } = renderHook(() => useHeists("assigned"))

    fireSnapshot([makeHeist({ id: "heist-2", title: "Swap the coffee" })])

    await waitFor(() =>
      expect(result.current.heists.map((h) => h.title)).toEqual([
        "Swap the coffee",
      ]),
    )
  })

  it("returns the heists received for the 'expired' filter", async () => {
    const { result } = renderHook(() => useHeists("expired"))

    fireSnapshot([
      makeHeist({ id: "heist-3", title: "Old caper", finalStatus: "success" }),
    ])

    await waitFor(() =>
      expect(result.current.heists.map((h) => h.title)).toEqual(["Old caper"]),
    )
  })

  it("returns an empty array when no heist matches", async () => {
    const { result } = renderHook(() => useHeists("active"))

    fireSnapshot([])

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.heists).toEqual([])
  })

  it("cleans up the Firestore listener on unmount", () => {
    const { unmount } = renderHook(() => useHeists("active"))
    unmount()
    expect(unsubscribeMock).toHaveBeenCalledTimes(1)
  })

  it("unsubscribes from the previous filter and resubscribes when the filter changes", async () => {
    const { result, rerender } = renderHook(
      ({ filter }: { filter: HeistFilter }) => useHeists(filter),
      { initialProps: { filter: "active" as HeistFilter } },
    )

    fireSnapshot([makeHeist({ id: "heist-1", title: "Active job" })])
    await waitFor(() =>
      expect(result.current.heists.map((h) => h.title)).toEqual(["Active job"]),
    )

    rerender({ filter: "assigned" })
    expect(unsubscribeMock).toHaveBeenCalledTimes(1)

    fireSnapshot([makeHeist({ id: "heist-2", title: "Assigned job" })])
    await waitFor(() =>
      expect(result.current.heists.map((h) => h.title)).toEqual([
        "Assigned job",
      ]),
    )
  })

  it("updates the returned heists when Firestore data changes, without remounting", async () => {
    const { result } = renderHook(() => useHeists("active"))

    fireSnapshot([makeHeist({ id: "heist-1", title: "First job" })])
    await waitFor(() =>
      expect(result.current.heists.map((h) => h.title)).toEqual(["First job"]),
    )

    fireSnapshot([makeHeist({ id: "heist-1", title: "First job (updated)" })])
    await waitFor(() =>
      expect(result.current.heists.map((h) => h.title)).toEqual([
        "First job (updated)",
      ]),
    )
  })

  it("exposes an error when the Firestore listener fails", async () => {
    const { result } = renderHook(() => useHeists("active"))

    act(() => errorCallback(new Error("permission denied")))

    await waitFor(() =>
      expect(result.current.error).toBe("Failed to load heists"),
    )
    expect(result.current.loading).toBe(false)
  })
})
