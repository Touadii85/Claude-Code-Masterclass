# Spec — Logout Functionality

branche : claude/feature/logout-functionality-01
composant_figma (si utilisé) : logout-button-navbar

## Résumé
Ajouter un bouton de déconnexion dans le composant `Navbar`. Au clic, l'utilisateur connecté est déconnecté de la session Firebase Auth. Le bouton n'est visible que lorsqu'un utilisateur est authentifié ; aucune redirection n'est gérée à ce stade (elle sera traitée dans une fonctionnalité ultérieure).

## Exigences fonctionnelles
- Un bouton "Se déconnecter" (ou équivalent) est ajouté dans le composant `Navbar`.
- Le bouton n'est rendu que si l'état d'authentification global (exposé via le hook `useUser`) indique un utilisateur connecté.
- Tant que l'état d'authentification est en cours de chargement, le bouton ne doit pas s'afficher.
- Au clic sur le bouton, la session Firebase Auth de l'utilisateur est terminée (déconnexion effective).
- Après la déconnexion, le bouton disparaît de la Navbar puisque l'état global ne contient plus d'utilisateur connecté.
- Aucune redirection de page n'est déclenchée après la déconnexion (hors périmètre de cette fonctionnalité).
- Le contexte d'authentification global (`AuthContext`) doit exposer une action de déconnexion utilisable par la Navbar (il n'expose actuellement que `user` et `loading`).

## Référence de design Figma (uniquement si mentionnée)
- Fichier : https://www.figma.com/design/elHzuUQZiJXNqJft57oneh/Page-Designs?node-id=57-18&m=dev
- Nom du composant : (non déterminé — accès Figma refusé)
- Contraintes visuelles clés : Référence de design non récupérable. Se référer manuellement à Figma.

## Cas particuliers possibles
- Utilisateur non connecté : le bouton de déconnexion ne doit jamais apparaître dans la Navbar.
- État d'authentification en cours de résolution (`loading: true`) : ne pas afficher le bouton tant que l'état n'est pas déterminé, pour éviter un flash visuel incorrect.
- Échec de la déconnexion côté Firebase (ex. problème réseau) : le comportement attendu de l'interface en cas d'erreur reste une question ouverte.
- Clics multiples rapides sur le bouton pendant que la déconnexion est en cours de traitement.

## Critères d'acceptation
- Quand un utilisateur est connecté, le bouton de déconnexion est visible dans la Navbar.
- Quand aucun utilisateur n'est connecté (ou que l'état est en cours de chargement), le bouton n'est pas visible dans la Navbar.
- Un clic sur le bouton déclenche la déconnexion Firebase Auth de l'utilisateur courant.
- Après une déconnexion réussie, l'état global d'authentification (`useUser`) ne contient plus d'utilisateur, et le bouton disparaît de la Navbar sans rechargement de page.
- Aucune navigation ou redirection n'est déclenchée par le clic sur le bouton.

## Questions ouvertes
- Comment afficher (ou non) une erreur à l'utilisateur si la déconnexion Firebase échoue ?
- Le bouton doit-il afficher un état de chargement/désactivé pendant que la déconnexion est en cours ?
- Le contenu exact du composant Figma (libellé, icône, position dans la Navbar, styles) n'a pas pu être récupéré automatiquement — à vérifier manuellement sur le lien fourni avant l'implémentation visuelle.

## Consignes de tests
Créer un ou plusieurs fichiers de test dans le dossier ./tests pour la nouvelle fonctionnalité, et écrire des tests pertinents pour les cas suivants, sans en faire trop :
- Le bouton de déconnexion est rendu dans la Navbar quand `useUser` retourne un utilisateur connecté.
- Le bouton de déconnexion n'est pas rendu quand `useUser` retourne un utilisateur non connecté (`user: null`).
- Le bouton de déconnexion n'est pas rendu quand l'état d'authentification est en cours de chargement (`loading: true`).
- Un clic sur le bouton appelle bien l'action de déconnexion exposée par le contexte d'authentification.
