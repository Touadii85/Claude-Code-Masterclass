# Spec — Auth State Hook

branche : claude/feature/auth-state-hook

## Résumé
Implémenter une solution de gestion globale de l'état d'authentification, fournissant un accès en temps réel au statut de connexion de l'utilisateur courant dans toute l'application. Cette solution expose un hook `useUser` qui retourne soit l'objet utilisateur authentifié, soit `null` s'il est déconnecté. L'implémentation inclut une écoute en temps réel qui met automatiquement à jour l'état utilisateur dès que le statut d'authentification change.

## Exigences fonctionnelles
- Créer un hook `useUser` appelable depuis n'importe quelle page ou composant.
- Le hook retourne `null` quand l'utilisateur est déconnecté.
- Le hook retourne l'objet utilisateur quand l'utilisateur est connecté.
- Implémenter une écoute en temps réel qui met à jour automatiquement l'état utilisateur dès que le statut d'authentification change.
- Fournir le contexte d'authentification de manière globale dans toute l'application, via React Context.
- Mettre à jour les composants existants qui accèdent actuellement aux informations utilisateur pour qu'ils utilisent le nouveau hook `useUser`.
- S'assurer que l'état d'authentification persiste lors des rafraîchissements de page et de la navigation.

## Cas particuliers possibles
- Changement d'état d'authentification dans un autre onglet ou une autre fenêtre du navigateur.
- Connexion à Firebase perdue ou interrompue.
- Composant monté avant que l'état d'authentification ne soit initialisé.
- Changements rapides d'état d'authentification (connexion/déconnexion en succession rapide).
- Expiration du token utilisateur pendant que l'application tourne.
- Hook appelé en dehors du fournisseur (provider) de contexte d'authentification.

## Critères d'acceptation
- Le hook `useUser` est disponible et peut être importé depuis un emplacement centralisé.
- Appeler `useUser()` retourne `null` quand aucun utilisateur n'est authentifié.
- Appeler `useUser()` retourne l'objet utilisateur avec les propriétés attendues quand un utilisateur est authentifié.
- L'état d'authentification se met à jour automatiquement sans nécessiter de rafraîchissement de page.
- Tous les composants existants qui accèdent aux données utilisateur sont mis à jour pour utiliser le nouveau hook.
- Le hook peut être utilisé aussi bien dans des composants client que dans des composants de page.
- Aucune erreur ni avertissement dans la console liés à la gestion de l'état d'authentification.
- L'état d'authentification persiste correctement lors des rafraîchissements du navigateur.

## Questions ouvertes
- Quelles propriétés précises l'objet utilisateur doit-il contenir (email, uid, displayName, etc.) ?
- Le hook doit-il aussi exposer un état de chargement (loading) pendant l'initialisation de l'authentification ?
- Faut-il une gestion des erreurs pour les erreurs liées à l'état d'authentification ?
- Faut-il un hook séparé pour simplement vérifier si l'utilisateur est authentifié (booléen), par opposition à récupérer ses données ?

## Consignes de tests
Créer un ou plusieurs fichiers de test dans le dossier ./tests pour la nouvelle fonctionnalité, et écrire des tests pertinents pour les cas suivants, sans en faire trop :
- Le hook retourne `null` quand l'utilisateur n'est pas authentifié.
- Le hook retourne l'objet utilisateur quand l'utilisateur est authentifié.
- Le hook se met à jour automatiquement quand l'état d'authentification change.
- Le hook lève une erreur ou retourne une valeur appropriée quand il est utilisé en dehors du provider.
- Les composants utilisant le hook reçoivent l'état utilisateur mis à jour lors des changements d'authentification.
