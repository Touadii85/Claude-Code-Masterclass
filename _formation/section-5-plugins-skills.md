# Section 5 : Plugins & Skills

*Cours : Claude Code Masterclass, Section 5 (6/7 leçons, 46 min).*

Cette section du cours n'a laissé aucune trace directe dans les 8 sessions analysées. Aucune des images collées ne montre le formateur en train d'expliquer la notion de « Skill » ou de « Plugin » Claude Code (créer un fichier `SKILL.md`, installer un plugin, parcourir un marketplace, etc.).

## Aucune leçon vidéo identifiée pour cette section

Après lecture des 8 rapports et vérification visuelle des images candidates, rien ne correspond à la Section 5 telle que décrite dans la table des matières Udemy.

**Ce qui a été vérifié et écarté :**

- **Le skill `.claude/skills/firestore-schemas/Skill.md`**, créé par Claude lui-même dans le commit `241a4cb` (« update heist type », 12/08 12:26) pendant la génération des types Firestore, puis étendu dans `6b9f2ec` (« feat: formulaire Create Heist », 12/08 16:19) après la découverte d'un bug de typage (`FirestoreDataConverter` attendait `WithFieldValue<X>` et non `Partial<X>`), documenté après coup pour éviter que le bug se reproduise. Bonne pratique appliquée par Claude, mais aucune image collée ne montre le formateur créer ou expliquer ce mécanisme de skill. L'image de la session 62cf38a7 (et sa quasi-copie dans ecc9fb7c) montre juste le texte d'un prompt sur les champs du document Firestore `heist`, rien sur la notion de skill elle-même. Cette leçon appartient plutôt à la [Section 4 (MCP Servers / Firebase)](./section-4-mcp-servers.md), ou reste une pratique interne à Claude, pas un contenu de la Section 5.

- **Les commandes `/component` et `/commit-message`**, présentes dans `.claude/commands/` (créées le 06/08). Le récapitulatif de la session 8d281e45 les classe lui-même, via le sommaire réel du cours affiché à l'écran, sous « Section 2 : Commands, Context, Tools & Hooks ». Pas sous Plugins & Skills. Ce sont des commandes personnalisées (custom slash commands), un mécanisme distinct des skills. Voir [`section-2-commands-context-tools-hooks.md`](./section-2-commands-context-tools-hooks.md).

- **La commande `/spec` (commit `d4c3bc8`)**, même chose. Aucune image des 8 sessions ne montre sa création depuis la vidéo. Les seules leçons vidéo captées à son sujet portent sur le contenu des specs (template, sections, formulation), qui relève de la [Section 3 (Plan Mode & Specs)](./section-3-plan-mode-specs.md), déjà couverte ailleurs.

- **Les hooks `PostToolUse`** (sessions bc2538f9 et a056c64e), bien documentés, mais explicitement Section 2, pas Plugins & Skills.

## Conclusion

Aucune leçon confirmée pour cette section. Les seuls objets du projet qui portent le nom « skill » (`.claude/skills/firestore-schemas/`, `.claude/skills/humanizer/`) ou qui ressemblent à des plugins ne sont pas rattachables à une capture vidéo. Soit ce sont des initiatives autonomes de Claude, soit ils appartiennent aux Sections 2, 3 ou 4 déjà traitées ailleurs dans ce dossier. Si le formateur a bien consacré 46 minutes à ce sujet dans le cours, je ne l'ai pas encore suivi, ou pas collé de capture, au moment des 8 sessions couvertes ici.
