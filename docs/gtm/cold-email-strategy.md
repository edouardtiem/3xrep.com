# Acquisition outbound — stratégie actuelle

> Statut : test lancé dans Smartlead. Au 25 septembre 2026, les deux campagnes sont actives et deux premiers courriels sont partis; un a rebondi avec une adresse inexistante. Plafond actuel : deux courriels par jour au total. Cette documentation seule n’autorise aucun changement d’envoi. La séquence Gojiberry est obsolète et ne doit pas être reprise.

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

Contacter une seule personne par entreprise dans le premier passage. Ajouter d’autres personnes de la même entreprise dans une cohorte suivante seulement si les résultats le justifient. Avant cela, activer l’arrêt pour toute l’entreprise dès qu’une personne répond ou se désinscrit. Une adresse différente ne contourne pas un arrêt.

## Approche signal-based

Le signal répond à « pourquoi cette personne, pourquoi maintenant ? ». Exemples : embauche d’AE ou de leadership commercial, expansion annoncée, publication récente sur un problème de pipeline, négociation, accès au décideur ou coaching, changement de processus publiquement annoncé, ou recrutement qui révèle une vente complexe.

Pour chaque prospect, garder l’URL source, la date, le fait exact et le lien avec l’angle choisi. N’affirmer que ce que la source permet de vérifier. Si aucun signal fiable n’existe, exclure le contact du lot signal-based ou utiliser le repli générique en l’étiquetant comme tel. Le titre seul n’est pas un signal.

Une source dédiée fournit les contacts et vérifie les adresses. ChatGPT ou une routine de recherche qualifie le compte, comprend le signal et choisit l’angle. Smartlead envoie et gère les réponses.

## Séquences de départ

Version revue le 25 septembre après lecture du produit et du moteur de stratégie, des recherches de Gong et de la documentation Smartlead. Le test a commencé : deux courriels ont été envoyés le 25 septembre, un a rebondi, aucun n’a encore obtenu de réponse humaine. Il est trop tôt pour juger la conversion.

Le premier courriel présente une situation possible, sans prétendre que le destinataire l’a vécue. Il explique la démarche concrète, précise que l’accès au décideur est un exemple parmi d’autres et invite à contribuer par un essai réel. Le deuxième approfondit la démarche pour les commerciaux et la préparation du coaching pour les managers. Le troisième ouvre sur une proposition bloquée ou la revue de plusieurs affaires.

Voix : « we », jamais « I »; aucun tiret cadratin dans les courriels. La phrase sur l’expérience est conservée et suivie d’une question claire. La Beta est gratuite. L’accès à vie au plan de base concerne jusqu’à 20 organisations sélectionnées après usage réel, pas automatiquement toutes les inscriptions.

Décision : six courriels par campagne. Les trois suivants abordent une affaire sans réponse, la négociation d’une remise, puis une dernière invitation courte. Examiner les réponses humaines positives et les essais activés apportés par les dernières étapes avant de décider de les conserver dans les futures cohortes.

Les relances restent dans le même fil : leur objet est vide dans Smartlead. Les délais entre étapes sont 0, 4, 5, 6, 7 et 6 jours pour viser J0, J4, J9, J15, J22 et J28, sous réserve des jours et plages d’envoi. Arrêter la séquence dès une réponse ou une désinscription. Aucun nouveau message automatique après le sixième.

### Campagne AE

#### Email 1 — jour 0

**Objet :** getting the decision maker involved

Hi {{first_name}},

We're inviting sales teams in {{industry}} that already use AI to help shape 3xrep.

One problem we're working on: a manager asks a rep to bring in the decision maker, but the buyer's contact can't arrange the meeting.

Using the deal context, 3xrep helps work out how to turn the problem the contact has described into a reason for the decision maker to join, what to ask, and how to respond.

This is one example of how it helps plan next steps from prospecting to close.

Given your experience with complex deals, we'd value your feedback as you try it on one live opportunity.

The beta is free. We'll select up to 20 founding organizations after real use, with lifetime access to the base plan for their whole organization.

