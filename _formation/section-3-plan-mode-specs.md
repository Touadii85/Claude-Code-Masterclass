# Section 3 : Plan Mode & Specs

*Cours : Claude Code Masterclass, Section 3 (6/6 leçons, 39 min).*

Cette section documente comment le formateur enseigne la méthode de rédaction de spec (via la commande `/spec` et un template fixe), puis comment il détaille cette spec en plan d'implémentation avant tout code. Les captures clés viennent des sessions `a056c64e` (structure canonique du template, plus un exemple complet) et `3bb6cf8f` (comment formuler le prompt qui lance `/spec`, puis deux exemples complets de spec et de plan).

## Le template de spec canonique

**Session source :** a056c64e, 06/08/2026

**Ce que montre la vidéo :** le contenu exact de `_specs/template.md` du formateur. En-tête `# Spec for <feature-name>`, `branch:`, `figma_component (if used):`, puis les sections `## Summary`, `## Functional Requirements`, `## Figma Design Reference (only if referenced)`, `## Possible Edge Cases`, `## Acceptance Criteria`, `## Open Questions`, `## Testing Guidelines`.

**Ce que le formateur explique :** une spec suit toujours la même structure fixe, plus simple que ce que Claude avait improvisé au départ. La section Figma est explicitement conditionnelle (« only if referenced »), à omettre si aucun design Figma n'est utilisé.

**Application dans Pocket Heist :** réécriture de `_specs/template.md` pour coller exactement à cette structure, commit `d4c3bc8` (« feat: ajoute la commande /spec et son template de spécification », 06/08/2026). La commande `/spec` elle-même (créée dans ce même commit) relève plutôt de la [Section 2 « Commands »](./section-2-commands-context-tools-hooks.md). Ici je ne retiens que le template de sortie qu'elle produit.

## Une spec complète et exploitable, exemple login/signup

**Session source :** a056c64e, 06/08/2026

**Ce que montre la vidéo :** la spec entièrement remplie `authentication-forms.md` du formateur pour les formulaires de connexion et d'inscription. Un Summary concret, 9 Functional Requirements précis (validation HTML5, accessibilité ARIA, responsive...), 8 Edge Cases, 8 Acceptance Criteria, et surtout 5 Open Questions déjà tranchées par le formateur lui-même. Pas de longueur minimale de mot de passe, pas de persistance, pas de « remember me », pas de « mot de passe oublié ».

**Ce que le formateur explique :** à quoi ressemble une spec réellement exploitable, pas un simple squelette. Trancher les questions ouvertes soi-même dans le document évite les allers-retours pendant le plan et l'implémentation.

**Application dans Pocket Heist :** réécriture complète de `_specs/login-signup-forms.md` pour intégrer les manques repérés (accessibilité, responsive, touche Entrée, absence de section Figma car non utilisée), commit `df83e8d` (« feat: ajoute les formulaires d'authentification login/signup », 10/08/2026, qui embarque spec, plan et code dans le même commit).

## Formuler le prompt qui lance `/spec`

**Session source :** 3bb6cf8f, 10/08/2026

**Ce que montre la vidéo :** le texte exact tapé par le formateur pour démarrer une spec. *« /spec let's spec an auth state management solution for the app, where we can access the current user (null if logged out, the user object if logged in), through a hook called useUser. [...] Do not spec any signup/login/logout flow yet, just a realtime global listener to update user status. »*

**Ce que le formateur explique :** bien formuler l'idée de fonctionnalité avant `/spec`, en nommant le résultat attendu (un hook `useUser`, son comportement) et en posant une limite claire (« pas de flux login/logout ») pour empêcher la spec de dériver sur un périmètre trop large.

**Application dans Pocket Heist :** cette formulation a servi de référence directe pour cadrer le prompt `/spec auth-state-hook`, à l'origine de la branche `claude/feature/auth-state-hook` et du fichier `_specs/auth-state-hook.md`, commit `96f5001` (« docs: spec + plan pour le hook useUser (état d'auth global) », 11/08/2026, 12:51).

## À quoi ressemble une spec complète, exemple useUser

**Session source :** 3bb6cf8f, 10/08/2026

