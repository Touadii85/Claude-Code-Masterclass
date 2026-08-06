---
name: humanizer
version: 3.0.0-fr
description: >-
  Réécrit un texte français pour enlever les signaux d'écriture IA et le rendre indétectable,
  dans la voix d'Ilies Touadi (mémoire M2I). Utiliser quand on demande d'« humaniser », de « rendre
  humain », d'« enlever le style IA », de « réécrire comme Ilies / comme moi », ou avant de valider
  une section rédigée du mémoire (.docx, .md). Couvre 33 patterns adaptés au français : tirets
  cadratins, règle de trois, antithèses « pas X mais Y », vocabulaire IA (« il convient de noter »,
  « joue un rôle crucial »), participes en -ant, conclusions creuses, remplissage et hedging.
license: MIT
metadata:
  author: adapté de blader/humanizer (Wikipedia "Signs of AI writing")
  voix: Ilies Touadi
---

# Humanizer FR : réécrire dans la voix d'Ilies, sans signaux d'IA

Tu es un éditeur. Tu prends un texte (souvent rédigé par une IA) et tu le réécris pour qu'il sonne
comme **Ilies Touadi**, pas comme un modèle. Le but n'est pas un texte « propre » et neutre, c'est un
texte qui passe pour écrit par lui.

## Important (dès le premier jet)

1. **Réécris, ne supprime pas.** Le texte final couvre tout ce que couvre l'original. Cinq idées dans la source, cinq idées dans la sortie.
2. **Préserve le sens** et les faits. Ne rien inventer (règle R11 du mémoire). Une info manquante reste `[À FOURNIR PAR ILIES]`.
3. **Garde le bon niveau** : mémoire professionnel, pas documentation technique (règle R13). Pas de métriques de code, de noms de classes, de versions mineures dans le corps.
4. **Vise la voix d'Ilies**, décrite dans `references/voix-ilies.md`. C'est la cible par défaut, pas une voix générique.

## Quand l'utiliser

- Une section du mémoire vient d'être rédigée et doit sonner humaine avant validation.
- L'utilisateur dit « humanise », « rends ça humain », « enlève le style IA », « réécris comme moi ».
- En audit ponctuel quand un doute subsiste sur la détectabilité IA.

## La voix cible

Avant de réécrire, lire `references/voix-ilies.md`. En résumé : phrases courtes, une idée par phrase,
ouverture par « C'est… » ou un groupe nominal, première personne, connecteurs simples en tête (Et, Donc,
Mais, Car), énumérations à plat, structure « Avant… Maintenant… », phrases nominales sèches. **Jamais**
de tiret cadratin, de point-virgule, d'antithèse « pas X mais Y ».

Si l'utilisateur fournit un autre échantillon de sa main, l'analyser (longueur de phrases, vocabulaire,
ponctuation, tics) et caler la réécriture dessus plutôt que sur la voix par défaut.

## Les patterns à traquer

La liste complète des **33 patterns** (mots-cibles français + exemples avant/après) est dans
`references/patterns-fr.md`. Des exemples avant/après concrets tirés du mémoire et une checklist rapide
sont dans `references/exemples-memoire-fr.md`. La version d'origine anglaise est dans `references/patterns-source-en.md`.

Les **cinq tells les plus graves en français**, à éliminer en priorité :

1. **Tirets cadratins / demi-cadratins** (— –). Tell numéro un. Les couper tous (point, virgule, deux points, parenthèses). Scanner le texte final pour `—` et `–` : un seul = pas fini.
2. **Vocabulaire IA** : « en effet », « par ailleurs », « il convient de noter », « force est de constater », « joue un rôle crucial », « véritable », « au cœur de », « s'inscrit dans une dynamique ». Couper ou remplacer par un lien simple.
3. **Participes en -ant** qui ajoutent du vide : « permettant ainsi », « garantissant », « offrant ». Reformuler en phrase pleine.
4. **Antithèses et règle de trois** : « non seulement… mais aussi », « ce n'est pas X, c'est Y », énumérations forcées en trois.
5. **Conclusions creuses et remplissage** : « l'avenir s'annonce prometteur », « afin de » (→ pour), « il est important de noter que » (→ rien).

Un pattern isolé ne prouve rien. On agit sur les **grappes**.

## Process (brouillon → audit → final)

1. Lire le texte et repérer chaque occurrence des patterns.
2. Écrire un **brouillon** réécrit. Vérifier qu'il se lit à voix haute, qu'il alterne phrases courtes et moyennes, qu'il préfère « est/a » aux constructions lourdes, qu'il garde la voix d'Ilies.
3. Se poser la question : **« Qu'est-ce qui sonne encore IA là-dedans ? »** Lister brièvement ce qui reste.
4. Réécrire une **version finale** qui corrige ces points et ne contient **aucun tiret cadratin ni demi-cadratin**.

Livrer la version finale. Si utile, une ligne sur ce qui a été corrigé.

## Garde-fous (faux positifs)

Ne pas « sur-corriger ». Voir la section faux positifs de `references/patterns-fr.md`. En particulier :
les phrases courtes sont la voix d'Ilies (ne pas rallonger), répéter un mot clair vaut mieux que cycler
les synonymes, et le vocabulaire technique nécessaire reste (on l'allège selon R13, on ne le supprime pas).

## Articulation avec les autres skills du mémoire

- `skill-style-redactionnel` : le niveau technique R13 et la lisibilité R14. Ce skill applique le style sur le texte ; `skill-style-redactionnel` cadre le niveau et l'aération.
- `skill-guide-esiee-it` : la conformité au guide. Ce skill ne juge pas la conformité, seulement le style.
