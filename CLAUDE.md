# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

**Pocket Heist** — projet de départ (starter) de la Claude Code Masterclass. Application Next.js 16 (App Router) + React 19 + TypeScript 5 + Tailwind CSS 4. Les pages du dashboard sont encore des coquilles vides : elles définissent la structure de routes, pas encore les fonctionnalités. Les pages `/login` et `/signup` sont, elles, implémentées.

## Commandes

```bash
npm install          # installer les dépendances
npm run dev          # serveur de dev sur http://localhost:3000
npm run build        # build de production
npm start            # servir le build de production
npm run lint         # ESLint (config plate ESLint 9)
npm test             # Vitest en mode watch

npx vitest run                                    # lancer tous les tests une seule fois (CI)
npx vitest run tests/components/Navbar.test.tsx   # un seul fichier de test
npx vitest run -t "renders the Create Heist link" # un seul test par son nom
```

## Architecture

### Route groups
Le dossier `app/` utilise deux route groups qui portent chacun leur propre layout — c'est la structure clé du projet :

- `app/(public)/` — pages accessibles sans authentification (`/`, `/login`, `/signup`, `/preview`). Layout minimal : `<main className="public">`, sans navigation.
- `app/(dashboard)/` — pages authentifiées (`/heists`, `/heists/create`, `/heists/[id]`). Son layout injecte la `<Navbar />`.

Les parenthèses n'apparaissent pas dans l'URL : `app/(dashboard)/heists/page.tsx` répond sur `/heists`.

`app/layout.tsx` est le layout racine (`<html>`, `<body>`, metadata) et importe `globals.css`.

`app/(public)/page.tsx` est prévu comme splash page qui redirigera : connecté → `/heists`, non connecté → `/login`. La redirection n'est pas encore implémentée.

`app/(public)/preview/page.tsx` sert de bac à sable pour visualiser les nouveaux composants UI — tout nouveau composant doit y être ajouté dans une section identifiée.

### Composants
Un composant = un dossier sous `components/<Nom>/` contenant :
- `<Nom>.tsx` — export default du composant
- `<Nom>.module.css` — styles scopés
- `index.ts` — ré-export (`export { default } from "./Nom"`) permettant `import Navbar from "@/components/Navbar"`

Suivre cette convention pour tout nouveau composant. L'alias `@/*` pointe sur la racine du projet.

Les composants sont Server Components par défaut ; `"use client"` seulement quand il y a de l'état ou un gestionnaire d'événement (`PasswordInput`, `LoginForm`, `SignupForm` en ont besoin, `Input` et `Button` non).

### Conventions de formulaire
`LoginForm` et `SignupForm` sont volontairement deux composants distincts (pas un composant unique paramétré par un `mode`), et composent trois briques réutilisables : `Input`, `PasswordInput`, `Button`. Le patron à reproduire :

- entrées **contrôlées** : un `useState` par champ, plus un `useState` par message d'erreur
- `<form noValidate>` + `e.preventDefault()` — la validation est faite en JS, pas par les bulles natives du navigateur
- validation à la soumission : on calcule les erreurs dans des variables locales (`nextEmailError`…), on les pousse dans l'état, puis on sort si l'une d'elles est non vide (l'état React n'est pas encore à jour à ce moment-là)
- accessibilité obligatoire sur les champs : `label` lié par `htmlFor`/`id`, `aria-invalid`, `aria-describedby` pointant vers l'id du message, et message d'erreur en `role="alert"`
- la soumission logue simplement dans la console — aucun backend pour l'instant

### Styles
Tailwind CSS 4 en configuration CSS-first : pas de `tailwind.config.js`. Le thème est déclaré dans le bloc `@theme` de `app/globals.css` (couleurs `primary`, `secondary`, `dark`, `light`, `lighter`, `success`, `error`, `heading`, `body`, police `Inter`). Utiliser ces tokens (`bg-dark`, `text-body`, …) plutôt que des couleurs brutes.

Les CSS modules qui emploient `@apply` doivent commencer par `@reference "../../app/globals.css";` — sans cette ligne, les classes du thème ne sont pas résolues.

Classes utilitaires maison définies dans `globals.css` : `.page-content`, `.center-content`, `.form-title`, `.public`, `.btn`.

`.btn` est global et porte l'apparence du bouton primaire (fond `primary`, hover `secondary`). Un composant peut le combiner avec son module : ``className={`btn ${styles.button}`}`` — le module n'ajoute alors que ce qui lui est propre (largeur, état désactivé…).

Icônes : `lucide-react` (l'horloge `Clock8` fait office de « o » dans le logo « Pocket Heist »).

### Tests
Vitest 4 + jsdom + Testing Library. Les tests vivent dans `tests/`, en miroir de l'arborescence source (`tests/components/Navbar.test.tsx`). `globals: true` est activé (les imports depuis `vitest` restent tout de même explicites dans les tests existants), les matchers `jest-dom` sont chargés via `vitest.setup.ts`, et `vite-tsconfig-paths` résout l'alias `@/*`.

Conventions suivies par les tests existants : requêtes par rôle ou label accessible (`getByRole`, `getByLabelText`) plutôt que par classe CSS, `@testing-library/user-event` pour les interactions, et `vi.spyOn(console, "log")` mocké dans un `beforeEach` (puis `mockRestore` en `afterEach`) pour vérifier les soumissions de formulaire sans polluer la sortie.

## Style de code

- **Pas de points-virgules** — Prettier est configuré avec `semi: false` (`.prettierrc`). Un hook `PostToolUse` (`.claude/settings.local.json`) lance `npx prettier --write` sur chaque `.ts`/`.tsx` écrit ou édité ; ce même hook écrit un fichier de debug `tool-use.json` (gitignoré).
- Commentaires **en français**, courts, sur le « pourquoi » d'une ligne non évidente (ex. pourquoi `type="button"` sur la bascule de mot de passe).
- Guillemets doubles, props typées par une `interface <Nom>Props` locale au fichier.

## Workflow du projet

Trois commandes slash définies dans `.claude/commands/` structurent le travail :

- `/spec <idée courte>` — vérifie que l'arbre de travail est propre, crée une branche `claude/feature/<slug>`, puis écrit une spec dans `_specs/<slug>.md` en suivant `_specs/template.md`. La spec reste fonctionnelle : pas de code ni de détail d'implémentation.
- `/component <description>` — crée un composant en TDD : test d'abord dans `tests/components/`, échec constaté, puis les 3 fichiers du composant, puis test au vert, puis ajout à la page `/preview`.
- `/commit-message` — analyse `git diff --staged` et propose un message `<emoji> <type>: <description>` (✨ feat, 🐛 fix, 🔨 refactor, 📝 docs, 🎨 style, ✅ test, ⚡ perf), en français, sans commiter sans accord.

`_specs/` contient les specs (le « quoi »), `_plans/` les plans d'implémentation rédigés à partir d'une spec (le « comment »). Ni l'un ni l'autre n'est du code : ce sont les documents d'entrée du mode plan.

`.claude/lecons/` contient des notes de cours sur les hooks Claude Code, pas du code applicatif.
