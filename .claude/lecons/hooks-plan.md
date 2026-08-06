# Plan — Refaire le hook PostToolUse (Write|Edit)

## Contexte

La vidéo de formation montre un hook `PostToolUse` (matcher `Write|Edit`, commande
`echo "hello"`) dont le résultat s'affiche directement dans le chat sous la forme
`"PostToolUse:Edit hook succeeded: hello"`.

En reproduisant ce hook avec la version actuelle de Claude Code (2.1.223), ce
message ne s'affiche jamais dans le transcript, même avec `Ctrl+O`.

## Ce que dit la documentation officielle actuelle

- Un hook qui se termine avec le code de sortie **`0`** (succès) : le `stdout`
  part uniquement dans le "debug log", **jamais dans le transcript**, et Claude
  ne le voit pas non plus.
- Le **seul cas garanti visible** dans le chat pour `PostToolUse` : sortir avec
  le code **`2`** et écrire sur **stderr** (pas `stdout`). Une ligne
  `"<nom du hook> hook blocking error: <message>"` s'affiche alors dans le
  transcript, et Claude la voit aussi.
- Le comportement montré dans la vidéo (`exit 0` + `stdout` affiché) correspond
  à un comportement non documenté et incohérent de Claude Code, confirmé par
  une issue GitHub (#11224, fermée sans correction). Ce n'est donc pas fiable
  à reproduire tel quel avec la version actuelle.

## Étapes

1. **Effacer le hook actuel** dans `.claude/settings.local.json` (celui avec
   `echo "hello"`, code de sortie `0`).
2. **Recréer le hook** avec la commande suivante, conforme à ce que la doc
   garantit visible :
   ```
   echo "hello" >&2; exit 2
   ```
   (`>&2` envoie le texte sur stderr au lieu de stdout ; `exit 2` est le seul
   code de sortie dont la doc garantit qu'il s'affiche dans le chat)
3. **Déclencher le hook** en modifiant un fichier du projet (`Write` ou `Edit`).
4. **Vérifier ensemble** si une ligne `"... hook blocking error: hello"`
   apparaît dans le transcript, sans dépendre de `Ctrl+O` ni d'un comportement
   non garanti.

## Note (dépassée, voir résultat final ci-dessous)

Une première tentative utilisait `exit 2` + `stderr`, qui affichait le message
avec un label "blocking error" trompeur. Une meilleure solution a été trouvée
ensuite : le champ JSON `systemMessage`.

## Résultat final — validé le 2026-08-06

Le champ `systemMessage` est fait exactement pour ça : un hook qui réussit
normalement (code de sortie `0`) peut renvoyer du JSON sur `stdout` avec un
champ `systemMessage`, affiché à l'utilisateur ET à Claude, sans aucun
détournement de code d'erreur.

Message reçu après une modification de `components/Navbar/Navbar.tsx` :

```
PostToolUse:Edit says: hello
```

Configuration finale dans `.claude/settings.local.json` :

```json
"hooks": {
  "PostToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "command",
          "command": "echo '{\"systemMessage\": \"hello\"}'"
        }
      ]
    }
  ]
}
```

## Deuxième débogage — le hook `prettier`

Le but : lancer `prettier` automatiquement sur le fichier que Claude vient de
modifier, en ciblant `.tool_input.file_path` extrait par `jq`.

**Symptôme** : la commande marchait quand je la lançais moi-même dans le
terminal, mais rien ne se passait quand c'était le hook qui la lançait.
Aucune erreur visible.

**Cause trouvée** : la commande utilisait `[[ "$fp" =~ \.tsx?$ ]]`, une
syntaxe propre à `bash`. Or sur Linux, une commande de hook "avec pipes"
passe par `sh` par défaut, pas `bash`. Sur cette machine, `sh` pointe vers
`dash`, qui ne connaît pas `[[ ]]`. La commande plantait avec un code de
sortie `127`, invisible pour nous (voir le tableau des codes de sortie dans
`hooks-guide.md`).

Un champ `"shell": "bash"` existe dans la doc pour forcer `bash`
explicitement, mais il n'a eu aucun effet observable sur cette version de
Claude Code (2.1.223).

**Solution retenue** : réécrire le test en syntaxe `case ... esac`, qui
marche sous n'importe quel shell, sans dépendre de `bash` :

```bash
jq -r '.tool_input.file_path' | { read fp; case "$fp" in *.ts|*.tsx) npx prettier --write "$fp" ;; esac; }
```

Testé et confirmé : le hook reformate désormais le fichier tout seul après
chaque modification.
