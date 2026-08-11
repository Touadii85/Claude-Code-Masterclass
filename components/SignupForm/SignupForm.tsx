"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import Input from "@/components/Input"
import PasswordInput from "@/components/PasswordInput"
import Button from "@/components/Button"
import { auth, db } from "@/lib/firebase/config"
import { generateCodename } from "@/lib/utils/codename"
import styles from "./SignupForm.module.css"

// validation légère du format d'e-mail : du texte, un @, du texte, un point, du texte
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please log in instead."
    case "auth/weak-password":
      return "Password should be at least 6 characters long."
    case "auth/invalid-email":
      return "Please enter a valid email address."
    default:
      return "An error occurred during signup. Please try again."
  }
}

export default function SignupForm() {
  const router = useRouter()

  // entrées contrôlées : la valeur affichée vient toujours de l'état React
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    // empêche le rechargement de la page provoqué par la soumission native
    e.preventDefault()

    const nextEmailError = !email.trim()
      ? "Email is required"
      : !EMAIL_PATTERN.test(email)
        ? "Invalid email format"
        : ""
    const nextPasswordError = !password ? "Password is required" : ""

    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    setFormError("")

    // rien n'est enregistré tant qu'un champ est vide ou mal rempli
    if (nextEmailError || nextPasswordError) return

    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const user = userCredential.user

      const codename = generateCodename()
      await updateProfile(user, { displayName: codename })

      try {
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          codename,
        })
      } catch (firestoreError) {
        console.error("Failed to create user document:", firestoreError)
      }

      router.push("/heists")
    } catch (error) {
      const errorCode =
        error instanceof Error && "code" in error ? String(error.code) : ""
      setFormError(getErrorMessage(errorCode))
      setLoading(false)
    }
  }

  return (
    // noValidate désactive les bulles natives du navigateur au profit de nos propres messages
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {formError && (
        <div className={styles.error} role="alert">
          {formError}
        </div>
      )}
      <Input
        id="signup-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        error={emailError}
        disabled={loading}
      />
      <PasswordInput
        id="signup-password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        error={passwordError}
        disabled={loading}
      />
      <Button disabled={loading}>
        {loading ? "Creating Account..." : "Sign Up"}
      </Button>
      <p className={styles.switch}>
        Already have an account?{" "}
        <Link href="/login" className={styles.switchLink}>
          Log in
        </Link>
      </p>
    </form>
  )
}