**Ce que montre la vidéo :** le fichier `auth-state-management.md` du formateur, complet. Summary, Functional Requirements, Possible Edge Cases, Acceptance Criteria, Open Questions, Testing Guidelines pour le hook `useUser` (lecture seule de l'utilisateur courant, écoute temps réel via `onAuthStateChanged`, persistance après rafraîchissement, sans flux login/logout).

**Ce que le formateur explique :** une spec complète couvre tous les cas particuliers et critères d'acceptation, même pour une fonctionnalité en apparence simple. Point pédagogique clé, les Open Questions ne sont pas forcément résolues par écrit. Elles peuvent être discutées à l'oral pendant le mode plan (`/plan`), juste avant l'implémentation.

**Application dans Pocket Heist :** la spec initiale, plus courte, a été complétée pour aligner `_specs/auth-state-hook.md` sur ce niveau de détail (traduit en français), commit `96f5001` (même commit que ci-dessus), puis implémentée en `94b159e` (« feat: ajoute le hook useUser pour l'état d'authentification global », 11/08/2026, 12:55).

## Du spec au plan d'implémentation détaillé, exemple Signup Firebase Integration

**Session source :** 3bb6cf8f, 10/08/2026

**Ce que montre la vidéo :** dix captures VS Code (sous-titres français visibles, donc bien la vidéo) qui montrent la spec `signup-firebase-integration.md` du formateur (connexion du formulaire à `createUserWithEmailAndPassword`, génération d'un « codename » aléatoire en PascalCase comme `displayName`, document Firestore `users` sans stocker l'email), puis son plan d'implémentation détaillé (fonction `generateCodename()`, gestion d'erreurs par code Firebase, tests avec mocks Vitest, vérifications finales).

**Ce que le formateur explique :** comment une spec se traduit en plan d'implémentation concret, étape par étape et vérifiable. Pas juste une liste d'intentions.

**Application dans Pocket Heist :** `_specs/signup-firebase-integration.md` reprend fidèlement la génération de codename et l'exclusion de l'email du document Firestore, commit `1db9f37` (« docs: spec pour Signup Firebase Integration », 11/08/2026, 13:03), implémenté ensuite en `d683af4` (« feat: connecte le formulaire d'inscription à Firebase Auth », 11/08/2026, 13:10).

## Chronologie complète des specs du projet

Les fonctionnalités suivantes appliquent la même méthode (spec puis plan) sans qu'une nouvelle capture vidéo enseigne une technique différente. Pas de fiche dédiée avec « ce que montre la vidéo » pour chacune, donc. Mais pour savoir précisément ce qui a été fait, et dans quel ordre, voici la suite complète des fichiers de `_specs/`, reconstituée depuis l'historique git réel (`git log --diff-filter=A --follow`) plutôt que depuis les captures.

| # | Fichier | Commit | Date | Sujet |
|---|---|---|---|---|
| 1 | `template.md` | `d4c3bc8` | 06/08 17:00 | Le template lui-même (voir plus haut) |
| 2 | `login-signup-forms.md` | `df83e8d` | 10/08 09:20 | Formulaires login/signup (UI seule) |
| 3 | `auth-state-hook.md` | `96f5001` | 11/08 12:51 | Hook `useUser` (voir plus haut) |
| 4 | `signup-firebase-integration.md` | `1db9f37` | 11/08 13:03 | Connexion Firebase Auth du formulaire d'inscription (voir plus haut) |
| 5 | `logout-button.md` | `50ddb7d` puis renommé par `4c185e7` | 11/08 14:32 → 15:29 | Bouton de déconnexion, créé sous le nom `logout-functionality.md`, renommé le jour même |
| 6 | `login-form.md` | `e8daee6` | 11/08 16:26 | Formulaire de login (UI seule) |
| 7 | `login-form-functionality.md` | `b674c2d` | 11/08 16:39 | Connexion Firebase Auth du formulaire de login, spec distincte de la précédente, rédigée 13 min après. Même découpage UI/logique que login-signup-forms → signup-firebase-integration |
| 8 | `route-protection-auth-guards.md` | `abf8300` | 11/08 17:45 | Protection des routes selon l'état d'authentification |
| 9 | `create-heist-form.md` | `6b9f2ec` | 12/08 16:19 | Formulaire de création de heist |

Ce tableau révèle un pattern répété que les captures vidéo isolées ne montrent pas. Chaque fonctionnalité connectée à Firebase est spécifiée en deux temps, d'abord l'UI seule (`login-signup-forms.md`, `login-form.md`), puis sa connexion réelle au backend dans un fichier séparé (`signup-firebase-integration.md`, `login-form-functionality.md`). Ce découpage n'apparaît dans aucune capture retenue plus haut, mais c'est la méthode réellement suivie tout du long.

Un point vaut aussi d'être signalé. Dans la session `ecc9fb7c`, le premier plan proposé par Claude pour le formulaire Create Heist (avec un composant séparé `CreateHeistForm`) a été rejeté, puis entièrement réécrit pour coller à la structure vue dans la vidéo du formateur. Bon exemple concret de l'usage du mode plan comme étape de relecture et de correction avant le code.

**Non couvert par cette reconstitution :** un dixième fichier, `_specs/use-heists-hook.md`, existe dans le dépôt mais n'a jamais été commité (`git status` le montre encore en `??`, non suivi). Travail en cours, postérieur à ce qui a été analysé ici, à documenter séparément une fois committé.
