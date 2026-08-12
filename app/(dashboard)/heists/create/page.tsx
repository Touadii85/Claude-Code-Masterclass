"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useUser } from "@/hooks/useUser"
import {
  COLLECTIONS,
  userConverter,
  type CreateHeistInput,
  type User,
} from "@/types/firestore"
import Input from "@/components/Input"
import styles from "./page.module.css"

// délai entre la création d'un heist et sa date limite (48h, non modifiable)
const DEADLINE_DELAY_MS = 48 * 60 * 60 * 1000

export default function CreateHeistPage() {
  const router = useRouter()
  // l'authentification est déjà garantie par app/(dashboard)/layout.tsx
  const { user } = useUser()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [assignedToCodename, setAssignedToCodename] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) return

    async function loadUsers() {
      try {
        const snapshot = await getDocs(
          collection(db, COLLECTIONS.USERS).withConverter<User>(userConverter),
        )
        // exclusion côté client de l'utilisateur connecté (pas de requête
        // avec inégalité Firestore, pas d'index composite nécessaire)
        const others = snapshot.docs
          .map((docSnapshot) => docSnapshot.data())
          .filter((candidate) => candidate.id !== user?.uid)
        setUsers(others)
      } catch (err) {
        console.error("Failed to load users:", err)
      } finally {
        setUsersLoading(false)
      }
    }

    loadUsers()
  }, [user])

  function validateForm(): boolean {
    if (!title.trim()) {
      setError("Title is required")
      return false
    }
    if (!description.trim()) {
      setError("Description is required")
      return false
    }
    if (!assignedTo) {
      setError("Please select a user to assign this heist to")
      return false
    }
    return true
  }

  function handleAssignedToChange(e: ChangeEvent<HTMLSelectElement>) {
    const selectedUserId = e.target.value
    setAssignedTo(selectedUserId)

    const selectedUser = users.find((u) => u.id === selectedUserId)
    if (selectedUser) setAssignedToCodename(selectedUser.codename)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")

    if (!validateForm() || !user) return

    setLoading(true)

    try {
      // deadline calculée côté client, 48h après la création, non modifiable
      const deadline = new Date(Date.now() + DEADLINE_DELAY_MS)

      const heistData: CreateHeistInput = {
        title: title.trim(),
        description: description.trim(),
        createdBy: user.uid,
        createdByCodename: user.displayName ?? "Unknown",
        assignedTo,
        assignedToCodename,
        createdAt: serverTimestamp(),
        deadline,
        finalStatus: null,
      }

      // pas de .withConverter(heistConverter) ici : CreateHeistInput a
      // createdAt en FieldValue (serverTimestamp) et pas d'id, incompatible
      // avec WithFieldValue<Heist>. Le converter reste réservé aux futures
      // lectures de heists (heistConverter.fromFirestore).
      await addDoc(collection(db, COLLECTIONS.HEISTS), heistData)

      router.push("/heists")
    } catch (err) {
      console.error("Failed to create heist:", err)
      setError("Failed to create heist. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="center-content">
      <div className="page-content">
        <h2 className="form-title">Create a New Heist</h2>

        {usersLoading ? (
          <p className={styles.emptyState}>Loading available agents...</p>
        ) : users.length === 0 ? (
          <p className={styles.emptyState}>
            No other agents are available yet. Invite someone to join Pocket
            Heist before creating a heist.
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            {error && (
              <div role="alert" className={styles.error}>
                {error}
              </div>
            )}
            <Input
              id="heist-title"
              label="Title"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder="Enter heist title"
              required
              disabled={loading}
            />
            <div className={styles.inputGroup}>
              <label htmlFor="heist-description" className={styles.label}>
                Description
              </label>
              <textarea
                id="heist-description"
                value={description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
                placeholder="Enter heist description"
                required
                disabled={loading}
                className={styles.textarea}
                rows={4}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="heist-assigned-to" className={styles.label}>
                Assigned To
              </label>
              <select
                id="heist-assigned-to"
                value={assignedTo}
                onChange={handleAssignedToChange}
                required
                disabled={loading}
                className={styles.select}
              >
                <option value="">Select a user...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.codename}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? "Creating Heist..." : "Create Heist"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
