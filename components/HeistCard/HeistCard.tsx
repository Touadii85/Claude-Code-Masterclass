import Link from "next/link"
import { Clock, Timer, User, Users } from "lucide-react"
import type { Heist } from "@/types/firestore"
import { formatDeadline } from "@/lib/utils/formatDeadline"
import styles from "./HeistCard.module.css"

interface HeistCardProps {
  heist: Heist
}

export default function HeistCard({ heist }: HeistCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Link href={`/heists/${heist.id}`} className={styles.title}>
          {heist.title}
        </Link>
        <Clock size={16} strokeWidth={2.5} className={styles.headerIcon} />
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
        <p className={styles.metaLine}>
          <Timer size={12} strokeWidth={2.5} className={styles.metaIcon} />
          <span className={styles.deadline}>
            {formatDeadline(heist.deadline)}
          </span>
        </p>
      </div>
    </div>
  )
}
