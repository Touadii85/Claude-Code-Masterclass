# Spec — Expired Heist Card Component

branche : claude/feature/expired-heist-card
composant_figma (si utilisé) : ExpiredHeistCard

## Résumé
Composant de carte affichant un vol (heist) expiré, pour remplacer les lignes de texte brutes (`<div>{heist.title}</div>`) actuellement utilisées dans la section « All Expired Heists » de `/heists` — la seule section de la page qui n'a pas encore de carte stylée (Active et Assigned l'ont déjà via `HeistCard`). Carte purement informationnelle (lecture seule, pas de lien cliquable), avec un badge de statut final (réussi/échoué).

## Exigences fonctionnelles
- `ExpiredHeistCard` est utilisé uniquement dans la section « All Expired Heists » de `/heists` (filtre `useHeists("expired")`), à la place du rendu brut actuel.
- Contrairement à `HeistCard`, la carte n'est **pas cliquable** : pas de `Link` vers `/heists/[id]`, aucun état hover interactif — le design Figma ne montre ni lien ni bouton sur ce composant.
- Affiche un badge de statut final, mappé sur `heist.finalStatus` (`"success" | "failure"`, jamais `null` pour un vol expiré en pratique) : badge vert (style `--color-success`) si `"success"`, badge rouge (style `--color-error`, seule variante vue dans le design Figma sous le texte « FAILED ») si `"failure"`.
- Layout compact horizontal (icône + titre + date sur une ligne, badge de statut, To:/By: sur une autre ligne), différent du layout vertical empilé de `HeistCard`.
- Palette visuellement assourdie par rapport à `HeistCard` (fond et bordure en opacité réduite), pour signaler visuellement un vol terminé/inactif.

## Référence de design Figma (uniquement si mentionnée)
- Fichier : Page Designs (Copy) — https://www.figma.com/design/xCdyG3aZme0uw3AERcF7ea/Page-Designs--Copy-?node-id=34-13
- Nom du composant : ExpiredHeistCard (node `34:13`), symbole séparé du `HeistCard` normal (node `14:23`), repéré lors de la précédente extraction Figma pour Heist Card.
- Contraintes visuelles clés :
  - Carte pleine largeur, hauteur automatique (~86px), `flex-col`, `gap: 8px` entre la ligne titre/date et la ligne To:/By:.
  - Fond `rgba(16,24,40,0.3)` (`--color-lighter` à 30 % d'opacité), bordure `rgba(30,41,57,0.3)` (`--color-border` à 30 %), `border-radius: 10px`.
  - Titre : Inter Medium 16px/24px, `--color-heading`. Date + labels To:/By: : Inter Regular 14px/20px, `--color-body`. Codename après « To: » → `--color-primary`, après « By: » → `--color-secondary`.
  - Badge de statut : `border-radius: 4px`, texte 12px majuscules (`letter-spacing: 0.6px`), fond/bordure/texte dans les nuances d'opacité de la couleur sémantique correspondante (ex. erreur : fond 5 %, bordure 20 %, texte plein).
  - Icône 16px à gauche du titre (indicateur visuel d'état), icônes 12px devant date et To:/By: (`gap: 6px` icône-texte).
  - Aucun état hover/actif/disabled détecté — composant non interactif.

## Cas particuliers possibles
- Aucun vol expiré à afficher (liste vide) — message déjà géré par la page actuelle (« No expired heists »), inchangé.
- Erreur de chargement (`useHeists` retourne déjà un `error`), déjà gérée.
- `finalStatus` techniquement `null` sur un vol expiré (ne devrait pas arriver selon la logique métier actuelle, mais le composant doit rester robuste — voir questions ouvertes).

## Critères d'acceptation
- La section « All Expired Heists » de `/heists` affiche des `ExpiredHeistCard` au lieu des `<div>` bruts, avec le style visuel de Figma.
- Le badge de statut reflète correctement `success`/`failure`.
- Aucun lien ni interaction cliquable sur la carte.
- Les sections Active/Assigned (déjà en `HeistCard`) ne sont pas modifiées par cette feature.

## Questions ouvertes
- Emplacement confirmé par l'utilisateur : section « All Expired Heists » sur `/heists` (http://localhost:3000/heists), pas la page publique.
- Le design Figma extrait ne montre que la variante « FAILED » (rouge). La variante « réussi » (verte, `--color-success`) n'a pas de référence visuelle directe dans ce symbole — à déduire par symétrie avec le badge « success » déjà vu sur le `HeistCard` normal (section Heist History).
- Comportement si `finalStatus` est `null` sur un vol expiré (cas normalement impossible avec la logique actuelle, mais à décider : badge neutre, ou masqué ?).
- Responsive : le design Figma montre une carte pleine largeur fixe — pas de grille à plusieurs colonnes comme pour `HeistCard`, à confirmer que la section Expired reste en liste verticale simple.

## Consignes de tests
Créer un ou plusieurs fichiers de test dans le dossier ./tests pour la nouvelle fonctionnalité, et écrire des tests pertinents pour les cas suivants, sans en faire trop :
- `ExpiredHeistCard` affiche le titre, la date, les codenames To:/By:, et le bon badge de statut selon `finalStatus`.
- `ExpiredHeistCard` ne rend aucun élément cliquable (pas de `role="link"`).
- `/heists` affiche des `ExpiredHeistCard` dans la section Expired, sans toucher aux sections Active/Assigned.
