import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { addDoc, getDocs } from "firebase/firestore"
import { useUser } from "@/hooks/useUser"
import type { CreateHeistInput } from "@/types/firestore"
import CreateHeistPage from "@/app/(dashboard)/heists/create/page"

const pushMock = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}))

vi.mock("@/hooks/useUser", () => ({ useUser: vi.fn() }))

vi.mock("@/lib/firebase/config", () => ({ db: {} }))

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => ({ withConverter: vi.fn().mockReturnThis() })),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(() => "SERVER_TIMESTAMP"),
}))

const currentUser = {
  uid: "uid-ghost",
  email: "ghost@example.com",
  displayName: "Ghost",
}

function mockUsersSnapshot(users: { id: string; codename: string }[]) {
  vi.mocked(getDocs).mockResolvedValueOnce({
    docs: users.map((u) => ({ data: () => u })),
  } as never)
}

describe("CreateHeistPage", () => {
  beforeEach(() => {
    vi.mocked(useUser).mockReturnValue({ user: currentUser, loading: false })
    vi.mocked(addDoc).mockClear()
    pushMock.mockClear()
  })

  it("shows the form fields, excluding the current user from the assignee list", async () => {
    mockUsersSnapshot([
      { id: "uid-ghost", codename: "Ghost" },
      { id: "uid-shadow", codename: "Shadow" },
    ])
    render(<CreateHeistPage />)

    expect(await screen.findByLabelText("Title")).toBeInTheDocument()
    expect(screen.getByLabelText("Description")).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Shadow" })).toBeInTheDocument()
    expect(
      screen.queryByRole("option", { name: "Ghost" }),
    ).not.toBeInTheDocument()
  })

  it("shows a message instead of the form when no other agent is available", async () => {
    mockUsersSnapshot([{ id: "uid-ghost", codename: "Ghost" }])
    render(<CreateHeistPage />)

    expect(
      await screen.findByText(/No other agents are available/),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText("Title")).not.toBeInTheDocument()
  })

  it("blocks submission and shows an error when required fields are empty", async () => {
    mockUsersSnapshot([{ id: "uid-shadow", codename: "Shadow" }])
    const user = userEvent.setup()
    render(<CreateHeistPage />)

    await user.click(
      await screen.findByRole("button", { name: "Create Heist" }),
    )

    expect(screen.getByText("Title is required")).toBeInTheDocument()
    expect(addDoc).not.toHaveBeenCalled()
  })

  it("creates the heist with computed fields and redirects to /heists", async () => {
    mockUsersSnapshot([{ id: "uid-shadow", codename: "Shadow" }])
    vi.mocked(addDoc).mockResolvedValueOnce({} as never)
    const user = userEvent.setup()
    render(<CreateHeistPage />)

    await user.type(await screen.findByLabelText("Title"), "Steal the stapler")
    await user.type(
      screen.getByLabelText("Description"),
      "Classic office prank",
    )
    await user.selectOptions(screen.getByLabelText("Assigned To"), "uid-shadow")
    await user.click(screen.getByRole("button", { name: "Create Heist" }))

    await waitFor(() => expect(addDoc).toHaveBeenCalledTimes(1))
    const payload = vi.mocked(addDoc).mock.calls[0][1] as CreateHeistInput
    expect(payload).toMatchObject({
      title: "Steal the stapler",
      description: "Classic office prank",
      createdBy: "uid-ghost",
      createdByCodename: "Ghost",
      assignedTo: "uid-shadow",
      assignedToCodename: "Shadow",
      createdAt: "SERVER_TIMESTAMP",
      finalStatus: null,
    })
    expect(payload.deadline).toBeInstanceOf(Date)
    expect(pushMock).toHaveBeenCalledWith("/heists")
  })

  it("shows a loading state while submitting", async () => {
    mockUsersSnapshot([{ id: "uid-shadow", codename: "Shadow" }])
    let resolveAdd: () => void = () => {}
    vi.mocked(addDoc).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveAdd = () => resolve({} as never)
      }),
    )
    const user = userEvent.setup()
    render(<CreateHeistPage />)

    await user.type(await screen.findByLabelText("Title"), "Steal the stapler")
    await user.type(
      screen.getByLabelText("Description"),
      "Classic office prank",
    )
    await user.selectOptions(screen.getByLabelText("Assigned To"), "uid-shadow")
    await user.click(screen.getByRole("button", { name: "Create Heist" }))

    expect(
      screen.getByRole("button", { name: "Creating Heist..." }),
    ).toBeDisabled()

    resolveAdd()
    await waitFor(() => expect(pushMock).toHaveBeenCalled())
  })

  it("shows an error message when the submission fails", async () => {
    mockUsersSnapshot([{ id: "uid-shadow", codename: "Shadow" }])
    vi.mocked(addDoc).mockRejectedValueOnce(new Error("network error"))
    const user = userEvent.setup()
    render(<CreateHeistPage />)

    await user.type(await screen.findByLabelText("Title"), "Steal the stapler")
    await user.type(
      screen.getByLabelText("Description"),
      "Classic office prank",
    )
    await user.selectOptions(screen.getByLabelText("Assigned To"), "uid-shadow")
    await user.click(screen.getByRole("button", { name: "Create Heist" }))

    expect(
      await screen.findByText("Failed to create heist. Please try again."),
    ).toBeInTheDocument()
    expect(pushMock).not.toHaveBeenCalled()
  })
})
