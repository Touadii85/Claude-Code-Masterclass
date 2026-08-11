Plan — Connexion de LoginForm à Firebase Auth

 Contexte

 La spec _specs/login-form-functionality.md (branche claude/feature/login-form) demande de connecter le composant LoginForm existant à Firebase Authentication. Aujourd'hui, LoginForm.tsx valide les champs puis se contente d'un console.log des identifiants — aucun appel Firebase, aucun message de succès/erreur, aucun état de chargement. Le composant SignupForm sert de modèle de référence pour ce genre d'intégration (déjà connecté à createUserWithEmailAndPassword).

 Décisions de conception

 - Deux états séparés formError et successMessage (pas un état générique unifié) : le flux est simple (try → succès, catch → erreur), un type union ajouterait de l'indirection pour rien.
 - Pas de nouvelle fonction dans AuthContext : comme pour signOut dans Navbar, l'appel signInWithEmailAndPassword se fait directement dans LoginForm. Le contexte se met à jour tout seul via onAuthStateChanged, déjà branché.
 - setLoading(false) dans un finally : contrairement à SignupForm (qui redirige après succès et n'a donc pas besoin de réactiver le formulaire), ici il n'y a pas de redirection — le formulaire doit redevenir actif même après une connexion réussie.
 - role="status" pour le message de succès, role="alert" pour l'erreur : cohérent avec les tests existants qui interrogent déjà role="alert" pour les erreurs, et évite toute ambiguïté entre les deux messages.

 Étapes d'implémentation

 1. components/LoginForm/LoginForm.tsx

 - Importer signInWithEmailAndPassword depuis firebase/auth et auth depuis @/lib/firebase/config.
 - Ajouter les états formError, successMessage (string, défaut "") et loading (boolean, défaut false).
 - handleSubmit devient async. Au début de chaque soumission valide, reset formError et successMessage à "". Après validation des champs (logique inchangée), setLoading(true), puis :
   - try { await signInWithEmailAndPassword(auth, email, password); setSuccessMessage("Login successful") }
   - catch (error) { setFormError(getErrorMessage(errorCode)) } (même idiome d'extraction du code que SignupForm : error instanceof Error && "code" in error ? String(error.code) : "")
   - finally { setLoading(false) }
 - Nouvelle fonction locale getErrorMessage(errorCode: string), calquée sur celle de SignupForm mais avec les codes pertinents pour une connexion : auth/invalid-credential et auth/wrong-password → message générique "identifiants invalides" ; auth/user-not-found → "no account found" ; auth/too-many-requests → message dédié ; défaut → message générique.
 - JSX : afficher {formError && <div className={styles.error} role="alert">{formError}</div>} et {successMessage && <div className={styles.success} role="status">{successMessage}</div>} avant les champs (même emplacement que SignupForm). Input/PasswordInput/Button reçoivent disabled={loading} ; le texte du bouton devient {loading ? "Logging In..." : "Log In"}. Aucun useRouter/router.push — pas de redirection, conformément à la spec.

 2. components/LoginForm/LoginForm.module.css

 Ajouter, par symétrie avec SignupForm.module.css :
 .error {
   @apply bg-error/10 text-error text-sm p-3 rounded mb-4;
 }
 .success {
   @apply bg-success/10 text-success text-sm p-3 rounded mb-4;
 }
 Les tokens --color-error/--color-success existent déjà dans app/globals.css, rien à y changer.

 3. tests/components/LoginForm.test.tsx

 Ajouter en tête : mock de firebase/auth (signInWithEmailAndPassword: vi.fn()).

 Deux tests existants cassent, pas un seul — vérifié en relisant le fichier actuel : le test « logs the credentials when the form is valid » (assertions sur console.log + queryByRole("alert") absent) ET le test « submits when the user presses the Enter key » (assertion sur console.log) dépendent tous les deux du console.log qui disparaît. Les trois tests de blocage (champs vides/manquants) utilisent expect(logSpy).not.toHaveBeenCalled() — cette assertion devient vide de sens (plus rien n'appelle jamais console.log), donc logSpy/beforeEach/afterEach doivent être supprimés entièrement, et ces trois lignes retirées des tests de blocage (le reste de ces tests, la vérification des messages de validation, ne change pas).

 - Test « valid submission » → renommé, vérifie signInWithEmailAndPassword appelé avec (auth, email, password) et screen.findByText("Login successful") affiché.
 - Test « Enter key » → l'assertion console.log est remplacée par la même vérification sur signInWithEmailAndPassword.
 - Nouveau test : échec de connexion (mockRejectedValueOnce avec un code d'erreur) → message d'erreur précis affiché via role="alert".
 - Nouveau test : état de chargement → juste après le clic, bouton désactivé et texte "Logging In...", champs désactivés.
 - Nouveau test : pas de navigation après succès → le formulaire (les champs) reste dans le DOM après le succès, preuve qu'il n'y a pas eu de démontage/redirection.
 - Les tests de rendu, masquage password, format email invalide, lien signup restent inchangés.

 Fichiers concernés

 - components/LoginForm/LoginForm.tsx
 - components/LoginForm/LoginForm.module.css
 - tests/components/LoginForm.test.tsx

 Hors périmètre, inchangés : contexts/AuthContext.tsx, hooks/useUser.ts, components/Navbar/Navbar.tsx, app/globals.css.

 Vérification

 - npx vitest run tests/components/LoginForm.test.tsx puis npx vitest run (suite complète) — tout doit passer.
 - npm run lint — aucune erreur introduite.
 - Test manuel dans le navigateur : connexion avec un compte existant valide → message "Login successful" affiché, pas de navigation, et le bouton "Logout" de la Navbar devient visible (preuve que AuthProvider s'est mis à jour). Connexion avec de mauvais identifiants → message d'erreur précis affiché, on reste sur /login.