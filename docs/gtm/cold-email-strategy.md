# Acquisition outbound — stratégie actuelle

> Statut : stratégie de test retenue, campagne à préparer dans Smartlead. Aucun envoi n’est autorisé par cette documentation seule. La séquence Gojiberry est obsolète et ne doit pas être reprise.

## Décision

Tester le cold email américain avec Smartlead comme moteur d’envoi et d’orchestration. La campagne vend la stratégie par affaire de 3xrep : à partir du contexte réel d’un deal, construire comment obtenir la prochaine preuve et faire avancer la décision — qui impliquer, comment y accéder, quoi demander ou écrire et comment réagir.

Fil narratif central : partir d’un blocage concret autour du décideur, puis montrer que 3xrep aide à choisir la prochaine étape tout au long du cycle de vente, sur une affaire ou plusieurs.

Ne pas présenter 3xrep comme un séquenceur, une boîte blanche Smartlead, un simple coach IA ou un dashboard. Le produit prépare le jugement et les prochaines conversations; il n’envoie pas de message au prospect à la place de l’utilisateur.

## ICP et personas

Cohorte initiale : entreprises américaines B2B SaaS, logiciel ou services technologiques, environ 20–300 employés (filtre de départ, pas vérité de marché), avec vente consultative et plusieurs parties prenantes. Il faut un CRM ou des notes commerciales et assez de contexte pour essayer le produit sur une vraie affaire. Priorité aux équipes qui utilisent déjà ChatGPT ou Claude au travail si c’est vérifiable.

Deux campagnes distinctes :

| Segment | Part de départ | Personne ciblée | Tension à tester |
| --- | ---: | --- | --- |
| Représentants | 70 % | Account Executive / Senior AE | Je vois que l’affaire bloque, mais je ne sais pas comment obtenir concrètement ce qui manque. |
| Managers | 30 % | Head of Sales / VP Sales / Sales Director | Je ne peux pas construire la stratégie de chaque affaire avec chaque représentant chaque jour. |

Contacter une seule personne par entreprise dans le premier passage. N’activer le multithreading qu’après évaluation des réponses et activation de l’arrêt entreprise dans Smartlead.

## Approche signal-based

Le signal répond à « pourquoi cette personne, pourquoi maintenant ? ». Exemples : embauche d’AE ou de leadership commercial, expansion annoncée, publication récente sur un problème de pipeline, négociation, accès au décideur ou coaching, changement de processus publiquement annoncé, ou recrutement qui révèle une vente complexe.

Pour chaque prospect, garder l’URL source, la date, le fait exact et le lien avec l’angle choisi. N’affirmer que ce que la source permet de vérifier. Si aucun signal fiable n’existe, exclure le contact du lot signal-based ou utiliser le repli générique en l’étiquetant comme tel. Le titre seul n’est pas un signal.

Une source dédiée fournit les contacts et vérifie les adresses. ChatGPT ou une routine de recherche qualifie le compte, comprend le signal et choisit l’angle. Smartlead envoie et gère les réponses.

## Séquences de départ

Texte anglais pour la première cohorte américaine. Les deux campagnes gardent le même angle central, avec des exemples formulés pour le rôle ciblé. La séquence part d’un blocage précis : le manager demande à l’AE d’impliquer le décideur, mais le contact côté acheteur n’arrive pas à obtenir un rendez-vous. Elle explique ensuite comment 3xrep aide à préparer la suite, puis élargit à d’autres étapes de la vente.

Règles de voix : employer « we » pour parler de 3xrep, jamais « I ». Aucun tiret cadratin dans les courriels. Écrire comme une personne, sans slogans ni promesses de résultat. Ne pas écrire « free forever ». La Beta est gratuite pour les équipes qui y participent; cela ne promet pas une place ni un accès gratuit à vie.

### Campagne AE — trois courriels

#### Email 1 — jour 0

**Objet :** getting the decision maker involved

Hi {{first_name}},

If you're a {{job_title}} in {{industry}} and your team already uses AI in sales, this may sound familiar. Your manager asks you to bring the decision maker into a deal, but your contact on the buyer's side can't get a meeting.

We're building 3xrep to help reps work out what to do next, including how to help their contact make the case internally.

The beta is free to try on a real deal. Would you be open to trying it?

Edouard

#### Email 2 — jour 4

**Objet :** helping your contact make the case

Hi {{first_name}},

If your contact can't get the decision maker to meet, it may help to understand what would make that conversation worth their time.

3xrep helps reps plan what to ask, how their contact can make the case internally, and what to do next using the context they already have.

The beta is free to try on a live deal. Would you be open to testing it on one?

Edouard

#### Email 3 — jour 9

**Objet :** after the proposal

Hi {{first_name}},

Getting the decision maker involved is one example. 3xrep helps reps work out next steps across the sales cycle, from prospecting to close, on one deal or several.

After a proposal goes out, for example, it can help you see who still needs to weigh in and what to ask next.

The beta is free to try on a live deal. Would you be open to trying it?

