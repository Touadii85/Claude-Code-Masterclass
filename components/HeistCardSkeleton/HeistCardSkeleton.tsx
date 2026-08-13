import styles from "./HeistCardSkeleton.module.css"

export default function HeistCardSkeleton() {
  return (
    <div className={styles.card} role="status" aria-label="Loading heist">
      <div className={styles.header}>
        <div className={styles.titleLine} />
        <div className={styles.headerIcon} />
      </div>
      <div className={styles.meta}>
        <div className={`${styles.line} ${styles.lineWide}`} />
        <div className={`${styles.line} ${styles.lineMedium}`} />
        <div className={`${styles.line} ${styles.lineShort}`} />
      </div>
    </div>
  )
}
