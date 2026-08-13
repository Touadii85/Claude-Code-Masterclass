"use client"

import { useHeists } from "@/lib/hooks"

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
        {activeLoading && <p>Loading...</p>}
        {activeError && <p>Error: {activeError}</p>}
        {!activeLoading && !activeError && activeHeists.length === 0 && (
          <p>No active heists</p>
        )}
        {!activeLoading &&
          !activeError &&
          activeHeists.map((heist) => <div key={heist.id}>{heist.title}</div>)}
      </div>
      <div className="assigned-heists">
        <h2>Heists You&apos;ve Assigned</h2>
        {assignedLoading && <p>Loading...</p>}
        {assignedError && <p>Error: {assignedError}</p>}
        {!assignedLoading && !assignedError && assignedHeists.length === 0 && (
          <p>You haven&apos;t assigned any heists yet</p>
        )}
        {!assignedLoading &&
          !assignedError &&
          assignedHeists.map((heist) => (
            <div key={heist.id}>{heist.title}</div>
          ))}
      </div>
      <div className="expired-heists">
        <h2>All Expired Heists</h2>
        {expiredLoading && <p>Loading...</p>}
        {expiredError && <p>Error: {expiredError}</p>}
        {!expiredLoading && !expiredError && expiredHeists.length === 0 && (
          <p>No expired heists</p>
        )}
        {!expiredLoading &&
          !expiredError &&
          expiredHeists.map((heist) => <div key={heist.id}>{heist.title}</div>)}
      </div>
    </div>
  )
}