https://3xrep.com/start?utm_source=smartlead&utm_medium=cold_email&utm_campaign=us_ae_decision_maker_test&utm_content=email_3

Edouard

### Campagne managers — trois courriels

#### Email 1 — jour 0

**Objet :** when a rep can't reach the decision maker

Hi {{first_name}},

If you're a {{job_title}} in {{industry}} and your team already uses AI in sales, does this sound familiar? You ask a rep to bring the decision maker into a deal, but their contact on the buyer's side can't get a meeting.

We're building 3xrep to help reps plan the next move, including what to ask, how their contact can make the case internally, and who else may need to be involved.

The beta is free to try on a real deal. Would you be open to trying it with a rep?

Edouard

#### Email 2 — jour 4

**Objet :** coaching a rep through a stuck deal

Hi {{first_name}},

When a rep gets stuck, coaching often starts with what the decision maker still needs to know.

3xrep helps reps use the context they already have to plan what to ask their contact and how to make the case internally.

The beta is free to try on a live deal. Would you be open to testing it with a rep?

Edouard

#### Email 3 — jour 9

**Objet :** one deal or the pipeline

Hi {{first_name}},

Getting a decision maker into the conversation is one example. 3xrep helps reps plan next steps from prospecting to close. Managers can use it with one deal or to review several across the pipeline.

After a proposal goes out, for example, it can help a rep see who still needs to weigh in and what to ask next.

The beta is free to try on a live deal. Would you be open to trying it with a rep?

https://3xrep.com/start?utm_source=smartlead&utm_medium=cold_email&utm_campaign=us_sales_manager_decision_maker_test&utm_content=email_3

Edouard

### Règles de personnalisation et révision

- L’ouverture utilise `{{job_title}}` et `{{industry}}`. Elle présente l’usage de l’IA comme une condition, pas comme un fait connu sur le prospect.
- Ne pas utiliser le slot IA de Smartlead. La phrase de qualification suffit pour ce premier test; les signaux IA n’ont pas montré qu’ils étaient déterminants.
- Avant l’import, mapper `job_title` et `industry`, contrôler leur grammaire dans l’aperçu et écarter les lignes où un champ manque ou sonne faux.
- Ne pas inventer de citation, d’usage d’outils, de résultat, de relation ou d’urgence.
- Garder le cœur stable pendant le test. Les deux personas ont un exemple d’ouverture et une relance adaptés; ne changer qu’une variable à la fois lors d’un futur test.
- Pas de pièce jointe, pixel ou lien dans le premier courriel du premier lot. Le lien d’inscription est réservé au troisième courriel et aux demandes explicites d’information. Les UTM identifient le segment et l’angle, sans donnée personnelle.
- Arrêter après toute réponse, désinscription ou rebond. Exclure les désinscriptions des prochains lots. Les réponses négatives ne sont pas réenrôlées.
- Avant tout lancement, vérifier que la Beta est ouverte et qu’il reste des places. La phrase « The beta is free » concerne la période Beta, pas une gratuité à vie. Un essai ne garantit pas une place Founding; voir [Founding 20](../beta/founding-20.md).

## Smartlead — règles de campagne

- Séparer les campagnes par persona; séparer aussi les familles de signaux quand l’échantillon le permet.
- Importer des contacts dédupliqués par adresse et domaine d’entreprise, avec adresse vérifiée.
- Utiliser des boîtes dédiées à l’outbound sur des domaines secondaires détenus par 3xrep. Garder 3xrep.com hors du cold outbound.
- Texte brut et signature humaine. Augmenter le volume selon l’âge de la boîte, les réponses et la santé du domaine, jamais selon le plafond maximal affiché.
- Activer l’arrêt sur réponse, désinscription et rebond. Avant le multithreading, activer aussi l’arrêt au niveau entreprise. Exclure réponses automatiques et rebonds des réponses humaines.
- Ne pas optimiser selon les ouvertures ou clics; les protections de confidentialité et les robots rendent ces données peu fiables.
- Catégoriser les réponses : positive/demande d’information, neutre/redirection, négative, désinscription, automatique, rebond. Une personne vérifie les cas ambigus. La suite des réponses positives reste humaine.
- Journaliser les variantes, dates, cohortes et volumes pour relier chaque résultat à la bonne version.

## Boucle d’apprentissage : Smartlead → Supabase → décision

Prospect vérifié + signal sourcé → Smartlead (envoi, étape, réponse, catégorie, arrêt) → événements minimisés → Supabase (cohorte et métriques d’acquisition) → agrégation persona × signal × copy → décision humaine → signup → activation sur un vrai deal → retour d’usage → paid → prochaine itération.

Supabase est une couche d’analyse d’acquisition séparée des données commerciales des organisations clientes. Le flux cible utilise les webhooks Smartlead ou un export/API planifié. Stocker seulement les événements nécessaires : campagne, segment, variante, date, étape, catégorie de réponse, rebond, désinscription, signup et étapes d’activation/paiement attribuées. Limiter l’accès et la conservation. Ne pas copier le texte des deals ni les données CRM des clients. Le texte des réponses et les détails de personnalisation restent dans la source ou un espace restreint; les agrégats alimentent l’apprentissage.

