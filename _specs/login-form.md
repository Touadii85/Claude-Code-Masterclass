# Spec — Login Form

branche : claude/feature/login-form

## Résumé
Connecter le formulaire de connexion (`LoginForm`) à Firebase Authentication. Actuellement, le formulaire valide seulement les champs et affiche les valeurs saisies dans la console, sans authentifier réellement l'utilisateur. À la soumission, l'utilisateur doit être authentifié avec les identifiants (email + mot de passe) via Firebase Auth. Une fois la connexion réussie, un message de confirmation est affiché sur la même page, sans redirection vers une autre page.

## Exigences fonctionnelles
- Connecter le formulaire de connexion à la méthode `signInWithEmailAndPassword` de Firebase Auth.
- La soumission n'est tentée que si les champs email et mot de passe passent la validation déjà en place (champs requis, format d'email valide).
- Après une connexion réussie, afficher un message de confirmation sur la page du formulaire.
- Ne pas rediriger l'utilisateur vers une autre page après la connexion, quel que soit le résultat.
- En cas d'échec de connexion (identifiants incorrects, compte inexistant, etc.), afficher un message d'erreur à l'utilisateur, sans faire planter le formulaire.

## Cas particuliers possibles
- Identifiants incorrects (email inconnu ou mot de passe erroné).
- Champs vides ou email au format invalide (déjà gérés par la validation existante, à ne pas casser).
- Échec réseau pendant la tentative de connexion.
- L'utilisateur soumet le formulaire plusieurs fois rapidement avant la fin de la première tentative.

## Critères d'acceptation
- Un utilisateur peut se connecter via le formulaire de connexion en utilisant Firebase Auth avec des identifiants corrects.
- Après une connexion réussie, un message de confirmation est visible sur la page, sans navigation vers une autre route.
- Après une tentative avec des identifiants incorrects, un message d'erreur approprié est affiché, et l'utilisateur reste sur le formulaire.
- La validation existante des champs (email requis, format valide, mot de passe requis) continue de fonctionner comme avant.

## Questions ouvertes
- Faut-il afficher un état de chargement pendant la tentative de connexion (comme pour le formulaire d'inscription) ?
- Quels messages d'erreur spécifiques à Firebase Auth afficher (identifiants invalides, compte désactivé, trop de tentatives...) plutôt qu'un message générique ?
- Le message de confirmation doit-il rester affiché indéfiniment, ou disparaître après un certain temps ?
- Le formulaire doit-il être réinitialisé (champs vidés) après une connexion réussie ?

## Consignes de tests
Créer un ou plusieurs fichiers de test dans le dossier ./tests pour la nouvelle fonctionnalité, et écrire des tests pertinents pour les cas suivants, sans en faire trop :
- La soumission avec des identifiants valides appelle `signInWithEmailAndPassword` avec l'email et le mot de passe saisis.
- Un message de confirmation s'affiche après une connexion réussie.
- Un message d'erreur s'affiche après une tentative avec des identifiants incorrects.
- Aucune navigation/redirection n'est déclenchée après la soumission, que la connexion réussisse ou échoue.
