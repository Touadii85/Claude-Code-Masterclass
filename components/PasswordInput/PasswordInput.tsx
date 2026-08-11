"use client"

import { ChangeEvent, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import styles from "./PasswordInput.module.css"

interface PasswordInputProps {
  id: string
  label: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  error?: string
  disabled?: boolean
}

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
}: PasswordInputProps) {
  // état d'affichage du mot de passe : masqué par défaut
  const [showPassword, setShowPassword] = useState(false)

  // identifiant du message d'erreur, relié à l'input via aria-describedby
  const errorId = `${id}-error`

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${styles.input} ${error ? styles.inputError : ""}`}
        />
        {/* type="button" est indispensable : sans lui, le bouton soumettrait le formulaire */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className={styles.toggle}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
