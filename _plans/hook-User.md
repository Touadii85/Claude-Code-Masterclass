# Plan — useUser (auth state) + Signup Firebase Integration

## Contexte

Ce plan couvre les deux dernières fonctionnalités de la session du jour, dans l'ordre exact du formateur :
1. **`useUser`** — hook + AuthContext + AuthProvider (déjà spécifié et conçu, confirmé correct, prêt à implémenter).
2. **Signup Firebase Integration** — connecter le formulaire d'inscription à Firebase Auth (nouvelle fonctionnalité, dernière leçon du jour). Le formateur commence cette leçon en confirmant que `useUser`/le contexte d'auth est déjà en place ("nous avons préparé un contexte d'authentification... dans cette leçon, nous allons passer à la fonctionnalité suivante").

---

## Partie A — `useUser` (implémentation)

Voir conception déjà validée : `contexts/AuthContext.tsx` (Context + Provider, écoute `onAuthStateChanged`), `hooks/useUser.ts` (hook consommateur, lève une erreur hors provider), `app/providers.tsx` (wrapper client), modification minimale de `app/layout.tsx`. Tests dans `tests/hooks/useUser.test.tsx` avec mocks Firebase.

### Détails

1. `contexts/AuthContext.tsx` — `"use client"`. Définit :
   - `AppUser` : `{ uid, email, displayName }`
   - `AuthContextValue` : `{ user: AppUser | null, loading: boolean }`
   - `AuthContext = createContext<AuthContextValue | undefined>(undefined)`
   - `AuthProvider` : `useState(null)` pour `user`, `useState(true)` pour `loading` ; dans un `useEffect` (dépendances vides), s'abonne à `onAuthStateChanged(auth, callback)` (importé depuis `lib/firebase/config.ts`) ; le callback met à jour `user` (mappé via `mapFirebaseUser`) et passe `loading` à `false` ; retourne la fonction de désabonnement au démontage.
2. `hooks/useUser.ts` — `useContext(AuthContext)` ; si `undefined` (hook hors `AuthProvider`) → `throw new Error(...)` ; sinon retourne `{ user, loading }`.
3. `app/providers.tsx` (nouveau) — wrapper Client Component qui compose `AuthProvider`.
4. `app/layout.tsx` — importer `Providers`, envelopper `{children}` dans `<body>`. Le layout racine reste Server Component.

Réutilisation : `auth` depuis `lib/firebase/config.ts` (déjà configuré).

### Tests

`tests/hooks/useUser.test.tsx` — mock de `@/lib/firebase/config` et `firebase/auth` (`onAuthStateChanged` mocké). 5 cas : état initial (`loading = true`), callback avec `null`, callback avec faux utilisateur (mapping des 3 propriétés), changement d'état sans remontage, `useUser()` hors provider → erreur.

### Hors scope confirmé

Aucune modification de Navbar, LoginForm, SignupForm ou pages existantes. Aucun hook booléen séparé. Aucune gestion d'erreur Firebase spécifique. Aucun flux login/signup/logout branché.

---

## Partie B — Signup Firebase Integration

### Spec (`_specs/signup-firebase-integration.md`, branche `claude/feature/signup-firebase-integration`)

**Résumé** : Intégrer le formulaire d'inscription à Firebase Authentication pour créer des comptes utilisateurs. À l'inscription réussie, générer un nom de code unique (`displayName`) en combinant trois mots choisis aléatoirement (adjectif + couleur + nom) en PascalCase. Créer un document Firestore dans la collection `users` stockant le nom de code et l'ID (sans l'email). Uniquement le Firebase Web SDK — pas de Cloud Functions (compte Blaze payant requis).

**Exigences fonctionnelles** :
- Connecter le formulaire au `createUserWithEmailAndPassword` de Firebase Auth.
- Générer un nom de code aléatoire à partir de 3 ensembles de mots distincts, combinés en PascalCase (ex. `SwiftCrimsonFalcon`).
- Mettre à jour le profil Firebase Auth (`updateProfile`) avec ce nom de code comme `displayName`.
- Créer un document Firestore dans `users`, ID document = UID Firebase Auth, champs `codename` (string) et `id` (string) — email exclu.
- Gérer les erreurs d'authentification et afficher des messages appropriés.
- Afficher un état de chargement pendant l'inscription.
- Rediriger vers `/heists` après succès.

**Cas particuliers** : échec réseau, email déjà utilisé, mot de passe trop faible, fermeture du navigateur en cours d'inscription.

**Questions ouvertes → réponses du formateur** :
- Mots de génération : fichier distinct (`lib/utils/codename.ts`), séparé du composant.
- Échec Firestore après création du compte : logger l'erreur uniquement, ne pas bloquer/réessayer.
- Unicité du nom de code : non vérifiée pour cette application (collision jugée négligeable).
- Messages d'erreur spécifiques : mot de passe trop faible et erreurs email dédiées ; reste générique.

### Implémentation

1. `lib/utils/codename.ts` (nouveau) — 3 tableaux de mots (adjectifs, couleurs, noms), fonction `pick`, `generateCodename(): string`.
2. `components/SignupForm/SignupForm.tsx` (modifié) — imports `useRouter`, `createUserWithEmailAndPassword`/`updateProfile`, `doc`/`setDoc`, `auth`/`db`, `generateCodename`. États `loading`/`error`. `handleSubmit` async : créer compte → générer codename → `updateProfile` → `setDoc` Firestore (erreur catchée/loguée séparément) → `router.push("/heists")`. `getErrorMessage(error.code)` avec cas spécifiques + générique.
3. `components/SignupForm/SignupForm.module.css` (modifié) — classe `.error`.
4. Navbar : aucune modification (décision explicitement différée par le formateur).

### Tests

- `tests/lib/utils/codename.test.ts` (nouveau) : chaîne non vide, format PascalCase 3 mots, valeurs différentes sur 10 itérations (8+ uniques).
- `tests/components/SignupForm.test.tsx` (modifié) : **sans mocks Firebase** — le formateur les retire explicitement, préférant une vérification manuelle/E2E dans le navigateur pour le chemin Firebase réel.

### Vérification

1. `npx vitest run tests/lib/utils/codename.test.ts tests/components/SignupForm.test.tsx`
2. `npx vitest run` — pas de régression.
3. `npm run dev`, inscription réelle sur `/signup` : redirection `/heists`, pas d'erreur console, utilisateur Firebase Auth avec bon `displayName`, document Firestore `users/{uid}` avec `id`/`codename` sans email. Vérifier aussi le message d'erreur (mot de passe trop court).

---

## Étapes communes

Pour chaque partie : commit de checkpoint (spec + plan) → implémentation (revue auto) → vérification légère → commit final → fusion locale dans `claude/feature/login-signup-forms` (pas de push).
