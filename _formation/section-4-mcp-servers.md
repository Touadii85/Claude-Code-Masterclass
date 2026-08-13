# Section 4 — MCP Servers

*Cours : Claude Code Masterclass — Section 4 (13/13 leçons, 1h40).*

Cette section couvre un seul serveur MCP réellement documenté par une capture de la vidéo de formation dans les 8 sessions analysées : **Firebase** (plan Firestore + Authentication). Les usages de Figma MCP et Context7 existent bien dans le projet, mais aucune image collée par Ilies ne montre le formateur en train de les expliquer — voir la note en fin de section.

## Le plan Firebase MCP : Firestore + Authentication en mode test

**Sessions source :** 8d281e45 (10/08 matin) et 3bb6cf8f (10/08, suite — la même capture a été collée dans les deux sessions)

**Ce que montre la vidéo :** un terminal Claude Code appartenant au formateur (chemin visible en bas de l'image : `/Users/shaun/Code/Courses/pocket_heist`, à distinguer de l'environnement WSL d'Ilies). Le serveur Firebase MCP vient de proposer un plan en 5 étapes après la commande d'initialisation :
1. **Install Firebase SDK** — ajouter Firebase à `package.json` et créer le fichier de config SDK
2. **Initialize Firestore** — règles de sécurité en mode test (accès ouvert pour le développement)
3. **Deploy Firestore** — `firebase deploy --only firestore`
4. **Enable Authentication** — activer l'authentification Email/Password dans la console Firebase
5. **Implement Auth in App** — ajouter l'initialisation du SDK Auth dans le code

L'image montre ensuite l'appel d'outil MCP concret qui suit l'acceptation du plan : `firebase — Get Firebase SDK Config (MCP)`, avec le prompt de permission standard (« Do you want to proceed? Yes / Yes and don't ask again / No »).

**Ce que le formateur explique :** à quoi ressemble un plan généré automatiquement par un serveur MCP « puissant » comme Firebase MCP — capable de créer de la vraie infrastructure cloud (base de données, authentification) — et pourquoi rester minimaliste dans la demande initiale (mode test uniquement, pas de hosting). Point important signalé par Claude en comparant avec l'environnement d'Ilies : le plugin Firebase MCP a changé de comportement par défaut depuis l'enregistrement de la vidéo (règles moins ouvertes par défaut aujourd'hui) — il fallait donc suivre explicitement la version du formateur pour rester en mode test ouvert.

**Application dans Pocket Heist :** Ilies a suivi ce plan à l'identique dans son propre terminal — installation du SDK Firebase (`npm install firebase`), écriture de `firestore.rules` en mode test ouvert (`allow read, write: if request.time < timestamp.date(2026, 9, 10);`), `firebase.json`, déploiement (`firebase deploy --only firestore`), activation de l'authentification Email/Password, puis création de `lib/firebase/config.ts` — commit `083b5a6` (« ✨ feat: configure Firebase (Firestore + Authentication) », 2026-08-11 10:44).

---

## Note sur Figma MCP et Context7

Le projet utilise bien ces deux autres serveurs MCP concrètement :
- **Figma MCP** — commit `f336a1f` (« ✨ feat: style le bouton Create Heist selon le design Figma », 2026-08-11 01:08), et un tag `figma_component (if used)` ajouté au template de spec, commit `395e229` (« ✨ feat: ajoute la référence Figma optionnelle à la commande /spec », 2026-08-11 01:08).
- **Context7** — la consigne « vérifier la doc via Context7 avant d'écrire du code » a été ajoutée directement dans `CLAUDE.md`, commit `dadbd08` (« 📝 docs: ajoute la consigne de vérification doc via Context7 dans CLAUDE.md », 2026-08-10 12:52).

Mais en vérifiant chaque image des 8 sessions (notamment l'image Figma de la session 8d281e45/3bb6cf8f, qui montre en fait le fichier Figma **personnel** d'Ilies avec le bandeau « View only », pas une capture de la vidéo), aucune n'affiche le formateur en train d'expliquer Figma MCP ou Context7 à l'écran. Ces deux usages ont donc été appliqués sans capture vidéo correspondante dans le lot d'images fourni — pas de « leçon » sourcée pour eux, pour ne pas inventer un contenu qui n'a pas été vérifié.
