import {
  DocumentData,
  FieldValue,
  QueryDocumentSnapshot,
} from "firebase/firestore"

export type HeistStatus = "success" | "failure" | null

// Document : ce qu'on lit depuis Firestore (après conversion)
export interface Heist {
  id: string
  title: string
  description: string
  createdBy: string
  createdByCodename: string
  assignedTo: string
  assignedToCodename: string
  createdAt: Date
  deadline: Date
  finalStatus: HeistStatus
}

// Create Input : ce qu'on passe à addDoc
export interface CreateHeistInput {
  title: string
  description: string
  createdBy: string
  createdByCodename: string
  assignedTo: string
  assignedToCodename: string
  createdAt: FieldValue // serverTimestamp()
  deadline: Date // calculé côté client, 48h après la création
  finalStatus: null
}

// Update Input : champs partiels pour updateDoc (pas de createdAt)
export interface UpdateHeistInput {
  title?: string
  description?: string
  createdBy?: string
  createdByCodename?: string
  assignedTo?: string
  assignedToCodename?: string
  deadline?: Date
  finalStatus?: HeistStatus
}

export const heistConverter = {
  toFirestore: (data: Partial<Heist>): DocumentData => data,

  fromFirestore: (snapshot: QueryDocumentSnapshot): Heist =>
    ({
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate(),
      deadline: snapshot.data().deadline?.toDate(),
    }) as Heist,
}