Would you be interested in taking part?

Edouard

#### Email 2 — jour 4

**Objet :** (vide dans Smartlead, réponse dans le même fil)

Hi {{first_name}},

For the decision maker example, a starting point could be the problem your contact has already described and why solving it matters to their team.

3xrep helps you use that context to prepare the request for an introduction, suggest the words to use, and work out the next step if the answer is no.

Would you be interested in trying this on one live deal?

Edouard

#### Email 3 — jour 9

**Objet :** (vide dans Smartlead, réponse dans le même fil)

Hi {{first_name}},

Another moment we're working on is when a proposal has gone out and the deal stops moving.

3xrep helps you work out what is still unclear, who needs to weigh in, and what to ask in the next conversation.

You can use it on one deal or work through several, from preparing a first conversation to negotiating the terms.

If you'd like to try the free beta on a live deal, you can start here:

https://3xrep.com/start?utm_source=smartlead&utm_medium=cold_email&utm_campaign=us_ae_decision_maker_test&utm_content=email_3

Edouard

#### Email 4 — jour 15

**Objet :** (vide dans Smartlead, réponse dans le même fil)

Hi {{first_name}},

A buyer says they're interested, agrees to a next step, then stops replying. What do you send after that?

3xrep helps you go back through the conversation, find what was left unresolved, and write a follow-up with a reason to answer. It also helps you decide when to leave the deal alone.

Is there a deal you'd want to try that on?

Edouard

#### Email 5 — jour 22

**Objet :** (vide dans Smartlead, réponse dans le même fil)

Hi {{first_name}},

Another example: a buyer asks for a discount, but you don't know whether agreeing would actually get the deal signed.

3xrep helps you prepare what to ask before changing the price, what you could ask for in return, and how to check who still needs to approve.

We'd value your feedback on whether that advice holds up in a real negotiation.

Would you be open to trying it?

Edouard

#### Email 6 — jour 28

**Objet :** (vide dans Smartlead, réponse dans le même fil)

Hi {{first_name}},

We'll leave it here after this.

If there's a deal where you'd value another view on what to do next, we'd be happy to help you try 3xrep on it during the free beta.

Would that be useful?

Edouard

### Campagne managers

#### Email 1 — jour 0

**Objet :** when a rep can't reach the decision maker

Hi {{first_name}},

We're inviting sales teams in {{industry}} that already use AI to help shape 3xrep.

One problem we're working on: a rep knows the decision maker needs to be involved, but doesn't know how to get access. Their manager knows the goal, but still has to help them work out the approach.

Using the deal context, 3xrep helps the rep turn the problem their contact has described into a reason for the decision maker to join, with suggested wording and next steps depending on the answer.

This is one example of how it helps plan next steps from prospecting to close.

Given your experience with complex deals, we'd value your feedback as you try it on one live opportunity.

The beta is free. We'll select up to 20 founding organizations after real use, with lifetime access to the base plan for their whole organization.

Would you be interested in taking part?

Edouard

#### Email 2 — jour 4

**Objet :** (vide dans Smartlead, réponse dans le même fil)

Hi {{first_name}},

When several reps need help with different deals, each coaching conversation takes preparation.

3xrep helps each rep use their deal notes to work out what is missing, what to ask next, and how to approach the conversation. You can review that plan together and use your coaching time on the parts that need your judgment.

Would you be interested in trying this with one rep during the free beta?

Edouard

#### Email 3 — jour 9

**Objet :** (vide dans Smartlead, réponse dans le même fil)

Hi {{first_name}},

A rep may be waiting on a proposal while another is negotiating without knowing who can approve the purchase.

3xrep helps you review several deals, identify what needs attention, and prepare a specific coaching question and next step for each rep.

You can start with one deal and then use it across the pipeline, from preparing first conversations to working through negotiations.

If you'd like to try the free beta with your team, you can start here:

https://3xrep.com/start?utm_source=smartlead&utm_medium=cold_email&utm_campaign=us_sales_manager_decision_maker_test&utm_content=email_3

