# Section 2 — Commands, Context, Tools & Hooks

*Cours : Claude Code Masterclass — Section 2 (13/13 leçons, 1h33).*

Cette section du cours couvre les hooks Claude Code (via `/hooks`) et les commandes personnalisées du projet. Deux sessions collent précisément à ce thème : **bc2538f9** (05/08) et **a056c64e** (06/08), toutes deux confirmées par un watermark « Udemy » ou un chemin `/Users/shaun/...` (machine du formateur) visible sur les captures.

## Créer un hook `PostToolUse` pas à pas via `/hooks`

**Sessions source :** bc2538f9 (05/08) et a056c64e (06/08)

**Ce que montre la vidéo :** l'écran interactif `/hooks` en 4 étapes — choix de l'événement `PostToolUse`, puis `Add new matcher…` avec la liste des `tool_name` valides (`Task`, `Bash`, `Read`, `Edit`, `Write`, …) et la syntaxe (`Write` seul, `Write|Edit` pour plusieurs outils, `Web.*` en regex), puis retour à `/hooks` titré « Matcher: Write|Edit », puis `Add new hook…` avec le champ `Command:` rempli avec `echo "hello"`.

**Ce que le formateur explique :** un hook se configure en deux temps — d'abord un **matcher** (quel outil déclenche le hook), puis une **commande shell** exécutée après. L'entrée reçue par la commande est un objet JSON (`tool_input`/`tool_response`) ; le code de sortie détermine l'affichage (0 = stdout visible directement dans le transcript, sans besoin de `Ctrl+O` — point confirmé par une capture vidéo montrant le résultat `PostToolUse:Edit hook succeeded: hello` juste sous un diff).

**Application dans Pocket Heist :** le menu interactif `/hooks` ne s'est pas comporté comme attendu dans l'environnement WSL d'Ilies ; la solution a été d'éditer directement `.claude/settings.local.json` avec l'équivalent JSON (`"matcher": "Write|Edit"`, `"command": "echo \"hello\""`). Cette compréhension a ensuite été rédigée en documentation pédagogique dans `.claude/lecons/hooks-guide.md` et `.claude/lecons/hooks-plan.md` — commit `19bfc5a` (« 📝 docs: ajoute les leçons hooks et traduit les commandes en français », 06/08/2026).

## Logger l'objet complet transmis au hook avec `jq`

**Session source :** a056c64e (06/08)

**Ce que montre la vidéo :** le contenu d'un fichier `tool-use.json` produit par un hook, contenant l'objet complet reçu (`session_id`, `cwd`, `hook_event_name`, `tool_name`, `tool_input`, `tool_response` avec `structuredPatch`) sur un fichier du projet du formateur (`app/(public)/login/page.tsx`, chemin `/Users/shaun/Code/Courses/pocket_heist`).

**Ce que le formateur explique :** pour logger l'objet JSON complet reçu par le hook, le bon filtre `jq` est l'identité `jq '.'` (garde tout), et non un filtre restrictif comme `.tool_input.file_path` qui ne garderait qu'un seul champ.

**Application dans Pocket Heist :** correction de la commande dans `.claude/settings.local.json` (`jq . > tool-use.json`), mise à jour de `.claude/lecons/hooks-jq-log.md`, suppression d'un fichier obsolète (`tool-log.json`) — regroupé dans le commit `19bfc5a` (même commit que ci-dessus, qui ajoute justement ce fichier `hooks-jq-log.md`).

## Chaîner plusieurs commandes sur un même hook (permissions + auto-formatage `prettier`)

**Session source :** a056c64e (06/08)

**Ce que montre la vidéo :** le fichier `.claude/settings.local.json` du formateur avec des permissions pré-accordées (`WebSearch`, `Bash(git init)`, `Bash(git switch:*)`) et **trois commandes chaînées** sur le même matcher `Write|Edit` : `echo "hello"`, `jq . > tool-use.json`, et une commande de reformatage automatique des fichiers `.tsx` via `prettier`.

**Ce que le formateur explique :** un même matcher peut déclencher plusieurs hooks à la suite — ici un exemple concret d'auto-formatage post-édition, qui filtre sur l'extension `.tsx` avant d'appeler `npx prettier --write`.

**Application dans Pocket Heist :** reproduction fidèle de ces commandes dans `.claude/settings.local.json`, plus l'ajout d'un fichier `.prettierrc` (`semi: false`) pour que le hook `prettier` respecte la convention du projet (pas de points-virgules) — commit `19bfc5a` (06/08/2026).

## Commande personnalisée `/commit-message`

**Origine :** fournie dans le squelette de départ du cours (`.claude/commands/commit-message.md`), commit `10dd3cf` (« ✨ feat: ajoute le squelette de départ du projet Pocket Heist », 06/08/2026), puis traduite en français dans le commit `19bfc5a` (même date).

**Ce qu'elle fait :** lance `git status` et `git diff --staged`, analyse les changements stagés, puis propose un message de commit au format `<emoji> <type>: <description>` (liste fixe d'emojis : `✨ feat`, `🐛 fix`, `🔨 refactor`, `📝 docs`, `🎨 style`, `✅ test`, `⚡ perf`) — sans jamais commiter automatiquement, seulement sur confirmation explicite de l'utilisateur.

*Remarque : aucune capture vidéo retrouvée dans les 8 sessions ne montre spécifiquement l'écran de création de cette commande ; sa présence est déduite du diff git et du récapitulatif de la session 8d281e45, qui la cite comme exemple d'usage classé par Ilies dans « Section 2 » du cours.*

## Commande personnalisée `/component` (TDD)

**Origine :** ajoutée en français dans le commit `19bfc5a` (06/08/2026).

**Ce qu'elle fait :** à partir d'une description libre (`$ARGUMENTS`), détermine un nom de composant en PascalCase, écrit d'abord les tests (`tests/components/[Nom].test.tsx`), les lance (échec attendu), crée le composant (`.tsx` + `.module.css` + `index.ts`) en suivant la convention du projet, relance les tests (succès attendu), puis l'ajoute à `app/(public)/preview/page.tsx` — un cycle TDD complet piloté par une seule commande slash.

*Remarque : même limite que `/commit-message` — pas de capture vidéo isolée retrouvée pour cette commande précisément ; elle est citée dans le récapitulatif de session 8d281e45 comme faisant partie du travail classé en Section 2.*

## Chevauchement signalé : la commande `/spec`

La commande `/spec` (créée en `d4c3bc8`, « ✨ feat: ajoute la commande /spec et son template de spécification », 06/08/2026 17:00) pourrait sembler relever de cette Section 2 (« Commands ») puisque c'est une commande personnalisée comme `/commit-message` ou `/component`. **Choix fait ici : elle est classée en Section 3 « Plan Mode & Specs »**, parce que tout le contenu pédagogique retrouvé à son sujet (structure du template, contenu détaillé d'une spec complète, formulation du prompt d'entrée) enseigne la **méthode de rédaction d'une spec**, pas la mécanique de création d'une commande slash — ce qui correspond exactement à l'intitulé de la Section 3, pas de la Section 2. Voir [`section-3-plan-mode-specs.md`](./section-3-plan-mode-specs.md).

---

**Note de couverture :** sur les 8 sessions analysées, seules bc2538f9 et a056c64e contiennent des leçons vidéo directement liées aux hooks. Aucune session ne montre d'autres sujets typiques de cette section (contexte, autres outils du terminal) — soit ce contenu n'a pas été capturé par Ilies, soit il correspond aux leçons de la Section 2 non couvertes par une capture d'écran collée dans le chat.
