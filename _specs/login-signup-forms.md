# Spec — Login And Signup Forms

branche : claude/feature/login-signup-forms

## Résumé
Implémenter des formulaires d'authentification fonctionnels sur les pages `/login` et `/signup`, avec des champs e-mail et mot de passe, une bascule de visibilité du mot de passe, et une fonctionnalité de soumission. Les formulaires doivent consigner les identifiants dans la console à la soumission. Les utilisateurs doivent pouvoir naviguer facilement entre les formulaires de connexion et d'inscription.

## Exigences fonctionnelles

- Champ de saisie e-mail avec le type approprié et des attributs de validation
- Champ de saisie mot de passe avec fonctionnalité de bascule de visibilité
- Icône masquer/afficher qui bascule entre texte masqué et texte en clair
- Bouton de validation intitulé "Log In" sur la page de connexion et "Sign Up" sur la page d'inscription
- Gestionnaire de soumission qui consigne l'e-mail et le mot de passe dans la console
- Empêcher le comportement de soumission par défaut du formulaire (pas de rechargement de page)
- Liens ou boutons pour naviguer entre les pages de connexion et d'inscription
- Retour de validation pour les champs e-mail/mot de passe vides ou invalides
- Labels de formulaire accessibles et attributs ARIA quand c'est pertinent
- Design responsive qui fonctionne sur mobile et sur desktop

## Cas particuliers possibles

- L'utilisateur soumet le formulaire avec un champ e-mail vide
- L'utilisateur soumet le formulaire avec un champ mot de passe vide
- L'utilisateur soumet le formulaire avec un format d'e-mail invalide
- L'utilisateur bascule rapidement la visibilité du mot de passe
- L'utilisateur navigue entre les formulaires sans effacer la saisie précédente
- L'utilisateur utilise le remplissage automatique du navigateur pour les identifiants
- L'utilisateur appuie sur la touche Entrée pour soumettre le formulaire

## Critères d'acceptation

- Les champs e-mail et mot de passe s'affichent correctement sur les deux pages
- L'icône de bascule de visibilité du mot de passe change d'état et révèle/masque le texte du mot de passe
- Cliquer sur le bouton de validation consigne les données du formulaire dans la console du navigateur
- Le formulaire ne déclenche pas de rechargement de page à la soumission
- Les utilisateurs peuvent naviguer facilement entre les pages de connexion et d'inscription
- Les champs du formulaire ont les attributs de validation HTML5 appropriés
- Tous les éléments interactifs sont accessibles au clavier
- Les formulaires affichent un style cohérent avec le système de design existant

## Questions ouvertes

- Faut-il valider le format de l'e-mail avant d'autoriser la soumission ? Validation légère.
- Faut-il imposer une longueur minimale pour le mot de passe ? Non.
- Les champs saisis doivent-ils persister lors de la navigation entre login/signup ? Non.
- Faut-il une case "Se souvenir de moi" sur le formulaire de connexion ? Non.
- Faut-il inclure un lien "Mot de passe oublié" sur le formulaire de connexion ? Non.

## Consignes de tests

Créer des fichiers de test dans le dossier `./tests` pour les formulaires d'authentification, et écrire des tests pertinents pour les cas suivants :

- Le formulaire s'affiche avec tous les champs requis et le bouton de validation
- La bascule de visibilité du mot de passe alterne entre état masqué et visible
- La soumission du formulaire empêche le comportement par défaut et consigne les identifiants dans la console
- Le bouton de validation affiche le bon libellé selon le contexte (connexion ou inscription)
- Le champ e-mail accepte un format d'e-mail valide
- Le champ mot de passe accepte la saisie de texte et masque par défaut
- La navigation entre les formulaires de connexion et d'inscription fonctionne correctement
- La validation du formulaire empêche la soumission si des champs requis sont vides
