# Ce que le cours a enseigné, et ce qui en a été fait

Voici les leçons de la vidéo de formation (Claude Code Masterclass) que j'ai réellement collées dans le chat, entre le 4 et le 12 août 2026. Classées selon la vraie table des matières du cours, pas selon la date où je les ai collées.

## Méthode

J'ai analysé 8 sessions Claude Code (`bef46bcb`, `bc2538f9`, `a056c64e`, `8d281e45`, `3bb6cf8f`, `6b055b65`, `62cf38a7`, `ecc9fb7c`). Toutes les images collées dans le chat ont été extraites. Regardées une par une. Triées entre captures réelles de la vidéo du formateur et captures perso de debug (Firebase, terminal, Figma), ces dernières écartées de ces fichiers. Chaque leçon retenue est reliée au commit git qui l'a appliquée dans le code de Pocket Heist.

## Sommaire

| Section | Contenu retrouvé |
|---|---|
| [Section 1 : Introduction](./section-1-introduction.md) | Aucun. Les captures commencent après cette section |
| [Section 2 : Commands, Context, Tools & Hooks](./section-2-commands-context-tools-hooks.md) | Hooks `PostToolUse`, log `jq`, chaînage avec `prettier`, commandes `/commit-message` et `/component` |
| [Section 3 : Plan Mode & Specs](./section-3-plan-mode-specs.md) | Template de spec, méthode de rédaction complète, prompt `/spec`, du spec au plan d'implémentation, plus la chronologie complète des 9 specs du projet (`_specs/`) |
| [Section 4 : MCP Servers](./section-4-mcp-servers.md) | Plan Firebase MCP (Firestore + Auth). Figma MCP et Context7 sont utilisés mais aucune capture ne vient de la vidéo pour eux |
| [Section 5 : Plugins & Skills](./section-5-plugins-skills.md) | Aucun. Rien de capté ne correspond à ce thème |

## À lire avec ces nuances

Deux sections (1 et 5) n'ont aucune leçon confirmée. Ce n'est pas un oubli, aucune capture des 8 sessions ne s'y rattache. Je préfère le dire plutôt que forcer un contenu.

Certaines leçons chevauchent plusieurs sections. La commande `/spec` est une « Command », mais son contenu enseigne la méthode de « Specs ». Le chevauchement est signalé dans le fichier concerné, pas dupliqué.

Chaque fichier cite les commits git exacts (hash court, message, date) qui ont appliqué la leçon dans le projet. Vérifiables avec `git show <hash>`.
