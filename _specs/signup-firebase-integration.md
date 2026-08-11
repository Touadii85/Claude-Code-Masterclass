# Spec — Signup Firebase Integration

branche : claude/feature/signup-firebase-integration

## Résumé
Intégrer le formulaire d'inscription à Firebase Authentication pour créer des comptes utilisateurs. Lors d'une inscription réussie, générer un nom de code unique (`displayName`) en combinant trois mots choisis aléatoirement parmi trois ensembles distincts, en notation PascalCase. Créer un document dans la collection `users` de Firestore pour y stocker le nom de code et l'ID de l'utilisateur (l'adresse email n'est pas stockée). Utiliser uniquement le Firebase Web SDK.

## Exigences fonctionnelles
- Connecter le formulaire d'inscription à la méthode `createUserWithEmailAndPassword` de Firebase Auth.
- Générer un nom de code aléatoire en choisissant un mot parmi trois ensembles de mots distincts, et les combiner en PascalCase.
- Mettre à jour le profil Firebase Auth de l'utilisateur (`updateProfile`) pour définir le nom de code généré comme `displayName`.
- Créer un document dans la collection Firestore `users`, avec un ID de document correspondant à l'ID utilisateur Firebase Auth.
- Ne pas stocker l'adresse email dans Firestore.
- Gérer les erreurs d'authentification de manière appropriée et afficher des messages d'erreur à l'utilisateur.
- Afficher un état de chargement pendant le processus d'inscription.
- Rediriger l'utilisateur vers la page dashboard/heists après une inscription et une création de document réussies.

## Cas particuliers possibles
- Échecs réseau pendant la création du compte ou l'écriture du document Firestore.
- Adresses email dupliquées (Firebase Auth les rejette).
- Mots de passe trop faibles ne respectant pas les exigences de Firebase Auth.
- L'utilisateur ferme le navigateur/l'onglet en cours d'inscription.

## Critères d'acceptation
- Un utilisateur peut créer un compte via le formulaire d'inscription en utilisant Firebase Auth.
- Un nom de code est généré automatiquement et défini comme `displayName` de l'utilisateur.
- Un document est créé dans la collection Firestore `users`, contenant l'ID et le nom de code, sans l'adresse email.
- Un état de chargement est visible pendant le processus d'inscription.
- En cas d'erreur, un message approprié est affiché à l'utilisateur.
- L'utilisateur est redirigé vers la page dashboard/heists après une inscription réussie.
- Seul le Firebase Web SDK est utilisé — aucune Cloud Function n'est ajoutée.

## Questions ouvertes
- Les mots utilisés pour générer les noms de code doivent-ils être stockés dans un fichier distinct, ou directement dans le code ?
- Que se passe-t-il si la création du document Firestore échoue après la création du compte d'authentification ?
- Faut-il vérifier que le nom de code généré est unique dans Firestore avant de l'attribuer ?
- Quels messages d'erreur spécifiques à Firebase Auth faut-il afficher à l'utilisateur, plutôt que des messages génériques ?

## Consignes de tests
Créer un ou plusieurs fichiers de test dans le dossier ./tests pour la nouvelle fonctionnalité, et écrire des tests pertinents pour les cas suivants, sans en faire trop :
- Le générateur de nom de code retourne une chaîne non vide au format PascalCase à trois mots.
- Le générateur de nom de code produit des valeurs différentes sur plusieurs appels.
- Le formulaire affiche un état de chargement pendant la soumission.
- Le formulaire affiche un message d'erreur approprié en cas d'échec.
