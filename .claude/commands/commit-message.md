---
description: Créer un message de commit en analysant les diffs git
allowed-tools: Bash(git status:*), Bash(git diff --staged), Bash(git commit:*)
---

## Lancer ces commandes :

```bash
git status
git diff --staged
```

## Ta tâche :

Analyser les changements git stagés ci-dessus et créer un message de commit. Utiliser le présent et expliquer le "pourquoi" du changement, pas seulement le "quoi".

## Types de commit avec emojis :
N'utiliser que les emojis suivants : 

- ✨ `feat:` - Nouvelle fonctionnalité
- 🐛 `fix:` - Correction de bug
- 🔨 `refactor:` - Refactorisation du code
- 📝 `docs:` - Documentation
- 🎨 `style:` - Style/formatage
- ✅ `test:` - Tests
- ⚡ `perf:` - Performance

## Format :
Utiliser le format suivant pour le message de commit :

```
<emoji> <type>: <description_concise>
<corps_optionnel_expliquant_le_pourquoi>
```

## Sortie :

1. Afficher un résumé des changements actuellement stagés
2. Proposer un message de commit avec l'emoji approprié
3. Demander confirmation avant de commiter

NE PAS commiter automatiquement - attendre l'approbation de l'utilisateur, et ne commiter que si l'utilisateur le demande.