Edouard

#### Email 4 — jour 15

**Objet :** (vide dans Smartlead, réponse dans le même fil)

Hi {{first_name}},

A rep says they're still following up, but the buyer hasn't replied in weeks. Do you help them try another approach or ask them to move on?

3xrep helps you review what the buyer actually committed to, what's still unknown, and whether there's a useful next step worth trying.

Is there a deal on your team you'd want to look at that way?

Edouard

#### Email 5 — jour 22

**Objet :** (vide dans Smartlead, réponse dans le même fil)

Hi {{first_name}},

A rep asks you to approve a discount so they can close this month. Before saying yes, you need to know what that discount would actually change.

3xrep helps prepare the questions to ask the buyer, possible terms to discuss, and what still needs to happen before signature.

We'd value your judgment on whether that preparation helps the rep have a better conversation.

Would you be open to testing it on one negotiation?

Edouard

#### Email 6 — jour 28

**Objet :** (vide dans Smartlead, réponse dans le même fil)

Hi {{first_name}},

We'll leave it here after this.

If you'd like to see whether 3xrep helps your team, we could start with one rep and one live deal during the free beta. We'd value your feedback on what helps and what's missing.

Would you be interested?

Edouard

### Règles de personnalisation et révision

- L’ouverture utilise `{{industry}}` et `{{first_name}}`. Le poste sert au ciblage des campagnes, sans insertion de `a {{job_title}}` dans le texte. L’usage de l’IA décrit le public recherché, pas une information prétendument vérifiée sur chaque destinataire.
- Vérifier l’expérience de vente complexe dans le ciblage avant d’utiliser la phrase qui la valorise. Un intitulé seul n’établit pas cette expérience.
- Ne pas utiliser de slot IA ni de variations automatiques de mots. Ce choix simplifie le premier test; il ne prouve pas que la personnalisation IA est inefficace.
- Avant import, mapper le prénom et le secteur, vérifier la grammaire de chaque aperçu et traiter les champs manquants. Conserver le poste dans les données de qualification.
- Ne pas inventer de citation, d’usage d’outils, de résultat, de relation ou d’urgence. Un contact n’est pas automatiquement un champion; la démarche dépend du contexte et des preuves disponibles.
- Garder une seule version par campagne au départ. Pour un futur test, répartir deux variantes à parts égales dans un même public et ne changer qu’un élément. Comparer les réponses humaines positives et les essais utilisés sur une vraie affaire. Ne pas sélectionner automatiquement une version sur les ouvertures ou les clics, ni traiter les deux publics comme un test de texte contrôlé.
- Pas de pièce jointe, pixel ou lien dans les deux premiers courriels. Le lien d’inscription est réservé au troisième et aux demandes explicites d’information. Les UTM identifient le segment et l’angle, sans donnée personnelle.
- Arrêter après toute réponse, désinscription ou rebond. Les réponses négatives ne sont pas réenrôlées.
- Avant lancement, vérifier que la Beta est ouverte et qu’il reste des places Founding. L’attribution suit les règles de [Founding 20](../beta/founding-20.md).

## Smartlead — règles de campagne

- Séparer les campagnes par persona; séparer aussi les familles de signaux quand l’échantillon le permet.
- Importer des contacts dédupliqués par adresse et domaine d’entreprise, avec adresse vérifiée.
- Pour le premier passage, garder une personne par entreprise. Ajouter ensuite d’autres personnes seulement si les résultats le justifient et si l’arrêt au niveau de l’entreprise est actif.
- Utiliser des boîtes dédiées à l’outbound sur des domaines secondaires détenus par 3xrep. Garder 3xrep.com hors du cold outbound.
- Texte brut et signature humaine. Augmenter le volume selon l’âge de la boîte, les réponses et la santé du domaine, jamais selon le plafond maximal affiché.
- Activer l’arrêt sur réponse, désinscription et rebond. Avant le multithreading, activer aussi l’arrêt au niveau entreprise. Exclure réponses automatiques et rebonds des réponses humaines.
- Ne pas optimiser selon les ouvertures ou clics; les protections de confidentialité et les robots rendent ces données peu fiables.
- Catégoriser les réponses : positive/demande d’information, neutre/redirection, négative, désinscription, automatique, rebond. Une personne vérifie les cas ambigus. La suite des réponses positives reste humaine.
- Journaliser les variantes, dates, cohortes et volumes pour relier chaque résultat à la bonne version.

