import { describe, it, expect } from "vitest"
import { formatDeadline } from "@/lib/utils/formatDeadline"

const now = new Date("2026-08-13T12:00:00.000Z")

describe("formatDeadline", () => {
  it("formats hours and minutes", () => {
    const deadline = new Date(
      now.getTime() + 4 * 60 * 60 * 1000 + 42 * 60 * 1000,
    )
    expect(formatDeadline(deadline, now)).toBe("4h 42m")
  })

  it("formats minutes only when under an hour", () => {
    const deadline = new Date(now.getTime() + 30 * 60 * 1000)
    expect(formatDeadline(deadline, now)).toBe("30m")
  })

  it("formats days and hours when a day or more remains", () => {
    const deadline = new Date(
      now.getTime() + 25 * 60 * 60 * 1000 + 30 * 60 * 1000,
    )
    expect(formatDeadline(deadline, now)).toBe("1d 1h")
  })

  it("returns Overdue for a deadline in the past", () => {
    const deadline = new Date(now.getTime() - 60 * 1000)
    expect(formatDeadline(deadline, now)).toBe("Overdue")
  })

  it("returns Overdue for a deadline exactly equal to now", () => {
    expect(formatDeadline(new Date(now), now)).toBe("Overdue")
  })
})
