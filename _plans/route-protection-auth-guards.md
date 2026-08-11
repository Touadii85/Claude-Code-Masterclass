# Implementation Plan: Route Protection with Auth Guards

## Overview

Implement client-side route protection by adding auth guards to the `(public)` and `(dashboard)` layout files. The guards use the existing `useUser` hook to check authentication status and redirect users accordingly:
- Public routes → redirect authenticated users to `/heists`
- Dashboard routes → redirect unauthenticated users to `/login`
- Show a full-screen loading spinner with the Clock icon while Firebase determines auth status

## Architecture Approach

**Client-Side Guards in Layouts, redirect called during render (pas dans un `useEffect`) :**
- Réutiliser le hook `useUser` existant, qui fournit `{ user, loading }` depuis `onAuthStateChanged` de Firebase.
- Implémenter les guards directement dans les fichiers de layout (un seul point de protection par groupe de routes).
- Utiliser `redirect()` de `next/navigation`, appelé **directement pendant le rendu** (pas dans un `useEffect`).

**Correction technique par rapport à la première version montrée dans la vidéo :** la doc officielle Next.js (vérifiée via Context7) précise que `redirect()` fonctionne en Client Component *"during the rendering process"*, mais **pas** dans un event handler — et un `useEffect` s'apparente à un callback asynchrone du même genre, pas à un rendu synchrone. Le pattern documenté et supporté ressemble à :
```tsx
'use client'
import { redirect, usePathname } from 'next/navigation'

export function ClientRedirect() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin') && !pathname.includes('/login')) {
    redirect('/admin/login')
  }
  return <div>Login Page</div>
}
```
`redirect()` appelé ainsi lève immédiatement une erreur spéciale (`NEXT_REDIRECT`) qui interrompt le rendu — pas besoin de `useEffect`, ni de `useRouter`, ni d'un `useState` intermédiaire. C'est à la fois plus correct et plus simple que la version avec `useEffect` + `router.push()`.

Rendu conditionnel basé sur trois états, dans l'ordre :
1. `loading === true` → afficher `LoadingSpinner`
2. `loading === false` && besoin de redirection → `redirect(...)` appelé directement, suivi d'un `return null` (utile uniquement pour les tests, où `redirect` est mocké et ne lève donc pas d'erreur — en production, `redirect()` interrompt déjà le rendu avant d'atteindre ce `return`)
3. `loading === false` && autorisé → rendu des enfants

**Pourquoi ça évite le FOUC (flash of incorrect content) :**
- `AuthProvider` s'initialise avec `loading: true`.
- Le spinner s'affiche immédiatement au montage.
- Les enfants ne sont jamais rendus avant que la décision de redirection soit prise — et comme `redirect()` s'exécute pendant le rendu lui-même (pas après, comme le ferait un `useEffect`), il n'y a même pas de fenêtre intermédiaire où le mauvais contenu pourrait apparaître.

## Implementation Steps

### 1. Create LoadingSpinner Component

**New files:**
- `components/LoadingSpinner/LoadingSpinner.tsx` — spinner plein écran centré, icône `Clock8` de lucide-react
- `components/LoadingSpinner/LoadingSpinner.module.css` — styles avec animation de rotation
- `components/LoadingSpinner/index.ts` — export nommé (`export { default } from "./LoadingSpinner"`)

**Design :**
- Positionnement `fixed` couvrant tout le viewport
- Icône `Clock8` violette (48px) — couleur `text-primary` du thème (`--color-primary: #C27AFF`). Note : dans notre Navbar actuelle, le logo `Clock8` n'a pas de couleur explicite (il hérite du blanc du titre) — cette teinte violette est donc une couleur délibérée pour le spinner, pas une reprise littérale du logo existant.
- Animation de rotation CSS (`1s linear infinite`), définie via `@keyframes` dans le module CSS (pas la classe utilitaire `animate-spin` de Tailwind, pour garder un contrôle précis sur la durée)
- Fond sombre (`bg-dark`)
- `z-index` élevé (`z-[9999]`) pour être certain qu'il passe au-dessus de tout

### 2. Update Public Layout (`app/(public)/layout.tsx`)

**Changes:**
- Ajouter la directive `"use client"`
- Importer `redirect` (`next/navigation`), `useUser`, `LoadingSpinner`
- Logique du guard :
  - Afficher le spinner tant que `loading === true`
  - Rediriger les utilisateurs authentifiés vers `/heists` via `redirect()`, appelé directement pendant le rendu
  - Rendre les enfants uniquement quand `loading === false && user === null`

**Pattern :**
```typescript
const { user, loading } = useUser()

if (loading) return <LoadingSpinner />
if (user) {
  redirect("/heists")
  return null // pertinent uniquement en test, où redirect() est mocké
}
return <main className="public">{children}</main>
```

### 3. Update Dashboard Layout (`app/(dashboard)/layout.tsx`)

**Changes:**
- Ajouter la directive `"use client"`
- Importer `redirect`, `useUser`, `LoadingSpinner`
- Logique du guard (inverse du layout public) :
  - Afficher le spinner tant que `loading === true`
  - Rediriger les utilisateurs non authentifiés vers `/login` via `redirect()`
  - Rendre `Navbar` et les enfants uniquement quand `loading === false && user !== null`

