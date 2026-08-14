import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

import ExpiredHeistCard from "@/components/ExpiredHeistCard"
import type { Heist } from "@/types/firestore"

function makeHeist(overrides: Partial<Heist> = {}): Heist {
  return {
    id: "heist-1",
    title: "Steal the stapler",
    description: "",
    createdBy: "uid-ghost",
    createdByCodename: "Ghost",
    assignedTo: "uid-shadow",
    assignedToCodename: "Shadow",
    createdAt: new Date(2026, 7, 1),
    deadline: new Date(2026, 7, 13),
    finalStatus: "success",
    ...overrides,
  }
}

describe("ExpiredHeistCard", () => {
  it("shows the title, the formatted deadline date and the To:/By: codenames", () => {
    render(<ExpiredHeistCard heist={makeHeist()} />)
    expect(screen.getByText("Steal the stapler")).toBeInTheDocument()
    expect(screen.getByText("Aug 13, 2026")).toBeInTheDocument()
    expect(screen.getByText("To:")).toBeInTheDocument()
    expect(screen.getByText("Shadow")).toBeInTheDocument()
    expect(screen.getByText("By:")).toBeInTheDocument()
    expect(screen.getByText("Ghost")).toBeInTheDocument()
  })

  it("shows a SUCCESS badge when finalStatus is 'success'", () => {
    render(<ExpiredHeistCard heist={makeHeist({ finalStatus: "success" })} />)
    expect(screen.getByText("SUCCESS")).toBeInTheDocument()
  })

  it("shows a FAILED badge when finalStatus is 'failure'", () => {
    render(<ExpiredHeistCard heist={makeHeist({ finalStatus: "failure" })} />)
    expect(screen.getByText("FAILED")).toBeInTheDocument()
  })

  it("shows no status badge when finalStatus is null", () => {
    render(<ExpiredHeistCard heist={makeHeist({ finalStatus: null })} />)
    expect(screen.queryByText("SUCCESS")).not.toBeInTheDocument()
    expect(screen.queryByText("FAILED")).not.toBeInTheDocument()
  })

  it("renders no interactive link", () => {
    render(<ExpiredHeistCard heist={makeHeist()} />)
    expect(screen.queryByRole("link")).not.toBeInTheDocument()
  })
})
