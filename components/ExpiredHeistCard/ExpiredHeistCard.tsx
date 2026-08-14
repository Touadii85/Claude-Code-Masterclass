import { CheckCircle2, XCircle, Calendar, User, Users } from "lucide-react"
import type { Heist, HeistStatus } from "@/types/firestore"
import { formatDate } from "@/lib/utils/formatDate"
import styles from "./ExpiredHeistCard.module.css"

interface ExpiredHeistCardProps {
  heist: Heist
}

export default function ExpiredHeistCard({ heist }: ExpiredHeistCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <StatusIcon status={heist.finalStatus} />
          <p className={styles.title}>{heist.title}</p>
          <p className={styles.date}>
            <Calendar size={12} strokeWidth={2.5} className={styles.dateIcon} />
            {formatDate(heist.deadline)}
          </p>
        </div>
        <StatusBadge status={heist.finalStatus} />
      </div>
      <div className={styles.meta}>
        <p className={styles.metaLine}>
          <User size={12} strokeWidth={2.5} className={styles.metaIcon} />
          <span>
            To:{" "}
            <span className={styles.assignee}>{heist.assignedToCodename}</span>
          </span>
        </p>
        <p className={styles.metaLine}>
          <Users size={12} strokeWidth={2.5} className={styles.metaIcon} />
          <span>
            By:{" "}
            <span className={styles.creator}>{heist.createdByCodename}</span>
          </span>
        </p>
      </div>
    </div>
  )
}

function StatusIcon({ status }: { status: HeistStatus }) {
  if (status === "success") {
    return (
      <CheckCircle2
        size={16}
        strokeWidth={2.5}
        className={styles.iconSuccess}
      />
    )
  }
  if (status === "failure") {
    return (
      <XCircle size={16} strokeWidth={2.5} className={styles.iconFailure} />
    )
  }
  return null
}

function StatusBadge({ status }: { status: HeistStatus }) {
  if (status === "success") {
    return (
      <span className={`${styles.badge} ${styles.badgeSuccess}`}>SUCCESS</span>
    )
  }
  if (status === "failure") {
    return (
      <span className={`${styles.badge} ${styles.badgeFailure}`}>FAILED</span>
    )
  }
  return null
}
