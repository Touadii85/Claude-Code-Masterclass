import { describe, it, expect } from "vitest"
import { formatDate } from "@/lib/utils/formatDate"

describe("formatDate", () => {
  it("formats a date as a short, human-readable string", () => {
    const date = new Date(2026, 7, 13)
    expect(formatDate(date)).toBe("Aug 13, 2026")
  })

  it("does not zero-pad single-digit days", () => {
    const date = new Date(2026, 0, 5)
    expect(formatDate(date)).toBe("Jan 5, 2026")
  })
})
