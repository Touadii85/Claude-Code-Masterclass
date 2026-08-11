Plan — Bouton de déconnexion (Navbar)

Contexte

La spec _specs/logout-button.md (branche claude/feature/logout-functionality) demande d'ajouter un bouton de déconnexion dans le composant Navbar : visible uniquement si un utilisateur est connecté, qui termine la session Firebase Auth au clic, sans redirection. Aujourd'hui, AuthContext n'expose que { user, loading } — aucune action de déconnexion n'existe encore dans le code, et Navbar n'a aucune logique d'authentification.

Approche recommandée

1. contexts/AuthContext.tsx — exposer signOut

- Importer signOut as firebaseSignOut depuis firebase/auth.
- Étendre AuthContextValue avec signOut: () => Promise<void>.
- Dans AuthProvider, définir signOut via useCallback(() => firebaseSignOut(auth), []) (référence stable) et l'ajouter à la value du provider.
- Pas de try/catch ici : l'erreur remonte à l'appelant, comme le fait déjà SignupForm.tsx pour ses appels Firebase Auth.
- hooks/useUser.ts n'a besoin d'aucun changement (il retourne déjà tout le contexte).
- Aucun consommateur existant de useUser() en dehors des tests → ajouter ce champ obligatoire ne casse rien.

2. components/Navbar/Navbar.tsx — bouton de déconnexion

- Passer le composant en "use client" (nécessaire pour useUser + useState).
- const { user, loading, signOut } = useUser().
- État local isSigningOut (via useState) pour désactiver le bouton pendant l'appel et éviter les double-clics (edge case listé dans la spec).
- Handler try { setIsSigningOut(true); await signOut() } catch (e) { console.error(...) } finally { setIsSigningOut(false) } — pas de message d'erreur affiché à l'utilisateur (la spec laisse ce point ouvert ; on reste minimal).
- Rendu conditionnel : {!loading && user && (...)} — couvre à la fois "non connecté" et "chargement en cours" en une seule condition.
- Bouton ajouté dans le <ul> existant, à la suite du <li> "Create Heist".
- Icône LogOut de lucide-react (size={16} strokeWidth={2.5}, cohérent avec Plus/Clock8 déjà utilisés).
- Libellé : "Log Out" (anglais), pas "Se déconnecter" — la spec a été rédigée en français mais toute l'UI existante du projet est en anglais (Create Heist, Sign Up, Log in, tagline...). On suit la convention réelle du code plutôt que la langue de rédaction de la spec.
- type="button" explicite sur le <button>.

3. Style : <button> natif + nouvelle classe dans Navbar.module.css (pas d'extension de components/Button)

components/Button/Button.tsx n'accepte pas onClick et son seul style (.btn, fond primary) entrerait en compétition visuelle avec le bouton "Create Heist" déjà en gradient primary/secondary. Navbar.module.css a déjà pour habitude de styler ses propres actions localement (createBtn est un <Link> stylé directement ici, pas un composant partagé). On suit ce même pattern :
- .logoutBtn : style outline discret avec les tokens du thème (border, text-body au repos, virage vers text-error/border-error au survol via le token --color-error déjà déclaré dans app/globals.css).
- .logoutBtn:disabled : opacity-50 cursor-not-allowed, hover neutralisé — même pattern que Button.module.css.

4. tests/components/Navbar.test.tsx — mocker @/hooks/useUser directement

Plutôt que d'envelopper avec AuthProvider + mocks Firebase (déjà fait exhaustivement dans tests/hooks/useUser.test.tsx), on mocke directement @/hooks/useUser :
- vi.mock("@/hooks/useUser", () => ({ useUser: vi.fn() })).
- beforeEach : valeur par défaut { user: null, loading: false, signOut: vi.fn() } (nécessaire aussi pour que les 2 tests existants — heading, lien Create Heist — continuent de fonctionner).
- Nouveaux tests couvrant les 4 cas de la spec :
  a. Utilisateur connecté + loading: false → bouton "Log Out" rendu (getByRole("button", { name: /log out/i })).
  b. user: null → bouton absent (queryByRole → null).
  c. loading: true → bouton absent, même avec un user défini.
  d. Clic sur le bouton (utilisateur connecté) → le mock signOut est appelé une fois.

5. tests/hooks/useUser.test.tsx — un test additionnel léger

Ce fichier mocke déjà firebase/auth. Ajouter un test qui vérifie que signOut exposé par le contexte appelle bien signOut(auth) de firebase/auth — comble le seul trou de couverture laissé par le mock du hook côté Navbar (qui ne teste que le contrat, pas le câblage Firebase réel). Reste un seul test, pas de sur-ingénierie.

Fichiers concernés

- contexts/AuthContext.tsx
- components/Navbar/Navbar.tsx
- components/Navbar/Navbar.module.css
- tests/components/Navbar.test.tsx
- tests/hooks/useUser.test.tsx

Vérification

- npx vitest run — tous les tests (existants + nouveaux) doivent passer.
- npm run lint — aucune erreur ESLint introduite.
- npm run dev puis vérification manuelle dans le navigateur : le bouton "Log Out" apparaît dans la Navbar quand un compte est connecté, disparaît après clic, sans rechargement de page ni redirection.
