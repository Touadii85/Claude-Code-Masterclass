"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { signInWithEmailAndPassword } from "firebase/auth"
import Input from "@/components/Input"
import PasswordInput from "@/components/PasswordInput"
import Button from "@/components/Button"
import { auth } from "@/lib/firebase/config"
import styles from "./LoginForm.module.css"

// validation légère du format d'e-mail : du texte, un @, du texte, un point, du texte
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/invalid-credential":
      return "Invalid email or password. Please try again."
    case "auth/user-not-found":
      return "No account found with this email address."
    case "auth/wrong-password":
      return "Incorrect password. Please try again."
    case "auth/invalid-email":
      return "Please enter a valid email address."
    case "auth/too-many-requests":
      return "Too many failed login attempts. Please try again later."
    case "auth/user-disabled":
      return "This account has been disabled."
    default:
      return "An error occurred during login. Please try again."
  }
}

export default function LoginForm() {
  // entrées contrôlées : la valeur affichée vient toujours de l'état React
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

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
    setError("")
    setSuccess(false)

    // rien n'est enregistré tant qu'un champ est vide ou mal rempli
    if (nextEmailError || nextPasswordError) return

    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setSuccess(true)
      setLoading(false)
    } catch (error) {
      const errorCode =
        error instanceof Error && "code" in error ? String(error.code) : ""
      setError(getErrorMessage(errorCode))
      setLoading(false)
    }
  }

  return (
    // noValidate désactive les bulles natives du navigateur au profit de nos propres messages
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
      {success && <div className={styles.success}>Login successful</div>}
      <Input
        id="login-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        error={emailError}
        disabled={loading}
      />
      <PasswordInput
        id="login-password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        error={passwordError}
        disabled={loading}
      />
      <Button disabled={loading}>{loading ? "Logging In..." : "Log In"}</Button>
      <p className={styles.switch}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" className={styles.switchLink}>
          Sign up
        </Link>
      </p>
    </form>
  )
}
