# Sales Strategy Library — première version

Périmètre approuvé dans le chat du 30 septembre 2026. Réalisation sur `feat/acquisition-strategy`, suite de la demande de fusion nº 43. Aucune publication demandée.

## Sélection éditoriale

Recherche web exploratoire du 30 septembre. Marché visé : lecteurs anglophones, vente de logiciels entre entreprises. Ni volume, ni difficulté, ni résultats Search Console vérifiés : aucun outil de volume connecté accessible dans ce chat. Les résultats ci-dessous établissent des intentions et des réponses existantes, pas une demande quantifiée ni une garantie de trafic. Revoir la sélection avec les données connectées avant toute extension.

| Formulations examinées | Intention | Réponses consultées | Apport proposé | Page existante proche |
| --- | --- | --- | --- | --- |
| B2B sales how to reach economic buyer; economic buyer access | Préparer l’accès à l’autorité d’achat | [MEDDICC](https://meddicc.com/meddpicc-sales-methodology-and-process) | Montrer le passage impact → soutien → autorité → critères avec preuves calculées | `/docs/methods` : référence des méthodes, pas stratégie d’accès |
| sales champion testing internal champion; test sales champion | Tester le soutien interne | [MEDDICC : soutien et autorité](https://meddicc.com/meddicc-media/medmen-s2-ep1-misidentifying-champions) | Comparer enthousiasme et engagement observable ; ne pas assimiler soutien et pouvoir de décision | `/docs/methods` : définition, pas exemple interactif |
| B2B sales price objection too expensive | Comprendre et traiter une objection prix | [Salesforce](https://www.salesforce.com/blog/sales/overcoming-sales-objections-5-tips-to-try/) | Distinguer impact non mesuré, impact confirmé et financement absent | `/docs/use-cases` : questions à essayer, pas réponse détaillée |

L’absence à combler est notre proposition éditoriale : les pages consultées expliquent les concepts ; notre bibliothèque permet de voir l’effet d’une preuve sur le diagnostic et l’action. Ce relevé n’est pas une analyse exhaustive des résultats Google ou des citations d’assistants.

## Routes et contenu

`/playbooks` et trois routes par situation : `economic-buyer-access`, `test-sales-champion`, `too-expensive-objection`. Pas de combinaison automatique secteur × complexité. Les affaires ont un contexte déclaré propre, sans créer de classification simple/middle/complex dans le produit.

Chaque page : réponse courte, démarche, acteurs fictifs, étape déclarée, preuves/suppositions/inconnues, priorité, prochaine action, formulation, résultat à obtenir, réponses possibles, rattachements aux méthodes, limites, sources et démarrage dans l’assistant. Le premier état est rendu côté serveur et reste lisible sans JavaScript. Le navigateur sélectionne les états calculés et les suites hypothétiques ; il ne calcule pas le jugement commercial.

## Source commerciale et mise à jour

`src/lib/playbooks/scenarios.ts` contient uniquement les affaires synthétiques et leur texte éditorial. `calculate.ts` appelle `runMoteur`, sans dupliquer ses décisions. Les traductions anglaises sont indexées sur le texte exact du moteur ; une nouvelle formulation non revue bloque le calcul. Les citations ne sont jamais traduites ou réécrites.

`npm run dev`, `build` et `test` génèrent `revision.json` avec une empreinte des fichiers commerciaux. Chaque état identifie aussi l’entrée du scénario, la sortie calculée, les traductions et la règle stratégique retenue. Après un changement du cerveau : relancer les tests et la construction, revoir les traductions refusées, puis les diagnostics de toutes les pages. Pas de date de mise à jour inventée.

Le moteur vérifie une présence dans les sources synthétiques. Il ne vérifie pas une identité ni une vérité indépendante. L’engagement de soutien accepté ne prouve pas son exécution ou toutes les conditions d’un Champion MEDDIC. Une objection active peut faire réexaminer un impact déjà tenu ; l’affichage le précise. Les suites hypothétiques n’ajoutent aucune preuve.

## Mesure

GA4 existant conserve la mesure des pages. À l’entrée directe dans la bibliothèque, l’attribution de session ajoute `library.<slug>` dans le champ de campagne existant, sans remplacer une campagne externe. Google reste la source organique quand le référent le permet. Un accès direct est étiqueté direct. Aucune donnée d’affaire dans ces identifiants.

Limites : attribution au premier contact conservé dans l’onglet, stockage navigateur éventuellement indisponible, pas d’identité entre appareils. Les visites, inscriptions et usages ne prouvent pas une lecture, une action exécutée ou un effet causal de la page. Première valeur et retours s’évaluent avec les données existantes de l’organisation ; aucun faux événement d’activation ajouté.

Le lien `/start` consulte l’offre réellement ouverte. Aucune place gratuite à vie promise. Aucun envoi, changement de prix, nouvelle collecte ou mécanique de parrainage.

## Première extension sectorielle — 30 septembre

Suite autorisée dans le même chat : `/playbooks/cybersecurity-pilot-decision`. Affaire fictive Northstar : validation technique, critères acceptés, autorité d’investissement et revue fournisseur séparées. Trois états calculés : critères absents, réaction positive au pilote, critères confirmés. La réaction positive ne suffit pas à établir les critères. Le moteur reste générique ; il ne vérifie ni sécurité technique ni conformité.

Recherche exploratoire : [NIST SP 1326](https://csrc.nist.gov/pubs/sp/1326/final) décrit l’évaluation préalable des fournisseurs de technologies. Cette source justifie la distinction éditoriale entre test technique et revue fournisseur. Aucun volume de recherche ni demande quantifiée établi ; cette page est une première proposition sectorielle à mesurer, pas une validation du canal. Le relevé initial reste historique. Aucun produit cartésien secteur × situation.


## Extension fondée sur la recherche Google

Le 30 septembre, la demande utilisateur autorise la recherche connexe, l'extension et une stratégie SEO. Ajout local de /playbooks/sales-follow-up-email et /playbooks/sales-discovery-questions : six guides, quatre groupes de besoins, exemples adaptables et circuit animé commun. Les deux scénarios utilisent le moteur existant ; aucune nouvelle règle commerciale. La découverte passe de l'impact à l'échéance du client. La relance passe d'un accès sans soutien testé à un accès préparé avec un soutien documenté. Le moteur ne détecte ni le silence ni une cadence de mails. Demande, limites, deux prochaines portes d'entrée et contrôles de publication : [recherche](keyword-research-2026-09-30.md) et [plan SEO](search-led-content.md#plan-seo-retenu--30-septembre-2026). Publication distincte.


## Mise en production autorisée

Le 30 septembre, Édouard demande le visuel vers le milieu des guides et le passage vers le produit à proximité. Le circuit commun est déplacé après la sélection des preuves, avant leur détail. La demande à copier et le démarrage suivent le circuit, sans deuxième appel à démarrer dans le visuel. Publication autorisée via pre_main puis main si les tests passent. Après publication : contrôler les six pages, sitemap, canonique, accès Google et inspection Search Console ; demander l'exploration sans promettre l'indexation ni le classement.
