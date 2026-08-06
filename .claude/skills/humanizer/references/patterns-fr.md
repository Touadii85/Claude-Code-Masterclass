# Les 33 patterns d'écriture IA — adaptés au français

> Traduction et adaptation française des 33 patterns du repo `blader/humanizer` (source anglaise dans
> `patterns-source-en.md`). Mots-cibles et exemples orientés mémoire professionnel. Numérotation conservée.
> Un seul pattern isolé ne prouve rien : on traque les **grappes**.

## Contenu

### 1. Emphase indue sur l'importance, l'héritage, les grandes tendances
**Mots-cibles :** joue un rôle crucial / clé / central / majeur, témoigne de, s'inscrit dans une dynamique, marque un tournant, au cœur de, à l'ère du numérique, dans un monde en constante évolution, constitue une étape décisive.
**Avant :** Ce projet s'inscrit dans une dynamique plus large de transformation numérique, marquant un tournant décisif dans l'évolution de l'entreprise.
**Après :** Le projet sert à centraliser les contacts des sites. C'était sa seule fonction au départ.

### 2. Emphase indue sur la notoriété
**Mots-cibles :** reconnu, de référence, leader sur son marché, acteur incontournable, forte présence.
**Avant :** Wire Group est un acteur incontournable, reconnu sur son marché.
**Après :** Wire Group installe la fibre, l'IRVE et les courants faibles. Une vingtaine de personnes en interne.

### 3. Analyses superficielles en « -ant » (participe présent)
**Mots-cibles :** permettant de, offrant ainsi, garantissant, soulignant, mettant en avant, favorisant, assurant.
**Problème :** l'IA accroche des participes présents pour ajouter de la fausse profondeur.
**Avant :** L'outil clone les sites en parallèle, permettant ainsi un gain de temps considérable et garantissant une meilleure productivité.
**Après :** L'outil clone les sites en parallèle. Dix sites passaient de plusieurs heures à quelques minutes.

### 4. Langage promotionnel / publicitaire
**Mots-cibles :** véritable, riche, robuste, puissant, innovant, à la pointe, sur mesure, clé en main (hors sens propre), incontournable.
**Avant :** Une solution véritablement innovante, robuste et à la pointe de la technologie.
**Après :** Une application en PHP, déployable par simple copie de fichiers.

### 5. Attributions vagues / mots fuyants
**Mots-cibles :** les experts s'accordent, il est généralement admis, de nombreuses études montrent, on estime que, certains observateurs.
**Avant :** Il est généralement admis que l'IA améliore la productivité des développeurs.
**Après :** Sur le duplicateur, j'ai mesuré le gain moi-même : dix sites en deux minutes le 3 septembre 2025.

### 6. Sections formulaïques « défis et perspectives »
**Mots-cibles :** malgré les défis, en dépit des obstacles, des perspectives prometteuses, vers de nouveaux horizons.
**Avant :** Malgré les défis rencontrés, le projet continue de se développer vers de nouveaux horizons.
**Après :** Le projet n'a pas été livré faute de temps. Il sera repris plus tard avec l'IA.

## Langage et grammaire

### 7. Vocabulaire « IA » suremployé
**Mots-cibles :** en effet, par ailleurs, de plus, ainsi, notamment, il convient de noter, force est de constater, au demeurant, in fine, en somme, riche, véritable, levier, pierre angulaire, écosystème (figuré).
**Problème :** ces mots co-apparaissent et signent le texte. Les couper ou les remplacer par des liens simples (et, mais, donc, alors).
**Avant :** En effet, il convient de noter que cet outil constitue un véritable levier. Par ailleurs, force est de constater son efficacité.
**Après :** Cet outil fait gagner du temps. Et il marche.

### 8. Évitement de « être » / « avoir » (copule)
**Mots-cibles :** constitue, représente, se présente comme, fait figure de, s'impose comme, se révèle être, dispose de, se dote de, bénéficie de.
**Avant :** L'application se présente comme une solution de sauvegarde et dispose de dix modules.
**Après :** L'application sauvegarde et restaure les sites. Elle a dix modules.