## Boucle d’apprentissage : Smartlead → Supabase → décision

Prospect vérifié + signal sourcé → Smartlead (envoi, étape, réponse, catégorie, arrêt) → événements minimisés → Supabase (cohorte et métriques d’acquisition) → agrégation persona × signal × copy → décision humaine → signup → activation sur un vrai deal → retour d’usage → paid → prochaine itération.

Supabase est la source portable du dossier d’acquisition; Smartlead reste le système d’envoi et le registre opérationnel. La migration `20260925190000_outbound_smartlead_portability.sql` conserve les anciennes lignes Gojiberry et ajoute `source_contact_id`, `company_domain` et l’état de vérification de l’adresse. `outbound_campaign_leads` relie une personne à chaque campagne, avec les identifiants et statuts Smartlead. La migration `20260925193000_outbound_delivery_outcomes.sql` y ajoute les rebonds, désinscriptions et dates de réponse. `outbound_send_events` garde un enregistrement par courriel envoyé, sans texte de message. Le nom `outbound_prospects` reste valable; la colonne historique `gojiberry_contact_id` est conservée pour les 200 anciennes lignes. Le statut général de cette table reste historique; le statut de campagne est dans `outbound_campaign_leads`.

Le 25 septembre, `node --env-file=.env.local scripts/sync-smartlead-outbound.mjs 4023139 4023140` a copié les deux campagnes : 40 contacts, 40 appartenances à une campagne, deux envois et un rebond. Les 200 lignes Gojiberry sont intactes. La commande peut être relancée sans doublon; `--dry-run` lit Smartlead sans écrire. Elle doit être relancée pour intégrer les futurs imports et envois, tant qu’aucun déclenchement planifié n’est en place. Le flux cible peut ensuite utiliser les webhooks Smartlead ou un export/API planifié pour garder cette copie à jour. Stocker seulement les événements nécessaires : campagne, segment, variante, date, étape, catégorie de réponse, rebond, désinscription, signup et étapes d’activation/paiement attribuées. Limiter l’accès et la conservation. Ne pas copier le texte des deals ni les données CRM des clients. Le texte des réponses et les détails de personnalisation restent dans la source ou un espace restreint; les agrégats alimentent l’apprentissage.

Le modèle ne réécrit pas et ne lance pas une campagne seul. À chaque revue, comparer des cohortes assez grandes, repérer où le funnel casse, proposer une hypothèse, puis faire approuver la variante avant envoi. Optimiser les essais activés et les organisations payantes, pas les ouvertures.

## Métriques et objectifs

Distinguer prospects uniques et envois (les relances sont des envois supplémentaires). Rapporter par cohorte : délivrés, rebonds, désinscriptions, réponses humaines, positives, signups attribués, activation sur vrai deal, retours d’usage, organisations qualifiées Founding, puis paid après la bêta, et coût par signup/activation/organisation payante.

**Objectif de la Beta fixé le 25 septembre :** pour 1 000 courriels envoyés au total, obtenir 5 à 15 organisations inscrites, avec au moins une personne inscrite dans chacune. Le dénominateur compte aussi les relances, pas seulement les adresses contactées. À ce seuil, examiner l’usage réel. Si l’usage est déjà bon avant, une organisation peut être retenue plus tôt. Accorder l’offre de base gratuite à vie aux organisations retenues, dans la limite des 20 places Founding; lancer ensuite l’offre payante pour les nouvelles organisations. C’est un but de recrutement et d’apprentissage, pas une prévision de résultat.

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