Le modèle ne réécrit pas et ne lance pas une campagne seul. À chaque revue, comparer des cohortes assez grandes, repérer où le funnel casse, proposer une hypothèse, puis faire approuver la variante avant envoi. Optimiser les essais activés et les organisations payantes, pas les ouvertures.

## Métriques et objectifs

Distinguer prospects uniques et envois (les relances sont des envois supplémentaires). Rapporter par cohorte : délivrés, rebonds, désinscriptions, réponses humaines, positives, signups attribués, activation sur vrai deal, retours d’usage, organisations qualifiées Founding, puis paid après la bêta, et coût par signup/activation/organisation payante.

Plages hypothétiques du scénario discuté, à viser après optimisation et non à présenter comme une prévision :

| Pour 1 000 prospects uniques bien ciblés | Plage de travail |
| --- | ---: |
| Réponses humaines | 40–80 |
| Réponses positives | 15–40 |
| Signups bêta | 10–30 |
| Activations sur un vrai deal | 6–20 |
| Futures organisations payantes | 3–10 |

Le scénario central de modélisation à long terme est environ 0,6 % contact unique → organisation payante (6 pour 1 000), soit 774 $ de nouveau MRR au prix standard de 129 $/mois/org, avant churn. Ce n’est ni une promesse ni une projection du test initial. Pendant la bêta, mesurer d’abord l’usage qualifié; le revenu arrive après.

### Portes de décision : 100, 500, 1 000

**Avant envoi :** vérifier les sources, adresses, désinscriptions, ouverture de la bêta et arrêts Smartlead. Commencer à faible volume stable. Ne pas augmenter tant que rebonds ou plaintes ne sont pas compris.

**100 prospects uniques :** contrôle de qualité, pas verdict. Relire chaque réponse et rebond. Sans réponse humaine, vérifier délivrabilité, données, sujet et ciblage avant d’augmenter.

**500 prospects uniques :** première décision directionnelle sur une cohorte comparable. Vérifier la délivrabilité, viser initialement 2–3 % de réponses positives, au moins 1 % de signups attribués et une part mesurable activée sur un vrai deal. Définir le seuil de rebond avec le provider avant le test. Si peu de réponses, revoir données/signal/délivrabilité/persona. Si réponses sans intérêt, revoir la promesse. Si intérêt sans signup, revoir CTA et friction. Si signup sans activation, revoir le premier usage et le délai avant valeur.

**1 000 prospects uniques :** décider si le canal mérite une nouvelle cohorte et une montée progressive. Les réponses seules ne valident pas le canal : il faut des activations, puis des retours d’usage. Attendre la fin du cycle bêta pour juger les paid et séparer cohortes bêta et tarif standard. Ne pas tirer de conclusion ferme sur le paid avant une fenêtre suffisante.

## Montée en charge des inboxes

### Phase 1 — test (1–2 mois)

Utiliser Smartlead pour aller vite tout en gardant les domaines et boîtes portables : domaines achetés chez un registrar externe, boîtes gérées chez le fournisseur choisi, comptes connectés ensuite à Smartlead. Garder le domaine de marque hors prospection.

Démarrer avec l’adresse déjà en chauffe et monter vers 3–4 inboxes réparties sur au moins deux domaines secondaires. Pré-chauffer les nouvelles boîtes. Tenir compte du volume total, chauffe comprise; introduire peu de vrais messages au départ. Les repères discutés de 15–25 messages froids/jour/boîte au départ puis souvent 30–40 pour une boîte saine sont des points de départ à valider, jamais une garantie. Santé du domaine, plaintes et réponses priment. Ne pas acheter beaucoup de capacité avant d’avoir des signaux produit.

### Phase 2 — transition

Quand les cohortes montrent une délivrabilité saine, des réponses positives et de l’usage, faire chauffer en parallèle de nouvelles boîtes détenues directement. Déplacer les prochaines campagnes progressivement et réduire les anciens envois. Garder temporairement les anciennes adresses actives sans nouveaux envois froids pour traiter les réponses tardives, puis fermer les fils utiles avant suppression.

### Phase 3 — capacité programmable

Après validation répétée, ajouter une couche interchangeable Infrastructure Provider. Évaluer coût total, propriété et portabilité des domaines, API, compatibilité Smartlead, DNS, délivrabilité et délai de mise en route. Le fournisseur le moins cher n’est pas encore décidé. Smartlead peut rester le séquenceur; éviter de rendre les domaines captifs.

Ne pas augmenter les envois pour remplir une capacité théorique comme 500/jour. La capacité suit les résultats et la capacité à traiter les réponses et activations.

## Historique obsolète

La séquence Gojiberry Founding 20 est archivée dans [gojiberry-sequence.md](gojiberry-sequence.md). Elle n’est plus la stratégie ni la copy actuelles. La boucle Smartlead → Supabase et le provisioning automatisé sont des architectures cibles, pas des fonctionnalités déjà livrées. Les taux et volumes sont des hypothèses à valider par cohortes.
