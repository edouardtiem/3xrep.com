# Recherche et vérification des contacts

Décision du 13 octobre 2026. Le programme de 1 h utilise les API directement. Le connecteur Smartlead du chat n’est pas son accès serveur. SmartProspect est appelé sur `prospect-api.smartlead.ai`, les campagnes sur `server.smartlead.ai`.

## Circuit livré

1. SmartProspect recherche les profils et trouve leurs adresses avec les crédits disponibles. Aucun achat de crédits ni abonnement supplémentaire n’est déclenché.
2. Supabase conserve le profil avant la demande d’adresse. Une reprise relit la demande précédente ; elle ne la refait pas pour obtenir la même adresse.
3. Treg appelle Kitt pour vérifier l’adresse. Un résultat exploitable exige `validity=valid`, `validSMTP=true` et `validIdentity=true`.
4. Une adresse valide rejoint A ou B, avec une répartition stable et équilibrée. Le programme relit Smartlead pour confirmer chaque import et conserve les identifiants de contact, de campagne et de séquence.
5. Les adresses invalides ou incertaines restent dans Supabase et sont exclues des envois. Un profil sans adresse retournée reste également conservé. Une recherche encore en cours n’est pas présentée comme une adresse inexistante.

Le premier filtre utilise les commerciaux individuels `Senior`, `Enterprise` ou `Strategic Account Executive`, aux États-Unis, secteur SmartProspect `Software & Internet`. Les bandes de taille `0 - 25` et `25 - 100` sont le filtre pratique de ce premier lot, pas une définition universelle d’une petite entreprise. Les titres de manager, directeur, responsable d’équipe, fondateur ou débutant sont exclus. Le profil fourni par la base est la source de qualification ; aucun usage de Claude ou ChatGPT ni aucune intention d’achat n’est déduit du titre.

Une personne par entreprise. Les anciens contacts et domaines déjà travaillés sont exclus du prochain choix. Les listes de blocage et de désinscription Smartlead restent appliquées. Une réservation avant import empêche les reprises de changer la version attribuée. L’import ne démarre pas les campagnes.

## Coût et rythme du programme de 1 h

ContactOut était annoncé gratuit, mais les essais réels ont renvoyé des erreurs 403 et 429. Son adresse d’exemple a renvoyé `accept_all`, ce qui ne confirme pas la boîte. À la demande d’Édouard, Kitt a été essayé en premier, puis MillionVerifier sur les deux résultats incertains. Kitt fonctionne ; MillionVerifier a refusé les deux appels de repli. Il n’est pas un repli automatique du programme.

Le vérificateur quotidien retenu est **Kitt via Treg, 0,0015 USD par vérification terminée**, y compris les résultats invalides ou incertains. Le code relit le tarif avant le lot et refuse un tarif supérieur. L’identité Treg `3xrep-outbound-verifier` n’autorise que `trykitt.people.email.verify`, au plus 200 appels par jour, sans commandes locales. L’accès au seul endpoint a été vérifié : Kitt fonctionne, ContactOut est refusé par les permissions. Les deux recettes enregistrées dans Treg décrivent le circuit et la vérification, sans secret de fournisseur.

Le remplissage quotidien vise **trois jours ouvrés de contacts valides, importés et pas encore contactés**, répartis entre A et B. La réserve est calculée sur toute la capacité des quatre boîtes, sans la diviser par les quatre étapes : les relances ne consomment pas cette capacité au démarrage. Elle garde volontairement de la marge quand les relances occupent une partie des envois. Avec les plafonds 11 / 4 / 4 / 4, la réserve visée est de 69 contacts ; à terme, elle suit les nouveaux plafonds. Un vendredi couvre vendredi, lundi et mardi. Le maximum est **200 vérifications par jour**, donc **0,30 USD de vérification quotidienne au maximum**. Les recherches échouées ou les adresses non trouvées peuvent réduire le nombre d’adresses vérifiables. Le contrôle de livraison fonctionne indépendamment d’un échec de recherche.

**Plafond décidé par Édouard le 13 octobre 2026 pour accompagner la croissance et limiter les dépenses.** Il remplace les limites initiales de 100 appels Treg et de 50 contacts dans le programme. Ce plafond est une limite, pas un objectif de consommation. À tarif constant, 200 vérifications chaque jour pendant 30 jours coûteraient au plus 9 USD.

Si la croissance est limitée, vérifier les deux réglages : `daily_call_cap=200` sur l’identité Treg `3xrep-outbound-verifier` (identifiant `35005`) et `outbound_sourcing_config.max_daily_contacts=200` dans Supabase. La contrainte `outbound_sourcing_config_max_daily_contacts_check` interdit aussi de dépasser 200 ; elle est définie par la migration `20261014000000_outbound_verifier_daily_cap.sql`. Le stock visé est `buffer_days=3`, défini par `20261014010000_outbound_three_day_stock.sql`. Le garde-fou de tarif reste `verifier_max_cost_micro=1500`. Un refus de Treg peut venir de son compteur journalier, partagé par tous les appels du jeton, y compris les tests. Un lot inférieur à 200 peut simplement venir du stock visé, des crédits SmartProspect, du nombre de profils qualifiés ou des campagnes et boîtes encore inactives. Relever le plafond nécessite une nouvelle décision et une modification cohérente des deux réglages et de la contrainte.

