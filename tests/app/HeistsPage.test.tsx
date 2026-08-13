import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { useHeists } from "@/lib/hooks"
import type { HeistFilter, UseHeistsReturn } from "@/lib/hooks"
import type { Heist } from "@/types/firestore"
import HeistsPage from "@/app/(dashboard)/heists/page"

vi.mock("@/lib/hooks", () => ({ useHeists: vi.fn() }))

function makeHeist(id: string, title: string): Heist {
  return {
    id,
    title,
    description: "",
    createdBy: "uid-ghost",
    createdByCodename: "Ghost",
    assignedTo: "uid-shadow",
    assignedToCodename: "Shadow",
    createdAt: new Date(),
    deadline: new Date(),
    finalStatus: null,
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
  it("displays titles from each of the three filtered sections", () => {
    mockHeistsByFilter({
      active: { heists: [makeHeist("1", "Steal the stapler")] },
      assigned: { heists: [makeHeist("2", "Swap the coffee")] },
      expired: { heists: [makeHeist("3", "Old caper")] },
    })

    render(<HeistsPage />)

    expect(screen.getByText("Steal the stapler")).toBeInTheDocument()
    expect(screen.getByText("Swap the coffee")).toBeInTheDocument()
    expect(screen.getByText("Old caper")).toBeInTheDocument()
  })

  it("shows a loading indicator per section while its data is loading", () => {
    mockHeistsByFilter({ active: { loading: true } })

    render(<HeistsPage />)

    expect(screen.getAllByText("Loading...")).toHaveLength(1)
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
