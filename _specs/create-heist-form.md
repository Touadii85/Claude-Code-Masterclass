# Spec — Create Heist Form

branche : claude/feature/create-heist-form
composant_figma (si utilisé) : aucun

## Résumé

Implémenter un formulaire "Create Heist" fonctionnel sur la page `/heists/create`, permettant aux utilisateurs de créer de nouvelles missions heist. Le formulaire collecte les détails de la mission, définit automatiquement l'horodatage de création et l'échéance, puis enregistre le heist dans Firestore. Une fois la soumission réussie, l'utilisateur est redirigé vers la page de liste des heists.

## Exigences fonctionnelles

- Le formulaire comprend les champs de saisie suivants, correspondant à l'interface `CreateHeistInput` :
  - **Titre** (champ texte) : nom/titre de la mission heist.
  - **Description** (zone de texte) : description détaillée du heist.
  - **Assigné à** (liste déroulante) : utilisateur chargé de réaliser le heist, peuplée depuis la collection `users` avec les codenames. L'utilisateur actuellement connecté est exclu de cette liste.
- Le "créé par" n'est pas un champ du formulaire : il est déduit automatiquement de l'utilisateur actuellement connecté (id + codename), sans liste déroulante ni saisie.
- Lors de la sélection d'un utilisateur dans la liste "Assigné à", l'id et le codename sont tous les deux capturés.
- Le formulaire définit automatiquement :
  - `createdAt` : timestamp serveur Firebase.
  - `deadline` : calculée automatiquement, 48 heures après la création, non modifiable.
  - `finalStatus` : initialisé à `null`.
- La soumission du formulaire doit :
  - Valider que tous les champs requis sont remplis.
  - Créer un nouveau document dans la collection Firestore `heists`.
  - Utiliser `heistConverter` pour la transformation des données.
  - Rediriger vers la page `/heists` en cas de succès.
- Un état de chargement est affiché pendant la soumission.
- Un message d'erreur est affiché si la soumission échoue.
- Si la collection `users` est vide, un message est affiché à la place du formulaire.
- Le formulaire suit les patterns de composants existants (`Button`, `Input`).

## Référence de design Figma (uniquement si mentionnée)

N/A

## Cas particuliers possibles

- L'utilisateur tente de soumettre le formulaire avec des champs requis manquants.
- L'écriture Firestore échoue (permissions ou réseau).
- La collection `users` est vide ou échoue à charger.
- L'utilisateur quitte la page pendant la soumission.
- Le calcul de l'échéance traverse un changement d'heure (heure d'été/hiver).
- L'utilisateur n'est pas authentifié (doit être géré par la protection de routes, hors périmètre de cette spec).

## Critères d'acceptation

- Le formulaire s'affiche sur `/heists/create` avec tous les champs requis.
- La liste déroulante "Assigné à" est peuplée avec les codenames des utilisateurs depuis Firestore, sans inclure l'utilisateur connecté.
- Le formulaire valide que tous les champs requis sont remplis avant soumission.
- Une soumission réussie crée un document heist dans Firestore avec les bonnes valeurs de champs.
- `createdAt` utilise le timestamp serveur Firebase.
- `deadline` est automatiquement fixée à 48 heures après la création, toujours fixe.
- L'utilisateur est redirigé vers `/heists` après une soumission réussie.
- Un état de chargement est affiché pendant la soumission.
- Des messages d'erreur sont affichés en cas d'échec de la soumission.
- Le style du formulaire suit le système de design existant (classes de `globals.css` et CSS Modules).

## Questions ouvertes

- Le champ "créé par" doit-il être auto-rempli avec l'utilisateur connecté, ou rester une liste déroulante ? → Ni liste déroulante ni champ de saisie : toujours l'utilisateur actuellement connecté.
- Faut-il une boîte de dialogue de confirmation avant soumission ? → Non.
- L'échéance (deadline) doit-elle être modifiable ou toujours fixée à 48 heures ? → Toujours fixe.
- Faut-il empêcher qu'un utilisateur s'assigne un heist à lui-même ? → Ne pas afficher l'utilisateur connecté dans la liste déroulante "Assigné à".
- Que doit-il se passer si la collection `users` est vide ? → Afficher un message à la place du formulaire.

## Consignes de tests

Créer un ou plusieurs fichiers de test dans le dossier `./tests` pour la nouvelle fonctionnalité, et écrire des tests pertinents pour les cas suivants, sans en faire trop :
- Le formulaire s'affiche avec tous les champs requis (titre, description, liste déroulante assigné à).
- La validation du formulaire empêche la soumission si des champs requis sont vides.
- Une soumission réussie appelle Firestore avec la bonne structure de données.
- Le formulaire affiche un état de chargement pendant la soumission.
- Le formulaire affiche un message d'erreur si l'opération Firestore échoue.
- L'utilisateur est redirigé vers `/heists` après une soumission réussie.
- La liste déroulante est peuplée avec les données utilisateurs de Firestore.