**Pattern :**
```typescript
const { user, loading } = useUser()

if (loading) return <LoadingSpinner />
if (!user) {
  redirect("/login")
  return null
}
return (
  <>
    <Navbar />
    <main>{children}</main>
  </>
)
```

### 4. Create Tests

**LoadingSpinner tests** (`tests/components/LoadingSpinner.test.tsx`) :
- Se rend sans erreur
- Affiche l'icône Clock (SVG)
- Applique les bonnes classes CSS
- L'icône a les bonnes props de taille

**Public layout tests** (`tests/app/public-layout.test.tsx`) :
- Affiche le spinner pendant le chargement
- Rend les enfants pour un utilisateur non authentifié
- Redirige les utilisateurs authentifiés vers `/heists`
- Aucune redirection pendant le chargement

**Dashboard layout tests** (`tests/app/dashboard-layout.test.tsx`) :
- Affiche le spinner pendant le chargement
- Rend `Navbar` et les enfants pour un utilisateur authentifié
- Redirige les utilisateurs non authentifiés vers `/login`
- Aucune redirection pendant le chargement

**Stratégie de mock :**
- Mocker le hook `useUser` pour contrôler l'état d'authentification
- Mocker `redirect()` de `next/navigation` pour vérifier les appels (`vi.fn()`, ne lève pas d'erreur en test — c'est justement pour ça que le `return null` explicite après l'appel est nécessaire dans le composant)
- Mocker le composant `Navbar` lui-même pour isoler le test du layout dashboard (évite d'avoir à mocker `firebase/auth`/`lib/firebase/config` juste pour faire fonctionner `Navbar` dans ce test)

## Critical Files

**To Create:**
- `components/LoadingSpinner/LoadingSpinner.tsx`
- `components/LoadingSpinner/LoadingSpinner.module.css`
- `components/LoadingSpinner/index.ts`
- `tests/components/LoadingSpinner.test.tsx`
- `tests/app/public-layout.test.tsx`
- `tests/app/dashboard-layout.test.tsx`

**To Modify:**
- `app/(public)/layout.tsx` — ajoute le guard d'authentification pour les routes publiques
- `app/(dashboard)/layout.tsx` — ajoute le guard d'authentification pour les routes dashboard

**Dependencies (aucun changement nécessaire) :**
- `hooks/useUser.ts` — fournit l'état d'authentification
- `contexts/AuthContext.tsx` — gère l'authentification Firebase
- `components/Navbar/Navbar.tsx` — utilisé dans le layout dashboard (mocké dans son test)

## Edge Cases Handled

1. **L'état d'authentification change pendant qu'on est sur la page** — le composant se re-render au changement de `user`/`loading` (React), déclenchant la redirection
2. **Navigation manuelle vers une URL protégée** — le spinner s'affiche d'abord, puis la redirection a lieu une fois l'état d'authentification déterminé
3. **Firebase met plus de temps que prévu** — le spinner reste visible (pas de timeout, conformément à la spec)
4. **Navigation rapide entre routes** — chaque layout vérifie indépendamment l'état d'authentification
5. **L'utilisateur se déconnecte en étant sur le dashboard** — `onAuthStateChanged` se déclenche, provoque la redirection

## Implementation Order

1. Composant `LoadingSpinner` (aucune dépendance)
2. Tests de `LoadingSpinner` (vérifie que le composant fonctionne)
3. Guard du layout public (logique la plus simple)
4. Tests du layout public (vérifie le pattern)
5. Guard du layout dashboard (même pattern)
6. Tests du layout dashboard (couverture complète)

## Verification Steps

### 1. Run Tests
```bash
npx vitest run tests/components/LoadingSpinner.test.tsx
npx vitest run tests/app/public-layout.test.tsx
npx vitest run tests/app/dashboard-layout.test.tsx
```
**Expected:** tous les tests passent

### 2. Manual Testing

**Utilisateur non authentifié :**
- Accéder directement à `/heists` → spinner bref, puis redirection vers `/login`
- Accéder à `/login` → page de connexion normale, pas de redirection
- Accéder à `/` → page publique normale

**Utilisateur authentifié :**
- Se connecter via `/login` → spinner bref, puis redirection vers `/heists`
- Naviguer vers `/heists` → page heists affichée avec la Navbar
- Naviguer vers `/login` → spinner bref, puis redirection vers `/heists`
- Cliquer sur déconnexion → spinner bref, puis redirection vers `/login`

### 3. Visual Checks
- Le spinner est centré à l'écran
- L'icône Clock est violette (couleur primary)
- Animation de rotation fluide
- Aucun flash de contenu avant les redirections
- Aucune erreur ni avertissement dans la console
- Aucun problème d'hydratation

### 4. Edge Case Testing
- Sur `/heists`, vider le cache d'authentification Firebase (dev tools) → doit rediriger vers `/login`
- Cliquer rapidement entre les routes → doit être géré sans erreur
- Simuler un réseau lent → le spinner doit rester visible plus longtemps
