import { Clock8 } from "lucide-react"
import styles from "./LoadingSpinner.module.css"

export default function LoadingSpinner() {
  return (
    <div className={styles.spinner} role="status" aria-label="Loading">
      <Clock8 className={styles.icon} strokeWidth={2.75} />
    </div>
  )
}
