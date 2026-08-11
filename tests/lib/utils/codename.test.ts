import { describe, it, expect } from "vitest"
import { generateCodename } from "@/lib/utils/codename"

describe("generateCodename", () => {
  it("returns a non-empty string", () => {
    expect(generateCodename().length).toBeGreaterThan(0)
  })

  it("matches the three-word PascalCase pattern", () => {
    expect(generateCodename()).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+[A-Z][a-z]+$/)
  })

  it("generates different values across multiple calls", () => {
    const values = new Set(Array.from({ length: 10 }, () => generateCodename()))
    expect(values.size).toBeGreaterThanOrEqual(8)
  })
})
