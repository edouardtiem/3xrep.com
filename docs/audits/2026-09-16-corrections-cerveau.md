# Corrections du cerveau — sales-buddy, 16 septembre 2026

Périmètre autorisé : étapes 1 à 5. L’étape 6 (alignement général des promesses et corpus durable d’évaluation) reste à part. Les essais dans de vrais comptes Claude et ChatGPT Work ne sont pas réalisés : aucun compte de test disponible. Aucune migration distante ni mise en production effectuée.

## 1. Sources et évolution des preuves

Les extraits doivent être accompagnés du passage original (`sources` + `source_id`, ou champ original correspondant). La présence dans un autre type de source ne suffit pas. Une question et sa réponse exactes, dans cet ordre dans la source, sont nécessaires pour valider `test_pose`. Les étiquettes `piece`, `affirme` et `prospect` ne suffisent plus à produire `su`.

Des règles de contenu conservatrices en français et anglais vérifient chaque pièce. Une citation rejetée ne revient pas comme objection, preuve ou occasion manquée. Une phrase peut porter plusieurs pièces. Une nouvelle déclaration datée et testée peut remplacer la déclaration antérieure du même interlocuteur identifié, sur la même pièce. Des interlocuteurs différents ou des sources non datées restent en désaccord.

Limite : retrouver les mots ne certifie ni l’identité de l’auteur ni la vérité du propos. Le moteur ne comprend pas toutes les formulations possibles. Les passages pertinents doivent être renvoyés à chaque jugement ; le squelette mémorisé ne conserve pas leur histoire intégrale.

## 2. Jugement commun

Audit, prochaine question, objection, revue et planning utilisent le même moteur. Les exigences d’étape sont partagées : une découverte ne déclenche plus une correction de négociation. La revue sait dire `indetermine`. Un dossier sans source ne devient pas solide.

Le contrat de réponse retire les blocs d’appel quand les sources ne le permettent pas. La note sur dix est suspendue faute de barème défini. La formulation finale reste produite par l’assistant hôte : un test du serveur ne garantit pas son obéissance.

## 3. Choix de méthode

Deux décisions séparées : grille du dossier et geste de conversation. Le résultat expose la raison, les informations manquantes, les circonstances de révision, les sources et les adaptations.

| Contexte | Grille retenue par la règle 3xrep |
| --- | --- |
| Cycle court ou contexte inconnu | BANT ; provisoire si contexte incomplet |
| Cycle moyen déclaré | SPICED |
| Cycle long, comité ou plus de deux interlocuteurs | MEDDIC |
| Complexité précédente avec papier ou concurrence | MEDDPICC |

Le contexte de l’affaire prime sur le cycle habituel de l’entreprise. À défaut, les indices textuels et le montant servent seulement d’orientation provisoire. Aucun seuil de montant n’est une preuve.

Le geste dépend du moment : SPIN pour approfondir, CRAC pour une objection, BAC pour une démonstration, contreparties pour une négociation, exploration de l’écart si le problème n’est pas reconnu. Il s’agit d’un guidage explicite, pas de l’automatisation complète de chaque méthode.

SPICED est corrigé : Situation, Pain, Impact, Critical Event, Decision. Economic Buyer n’est pas une sixième lettre. Échéance, critères, décision et papier sont séparés. Le lexique expose les sources disponibles et nomme les adaptations sans source canonique.

La priorité suit d’abord l’objection, puis les preuves nécessaires à l’étape. En découverte, besoin et enjeu passent avant le processus d’achat. Cette politique est une règle produit, pas une vérité universelle des méthodes.

Références : [Winning by Design](https://winningbydesign.com/spiced-framework/), [MEDDICC](https://meddicc.com/meddpicc-sales-methodology-and-process), [Salesforce sur BANT](https://www.salesforce.com/blog/what-is-bant-lead-generation/), [Huthwaite sur SPIN](https://www.huthwaiteinternational.com/spin-methodology).

## 4. Journée et mémoire

Les brouillons de réponse avec source peuvent être autorisés. Cela n’autorise jamais l’envoi. Les séquences marketing restent exclues. Les instants sont triés chronologiquement et le fuseau IANA permet de suivre les changements d’heure. Une date invalide ne devient pas un rendez-vous inventé.

`sources_lues` distingue accès disponible, absence, refus et erreur. Une liste vide ne permet plus de conclure qu’un connecteur manque.

La mémoire exige un identifiant stable du fichier client. Les retours portent cet identifiant et le nom de l’affaire. Plusieurs rendez-vous d’une même affaire ne créent qu’une observation. Des états contradictoires ne sont pas écrasés silencieusement. Le compteur en base est mis à jour atomiquement : au plus une observation par jour UTC tant que le même trou reste ouvert. Il ne mesure ni les appels ni une performance commerciale. Un point résolu remet le compteur à zéro.

## 5. Installation et validation

Les chemins Claude et ChatGPT Work sont séparés sur `/install`. Le serveur accepte une clé Bearer ou une URL privée avec `?key=`. Le chemin Work reste indiqué comme connexion de test : ce n’est pas un plugin OAuth publié.

Guides officiels consultés : [Claude](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp), [ChatGPT](https://developers.openai.com/plugins/deploy/connect-chatgpt), [authentification des plugins OpenAI](https://developers.openai.com/plugins/build/auth).

Vérifications locales :

- `npm test` : 114 tests, dont appels au véritable point d’entrée HTTP MCP en mémoire (initialisation, liste des outils, schémas, clés valides/fausses/absentes, audit et planning).
- `npx tsc --noEmit` : réussi.
- `npm run build` (compilation standard Turbopack) : réussi avec accès réseau aux polices. La variante facultative Webpack échoue sur un import préexistant de `node:crypto` depuis la page d’accueil.
- Analyse ESLint des fichiers modifiés : réussie. L’analyse globale signale deux erreurs préexistantes dans `src/app/da/surface/board.tsx` et `src/app/da/surface-1.1/board.tsx`.
- `scripts/check-brain-memory.mjs` : migration mémoire exécutée dans PostgreSQL embarqué PGlite ; répétition, compteur, remise à zéro, identités distinctes, privilèges et requête de suppression vérifiés. Le planificateur `pg_cron` n’est pas disponible dans PGlite.

Pour rejouer la base sans accès distant : installer `@electric-sql/pglite` dans un dossier temporaire, puis lancer `PGLITE_MODULE=/chemin/du/module/dist/index.js node scripts/check-brain-memory.mjs`. Aucune dépendance ajoutée au produit.

Avant déploiement du code, appliquer `supabase/migrations/20260916200000_brain_reliability.sql` dans un projet de test, puis vérifier la tâche `3xrep-delete-expired-mcp-calls`. Elle supprime les traces âgées de plus de quatorze jours toutes les quinze minutes. Vérifier aussi la procédure `record_judgment_piece` avec le rôle de service. Le nouveau code lit `orgs.sales_context` : la migration doit précéder le code.

Essais encore requis sur chaque plateforme : installer la connexion ; vérifier les outils visibles ; faire lire un dossier fictif via le connecteur du fichier client ; transmettre les sources ; comparer la réponse à celle du moteur ; vérifier le brouillon sans envoi ; proposer une correction sans écriture automatique ; refaire avec droits refusés et listes vides. Ne déclarer l’expérience validée qu’après ces essais.
