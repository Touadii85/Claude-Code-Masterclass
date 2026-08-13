# Section 5 : Plugins & Skills

*Cours : Claude Code Masterclass, Section 5 (6/7 leçons, 46 min).*

Aucune capture de la vidéo de formation ne couvre cette section. Mais une leçon bien réelle s'y rattache quand même, pas montrée par le formateur, appliquée directement par moi dans le terminal. Ma première passe sur cette section ne cherchait que des captures d'écran, donc elle l'a manquée.

## Installer et utiliser le plugin `frontend-design` d'Anthropic

**Session source :** ecc9fb7c, 12/08/2026, à partir de 09h39

**Ce qui s'est passé :** j'ai installé le plugin officiel Anthropic depuis le terminal Claude Code.

```
✓ Installed frontend-design. Plugin is now active.
```

Six minutes plus tard, à 09h47, j'ai demandé une refonte de la page d'accueil publique (pour les visiteurs pas encore inscrits, avec un bouton d'inscription). Claude a invoqué le skill (`Skill({"skill": "frontend-design:frontend-design"})`), puis a lu `globals.css`, le layout public, `Button.tsx`, la page signup et la Navbar, pour caler la refonte sur la palette déjà en place plutôt que d'en inventer une nouvelle.

**Ce que ça a produit :** une nouvelle page d'accueil (`app/(public)/page.tsx`), avec un bandeau « Top Secret » incliné, un titre agrandi, l'accroche « Perfectly petty », quatre badges de fonctionnalités (Plan Heists, Assign Tasks, Earn Glory, Stay Sneaky), et deux boutons d'action, « Start Your First Heist » vers `/signup`, un lien de connexion vers `/login`. Quelques ajustements dans `globals.css`, dont une correction sur `.center-content` qui forçait un `text-justify` indésirable.

**Application dans Pocket Heist :** le changement est bien dans le dépôt, mais caché dans un commit au message trompeur, `241a4cb`, intitulé juste « update heist type » (12/08, 12h26). Ce commit regroupe trois choses sans rapport, les types Firestore des heists, le skill `firestore-schemas`, et cette refonte de page d'accueil. Le message ne mentionne aucune des deux dernières.

**La session n'a pas été simple.** Un premier essai s'est arrêté trop tôt, Claude n'avait modifié que `page.tsx`, sans vérifier les fichiers liés. J'ai coupé court, à 10h00 :

> stop vous ne vous êtes arreter qu'au fichier page.tsx pas autres qu'il lui sont liée global.css et d'autres c'est quoi cette erruer minable recommencer et on teste le skill frontend design

Claude a repris, vérifié `globals.css`, corrigé le `.center-content`, relancé les tests (57 verts) et le lint, avant de confirmer l'état exact par `git status` plutôt que de deviner.

## Ce que je n'ai pas pu confirmer

Sur toute la session `ecc9fb7c` et sa continuation `f6e0d53f`, le skill `frontend-design` n'est invoqué explicitement qu'une seule fois, celle décrite ci-dessus. Juste après, dans la même session, le travail est passé au formulaire Create Heist (spec, plan, puis commit `6b9f2ec` à 16h19), déjà documenté dans [`section-3-plan-mode-specs.md`](./section-3-plan-mode-specs.md) et [`section-4-mcp-servers.md`](./section-4-mcp-servers.md). Rien dans les échanges ne montre un second appel au skill pour cette partie du travail. Les principes du skill (garder la palette existante, ne pas en inventer une nouvelle) ont pu influencer le style du formulaire par la suite sans nouvel appel explicite, mais je n'ai pas de preuve directe de ça, donc je ne l'affirme pas.

## Ce qui reste écarté

- **Les commandes `/component` et `/commit-message`**, créées le 06/08. Le récapitulatif de la session 8d281e45 les classe lui-même en Section 2, pas en Section 5. Voir [`section-2-commands-context-tools-hooks.md`](./section-2-commands-context-tools-hooks.md).
- **La commande `/spec`**, dont le contenu pédagogique porte sur la rédaction de specs, donc en Section 3. Voir [`section-3-plan-mode-specs.md`](./section-3-plan-mode-specs.md).
- **Le skill `.claude/skills/firestore-schemas/Skill.md`**, créé par Claude pendant la génération des types Firestore. Pas de capture ni de leçon vidéo qui l'explique, il reste hors périmètre ici.
