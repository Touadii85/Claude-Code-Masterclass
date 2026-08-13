export function formatDeadline(deadline: Date, now: Date = new Date()): string {
  const diffMs = deadline.getTime() - now.getTime()
  if (diffMs <= 0) return "Overdue"

  const totalMinutes = Math.floor(diffMs / 60_000)
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}
