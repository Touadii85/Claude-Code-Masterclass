# Spec — Heist Card Component

branche : claude/feature/heist-card
composant_figma (si utilisé) : HeistCard

## Résumé
Composant de carte affichant un vol (heist) sur la page `/heists`, pour remplacer les lignes de texte brutes actuellement utilisées dans les sections « Active Heists » et « Assigned Heists ». Un composant squelette dédié (`HeistCardSkeleton`) doit reproduire la même mise en page pendant le chargement des données.

## Exigences fonctionnelles
- Le composant `HeistCard` est utilisé uniquement pour les vols actifs (filtre `useHeists("active")`) et assignés (`useHeists("assigned")`) sur `/heists`. La section « Expired Heists » n'est pas concernée par cette spec.
- Le titre du vol est cliquable et pointe vers `/heists/[id]` (page déjà existante, actuellement un simple placeholder — ne pas y ajouter de contenu).
- Les cartes s'affichent en grille 3 colonnes.
- `HeistCardSkeleton` reprend la même mise en page (grille 3 colonnes) et s'affiche tant que `loading` est `true` sur le hook `useHeists`.
- La distinction actif/assigné vient directement du hook `useHeists` existant (`lib/hooks/useHeists.ts`) : `active` = `assignedTo == utilisateur courant`, `assigned` = `createdBy == utilisateur courant`, les deux filtrés sur `deadline > maintenant`. Aucune nouvelle logique de statut à écrire.

## Référence de design Figma (uniquement si mentionnée)
- Fichier : Page Designs (Copy) — https://www.figma.com/design/xCdyG3aZme0uw3AERcF7ea/Page-Designs--Copy-?node-id=21-4&t=UzbLeovKUbiwPPWq-0
- Nom du composant : HeistCard (node `14:23`) — le lien fourni pointe par défaut sur un autre composant (bouton de navbar), le nœud `14:23` doit être consulté directement pour revoir le design.
- Contraintes visuelles clés :
  - Fond `#101828` (= `--color-lighter`), bordure `1px #1e2939` (couleur absente du thème actuel, cf. questions ouvertes), `border-radius: 10px`, padding `20px` (`p-5`), `gap: 12px` entre le titre et le bloc métadonnées.
  - Titre : Inter Regular 16px/24px, `--color-heading`.
  - Labels « To: » / « By: » / date : Inter Regular 14px/20px, `--color-body` (`#99a1af`).
  - Codename après « To: » → `--color-primary` (`#c27aff`). Codename après « By: » → `--color-secondary` (`#fb64b6`). Valeur du délai (ex. « 4h 42m », « Overdue ») → `--color-primary`.
  - Petites icônes 12px devant chaque ligne To:/By:/Date, `gap: 8px` icône-texte. Icône 16px en haut à droite du titre (horloge), sans état hover défini dans Figma.
  - Aucun état hover/actif/disabled modélisé dans Figma pour la carte elle-même.

## Cas particuliers possibles
- Aucun vol actif ou assigné à afficher (liste vide).
- Erreur de chargement (`useHeists` retourne déjà un `error`).
- Vol dont la deadline est très proche (affichage du délai, ex. « Overdue » vu dans Figma).

## Critères d'acceptation
- `/heists` affiche des `HeistCard` en grille 3 colonnes pour les sections Active et Assigned, avec le style visuel de Figma (couleurs, typographie, rayon de bordure).
- Le titre de chaque carte navigue vers `/heists/[id]` au clic.
- Pendant le chargement, `HeistCardSkeleton` s'affiche à la place, dans la même grille.
- La section Expired Heists n'est pas modifiée par cette fonctionnalité.

## Questions ouvertes
- La couleur de bordure `#1e2939` extraite de Figma n'existe pas dans `@theme` (`app/globals.css`). Faut-il l'ajouter comme nouveau token (ex. `--color-border`), ou réutiliser une couleur existante ?
- Combien de cartes squelettes afficher pendant le chargement (une rangée de 3, plus ?) ?
- Le design Figma ne définit aucun état de survol pour la carte — faut-il un effet visuel au survol (ex. bordure plus claire, comme `.btn:hover` dans `globals.css`) ?
- Le comportement responsive de la grille (nombre de colonnes en dessous de la largeur desktop) n'est pas précisé.

## Consignes de tests
Créer un ou plusieurs fichiers de test dans le dossier ./tests pour la nouvelle fonctionnalité, et écrire des tests pertinents pour les cas suivants, sans en faire trop :
- `HeistCard` affiche le titre, les codenames To:/By: et le délai avec les bonnes valeurs.
- Le titre de `HeistCard` est un lien vers `/heists/[id]` avec le bon `id`.
- `HeistCardSkeleton` s'affiche pendant `loading`, et `/heists` bascule vers les vraies cartes une fois les données chargées (test d'intégration sur `HeistsPage` avec `useHeists` mocké).
