# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

**Pocket Heist** — projet de départ (starter) de la Claude Code Masterclass. Application Next.js 16 (App Router) + React 19 + TypeScript 5 + Tailwind CSS 4. Les pages sont pour l'instant des coquilles vides : elles définissent la structure de routes, pas encore les fonctionnalités.

## Commandes

```bash
npm install          # installer les dépendances
npm run dev          # serveur de dev sur http://localhost:3000
npm run build        # build de production
npm start            # servir le build de production
npm run lint         # ESLint (config plate ESLint 9)
npm test             # Vitest en mode watch

npx vitest run                             # lancer les tests une seule fois (CI)
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

`app/(public)/preview/page.tsx` sert de bac à sable pour visualiser les nouveaux composants UI.

### Composants
Un composant = un dossier sous `components/<Nom>/` contenant :
- `<Nom>.tsx` — export default du composant
- `<Nom>.module.css` — styles scopés
- `index.ts` — ré-export (`export { default } from "./Nom"`) permettant `import Navbar from "@/components/Navbar"`

Suivre cette convention pour tout nouveau composant.

### Styles
Tailwind CSS 4 en configuration CSS-first : pas de `tailwind.config.js`. Le thème est déclaré dans le bloc `@theme` de `app/globals.css` (couleurs `primary`, `secondary`, `dark`, `light`, `lighter`, `success`, `error`, `heading`, `body`, police `Inter`). Utiliser ces tokens (`bg-dark`, `text-body`, …) plutôt que des couleurs brutes.

Les CSS modules qui emploient `@apply` doivent commencer par `@reference "../../app/globals.css";` — sans cette ligne, les classes du thème ne sont pas résolues.

Classes utilitaires maison définies dans `globals.css` : `.page-content`, `.center-content`, `.form-title`, `.public`.

Icônes : `lucide-react` (l'horloge `Clock8` fait office de « o » dans le logo « Pocket Heist »).

### Tests
Vitest + jsdom + Testing Library. Les tests vivent dans `tests/`, en miroir de l'arborescence source (`tests/components/Navbar.test.tsx`). `globals: true` est activé (pas besoin d'importer `describe`/`it`), les matchers `jest-dom` sont chargés via `vitest.setup.ts`, et `vite-tsconfig-paths` résout l'alias `@/*` → racine du projet.

## Documentation à jour

Pour toute fonctionnalité spécifique à une bibliothèque ou à un framework (Next.js, React, Tailwind CSS, etc.), toujours vérifier la documentation correspondante via le serveur MCP Context7 **avant d'écrire la moindre ligne de code**. Cela garantit de se référer à la documentation la plus récente de chaque framework ou bibliothèque utilisé dans ce projet, notamment pour ajouter une nouvelle fonctionnalité nécessitant une configuration spécifique à partir de ces bibliothèques.
