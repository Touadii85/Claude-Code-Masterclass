# Guide — Créer un hook Claude Code

## C'est quoi un hook

Un hook = une règle du type *"quand [tel événement arrive dans Claude Code],
exécute automatiquement [telle commande]"*. Ça sert à automatiser des
réactions au travail de Claude : formater du code après une modification,
logger une session, bloquer l'accès à un fichier sensible, etc.

## Où ça se configure

Trois emplacements possibles :

1. **Projet, local** (`.claude/settings.local.json`) — perso, ignoré par Git,
   invisible pour le reste de l'équipe. Celui qu'on utilise dans ce projet.
2. **Projet, partagé** (`.claude/settings.json`) — suivi par Git, actif pour
   toute l'équipe qui clone le projet.
3. **Utilisateur, global** (hors du projet, dans ton dossier personnel) —
   s'applique à tous tes projets sur cette machine, peu importe le dossier.

`/hooks` permet de consulter les hooks déjà configurés, mais pas d'en créer :
c'est un menu en lecture seule. Pour ajouter ou modifier un hook, il faut
éditer le fichier JSON directement.

## La structure JSON, expliquée

```json
{
  "hooks": {
    "PostToolUse": [                    // 1. quel événement écouter
      {
        "matcher": "Write|Edit",        // 2. quel(s) outil(s) déclenche(nt) le hook
        "hooks": [                      // 3. liste des actions à lancer
          {
            "type": "command",          // 4. type d'action : "command" = commande shell
            "command": "echo '{\"systemMessage\": \"...\"}'"  // 5. la commande exécutée
          }
        ]
      }
    ]
  }
}
```

1. **L'événement** — le moment précis où le hook se déclenche. Les trois à
   connaître pour commencer :
   - `PreToolUse` — juste AVANT que l'outil ne s'exécute. Utile pour bloquer
     une action avant qu'elle n'ait lieu.
   - `PostToolUse` — juste APRÈS que l'outil a fini. Utile pour réagir à une
     action déjà faite. C'est celui qu'on utilise.
   - `Stop` — quand la session de chat se termine. Exemple : générer un
     fichier de journal qui résume la session.

   D'autres événements existent, moins fréquents mais bons à connaître :
   `SessionStart` (une session démarre), `UserPromptSubmit` (tu envoies un
   message, avant que Claude le traite), `Notification` (Claude Code affiche
   une notification).
2. **Le matcher** — un filtre. `"Write|Edit"` veut dire "seulement si l'outil
   est Write OU Edit". Vide = tous les outils.
3. **Le tableau `hooks`** — la ou les actions à exécuter quand le matcher
   correspond. Tu peux en mettre plusieurs à la suite.
4. **Le type** — `"command"` pour une commande shell (il existe aussi
   `"prompt"` pour envoyer du texte au modèle, `"http"` pour appeler une API,
   etc.).
5. **La commande** — ce qui s'exécute réellement, en shell classique.

## Deux façons d'exécuter la commande

Il y a deux modes possibles pour une commande de hook :

- **Avec pipes ou `&&`** (ce qu'on a fait pour `prettier`) — la commande passe
  par un shell qui l'interprète. Sur Linux, ce shell est `sh` par défaut, pas
  `bash`. C'est ce qui a cassé notre premier essai : `sh` ne comprend pas la
  syntaxe `[[ ]]`, propre à `bash`. La solution qui marche partout : écrire la
  commande en syntaxe compatible avec n'importe quel shell (voir
  `hooks-plan.md` pour le détail de cette histoire).
- **Sans pipe ni `&&`** — la commande s'exécute directement, sans shell.
  Plus simple, mais on perd les pipes.

## Le piège important à retenir

Si tu veux juste lancer une commande en arrière-plan (formater du code,
écrire un log dans un fichier), un simple `command` suffit, pas besoin de
plus :

```json
"command": "npx prettier --write ."
```

Mais si tu veux **voir un message s'afficher dans le chat** pour confirmer
que le hook a tourné, il faut que ta commande renvoie du JSON avec le champ
`systemMessage` :

```json
"command": "echo '{\"systemMessage\": \"ton message ici\"}'"
```

Un simple `echo "texte"` sans ce format JSON ne s'affiche **pas** de façon
fiable — comportement vérifié avec la version actuelle de Claude Code.
`systemMessage` est le seul champ documenté et garanti visible, à la fois
pour l'utilisateur et pour Claude.

## Les codes de sortie, en détail

Quand une commande shell se termine, elle renvoie toujours un nombre appelé
**code de sortie**. C'est ce nombre qui dit à Claude Code quoi faire du
résultat de ton hook :

| Code de sortie | Ce que Claude Code en fait |
|---|---|
| `0` (succès) | Le `stdout` part dans le mode "transcript", visible avec `Ctrl+O` — mais pas affiché directement dans le chat, sauf via `systemMessage` |
| `2` | Le `stderr` est montré à Claude immédiatement, comme une erreur bloquante |
| Un autre code | Le `stderr` est montré seulement à toi, pas à Claude |

Sur cette version de Claude Code, même `Ctrl+O` n'a pas montré le message de
façon fiable dans nos tests. C'est pour ça qu'on est passé par
`systemMessage`, un mécanisme séparé et garanti (voir section précédente).

## Recette pour en créer un

1. Ouvre `.claude/settings.local.json`
2. Ajoute (ou complète) la clé `"hooks"` au même niveau que `"permissions"`
3. Choisis ton événement (`PostToolUse` pour "après une action",
   `SessionStart` pour "au démarrage", etc. — liste complète visible via
   `/hooks`)
4. Choisis ton matcher (quel outil déclenche ça)
5. Écris ta commande shell — utilitaire (formatage, log) OU avec
   `systemMessage` si tu veux une confirmation visible
6. Sauvegarde, déclenche l'événement (ex: modifie un fichier), vérifie le
   résultat

## Voir aussi

`hooks-plan.md` dans ce même dossier retrace le cheminement complet de
débogage (pourquoi un simple `echo` ne s'affichait pas, la fausse piste avec
`exit 2`, puis la solution finale avec `systemMessage`).