### 9. Parallélismes négatifs et négations en fin de phrase
**Mots-cibles :** non seulement… mais aussi, ce n'est pas seulement X c'est Y, il ne s'agit pas tant de X que de Y, …, sans le moindre effort.
**Avant :** Ce n'est pas seulement un outil, c'est une nouvelle façon de travailler.
**Après :** Cet outil a changé ma façon de travailler.

### 10. Règle de trois
**Problème :** l'IA force les idées en groupes de trois pour faire complet.
**Avant :** Le pilotage demande de la rigueur, de la méthode et de la discipline.
**Après :** Le pilotage demande de la rigueur. Surtout de vérifier ce que l'IA produit.

### 11. Variation élégante (cycle de synonymes)
**Problème :** l'IA évite la répétition à tout prix et fait tourner les synonymes.
**Avant :** L'agent migre le site. Le programme déploie les fichiers. L'outil réécrit les adresses. Le dispositif nettoie.
**Après :** L'agent migre le site. Il déploie les fichiers, réécrit les adresses et nettoie à la fin.

### 12. Fausses gammes (« de X à Y »)
**Avant :** De la conception au déploiement, de la première ligne de code à la mise en production, tout a évolué.
**Après :** J'ai géré le projet de bout en bout : conception, développement, tests, maintenance.

### 13. Voix passive et fragments sans sujet
**Avant :** Aucune configuration n'est requise. Les sauvegardes sont conservées automatiquement.
**Après :** Tu n'as rien à configurer. L'application garde chaque sauvegarde.

## Style

### 14. Tirets cadratins (—) et demi-cadratins (–) : les couper
**Règle dure :** le texte final ne contient AUCUN tiret cadratin ni demi-cadratin. C'est le tell IA le plus fiable. Remplacer par, dans l'ordre : un point, une virgule, deux points, des parenthèses, ou reformuler. Vérifier aussi les ` — ` espacés et les ` -- `.
**Avant :** L'IA fait gagner du temps — mais sans contrôle — la qualité chute.
**Après :** L'IA fait gagner du temps. Mais sans contrôle, la qualité chute.
**Avant de rendre le texte, le scanner pour `—` et `–`. Un seul = pas fini.**

### 15. Gras à outrance
**Avant :** Il combine les **OKR**, les **KPI** et la **gouvernance des agents**.
**Après :** Il combine les OKR, les KPI et la gouvernance des agents.

### 16. Listes à en-tête en gras
**Avant :**
> - **Performance :** la performance a été améliorée.
> - **Sécurité :** la sécurité a été renforcée.
**Après :** L'application est plus rapide et plus sûre, avec une vérification avant chaque restauration.

### 17. Capitales dans les titres (Title Case)
**Avant :** ## Pilotage Du Projet Et Conduite Du Changement
**Après :** ## Pilotage du projet et conduite du changement

### 18. Émojis
Les retirer du corps du mémoire et des titres.

