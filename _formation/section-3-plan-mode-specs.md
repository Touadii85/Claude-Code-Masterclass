# Section 3 — Plan Mode & Specs

*Cours : Claude Code Masterclass — Section 3 (6/6 leçons, 39 min).*

Cette section documente comment le formateur enseigne la méthode de rédaction de spec (via la commande `/spec` et un template fixe) puis comment il détaille cette spec en plan d'implémentation avant tout code. Les captures clés viennent des sessions **a056c64e** (structure canonique du template + exemple complet) et **3bb6cf8f** (comment formuler le prompt qui lance `/spec`, puis deux exemples complets de spec/plan).

## Le template de spec canonique

**Session source :** a056c64e, 06/08/2026

**Ce que montre la vidéo :** le contenu exact de `_specs/template.md` du formateur — en-tête `# Spec for <feature-name>`, `branch:`, `figma_component (if used):`, puis les sections `## Summary`, `## Functional Requirements`, `## Figma Design Reference (only if referenced)`, `## Possible Edge Cases`, `## Acceptance Criteria`, `## Open Questions`, `## Testing Guidelines`.

**Ce que le formateur explique :** une spec suit toujours la même structure fixe, plus simple que ce que Claude avait improvisé au départ ; la section Figma est explicitement conditionnelle (« only if referenced »), donc à omettre si aucun design Figma n'est utilisé.

**Application dans Pocket Heist :** réécriture de `_specs/template.md` pour coller exactement à cette structure — commit `d4c3bc8` (« ✨ feat: ajoute la commande /spec et son template de spécification », 06/08/2026). *Chevauchement à noter : la commande `/spec` elle-même (créée dans ce même commit) relève plutôt de la [Section 2 « Commands »](./section-2-commands-context-tools-hooks.md) — ici on ne retient que le template de sortie qu'elle produit.*

## Une spec complète et exploitable — exemple login/signup

**Session source :** a056c64e, 06/08/2026

**Ce que montre la vidéo :** la spec entièrement remplie `authentication-forms.md` du formateur pour les formulaires de connexion/inscription — un Summary concret, 9 Functional Requirements précis (validation HTML5, accessibilité ARIA, responsive...), 8 Edge Cases, 8 Acceptance Criteria, et surtout 5 Open Questions déjà tranchées par le formateur lui-même (pas de longueur minimale de mot de passe, pas de persistance, pas de « remember me », pas de « mot de passe oublié »).

**Ce que le formateur explique :** à quoi ressemble une spec réellement exploitable et non un simple squelette — trancher les questions ouvertes soi-même dans le document évite les allers-retours pendant le plan/l'implémentation.

**Application dans Pocket Heist :** réécriture complète de `_specs/login-signup-forms.md` pour intégrer les manques repérés (accessibilité, responsive, touche Entrée, absence de section Figma car non utilisée) — commit `df83e8d` (« ✨ feat: ajoute les formulaires d'authentification login/signup », 10/08/2026, qui embarque spec + plan + code dans le même commit).

## Formuler le prompt qui lance `/spec`

**Session source :** 3bb6cf8f, 10/08/2026

**Ce que montre la vidéo :** le texte exact tapé par le formateur pour démarrer une spec : *« /spec let's spec an auth state management solution for the app, where we can access the current user (null if logged out, the user object if logged in) — through a hook called useUser. [...] Do not spec any signup/login/logout flow yet, just a realtime global listener to update user status. »*

**Ce que le formateur explique :** bien formuler l'idée de fonctionnalité avant `/spec` en nommant explicitement le résultat attendu (un hook `useUser`, son comportement) et en posant une limite claire (« pas de flux login/logout ») pour empêcher la spec de dériver sur un périmètre trop large.

**Application dans Pocket Heist :** cette formulation a servi de référence directe pour cadrer le prompt `/spec auth-state-hook`, à l'origine de la branche `claude/feature/auth-state-hook` et du fichier `_specs/auth-state-hook.md` — commit `96f5001` (« 📝 docs: spec + plan pour le hook useUser (état d'auth global) », 11/08/2026, 12:51).

## À quoi ressemble une spec complète — exemple useUser

**Session source :** 3bb6cf8f, 10/08/2026

**Ce que montre la vidéo :** le fichier `auth-state-management.md` du formateur, complet — Summary, Functional Requirements, Possible Edge Cases, Acceptance Criteria, Open Questions, Testing Guidelines pour le hook `useUser` (lecture seule de l'utilisateur courant, écoute temps réel via `onAuthStateChanged`, persistance après rafraîchissement, sans flux login/logout).

**Ce que le formateur explique :** une spec complète doit couvrir tous les cas particuliers et critères d'acceptation, même pour une fonctionnalité en apparence simple ; point pédagogique clé — les « Open Questions » ne sont pas forcément résolues par écrit, elles peuvent être discutées à l'oral pendant le mode plan (`/plan`), juste avant l'implémentation.

**Application dans Pocket Heist :** la spec initiale d'Ilies, plus courte, a été complétée pour aligner `_specs/auth-state-hook.md` sur ce niveau de détail (traduit en français) — commit `96f5001` (même commit que ci-dessus), puis implémentée en `94b159e` (« ✨ feat: ajoute le hook useUser pour l'état d'authentification global », 11/08/2026, 12:55).

## Du spec au plan d'implémentation détaillé — exemple Signup Firebase Integration

**Session source :** 3bb6cf8f, 10/08/2026

**Ce que montre la vidéo :** dix captures VS Code (sous-titres français visibles, confirmant l'origine vidéo) montrant la spec `signup-firebase-integration.md` du formateur (connexion du formulaire à `createUserWithEmailAndPassword`, génération d'un « codename » aléatoire en PascalCase comme `displayName`, document Firestore `users` sans stocker l'email) puis son plan d'implémentation détaillé (fonction `generateCodename()`, gestion d'erreurs par code Firebase, tests avec mocks Vitest, vérifications finales).

**Ce que le formateur explique :** comment une spec se traduit en plan d'implémentation concret, étape par étape et vérifiable — pas juste une liste d'intentions.

**Application dans Pocket Heist :** `_specs/signup-firebase-integration.md` reprend fidèlement la génération de codename et l'exclusion de l'email du document Firestore — commit `1db9f37` (« 📝 docs: spec pour Signup Firebase Integration », 11/08/2026, 13:03), implémenté ensuite en `d683af4` (« ✨ feat: connecte le formulaire d'inscription à Firebase Auth », 11/08/2026, 13:10).

## Applications ultérieures de la méthode (mention brève)

Plusieurs autres fonctionnalités utilisent le même couple spec/plan (bouton logout, login form, route protection, formulaire Create Heist — sessions 6b055b65 et ecc9fb7c) : elles appliquent une méthode déjà acquise plutôt qu'elles n'enseignent une technique nouvelle, donc pas de fiche dédiée ici. Un point mérite tout de même d'être signalé : dans ecc9fb7c, le premier plan proposé par Claude pour le formulaire Create Heist (avec un composant séparé `CreateHeistForm`) a été **rejeté** par Ilies puis entièrement réécrit pour coller à la structure vue dans la vidéo du formateur — bon exemple concret de l'usage du mode plan comme étape de relecture/correction *avant* le code, implémenté ensuite dans le commit `6b9f2ec` (« feat: formulaire Create Heist », 12/08/2026, 16:19).
