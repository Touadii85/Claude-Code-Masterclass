"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import Input from "@/components/Input"
import PasswordInput from "@/components/PasswordInput"
import Button from "@/components/Button"
import styles from "./SignupForm.module.css"

// validation légère du format d'e-mail : du texte, un @, du texte, un point, du texte
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignupForm() {
  // entrées contrôlées : la valeur affichée vient toujours de l'état React
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
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

    // rien n'est enregistré tant qu'un champ est vide ou mal rempli
    if (nextEmailError || nextPasswordError) return

    console.log("Email:", email)
    console.log("Password:", password)
  }

  return (
    // noValidate désactive les bulles natives du navigateur au profit de nos propres messages
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input
        id="signup-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        error={emailError}
      />
      <PasswordInput
        id="signup-password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        error={passwordError}
      />
      <Button>Sign Up</Button>
      <p className={styles.switch}>
        Already have an account?{" "}
        <Link href="/login" className={styles.switchLink}>
          Log in
        </Link>
      </p>
    </form>
  )
}