### 19. Guillemets courbes vs droits
En français, garder les **guillemets français** « … ». Éviter le mélange `"…"` / `“…”` incohérent. (Pattern mineur, ne le signaler que groupé avec d'autres.)

## Communication

### 20. Artefacts de chatbot
**Mots-cibles :** J'espère que cela vous aide, Bien sûr !, Voici un aperçu de…, N'hésitez pas à…, Souhaitez-vous que je…, Voulez-vous que je continue ?
**Avant :** Voici une présentation de la mission. J'espère que cela vous aide !
**Après :** (commencer directement par le contenu de la mission.)

### 21. Avertissements de coupure / comblement spéculatif
**Mots-cibles :** à ma connaissance, d'après les informations disponibles, bien que les détails soient limités, il est probable que, on peut supposer que.
**Avant :** Bien que les détails soient limités, on peut supposer que le gain de temps a été important.
**Après :** Le gain de temps n'est pas encore chiffré. (à fournir) — ou couper la phrase.

### 22. Ton flatteur / servile
**Avant :** Excellente remarque, vous avez tout à fait raison sur ce point essentiel.
**Après :** (répondre directement, sans flatterie.)

## Remplissage et hedging

### 23. Phrases de remplissage
- « afin de / dans le but de » → « pour »
- « en raison du fait que » → « parce que »
- « à l'heure actuelle » → « aujourd'hui »
- « il est important de noter que les données montrent » → « les données montrent »
- « au niveau de la sécurité » → « pour la sécurité »
- « disposer de la capacité de traiter » → « pouvoir traiter »

### 24. Hedging excessif
**Avant :** Il pourrait potentiellement être envisagé que cela ait peut-être un certain effet.
**Après :** Cela peut avoir un effet.

### 25. Conclusions positives génériques
**Avant :** En somme, l'avenir s'annonce prometteur et de belles perspectives se dessinent.
**Après :** Prochaine étape : déployer l'agent sur un premier site client réel.

### 26. Paires de mots à trait d'union en excès
En français : éviter les calques anglais (« data-driven », « end-to-end », « client-facing »). Préférer une formule française simple. Garder le trait d'union français normal quand il est correct (« sous-partie », « porte-clés »).

### 27. Tropes d'autorité persuasive
**Mots-cibles :** au fond, en réalité, la vraie question est, ce qui compte vraiment, fondamentalement, le véritable enjeu.
**Avant :** Au fond, la vraie question est celle de la maîtrise.
**Après :** La question, c'est de garder la maîtrise du projet.

### 28. Annonces et balisage
**Mots-cibles :** plongeons dans, explorons, penchons-nous sur, voyons ensemble, sans plus attendre, décortiquons.
**Avant :** Plongeons dans le fonctionnement de l'agent de migration.
**Après :** L'agent de migration part d'une sauvegarde compressée.

### 29. En-têtes fragmentés
**Problème :** un titre suivi d'une phrase qui ne fait que répéter le titre.
**Avant :** ## Les résultats\n\nVoici les résultats.\n\nL'agent migre un site en quelques minutes.
**Après :** ## Les résultats\n\nL'agent migre un site en quelques minutes.

### 30. Écriture ancrée sur le « diff »
**Problème :** décrire ce qui a changé plutôt que ce que la chose est. Hors changelog, le texte doit se lire sans connaître l'ancienne version.
**Avant :** Cette fonction a été ajoutée pour remplacer l'ancienne approche.
**Après :** Cette fonction réécrit les adresses du site en une passe.

### 31. Chutes fabriquées / drame en staccato
**Problème :** enchaîner des fragments très courts pour fabriquer du drame. Une phrase courte pour appuyer, d'accord. Une rafale, non.
**Avant :** Puis l'IA est arrivée. Sans prévenir. Sans limite. Tout a changé.
**Après :** L'IA est arrivée avec Cursor. J'ai gagné du temps, mais la qualité restait fragile sans tests.

### 32. Formules d'aphorisme
**Mots-cibles :** X est le Y de Z, X devient un piège, le langage de, la pierre angulaire de, l'ADN de.
**Avant :** Le pilotage est le langage de la maîtrise.
**Après :** C'est le pilotage qui garde la maîtrise quand on délègue à l'IA.

### 33. Ouvertures rhétoriques conversationnelles
**Mots-cibles :** Honnêtement ?, Soyons honnêtes, Disons-le, La vérité c'est que, Le truc c'est que (en accroche théâtrale).
**Avant :** Est-ce que ça valait le coup ? Honnêtement ? Ça dépend.
**Après :** Ça valait le coup sur les délais. Moins sur la qualité, faute de tests.

## Faux positifs (NE PAS corriger)

- **Vocabulaire technique précis** quand il est juste (R13 dit de l'alléger, pas de le supprimer s'il est nécessaire).
- **Un seul tiret** chez un auteur humain : ici c'est interdit quand même (voix d'Ilies), mais ne pas « halluciner » des tells partout.
- **Phrases courtes** : c'est la voix d'Ilies, pas un défaut. Ne pas rallonger.
- **Répétition d'un mot clair** : préférable au cycle de synonymes.

Voir `voix-ilies.md` pour la cible de réécriture et `patterns-source-en.md` pour la version d'origine.