À 1 h, le programme recherche, vérifie et importe par lots de 20 au maximum. Si les adresses invalides, incertaines, introuvables ou encore en cours de recherche laissent la réserve insuffisante, il prend la page suivante de SmartProspect et recommence. Le curseur de pagination reprend la recherche initiale ; son identifiant est conservé lorsque les pages suivantes ne le répètent pas. Les lots partagent un seul passage, un seul verrou et le même plafond de 200 vérifications pour le jour d’envoi. Les nouvelles demandes d’adresse SmartProspect sont également limitées à 200 par passage. Seuls les contacts relus dans Smartlead avec le statut `STARTED` et la vérification `valid` comptent comme stock. Une campagne vide reste à remplir même si l’autre a du surplus.

Le programme ne recherche pas si les campagnes ne sont pas actives, si les boîtes présentent un problème, si le stock suffit, le week-end ou si le budget quotidien est épuisé. Depuis la correction du 17 octobre, les passages supplémentaires récupèrent d’abord les demandes existantes, puis peuvent poursuivre la recherche avec le curseur enregistré et le budget restant ; une même demande d’adresse n’est pas refaite. Les vérifications de ces reprises partagent les 200 autorisées pour le jour, en comptant les passages déjà enregistrés. Les contacts déjà en cours de recherche sont repris au prochain passage. Les crédits SmartProspect épuisés arrêtent les nouvelles demandes d’adresse ; aucun basculement payant vers un autre chercheur n’est activé. La recherche s’arrête aussi si les pages n’apportent plus de profils qualifiés, si les 200 vérifications sont atteintes ou si la durée disponible dans la fonction ne suffit plus. Les demandes en cours restent reprises le jour suivant, sans les refacturer.

Le journal privé du passage garde `stockTarget`, `stockDates`, `stockPerCampaign`, `stockByCampaign`, `queuedAfter`, `shortfall`, `verified`, `rounds` et `stopReason`. Une réserve incomplète est visible ; la réussite technique ne veut pas dire que le stock est rempli. Motifs possibles : `verification_cap`, `discovery_cap`, `credits_exhausted`, `search_exhausted`, `no_new_qualified_profiles` ou `time_budget`. Le programme vise le plein usage des plafonds, mais ne garantit pas les envois si les profils, crédits, boîtes ou fenêtres de Smartlead ne le permettent pas.

## Essai réel du 13 octobre

Dix profils ont été conservés dans Supabase. Smartlead a retourné huit adresses. Kitt a classé quatre adresses valides, deux invalides et deux incertaines. Les deux incertaines n’ont pas obtenu de verdict supplémentaire de MillionVerifier. Les deux autres profils n’ont pas encore d’adresse retournée.

**Quatre contacts ont été importés et relus dans Smartlead : deux dans A (`4139326`), deux dans B (`4139384`).** Les campagnes restent en brouillon. Aucun courriel n’a été envoyé. Les six autres profils restent en base.

Les huit vérifications Kitt ont coûté **0,012 USD**. Les appels de repli MillionVerifier ont coûté zéro. Les contrôles de connexion sur l’adresse publique d’exemple sont comptés séparément. Le dernier solde SmartProspect relu après l’import est **1 996 crédits** ; c’est le solde observé, pas une extrapolation du nombre de demandes.

## État et reprise

- `outbound_sourcing_candidates` garde les profils, demandes, adresses, qualification, résultats exacts, dates, appels, coûts et états d’import. Pas de corps de courriel.
- `outbound_sourcing_runs` garde les essais, les passages quotidiens et leurs motifs d’échec.
- `outbound_sourcing_config` garde l’activation, le pilote validé, le tarif autorisé, le stock visé et le verrou. Ces tables et fonctions sont privées, réservées au rôle serveur.
- `outbound_prospects`, les réservations de séquence et `outbound_campaign_leads` relient les contacts aux résultats du test.

`scripts/source-senior-outbound.mjs` reprend le même lot de dix profils à partir du premier essai enregistré. Il ne choisit pas dix nouveaux profils à chaque relance. `scripts/record-outbound-verification.mjs` conserve les reçus réels du pilote quand les appels sont faits depuis le chat. `scripts/deploy-outbound-sourcing.mjs` refuse l’activation sans import réel de contacts valides, puis vérifie l’appel Treg depuis Supabase et le contrôle hébergé. Le fichier de jeton local reste privé ; le programme utilise le secret de sa fonction Supabase.

