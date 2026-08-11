# Spec — Route Protection with Auth Guards

branche : claude/feature/route-protection-auth-guards

## Résumé
Implémenter la protection des routes pour garantir que les pages du groupe `(public)` ne sont accessibles qu'aux utilisateurs non authentifiés, et que les pages du groupe `(dashboard)` ne sont accessibles qu'aux utilisateurs authentifiés. Utiliser le hook `useUser` existant pour déterminer l'état d'authentification et rediriger les utilisateurs de façon conditionnelle vers la page appropriée. Afficher un état de chargement simple dans les layouts de groupe pendant que l'état d'authentification Firebase est en cours de détermination.

## Exigences fonctionnelles
- Les pages du groupe `(public)` (`/`, `/login`, `/signup`) redirigent les utilisateurs authentifiés vers `/heists`.
- Les pages du groupe `(dashboard)` (`/heists`, `/heists/create`, `/heists/[id]`) redirigent les utilisateurs non authentifiés vers `/login`.
- Afficher un indicateur de chargement simple dans les layouts `(public)` et `(dashboard)` pendant que le hook `useUser` détermine l'état d'authentification (`loading` à `true`).
- L'indicateur de chargement doit s'afficher avant toute redirection.
- Les redirections doivent se produire automatiquement, sans action de l'utilisateur.
- Utiliser `useRouter` ou `redirect` de Next.js pour la navigation.
- Le hook `useUser` fournit à la fois `user` (l'objet utilisateur authentifié, ou `null`) et `loading` (booléen).

## Cas particuliers possibles
- L'état d'authentification change pendant que l'utilisateur est sur une page (ex. jeton expiré, déconnexion depuis un autre onglet).
- L'utilisateur navigue manuellement vers une route protégée via l'URL.
- Firebase met plus de temps que prévu à déterminer l'état d'authentification.
- L'utilisateur navigue rapidement entre les routes pendant que l'authentification est encore en cours de chargement.
- Considérations SSR/hydratation avec des vérifications d'authentification côté client.

## Critères d'acceptation
- Les utilisateurs authentifiés ne peuvent pas accéder à `/`, `/login` ou `/signup`, et sont redirigés vers `/heists`.
- Les utilisateurs non authentifiés ne peuvent pas accéder à `/heists`, `/heists/create` ou `/heists/[id]`, et sont redirigés vers `/login`.
- Un indicateur de chargement est visible dans les deux groupes de routes tant que `loading` est `true` depuis le hook `useUser`.
- Aucun flash de contenu incorrect (FOUC) avant qu'une redirection ne se produise.
- Les états de chargement sont simples et cohérents entre les deux layouts.
- L'application reste réactive pendant les vérifications d'authentification.

## Questions ouvertes
- Faut-il préserver l'URL de destination prévue et y rediriger l'utilisateur après authentification ? **Non — jugé trop complexe pour cette application.**
- À quoi doit ressembler l'indicateur de chargement (symbole animé, squelette, simple texte) ? **Un symbole animé (spinner), en réutilisant l'icône d'horloge du titre (`Clock8` de `lucide-react`, déjà utilisée dans le logo "Pocket Heist").**
- Faut-il imposer un délai maximal pour l'état de chargement si Firebase met trop de temps ?

## Consignes de tests
Créer des fichiers de test dans le dossier ./tests pour la fonctionnalité de protection des routes, couvrant les cas suivants :
- Un utilisateur authentifié accédant aux routes publiques (doit être redirigé vers `/heists`).
- Un utilisateur non authentifié accédant aux routes du dashboard (doit être redirigé vers `/login`).
- L'état de chargement s'affiche tant que `loading` est `true`.
- Aucune redirection ne se produit tant que l'état d'authentification est en cours de chargement.
- Les redirections fonctionnent correctement une fois l'état d'authentification déterminé.
