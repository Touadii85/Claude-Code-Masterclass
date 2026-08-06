---
description: Créer un composant UI en utilisant le TDD (développement piloté par les tests)
allowed-tools: Read, Write, Edit, Glob, Bash(npm test:*), Bash(npx vitest:*)
argument-hint: [Description brève]
---

## Entrée utilisateur

L'utilisateur a fourni des informations sur le composant à créer : **$ARGUMENTS**

## À faire en premier :

À partir des informations sur le composant ci-dessus, déterminer un nom de composant en PascalCase (ex : "une carte affichant les stats utilisateur" → `UserStatsCard`).

### 1. Écrire les tests d'abord
Créer `tests/components/[ComponentName].test.tsx` avec 2-3 tests simples :
- Tester que le composant se rend correctement
- Tester que les éléments clés sont présents (roles, texte)

Modèle :
```tsx
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import ComponentName from "@/components/ComponentName"

describe("ComponentName", () => {
  it("renders successfully", () => {
    render(<ComponentName />)
    // assertions
  })
})
```

### 2. Lancer les tests (échec attendu)
```bash
npm test tests/components/[ComponentName].test.tsx
```

### 3. Créer le composant
- `components/[ComponentName]/[ComponentName].tsx`
- `components/[ComponentName]/[ComponentName].module.css`
- `components/[ComponentName]/index.ts` → `export { default } from './[ComponentName]'`

Conventions : pas de points-virgules, CSS Modules, couleurs du thème depuis globals.css si nécessaire.

### 4. Lancer les tests (succès attendu)
```bash
npm test tests/components/[ComponentName].test.tsx
```

Itérer sur le développement du composant jusqu'à ce que tous les tests passent.

### 5. Ajouter à la page de prévisualisation
Mettre à jour `app/(public)/preview/page.tsx` avec une section identifiée montrant le composant.

## Règles
- Garder les tests minimaux
- Ne passer à l'étape suivante que si l'étape actuelle réussit