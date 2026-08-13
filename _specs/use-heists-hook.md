# Spec — useHeists Hook

branche : claude/feature/use-heists-hook
composant_figma (si utilisé) : aucun

## Résumé

Créer un hook React personnalisé `useHeists` qui donne un accès temps réel aux données de heists depuis la collection Firestore. Le hook accepte un argument de filtre déterminant quels heists récupérer, en fonction de la relation de l'utilisateur connecté avec ces heists et de l'état de leur date limite. Une fois créé, intégrer le hook dans la page Heists pour afficher les titres de trois ensembles de résultats différents : heists actifs assignés à l'utilisateur, heists assignés par l'utilisateur, et heists expirés.

## Exigences fonctionnelles

- Créer un hook personnalisé `useHeists` dans le dossier `hooks/`.
- Le hook accepte un seul argument : `'active' | 'assigned' | 'expired'`.
- Le hook retourne un tableau d'objets Heist correspondant au critère de filtre.
- Le hook utilise des listeners Firestore en temps réel (`onSnapshot`), pas des requêtes ponctuelles.
- Logique de filtrage :
  - **`'active'`** : tous les heists où `assignedTo` correspond à l'id de l'utilisateur connecté ET dont la date limite n'est pas passée.
  - **`'assigned'`** : tous les heists où `createdBy` correspond à l'id de l'utilisateur connecté ET dont la date limite n'est pas passée.
  - **`'expired'`** : tous les heists dont la date limite est passée ET dont `finalStatus` n'est PAS `null` (indépendamment de l'utilisateur).
- Le hook doit gérer les états de chargement et d'erreur.
- Mettre à jour la page Heists (`app/(dashboard)/heists/page.tsx`) pour utiliser le hook trois fois, avec un argument de filtre différent à chaque fois.
- N'afficher que les titres des heists dans chaque section de la page Heists.

## Référence de design Figma (uniquement si mentionnée)

N/A

## Cas particuliers possibles

- L'utilisateur n'est pas authentifié au moment de l'appel du hook.
- La collection Firestore n'existe pas ou est vide.
- L'utilisateur connecté n'a aucun heist correspondant au critère de filtre.
- Les dates limites sont stockées dans des formats incohérents.
- Interruption réseau pendant l'abonnement au listener temps réel.
- Le composant est démonté avant que le listener Firestore ne soit établi.
- Changements de filtre rapides et multiples avant que les requêtes précédentes ne se terminent.
- Différences de fuseau horaire affectant la comparaison des dates limites.

## Critères d'acceptation

- Le hook établit correctement des listeners Firestore en temps réel selon l'argument de filtre.
- Les heists corrects sont retournés pour chaque type de filtre (`'active'`, `'assigned'`, `'expired'`).
- La page Heists affiche trois sections distinctes avec les titres des heists de chaque filtre.
- Les états de chargement sont gérés proprement (tableaux vides ou indicateurs de chargement).
- Les mises à jour temps réel sont reflétées dans l'interface quand les données de heists changent dans Firestore.
- Le hook nettoie correctement les listeners Firestore au démontage ou au changement de filtre.
- Aucune fuite mémoire due à des listeners non fermés.
- Le hook fonctionne correctement une fois l'état d'authentification de l'utilisateur disponible.

## Questions ouvertes

- Le hook doit-il gérer l'état d'authentification en interne, ou supposer que l'utilisateur est déjà authentifié ? Assime authentificated
- Doit-il y avoir une limite maximale au nombre de heists retournés par requête ? no
- Comment les états de chargement et d'erreur doivent-ils être exposés par le hook (valeurs de retour séparées, ou intégrées au tableau) ?
- Le hook doit-il gérer la pagination pour de grands ensembles de résultats ?
- Les heists expirés doivent-ils être triés dans un ordre particulier (ex. les plus récents en premier) ?

## Consignes de tests

Créer un ou plusieurs fichiers de test dans le dossier `./tests` pour la nouvelle fonctionnalité, et écrire des tests pertinents pour les cas suivants, sans en faire trop :
- Le hook retourne les bons heists pour le filtre `'active'` (assignés à l'utilisateur connecté, date limite non passée).
- Le hook retourne les bons heists pour le filtre `'assigned'` (créés par l'utilisateur connecté, date limite non passée).
- Le hook retourne les bons heists pour le filtre `'expired'` (date limite passée, `finalStatus` non nul).
- Le hook retourne un tableau vide quand aucun heist ne correspond au critère de filtre.
- Le hook nettoie correctement le listener Firestore au démontage.
- Le hook met à jour les données retournées quand les données Firestore changent en temps réel.
- La page Heists affiche trois sections avec les bons titres pour chaque filtre.
