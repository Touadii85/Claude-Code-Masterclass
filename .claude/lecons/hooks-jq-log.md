# Leçon — Lire le JSON d'un hook avec jq

## Contexte

Jusqu'ici, le hook `PostToolUse` (voir [`hooks-guide.md`](./hooks-guide.md))
ignorait complètement les données que Claude Code lui envoie : la commande se
contentait d'un `echo` fixe. Cette leçon apprend à **lire** ce JSON en entier,
pour voir sa structure complète avant d'aller y piocher une valeur précise
dans une leçon suivante.

## Rappel express sur JSON

- Un objet JSON est délimité par des accolades `{ }`.
- À l'intérieur : des paires **clé: valeur**, séparées par des virgules. Ex:
  `"tool_name": "Edit"` — la clé est `tool_name`, la valeur est `"Edit"`.
- Une valeur peut être un objet imbriqué, avec ses propres accolades. Ex:
  `tool_input` est un objet, avec sa propre clé `file_path` à l'intérieur.
- Les guillemets `" "` entourent les clés et les valeurs de type texte.

## L'idée du hook

Le hook `PostToolUse` reçoit toujours un JSON sur son **entrée standard**
(stdin) quand Claude Code l'exécute. Ce JSON contient, entre autres, un champ
`tool_input` — pour les outils `Write`/`Edit`, ce champ contient `file_path` :
le chemin du fichier que Claude vient de modifier.

## `jq`, à quoi ça sert

`jq` = un outil qui sait lire du JSON en ligne de commande et en extraire un
morceau précis, un peu comme si tu faisais `monObjet.tool_input.file_path` en
JS, mais depuis le terminal.

Installation (Ubuntu/WSL) :
```bash
sudo apt install jq
```

## La commande à mettre dans le hook

```bash
jq . > tool-use.json
```

- `jq` — lit directement l'entrée standard (stdin) par défaut, pas besoin de
  `cat` devant : Claude Code y envoie le JSON complet de l'événement
  (`session_id`, `cwd`, `hook_event_name`, `tool_name`, `tool_input`,
  `tool_response`, etc.).
- `.` — le filtre **identité** de `jq` : "ne sélectionne rien en particulier,
  garde tout l'objet tel quel". C'est différent de `.tool_input.file_path`,
  qui n'aurait extrait qu'un seul champ.
- `>` — redirige le résultat vers un fichier. Un seul chevron **écrase** le
  fichier à chaque déclenchement (contrairement à `>>` qui aurait accumulé les
  écritures les unes après les autres).
- `tool-use.json` — le fichier créé à la racine du projet, qui contient
  l'objet JSON complet du dernier événement `PostToolUse`.

## Le vrai fichier, annoté

Voici un extrait réel de `tool-use.json`, généré sur ce projet après une
modification de `Navbar.tsx` :

```json
{
  "hook_event_name": "PostToolUse",     // quel événement a déclenché ça
  "tool_name": "Edit",                  // quel outil Claude a utilisé
  "tool_input": {                       // les paramètres donnés à l'outil
    "file_path": ".../Navbar.tsx",      // le fichier touché
    "old_string": "// test du hook jq\n...",  // le texte remplacé
    "new_string": "import { Clock8 }..."      // le texte final
  },
  "tool_response": {                    // le résultat après exécution
    "structuredPatch": [ ... ]          // le diff ligne par ligne
  }
}
```

`tool_input` = ce que Claude a demandé de faire. `tool_response` = ce qui
s'est réellement passé une fois fait. Deux objets imbriqués, chacun avec ses
propres clés.

D'autres champs apparaissent aussi dans le fichier, moins importants pour
nous mais bons à reconnaître :

- `session_id` — identifiant de la conversation en cours
- `cwd` — le dossier du projet où Claude travaille
- `permission_mode` — le mode de permission actif (ex: `acceptEdits`)
- `tool_use_id` — identifiant unique de cette action précise

## Pourquoi c'est utile (la suite)

Une fois qu'on a vu la structure complète du JSON dans `tool-use.json`, on
peut cibler un champ précis — `.tool_input.file_path` — pour enchaîner avec
`prettier` et formater **exactement** le fichier que Claude vient de
modifier. C'est ce qu'on a fait dans le hook final (voir `hooks-plan.md`).

## Recette, dans l'ordre

1. Installer `jq` (`sudo apt install jq`)
2. `/hooks` étant en lecture seule (voir [`hooks-plan.md`](./hooks-plan.md)),
   éditer directement `.claude/settings.local.json` : événement
   `PostToolUse`, matcher `Write|Edit`, commande `jq . > tool-use.json`
3. Déclencher une modification (ex: demander à Claude de changer un titre)
4. Ouvrir `tool-use.json` à la racine pour voir l'objet JSON complet

## Voir aussi

[`hooks-guide.md`](./hooks-guide.md) — structure générale d'un hook.
[`hooks-plan.md`](./hooks-plan.md) — historique du débogage du premier hook.
