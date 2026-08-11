# Spec — Login Form Functionality

branche : claude/feature/login-form-functionality

## Résumé
Implémenter la fonctionnalité d'authentification du formulaire de connexion (`/login`). Les utilisateurs doivent pouvoir soumettre leurs identifiants et être connectés lorsque ceux-ci sont corrects. Après une connexion réussie, un message de succès est affiché à l'utilisateur, sans redirection vers une autre page.

## Exigences fonctionnelles
- Le composant `LoginForm` existant doit s'intégrer à Firebase Authentication.
- Quand l'utilisateur soumet le formulaire avec des identifiants valides (email et mot de passe), les authentifier via Firebase.
- En cas de connexion réussie, afficher un message de succès à l'utilisateur.
- En cas d'échec (identifiants invalides), afficher un message d'erreur approprié.
- Gérer un état de chargement pendant que la requête d'authentification est en cours.
- Le formulaire doit valider que les champs email et mot de passe ne sont pas vides avant la soumission.
- Aucune redirection ne doit se produire après une connexion réussie (sera implémentée plus tard).
- L'état de l'utilisateur authentifié doit être géré via le contexte `AuthProvider` déjà existant.

## Cas particuliers possibles
- L'utilisateur soumet le formulaire avec des champs vides.
- L'utilisateur saisit un email au format invalide.
- L'utilisateur saisit un mot de passe incorrect.
- Le compte utilisateur n'existe pas.
- Le service Firebase Authentication est indisponible ou met trop de temps à répondre.
- L'utilisateur est déjà connecté en accédant à la page de connexion.
- Problèmes de connexion réseau pendant l'authentification.

## Critères d'acceptation
- Un utilisateur peut se connecter avec succès en utilisant des identifiants valides.
- Un message de succès est affiché après une connexion réussie.
- Un message d'erreur est affiché quand la connexion échoue, avec une raison précise (ex. "Invalid credentials", "User not found").
- Le formulaire affiche un état de chargement pendant l'authentification.
- Le formulaire valide les champs requis avant la soumission.
- L'état d'authentification est correctement mis à jour dans le contexte `AuthProvider`.
- Le bouton de déconnexion, déjà présent dans la Navbar, devient visible après une connexion réussie (il dépend du même état `user` du contexte).
- Les tests existants du composant `LoginForm` continuent de passer.

## Questions ouvertes
- Quel doit être le libellé exact du message de succès ? **"Login successful"** (cohérent avec le reste de l'UI, qui est en anglais).
- Le message de succès doit-il disparaître automatiquement après un délai, ou nécessiter une action de l'utilisateur ? **Non, pas de disparition automatique.**
- Faut-il empêcher un utilisateur déjà connecté d'accéder à la page de connexion ? **Pas pour l'instant.**

## Consignes de tests
Créer un ou plusieurs fichiers de test dans le dossier ./tests pour la nouvelle fonctionnalité, et écrire des tests pertinents pour les cas suivants, sans en faire trop :
- `LoginForm` authentifie avec succès l'utilisateur avec des identifiants valides.
- `LoginForm` affiche un message d'erreur en cas d'identifiants invalides.
- `LoginForm` affiche un état de chargement pendant l'authentification.
- `LoginForm` valide les champs vides avant la soumission.
- Le contexte `AuthProvider` est mis à jour après une connexion réussie.
- Un message de succès est affiché après une authentification réussie.
- Gestion des erreurs réseau ou des erreurs Firebase.
