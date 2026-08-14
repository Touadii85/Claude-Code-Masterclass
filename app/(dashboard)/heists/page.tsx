"use client"

import { useHeists } from "@/lib/hooks"
import HeistCard from "@/components/HeistCard"
import HeistCardSkeleton from "@/components/HeistCardSkeleton"
import ExpiredHeistCard from "@/components/ExpiredHeistCard"
import ExpiredHeistCardSkeleton from "@/components/ExpiredHeistCardSkeleton"
import styles from "./page.module.css"

export default function HeistsPage() {
  const {
    heists: activeHeists,
    loading: activeLoading,
    error: activeError,
  } = useHeists("active")
  const {
    heists: assignedHeists,
    loading: assignedLoading,
    error: assignedError,
  } = useHeists("assigned")
  const {
    heists: expiredHeists,
    loading: expiredLoading,
    error: expiredError,
  } = useHeists("expired")

  return (
    <div className="page-content">
      <div className="active-heists">
        <h2>Your Active Heists</h2>
        {activeError && (
          <p className={styles.errorMessage}>Error: {activeError}</p>
        )}
        {!activeError && activeLoading && (
          <div className={styles.grid}>
            {Array.from({ length: 3 }).map((_, i) => (
              <HeistCardSkeleton key={i} />
            ))}
          </div>
        )}
        {!activeLoading && !activeError && activeHeists.length === 0 && (
          <p className={styles.emptyState}>No active heists</p>
        )}
        {!activeLoading && !activeError && activeHeists.length > 0 && (
          <div className={styles.grid}>
            {activeHeists.map((heist) => (
              <HeistCard key={heist.id} heist={heist} />
            ))}
          </div>
        )}
      </div>

      <div className="assigned-heists">
        <h2>Heists You&apos;ve Assigned</h2>
        {assignedError && (
          <p className={styles.errorMessage}>Error: {assignedError}</p>
        )}
        {!assignedError && assignedLoading && (
          <div className={styles.grid}>
            {Array.from({ length: 3 }).map((_, i) => (
              <HeistCardSkeleton key={i} />
            ))}
          </div>
        )}
        {!assignedLoading && !assignedError && assignedHeists.length === 0 && (
          <p className={styles.emptyState}>
            You haven&apos;t assigned any heists yet
          </p>
        )}
        {!assignedLoading && !assignedError && assignedHeists.length > 0 && (
          <div className={styles.grid}>
            {assignedHeists.map((heist) => (
              <HeistCard key={heist.id} heist={heist} />
            ))}
          </div>
        )}
      </div>

      <div className="expired-heists">
        <h2>All Expired Heists</h2>
        {expiredLoading && (
          <div className={styles.list}>
            {Array.from({ length: 3 }).map((_, i) => (
              <ExpiredHeistCardSkeleton key={i} />
            ))}
          </div>
        )}
        {expiredError && (
          <p className={styles.errorMessage}>Error: {expiredError}</p>
        )}
        {!expiredLoading && !expiredError && expiredHeists.length === 0 && (
          <p className={styles.emptyState}>No expired heists</p>
        )}
        {!expiredLoading && !expiredError && expiredHeists.length > 0 && (
          <div className={styles.list}>
            {expiredHeists.map((heist) => (
              <ExpiredHeistCard key={heist.id} heist={heist} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
