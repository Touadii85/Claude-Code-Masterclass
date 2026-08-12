import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  WithFieldValue,
} from "firebase/firestore"

// Document : forme du document users/{uid}, écrit par SignupForm
export interface User {
  id: string
  codename: string
}

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (data: WithFieldValue<User>): DocumentData => data,

  fromFirestore: (snapshot: QueryDocumentSnapshot): User =>
    ({ id: snapshot.id, ...snapshot.data() }) as User,
}