`node --env-file=.env.local scripts/deploy-outbound-stock.mjs` applique seulement les migrations du plafond et de la réserve, redéploie la fonction existante et vérifie son refus sans secret, une simulation, un passage réel et le calendrier. Les secrets et droits Treg ne sont pas modifiés.

A et B ont été activées explicitement le 14 octobre. Le pilote ci-dessus décrit l’état historique du 13 octobre ; les prochains lots suivent le circuit quotidien.

Le programme reste `3xrep-outbound-cloud-01h`, à **1 h Europe/Paris**, avec un seul passage effectif en été comme en hiver. Les [textes A et B](cold-email-senior-beta-test.md), le [contrôle des boîtes](smartlead-cloud-control.md) et l’adaptation du parcours de gratuité avant lancement restent distincts.

Sources techniques : [recherche et pagination SmartProspect](https://api.smartlead.ai/api-reference/smart-prospect/search-contacts), [récupération des adresses](https://api.smartlead.ai/api-reference/smart-prospect/fetch-contacts), [API Treg](https://treg.to/docs). Tarifs et verdicts issus du catalogue et des appels réels Treg du 13 octobre, pas de la seule publicité des fournisseurs.

### Reprise des résultats différés — 14 octobre

Le premier remplissage après activation a demandé 200 adresses. Aucune n’était encore retournée lors des lectures immédiates ; le stock restait aux quatre contacts du pilote. Cet essai réel a motivé la reprise le même jour : lire les demandes existantes, vérifier celles qui sont terminées et importer, sans refaire la recherche ou la demande d’adresse. La reprise conserve le verrou et le plafond journalier partagé. Le prochain passage de 1 h peut donc terminer ces demandes même si la recherche du jour a déjà eu lieu. Si une reprise a avancé mais s’arrête sur la durée disponible avec un manque de stock, la fonction programme automatiquement la suite. Au plus quatre suites supplémentaires par jour, après libération du verrou ; toutes partagent les 200 vérifications. Une absence de résultat, de progression ou de budget ne déclenche pas cette chaîne. Le compteur est `outbound_sourcing_config.continuations_today`, daté par `last_continuation_date`. La fonction privée `queue_outbound_reconciliation` réserve chaque suite une seule fois et refuse un appel anonyme.

Le remplissage réel a ensuite atteint **69 contacts prêts**, répartis 35 dans A et 34 dans B, sans nouvelle demande d’adresse pendant les reprises. Les adresses rejetées restent exclues.


### Correction des imports différés — 17 octobre

Les passages des 15 et 16 octobre ont interrompu le remplissage lors de la confirmation d’un import Smartlead. Un contact accepté peut ne pas être visible dans la lecture immédiate. Le contrôle des volumes avait réussi séparément ; sa réussite ne prouvait pas celle du remplissage.

La confirmation relit désormais la campagne jusqu’à trois fois supplémentaires, dans la durée disponible. Un import encore invisible reste en attente, sans interrompre les autres lots ni compter comme réserve. Au passage suivant, les contacts déjà présents sont rapprochés avant une nouvelle vérification ou un nouvel import. Les statuts `INPROGRESS` et `COMPLETED` sont conservés dans le suivi, mais seuls `STARTED` avec vérification `valid` comptent dans la réserve. Un refus explicite d’import reste un échec visible. Le journal d’échec conserve aussi l’étape en cause, sans contenu ni secret du fournisseur.

À la demande d’Édouard, `node --env-file=.env.local scripts/replenish-outbound-now.mjs` peut effectuer une reprise immédiate, y compris le week-end. L’appel reste protégé par le secret du programme. Il contrôle les boîtes en simulation, remplit les campagnes actives et vérifie que leurs plafonds restent identiques. Il n’active aucune campagne et ne modifie aucun horaire. Le programme automatique conserve son horaire de 1 h et ses jours ouvrés.

Les reprises hébergées peuvent poursuivre la recherche en utilisant le curseur enregistré, après la récupération des demandes existantes. Toutes les reprises du même jour partagent les plafonds de 200 demandes d’adresse et de 200 vérifications ; les demandes sont enregistrées avant l’appel fournisseur. Aucun achat de crédits ni élargissement de cible.

### Reprise du contrôle — 26 octobre

Une réponse temporaire 502 de Smartlead a interrompu le contrôle avant le remplissage. Les lectures sont retentées et des passages de secours sont programmés lorsque le contrôle de 1 h échoue. Une reprise immédiate du stock reste possible sans modifier les plafonds des boîtes et utilise les mêmes limites de recherche et de vérification.

### Blocage par la date de préparation — 29 octobre

Le 27, 28 et 29 octobre, la date de préparation fournie par Smartlead a empêché la hausse et la recherche automatique, malgré des campagnes actives. Le contrôle utilise maintenant la dernière date non future à New York ; la réserve peut à nouveau être remplie si les autres conditions de sécurité sont satisfaites.
