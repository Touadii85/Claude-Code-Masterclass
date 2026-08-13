# Section 2 : Commands, Context, Tools & Hooks

*Cours : Claude Code Masterclass, Section 2 (13/13 leçons, 1h33).*

Cette section couvre les hooks Claude Code (via `/hooks`) et les commandes personnalisées du projet. Deux sessions collent précisément à ce thème, `bc2538f9` (05/08) et `a056c64e` (06/08), toutes deux confirmées par un watermark Udemy ou un chemin `/Users/shaun/...` (la machine du formateur) visible sur les captures.

## Créer un hook `PostToolUse` pas à pas via `/hooks`

**Sessions source :** bc2538f9 (05/08) et a056c64e (06/08)

**Ce que montre la vidéo :** l'écran interactif `/hooks` en 4 étapes. D'abord le choix de l'événement `PostToolUse`. Puis `Add new matcher…` avec la liste des `tool_name` valides (`Task`, `Bash`, `Read`, `Edit`, `Write`, etc.) et la syntaxe (`Write` seul, `Write|Edit` pour plusieurs outils, `Web.*` en regex). Puis retour à `/hooks` titré « Matcher: Write|Edit ». Puis `Add new hook…` avec le champ `Command:` rempli avec `echo "hello"`.

**Ce que le formateur explique :** un hook se configure en deux temps. D'abord un matcher, quel outil déclenche le hook. Puis une commande shell exécutée après. L'entrée reçue par la commande est un objet JSON (`tool_input`, `tool_response`). Le code de sortie détermine l'affichage, 0 veut dire stdout visible directement dans le transcript, sans besoin de `Ctrl+O`. Une capture vidéo confirme ce point en montrant le résultat `PostToolUse:Edit hook succeeded: hello` juste sous un diff.

**Application dans Pocket Heist :** le menu interactif `/hooks` ne s'est pas comporté comme prévu dans l'environnement WSL. J'ai obtenu le même résultat en éditant directement `.claude/settings.local.json` avec l'équivalent JSON (`"matcher": "Write|Edit"`, `"command": "echo \"hello\""`). Cette compréhension a ensuite été rédigée dans `.claude/lecons/hooks-guide.md` et `.claude/lecons/hooks-plan.md`, commit `19bfc5a` (« docs: ajoute les leçons hooks et traduit les commandes en français », 06/08/2026).

## Logger l'objet complet transmis au hook avec `jq`

**Session source :** a056c64e (06/08)

**Ce que montre la vidéo :** le contenu d'un fichier `tool-use.json` produit par un hook. L'objet complet reçu, `session_id`, `cwd`, `hook_event_name`, `tool_name`, `tool_input`, `tool_response` avec `structuredPatch`, sur un fichier du projet du formateur (`app/(public)/login/page.tsx`, chemin `/Users/shaun/Code/Courses/pocket_heist`).

**Ce que le formateur explique :** pour logger l'objet JSON complet reçu par le hook, le bon filtre `jq` est l'identité `jq '.'` (garde tout). Pas un filtre restrictif comme `.tool_input.file_path` qui ne garderait qu'un seul champ.

**Application dans Pocket Heist :** correction de la commande dans `.claude/settings.local.json` (`jq . > tool-use.json`), mise à jour de `.claude/lecons/hooks-jq-log.md`, suppression d'un fichier obsolète (`tool-log.json`). Tout regroupé dans le commit `19bfc5a`, qui ajoute justement ce fichier `hooks-jq-log.md`.

## Chaîner plusieurs commandes sur un même hook (permissions + auto-formatage `prettier`)

**Session source :** a056c64e (06/08)

**Ce que montre la vidéo :** le fichier `.claude/settings.local.json` du formateur avec des permissions pré-accordées (`WebSearch`, `Bash(git init)`, `Bash(git switch:*)`) et trois commandes chaînées sur le même matcher `Write|Edit`, `echo "hello"`, `jq . > tool-use.json`, et une commande de reformatage automatique des fichiers `.tsx` via `prettier`.

**Ce que le formateur explique :** un même matcher peut déclencher plusieurs hooks à la suite. Ici un exemple concret d'auto-formatage post-édition, qui filtre sur l'extension `.tsx` avant d'appeler `npx prettier --write`.

**Application dans Pocket Heist :** j'ai reproduit ces commandes dans `.claude/settings.local.json`, plus l'ajout d'un fichier `.prettierrc` (`semi: false`) pour que le hook `prettier` respecte la convention du projet, pas de points-virgules. Le tout dans le commit `19bfc5a` (06/08/2026).

## Commande personnalisée `/commit-message`

**Origine :** fournie dans le squelette de départ du cours (`.claude/commands/commit-message.md`), commit `10dd3cf` (« feat: ajoute le squelette de départ du projet Pocket Heist », 06/08/2026), puis traduite en français dans le commit `19bfc5a` (même date).

**Ce qu'elle fait :** lance `git status` et `git diff --staged`, analyse les changements stagés, puis propose un message de commit au format `<emoji> <type>: <description>` (liste fixe d'emojis, `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `perf`). Elle ne commite jamais automatiquement, seulement sur confirmation explicite.

*Aucune capture vidéo retrouvée dans les 8 sessions ne montre l'écran de création de cette commande. Sa présence est déduite du diff git et du récapitulatif de la session 8d281e45, qui la cite comme exemple d'usage classé en Section 2.*

## Commande personnalisée `/component` (TDD)

**Origine :** ajoutée en français dans le commit `19bfc5a` (06/08/2026).

**Ce qu'elle fait :** à partir d'une description libre (`$ARGUMENTS`), elle détermine un nom de composant en PascalCase, écrit d'abord les tests (`tests/components/[Nom].test.tsx`), les lance (échec attendu), crée le composant (`.tsx` + `.module.css` + `index.ts`) selon la convention du projet, relance les tests (succès attendu), puis l'ajoute à `app/(public)/preview/page.tsx`. Un cycle TDD complet piloté par une seule commande slash.

*Même limite que `/commit-message`, pas de capture vidéo isolée retrouvée pour cette commande. Elle est citée dans le récapitulatif de session 8d281e45 comme faisant partie du travail classé en Section 2.*

## Chevauchement signalé : la commande `/spec`

La commande `/spec` (créée en `d4c3bc8`, « feat: ajoute la commande /spec et son template de spécification », 06/08/2026 17:00) pourrait sembler relever de cette Section 2, une commande personnalisée comme `/commit-message` ou `/component`. Je la classe en Section 3 « Plan Mode & Specs », parce que tout le contenu pédagogique retrouvé à son sujet (structure du template, contenu détaillé d'une spec complète, formulation du prompt d'entrée) enseigne la méthode de rédaction d'une spec, pas la mécanique de création d'une commande slash. Ça correspond à l'intitulé de la Section 3, pas de la Section 2. Voir [`section-3-plan-mode-specs.md`](./section-3-plan-mode-specs.md).

---

**Note de couverture :** sur les 8 sessions analysées, seules bc2538f9 et a056c64e contiennent des leçons vidéo directement liées aux hooks. Aucune session ne montre d'autres sujets typiques de cette section (contexte, autres outils du terminal). Soit ce contenu n'a pas été capturé, soit il correspond aux leçons de la Section 2 non couvertes par une capture d'écran.
