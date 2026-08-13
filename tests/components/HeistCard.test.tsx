import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"

import HeistCard from "@/components/HeistCard"
import { formatDeadline } from "@/lib/utils/formatDeadline"
import type { Heist } from "@/types/firestore"

vi.mock("@/lib/utils/formatDeadline", () => ({
  formatDeadline: vi.fn(() => "4h 42m"),
}))

const heist: Heist = {
  id: "heist-1",
  title: "Steal the stapler",
  description: "",
  createdBy: "uid-ghost",
  createdByCodename: "Ghost",
  assignedTo: "uid-shadow",
  assignedToCodename: "Shadow",
  createdAt: new Date(),
  deadline: new Date(),
  finalStatus: null,
}

describe("HeistCard", () => {
  it("renders the title as a link to the heist details page", () => {
    render(<HeistCard heist={heist} />)
    const link = screen.getByRole("link", { name: "Steal the stapler" })
    expect(link).toHaveAttribute("href", "/heists/heist-1")
  })

  it("shows the assignee and the creator codenames", () => {
    render(<HeistCard heist={heist} />)
    expect(screen.getByText("To:")).toBeInTheDocument()
    expect(screen.getByText("Shadow")).toBeInTheDocument()
    expect(screen.getByText("By:")).toBeInTheDocument()
    expect(screen.getByText("Ghost")).toBeInTheDocument()
  })

  it("shows the formatted deadline", () => {
    render(<HeistCard heist={heist} />)
    expect(screen.getByText("4h 42m")).toBeInTheDocument()
    expect(formatDeadline).toHaveBeenCalledWith(heist.deadline)
  })
})
