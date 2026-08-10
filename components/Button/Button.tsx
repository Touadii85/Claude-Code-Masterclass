import { ReactNode } from "react"
import styles from "./Button.module.css"

interface ButtonProps {
  children: ReactNode
  type?: "submit" | "button" | "reset"
  disabled?: boolean
}

export default function Button({
  children,
  type = "submit",
  disabled = false,
}: ButtonProps) {
  return (
    // la classe globale .btn porte la couleur primaire et la transition au survol
    <button type={type} disabled={disabled} className={`btn ${styles.button}`}>
      {children}
    </button>
  )
}
