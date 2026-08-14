import styles from "./ExpiredHeistCardSkeleton.module.css"

export default function ExpiredHeistCardSkeleton() {
  return (
    <div
      className={styles.card}
      role="status"
      aria-label="Loading expired heist"
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.icon} />
          <div className={styles.titleLine} />
          <div className={styles.dateLine} />
        </div>
        <div className={styles.badgeLine} />
      </div>
      <div className={styles.meta}>
        <div className={`${styles.line} ${styles.lineWide}`} />
        <div className={`${styles.line} ${styles.lineMedium}`} />
      </div>
    </div>
  )
}
