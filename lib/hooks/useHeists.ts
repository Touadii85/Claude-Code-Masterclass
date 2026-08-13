"use client"

import { useEffect, useState } from "react"
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  type CollectionReference,
  type Query,
} from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useUser } from "@/hooks/useUser"
import { COLLECTIONS, heistConverter, type Heist } from "@/types/firestore"
import type { HeistFilter, UseHeistsReturn } from "./types"

export function useHeists(filter: HeistFilter): UseHeistsReturn {
  const { user } = useUser()
  const uid = user?.uid

  const [heists, setHeists] = useState<Heist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fonction interne au hook : construit la requête Firestore pour le
  // filtre demandé (nichée ici plutôt qu'au niveau du module, comme dans
  // le plan — elle n'a pas besoin d'être partagée ailleurs).
  const buildQuery = (
    activeFilter: HeistFilter,
    userId: string,
  ): Query<Heist> => {
    const baseCollection = collection(
      db,
      COLLECTIONS.HEISTS,
    ) as CollectionReference<Heist>

    switch (activeFilter) {
      case "active":
        return query(
          baseCollection,
          where("assignedTo", "==", userId),
          where("deadline", ">", new Date()),
          orderBy("deadline", "asc"),
        ).withConverter(heistConverter)

      case "assigned":
        return query(
          baseCollection,
          where("createdBy", "==", userId),
          where("deadline", ">", new Date()),
          orderBy("deadline", "asc"),
        ).withConverter(heistConverter)

      case "expired":
        // Deux inégalités sur des champs différents dans la même requête :
        // Firestore l'autorise à condition d'ordonner par ces deux champs,
        // dans l'ordre où les inégalités sont posées, et de fournir l'index
        // composite correspondant (créé au besoin via le lien d'erreur
        // Firestore ou firestore_create_index).
        return query(
          baseCollection,
          where("deadline", "<", new Date()),
          where("finalStatus", "!=", null),
          orderBy("finalStatus"),
          orderBy("deadline", "desc"),
        ).withConverter(heistConverter)

      default:
        throw new Error(`Invalid filter: ${activeFilter}`)
    }
  }

  useEffect(() => {
    // Garde : pas d'utilisateur résolu, pas de requête ni de setState ici —
    // l'absence d'utilisateur est gérée directement dans la valeur retournée
    // ci-dessous (état dérivé), pas en réinitialisant l'état dans l'effet.
    // Correction post-implémentation : ESLint (react-hooks/set-state-in-effect)
    // rejette un setState synchrone en tête d'effet — pattern présent dans le
    // plan du formateur mais incompatible avec notre config lint.
    if (!uid) return

    const heistsQuery = buildQuery(filter, uid)

    const unsubscribe = onSnapshot(
      heistsQuery,
      (snapshot) => {
        // Le converter est déjà attaché à la requête : doc.data() retourne
        // directement un Heist. Ne PAS rappeler heistConverter.fromFirestore
        // ici, ça re-convertirait un objet déjà converti (createdAt/deadline
        // sont déjà des Date, pas des Timestamp — .toDate() n'existe plus).
        const heistsList = snapshot.docs.map((doc) => doc.data())
        setHeists(heistsList)
        setLoading(false)
      },
      (err) => {
        console.error(`useHeists(${filter}) listener error:`, err)
        setError("Failed to load heists")
        setLoading(false)
      },
    )

    // Nettoyage au démontage ou au changement de filtre/utilisateur.
    return unsubscribe
  }, [filter, uid])

  if (!uid) return { heists: [], loading: false, error: null }

  return { heists, loading, error }
}
