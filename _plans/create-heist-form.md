Plan — Formulaire "Create Heist"

 Contexte

 app/(dashboard)/heists/create/page.tsx est une coquille vide. La spec validée (_specs/create-heist-form.md) demande un formulaire fonctionnel qui écrit un document dans la collection Firestore heists, en s'appuyant sur CreateHeistInput
 (déjà défini dans types/firestore/heist.ts), avec un champ "Assigné à" peuplé depuis la collection users (en excluant l'utilisateur connecté), createdBy/createdByCodename déduits automatiquement de l'utilisateur connecté, et
 createdAt/deadline/finalStatus calculés côté code, jamais saisis.

 Décisions techniques (justifiées)

 A. Écriture Firestore sans .withConverter(heistConverter). heistConverter.toFirestore attend Partial<Heist> (createdAt/deadline en Date), alors que CreateHeistInput.createdAt est un FieldValue (serverTimestamp()). Les deux types sont
 incompatibles pour l'écriture. On écrit donc directement addDoc(collection(db, COLLECTIONS.HEISTS), input) avec input: CreateHeistInput, sans converter. heistConverter n'est pas modifié : il reste prévu pour de futures lectures de
 heists (fromFirestore convertit les Timestamp en Date), hors périmètre ici.

 B. Lecture des users : filtrage client, pas de requête avec inégalité. getDocs(collection(db, COLLECTIONS.USERS).withConverter(userConverter)), puis .filter(u => u.id !== user.uid) côté client. Évite un index composite Firestore pour
 une simple exclusion.

 C. Un composant CreateHeistForm dédié, pas de logique dans la page. Le projet a déjà ce pattern établi pour ses deux seuls autres formulaires : app/(public)/signup/page.tsx est une coquille fine (<h1
 className="form-title">…</h1><SignupForm />) et toute la logique (state, validation, Firestore, redirection) vit dans components/SignupForm/SignupForm.tsx. Même chose pour LoginForm. On suit ce pattern à l'identique pour rester cohérent
 avec components/<Nom>/<Nom>.tsx + .module.css + index.ts, et pour que les tests vivent dans tests/components/ en miroir de tests/components/SignupForm.test.tsx (comme documenté dans CLAUDE.md).

 D. Textarea en composant séparé, pas une extension d'Input. Input est fortement typé autour de <input>/ChangeEvent<HTMLInputElement>. Le projet a déjà ce précédent avec PasswordInput, un composant à part plutôt qu'une variante d'Input.
 Textarea reprend le même style visuel (.field/.label/.error, mêmes attributs ARIA).

 E. types/firestore/user.ts minimal. Seuls User (document { id, codename }, forme déjà écrite dans SignupForm.tsx) et userConverter sont créés, en suivant la convention de .claude/skills/firestore-schemas/Skill.md. Pas de
 CreateUserInput/UpdateUserInput : rien ne les utilise dans ce périmètre (l'écriture du doc users/{uid} à l'inscription reste un setDoc non typé, inchangée).

 Fichiers à créer / modifier

 1. types/firestore/user.ts (nouveau) — User { id: string; codename: string } + userConverter (même forme que heistConverter).
 2. types/firestore/index.ts (modifié) — ajoute export * from "./user" et USERS: "users" dans COLLECTIONS.
 3. components/Select/ (nouveau : Select.tsx, Select.module.css, index.ts) — props id, label, value, onChange, options: {value,label}[], placeholder?, required?, error?, disabled?, même structure ARIA qu'Input (aria-invalid,
 aria-describedby, role="alert" sur l'erreur).
 4. components/Textarea/ (nouveau : Textarea.tsx, Textarea.module.css, index.ts) — mêmes props qu'Input mais pour <textarea> (ChangeEvent<HTMLTextAreaElement>, rows?).
 5. components/CreateHeistForm/ (nouveau : CreateHeistForm.tsx, CreateHeistForm.module.css, index.ts) — tout le comportement (détaillé ci-dessous).
 6. app/(dashboard)/heists/create/page.tsx (réécrit, reste un composant serveur, pas de "use client") :
 import CreateHeistForm from "@/components/CreateHeistForm"

 export default function CreateHeistPage() {
   return (
     <div className="center-content">
       <div className="page-content">
         <h2 className="form-title">Create a New Heist</h2>
         <CreateHeistForm />
       </div>
     </div>
   )
 }
 7. tests/components/CreateHeistForm.test.tsx (nouveau, miroir de tests/components/SignupForm.test.tsx).

 components/CreateHeistForm/CreateHeistForm.tsx — comportement détaillé

 "use client". Reprend le pattern exact de SignupForm/LoginForm : un useState par champ, un useState d'erreur par champ, un useState d'erreur globale (role="alert"), un seul useState(false) pour loading (texte du bouton + disabled, pas
 LoadingSpinner qui est réservé au plein écran des layouts).

 - useUser() pour user.uid/user.displayName (l'auth est déjà garantie par app/(dashboard)/layout.tsx).
 - Au montage (useEffect), charge les utilisateurs assignables :
 const usersRef = collection(db, COLLECTIONS.USERS).withConverter(userConverter)
 const snapshot = await getDocs(usersRef)
 const others = snapshot.docs.map(d => d.data()).filter(u => u.id !== user.uid)
 - États dérivés : loadingUsers (true initialement), usersError (échec du fetch), assignableUsers: User[].
 - Rendu conditionnel, dans cet ordre :
   a. loadingUsers → message "Loading available agents..." (<p>, pas de LoadingSpinner).
   b. usersError → message d'erreur (role="alert").
   c. assignableUsers.length === 0 → message "No other agents are available yet. Invite someone to join Pocket Heist before creating a heist." (couvre à la fois collection vide et collection ne contenant que l'utilisateur connecté,
 puisque le filtre l'exclut).
   d. Sinon → le formulaire.
 - Champs du formulaire : Input (Title), Textarea (Description), Select (Assigned To — options = assignableUsers.map(u => ({ value: u.id, label: u.codename })), placeholder="Select an agent").
 - Validation au submit (e.preventDefault()) : title/description non vides (.trim()), un agent sélectionné. Si erreur, affichage inline, aucun appel réseau.
 - Soumission :
 const DEADLINE_DELAY_MS = 48 * 60 * 60 * 1000
 const deadline = new Date(Date.now() + DEADLINE_DELAY_MS) // calculé au submit, pas au montage
 const assignee = assignableUsers.find(u => u.id === assignedTo)

 const input: CreateHeistInput = {
   title: title.trim(),
   description: description.trim(),
   createdBy: user.uid,
   createdByCodename: user.displayName ?? "",
   assignedTo: assignee.id,
   assignedToCodename: assignee.codename,
   createdAt: serverTimestamp(),
   deadline,
   finalStatus: null,
 }
 await addDoc(collection(db, COLLECTIONS.HEISTS), input)
 router.push("/heists")
 - Erreur d'écriture → message global, loading repasse à false, pas de redirection.

 CreateHeistForm.module.css : mêmes classes que SignupForm.module.css (.form, .error) + .message/.messageError pour les états de chargement/vide, avec @reference "../../app/globals.css";.

 tests/components/CreateHeistForm.test.tsx

 Mocks (aucun mock firebase/firestore n'existe encore dans le repo — premier du genre) :
 vi.mock("next/navigation", () => ({ useRouter: () => ({ push: pushMock }) }))
 vi.mock("@/hooks/useUser", () => ({ useUser: vi.fn() }))
 vi.mock("@/lib/firebase/config", () => ({ db: {} }))
 vi.mock("firebase/firestore", () => ({
   collection: vi.fn(() => ({ withConverter: vi.fn().mockReturnThis() })),
   getDocs: vi.fn(),
   addDoc: vi.fn(),
   serverTimestamp: vi.fn(() => "SERVER_TIMESTAMP"),
 }))
 Cas à couvrir :
 - Affiche les champs, exclut l'utilisateur connecté de la liste "Assigned To".
 - Affiche le message "no other agent" quand la liste filtrée est vide.
 - Bloque la soumission et affiche les 3 erreurs si les champs requis sont vides (addDoc jamais appelé).
 - Soumission valide : addDoc appelé avec les bons champs (createdBy, createdByCodename, assignedTo, assignedToCodename, createdAt = mock du serverTimestamp, finalStatus: null, deadline instance de Date), puis redirection vers /heists.
 - État de chargement : le bouton passe à "Creating Heist..." et devient disabled pendant l'attente de addDoc.
 - Échec de addDoc → message d'erreur affiché, pas de redirection.

 Vérification

 npx vitest run tests/components/CreateHeistForm.test.tsx
 npx vitest run                # suite complète, non-régression
 npx tsc --noEmit              # attention particulière à addDoc(collection(...), input) et getDocs avec userConverter
 npm run lint

 Vérification manuelle (npm run dev) :
 1. Se connecter, aller sur /heists/create.
 2. Vérifier que "Assigned To" liste les codenames des autres utilisateurs Firestore, sans le sien.
 3. Soumettre vide → 3 erreurs inline, aucune requête réseau.
 4. Remplir et soumettre → bouton "Creating Heist..." désactivé, puis redirection vers /heists.
 5. Vérifier le document créé dans Firestore (heists) : createdAt/deadline en Timestamp (deadline ≈ +48h), finalStatus: null, createdBy/createdByCodename corrects.
 6. Couper le réseau juste avant submit → message d'erreur global, bouton réactivé.
 7. Ne laisser qu'un seul utilisateur (soi-même) dans users → recharger la page → message de remplacement au lieu du formulaire.

 Fichiers critiques

 - components/CreateHeistForm/CreateHeistForm.tsx
 - app/(dashboard)/heists/create/page.tsx
 - types/firestore/user.ts
 - types/firestore/index.ts
 - components/Select/Select.tsx
 - components/Textarea/Textarea.tsx
 - tests/components/CreateHeistForm.test.tsx