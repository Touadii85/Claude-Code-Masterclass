# Ce que le cours a enseigné, et ce qui en a été fait

Reconstitution des leçons de la vidéo de formation (**Claude Code Masterclass**) réellement collées dans le chat par Ilies entre le 4 et le 12 août 2026, organisée selon la vraie table des matières du cours — pas une timeline par date.

## Méthode

8 sessions Claude Code ont été analysées (`bef46bcb`, `bc2538f9`, `a056c64e`, `8d281e45`, `3bb6cf8f`, `6b055b65`, `62cf38a7`, `ecc9fb7c`). Toutes les images collées dans le chat ont été extraites, regardées une par une, triées entre captures réelles de la vidéo du formateur et captures personnelles de debug (Firebase, terminal, Figma) — écartées de ces fichiers. Chaque leçon retenue est reliée au commit git exact qui l'a appliquée dans le code de Pocket Heist.

## Sommaire

| Section | Contenu retrouvé |
|---|---|
| [Section 1 — Introduction](./section-1-introduction.md) | Aucun — les captures commencent après cette section |
| [Section 2 — Commands, Context, Tools & Hooks](./section-2-commands-context-tools-hooks.md) | Hooks `PostToolUse`, log `jq`, chaînage avec `prettier`, commandes `/commit-message` et `/component` |
| [Section 3 — Plan Mode & Specs](./section-3-plan-mode-specs.md) | Template de spec, méthode de rédaction complète, prompt `/spec`, du spec au plan d'implémentation |
| [Section 4 — MCP Servers](./section-4-mcp-servers.md) | Plan Firebase MCP (Firestore + Auth) — Figma MCP et Context7 utilisés mais non captés depuis la vidéo |
| [Section 5 — Plugins & Skills](./section-5-plugins-skills.md) | Aucun — rien de capté ne correspond à ce thème |

## À lire avec ces nuances

- Deux sections (1 et 5) n'ont aucune leçon confirmée : ce n'est pas un oubli, c'est qu'aucune capture des 8 sessions ne s'y rattache réellement. Mieux vaut le dire que forcer un contenu.
- Certaines leçons chevauchent plusieurs sections (ex. la commande `/spec` est une « Command » mais son contenu pédagogique enseigne la méthode de « Specs ») — le chevauchement est signalé dans le fichier concerné plutôt que dupliqué.
- Chaque fichier cite les commits git exacts (hash court, message, date) qui ont appliqué la leçon dans le projet — vérifiables avec `git show <hash>`.
