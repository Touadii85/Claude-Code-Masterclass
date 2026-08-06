---
description: Créer un fichier de spec de fonctionnalité et une branche à partir d'une idée courte
argument-hint: Description brève de la fonctionnalité
allowed-tools: Read, Write, Glob, Bash(git switch:*)
---

Tu aides à démarrer une nouvelle spec de fonctionnalité pour cette application, à partir d'une idée courte fournie dans l'entrée utilisateur ci-dessous. Toujours respecter les règles et exigences définies dans les fichiers CLAUDE.md lors de la réponse.

Entrée utilisateur : $ARGUMENTS

## Comportement général

Ta tâche est de transformer l'entrée utilisateur ci-dessus en :

- Un titre de fonctionnalité lisible en kebab-case (ex : new-heist-form)
- Un nom de branche Git valide et pas déjà pris (ex : claude/feature/new-heist-form)
- Un fichier de spec markdown détaillé dans le dossier _specs/

Ensuite, enregistrer le fichier de spec sur disque et afficher un court résumé de ce qui a été fait.

## Étape 1. Vérifier la branche actuelle

Vérifier la branche Git actuelle, et arrêter tout le processus s'il y a des fichiers non commités, non indexés (unstaged) ou non suivis (untracked) dans le répertoire de travail. Dire à l'utilisateur de commiter ou de mettre de côté (stash) ses changements avant de continuer, et NE PAS ALLER PLUS LOIN.

## Étape 2. Analyser les arguments

À partir de `$ARGUMENTS`, extraire :

1. `titre_fonctionnalite`
   - Un titre court et lisible, en Title Case.
   - Exemple : "Card Component for Dashboard Stats".

2. `slug_fonctionnalite`
   - Un identifiant (slug) compatible Git.
   - Règles :
     - Minuscules
     - Kebab-case
     - Uniquement `a-z`, `0-9` et `-`
     - Remplacer les espaces et la ponctuation par `-`
     - Fusionner les `-` multiples en un seul
     - Retirer les `-` en début et fin
     - Longueur maximale de 40 caractères
   - Exemple : `card-component` ou `card-component-dashboard`.

3. `nom_branche`
   - Format : `claude/feature/<slug_fonctionnalite>`
   - Exemple : `claude/feature/card-component`.

Si un `titre_fonctionnalite` et un `slug_fonctionnalite` cohérents ne peuvent pas être déduits, demander une clarification à l'utilisateur plutôt que de deviner.

## Étape 3. Basculer sur une nouvelle branche Git

Avant de créer le moindre contenu, basculer sur une nouvelle branche Git en utilisant le `nom_branche` déduit de `$ARGUMENTS`. Si ce nom de branche est déjà pris, ajouter un numéro de version à la fin : ex. `claude/feature/card-component-01`.

## Étape 4. Rédiger le contenu de la spec

Créer un document markdown de spec directement utilisable par le mode plan, et l'enregistrer dans le dossier _specs en utilisant le `slug_fonctionnalite`. Utiliser exactement la structure définie dans le fichier modèle ici : @_specs/template.md. Ne pas ajouter de détails techniques d'implémentation comme des exemples de code.

## Étape 5. Résultat final pour l'utilisateur

Une fois le fichier enregistré, répondre à l'utilisateur avec un court résumé dans ce format exact :

Branche : <nom_branche>
Fichier de spec : specs/<slug_fonctionnalite>.md
Titre : <titre_fonctionnalite>

Ne pas répéter la spec complète dans le chat, sauf si l'utilisateur le demande explicitement. Le but principal est d'enregistrer le fichier de spec et de signaler où il se trouve et quel nom de branche utiliser.
