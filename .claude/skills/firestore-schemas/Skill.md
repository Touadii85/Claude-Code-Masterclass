---
name: firestore-schemas
description: |
  Conventions et patterns de types Firestore pour les projets TypeScript. À utiliser quand : (1) on crée un nouveau type de document Firestore, (2) on définit le schéma d'une collection, (3) on met en place la sérialisation ou des converters, (4) on configure des requêtes Firestore typées, ou (5) on manipule des timestamps Firestore et leurs patterns de type.
---

# Emplacement des fichiers

Tous les types dans `types/firestore/`, un fichier par entité (minuscule, singulier), avec un export groupé dans `index.ts`.

# Conventions de nommage

- **Document :** `{Entity}`, utilise `Date` pour les champs de date
- **Create Input :** `Create{Entity}Input`, exclut `id`
- **Update Input :** `Update{Entity}Input`, tous les champs optionnels, pas de `createdAt`
- **Converter :** `{entityConverter}`

# Exemples de patterns de types

```typescript
// types/firestore/heist.ts
import { FieldValue } from 'firebase/firestore'

// Document : ce qu'on lit depuis Firestore (après conversion)
export interface Heist {
  id: string
  createdAt: Date
  
  // ...autres champs personnalisés
}

// Create Input : ce qu'on passe à addDoc
export interface CreateHeistInput {
  createdAt: FieldValue  // serverTimestamp()

  // ...autres champs personnalisés  
}

// Update Input : champs partiels pour updateDoc (pas de createdAt)
export interface UpdateHeistInput {
  // ...tous les champs personnalisés (tous optionnels)
}
```

# Pattern du converter

```typescript
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'

export const heistConverter = {
  toFirestore: (data: Partial<Heist>): DocumentData => data,

  fromFirestore: (snapshot: QueryDocumentSnapshot): Heist => ({
    id: snapshot.id,
    ...snapshot.data(),
    createdAt: snapshot.data().createdAt?.toDate(),

    // convertit les champs Timestamp personnalisés en Date
    deadline: snapshot.data().deadline?.toDate(),
  } as Heist),
}

// Utilisation
const ref = collection(db, COLLECTIONS.HEISTS).withConverter(heistConverter)
```

**Note :** les converters fonctionnent avec `addDoc` et `setDoc`, PAS avec `updateDoc`.

# Export groupé (barrel export)

```typescript
// types/firestore/index.ts
export * from './heist'
export * from './user'

export const COLLECTIONS = {
  HEISTS: 'heists',
  USERS: 'users',
} as const
```
