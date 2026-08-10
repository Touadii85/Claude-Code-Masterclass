# Plan — Formulaires d'authentification (login/signup)

## Contexte

La spec `_specs/login-signup-forms.md` (générée via `/spec`) décrit des formulaires de connexion et d'inscription fonctionnels sur `/login` et `/signup` : champs e-mail/mot de passe, bascule de visibilité du mot de passe, soumission qui logue dans la console (pas d'appel réseau pour l'instant), navigation facile entre les deux pages, validation légère et accessible. Les deux pages sont aujourd'hui des coquilles vides (juste un titre), sans formulaire ni logique.

Le but de ce plan est de transformer cette spec en une implémentation concrète, en réutilisant les conventions déjà en place dans le projet (dossier de composant à 3 fichiers, CSS modules avec `@apply`/`@reference`, tokens du thème, tests Vitest + Testing Library).

## Architecture des composants

**Composants séparés pour le formulaire de connexion et le formulaire d'inscription** (`LoginForm` et `SignupForm`), plutôt qu'un seul composant paramétré par un `mode`. Bien qu'ils soient similaires aujourd'hui, les garder séparés respecte le principe de responsabilité unique et facilite les évolutions futures (ex. si `SignupForm` doit un jour ajouter une confirmation de mot de passe ou une case de conditions d'utilisation, ça ne demandera pas de logique conditionnelle dans un composant partagé).

**Composants d'entrée réutilisables**, indépendants des formulaires eux-mêmes, pour pouvoir servir ailleurs dans l'application plus tard :
- `Input` — champ de texte générique (utilisé ici pour l'e-mail)
- `PasswordInput` — champ mot de passe avec bascule de visibilité
- `Button` — bouton personnalisé, `type="submit"` par défaut, gère un état désactivé

Chaque composant suit la convention à 3 fichiers du projet (`Nom.tsx`, `Nom.module.css`, `index.ts`), avec `@reference "../../app/globals.css";` en tête de chaque module CSS.

## Détail des composants à créer

### `components/Input/`
Champ de texte générique avec label, gestion d'erreur.

```tsx
interface InputProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  error?: string
}
```

Rendu : label associé à l'input (`htmlFor`/`id`), message d'erreur affiché si `error` est non vide, avec `aria-invalid` et `aria-describedby` pointant vers l'id du message. Style dans `Input.module.css` : bordure, radius, bg et police via les tokens du thème (`bg-light`, `border-lighter`, `text-heading`), et un focus ring en `primary` (couleur de mise en évidence déjà utilisée pour `.btn`).

### `components/PasswordInput/`
Même structure que `Input` (label, erreur, accessibilité), plus la bascule de visibilité.

```tsx
interface PasswordInputProps {
  id: string
  label: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  error?: string
}
```

État local `showPassword` (`useState`). Icônes `Eye`/`EyeOff` de `lucide-react` (seule lib d'icônes du projet, déjà utilisée pour `Clock8` dans `Navbar`). Le bouton de bascule est un `<button type="button">` (sinon il soumettrait le formulaire), avec `aria-label` dynamique (`"Show password"` / `"Hide password"`) et `aria-pressed={showPassword}`, positionné en overlay sur le champ via `PasswordInput.module.css` (`position: relative` sur le wrapper, bouton `absolute`).

### `components/Button/`
Bouton personnalisé pour la soumission des formulaires.

```tsx
interface ButtonProps {
  children: ReactNode
  type?: "submit" | "button" | "reset"
  disabled?: boolean
}
```

`type="submit"` par défaut. Réutilise la classe globale `.btn` déjà existante (couleur primaire, transition au survol) et ajoute la gestion de l'état désactivé (opacité réduite, curseur désactivé) via `Button.module.css`.

### `components/LoginForm/`
Assemble `Input` (e-mail), `PasswordInput`, `Button` ("Log In"), et un lien vers `/signup`.

État local (`useState`) : `email`, `password`, `emailError`, `passwordError` — entrées contrôlées.

`handleSubmit` : `e.preventDefault()`, valide l'e-mail (regex simple `^[^\s@]+@[^\s@]+\.[^\s@]+$`) et le mot de passe (non vide), met à jour les erreurs. Si une erreur existe, `return` sans logger. Sinon `console.log("Email:", email)` et `console.log("Password:", password)`.

Lien de bascule vers `/signup` via `next/link`, texte cohérent avec le reste des textes produit déjà en anglais (`"Log in to Your Account"`, `"Create Heist"`) : `"Don't have an account? Sign up"`.

### `components/SignupForm/`
Même structure que `LoginForm` : `Input` (e-mail), `PasswordInput`, `Button` ("Sign Up"), lien vers `/login` (`"Already have an account? Log in"`). Même logique de validation et de soumission, dans son propre fichier (pas de partage de code avec `LoginForm` au-delà des composants `Input`/`PasswordInput`/`Button` déjà réutilisés).

## Corrections incluses au passage

- `app/(public)/login/page.tsx` : le composant s'appelle actuellement `SignupPage` (copier-coller non corrigé) → renommer en `LoginPage`.
- `app/(public)/signup/page.tsx` : le titre est en `<h2>` alors que login utilise `<h1>` → passer en `<h1>` pour cohérence sémantique (un seul `h1` par page) et visuelle (la règle `.public h1 { text-4xl }` ne s'applique qu'au `h1`).

## Fichiers à créer / modifier

| Fichier | Action |
|---|---|
| `components/Input/Input.tsx`, `.module.css`, `index.ts` | Créer — champ de texte générique réutilisable |
| `components/PasswordInput/PasswordInput.tsx`, `.module.css`, `index.ts` | Créer — champ mot de passe avec bascule de visibilité |
| `components/Button/Button.tsx`, `.module.css`, `index.ts` | Créer — bouton personnalisé (submit par défaut, état désactivé) |
| `components/LoginForm/LoginForm.tsx`, `.module.css`, `index.ts` | Créer — assemble les composants ci-dessus pour la connexion |
| `components/SignupForm/SignupForm.tsx`, `.module.css`, `index.ts` | Créer — assemble les composants ci-dessus pour l'inscription |
| `app/(public)/login/page.tsx` | Modifier — corriger le nom du composant, rendre `<LoginForm />` |
| `app/(public)/signup/page.tsx` | Modifier — corriger `h2`→`h1`, rendre `<SignupForm />` |
| `app/(public)/preview/page.tsx` | Modifier — ajouter un aperçu des nouveaux composants (convention du projet) |
| `tests/components/Input.test.tsx` | Créer |
| `tests/components/PasswordInput.test.tsx` | Créer |
| `tests/components/Button.test.tsx` | Créer |
| `tests/components/LoginForm.test.tsx` | Créer |
| `tests/components/SignupForm.test.tsx` | Créer |

## Considérations techniques

- Interfaces TypeScript explicites pour chaque composant (props ci-dessus) — favorise la cohérence et l'accessibilité (labels, `aria-*` typés).
- Entrées contrôlées : chaque input reçoit `value`/`onChange` depuis l'état React du formulaire parent, pas d'état interne dupliqué pour la valeur du champ (seul `showPassword` dans `PasswordInput` reste un état interne, propre à l'affichage).
- Aucune nouvelle dépendance : `useState` natif + validation HTML5 (`type="email"`, `required`) en complément du check JS, cohérent avec l'absence de lib de formulaire dans le projet.
- Pas de points-virgules (convention du projet, `.prettierrc`).

## Couverture de tests

Pattern du projet (voir `tests/components/Navbar.test.tsx`) : `render`/`screen` de `@testing-library/react`, `userEvent` pour les interactions, `describe`/`it`/`expect` globaux, requêtes par rôle/label ARIA.

- **`Input.test.tsx`** : rendu du label et du champ, valeur affichée depuis `value`, `onChange` déclenché à la saisie, message d'erreur affiché quand `error` est fourni avec `aria-invalid`/`aria-describedby` corrects.
- **`PasswordInput.test.tsx`** : champ masqué par défaut (`type="password"`), bascule au clic sur l'icône (`type="text"`), plusieurs bascules rapides successives, `aria-label`/`aria-pressed` corrects.
- **`Button.test.tsx`** : rendu avec le texte enfant, `type="submit"` par défaut, `disabled` désactive le bouton et empêche le clic.
- **`LoginForm.test.tsx`** couvrant chaque point de la spec : affichage des champs + bouton "Log In", soumission valide (`preventDefault` + `console.log` espionné) y compris via la touche Entrée, e-mail invalide → erreur affichée et pas de log, champs vides → soumission bloquée avec erreurs, lien vers `/signup` présent.
- **`SignupForm.test.tsx`** : mêmes cas que `LoginForm.test.tsx`, avec le bouton "Sign Up" et le lien vers `/login`.
- Le cas "autofill navigateur" n'a pas de test dédié (non simulable fidèlement en jsdom) : couvert indirectement puisque les inputs sont contrôlés et que `userEvent.type` exerce le même mécanisme `onChange`.

## Ordre d'implémentation

0. Créer le dossier `_plans/` à la racine du projet et y copier ce fichier de plan (même logique que `_specs/` pour les specs), pour que le plan reste consultable et versionné dans le dépôt.
1. `components/Input/` (composant + test)
2. `components/PasswordInput/` (composant + test)
3. `components/Button/` (composant + test)
4. `components/LoginForm/` assemblant les trois composants ci-dessus (composant + test)
5. `components/SignupForm/` (composant + test)
6. Brancher `app/(public)/login/page.tsx` et `app/(public)/signup/page.tsx`
7. Ajouter l'aperçu dans `app/(public)/preview/page.tsx`

## Vérification

- `npx vitest run` — toute la suite de tests doit passer, y compris les nouveaux fichiers et `Navbar.test.tsx` (pas de régression).
- `npm run lint` — pas de nouvelle erreur ESLint.
- `npm run dev`, puis test manuel sur `/login` et `/signup` : saisie, bascule de visibilité, soumission (vérifier le `console.log` dans les devtools), navigation entre les deux pages, navigation clavier (Tab entre champs/icône/bouton/lien), rendu sur mobile et desktop.
