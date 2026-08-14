import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { useHeists } from "@/lib/hooks"
import type { HeistFilter, UseHeistsReturn } from "@/lib/hooks"
import type { Heist } from "@/types/firestore"
import HeistsPage from "@/app/(dashboard)/heists/page"

vi.mock("@/lib/hooks", () => ({ useHeists: vi.fn() }))

function makeHeist(
  id: string,
  title: string,
  overrides: Partial<Heist> = {},
): Heist {
  return {
    id,
    title,
    description: "",
    createdBy: "uid-ghost",
    createdByCodename: "Ghost",
    assignedTo: "uid-shadow",
    assignedToCodename: "Shadow",
    createdAt: new Date(),
    deadline: new Date(Date.now() + 4 * 60 * 60 * 1000),
    finalStatus: null,
    ...overrides,
  }
}

function mockHeistsByFilter(
  byFilter: Partial<Record<HeistFilter, Partial<UseHeistsReturn>>>,
) {
  vi.mocked(useHeists).mockImplementation((filter: HeistFilter) => ({
    heists: [],
    loading: false,
    error: null,
    ...byFilter[filter],
  }))
}

describe("HeistsPage", () => {
  it("renders HeistCard links for active and assigned heists, and a non-clickable ExpiredHeistCard for expired heists", () => {
    mockHeistsByFilter({
      active: { heists: [makeHeist("1", "Steal the stapler")] },
      assigned: { heists: [makeHeist("2", "Swap the coffee")] },
      expired: {
        heists: [makeHeist("3", "Old caper", { finalStatus: "failure" })],
      },
    })

    render(<HeistsPage />)

    expect(
      screen.getByRole("link", { name: "Steal the stapler" }),
    ).toHaveAttribute("href", "/heists/1")
    expect(
      screen.getByRole("link", { name: "Swap the coffee" }),
    ).toHaveAttribute("href", "/heists/2")

    expect(screen.getByText("Old caper")).toBeInTheDocument()
    expect(screen.getByText("FAILED")).toBeInTheDocument()
    expect(
      screen.queryByRole("link", { name: "Old caper" }),
    ).not.toBeInTheDocument()
  })

  it("shows a SUCCESS badge for expired heists that finished successfully", () => {
    mockHeistsByFilter({
      expired: {
        heists: [makeHeist("4", "Vault job", { finalStatus: "success" })],
      },
    })

    render(<HeistsPage />)

    expect(screen.getByText("SUCCESS")).toBeInTheDocument()
  })

  it("shows three HeistCardSkeleton while active heists are loading", () => {
    mockHeistsByFilter({ active: { loading: true } })

    render(<HeistsPage />)

    expect(
      screen.getAllByRole("status", { name: /loading heist/i }),
    ).toHaveLength(3)
  })

  it("shows three ExpiredHeistCardSkeleton while expired heists are loading", () => {
    mockHeistsByFilter({ expired: { loading: true } })

    render(<HeistsPage />)

    expect(
      screen.getAllByRole("status", { name: /loading expired heist/i }),
    ).toHaveLength(3)
  })

  it("shows an empty-state message when a section has no heists", () => {
    mockHeistsByFilter({})

    render(<HeistsPage />)

    expect(screen.getByText("No active heists")).toBeInTheDocument()
    expect(
      screen.getByText("You haven't assigned any heists yet"),
    ).toBeInTheDocument()
    expect(screen.getByText("No expired heists")).toBeInTheDocument()
  })

  it("shows an error message when a section fails to load", () => {
    mockHeistsByFilter({ expired: { error: "Failed to load heists" } })

    render(<HeistsPage />)

    expect(screen.getByText("Error: Failed to load heists")).toBeInTheDocument()
  })
})
