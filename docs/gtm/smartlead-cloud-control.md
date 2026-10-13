# Contrôle Smartlead hébergé

## Décision du 13 octobre 2026 — quatre boîtes vers 40–45 envois

Le contrôle quotidien conserve son horaire de **01:00 Europe/Paris** et devient le plan de montée des quatre boîtes admises vers une moyenne de **43 courriels par jour ouvré chacune**. Le maximum est **45**, premiers messages et relances compris. Cette décision remplace les paliers et le maximum de 30 du 30 septembre pour ces quatre boîtes. Les nouvelles boîtes restent soumises à une admission explicite.

Départ : 11 pour `edouard@get3xrep.com`, 4 pour `alex.dubois@3xrepgrow.com`, `edouard.carter@3xrepgrow.com` et `john.moreau@3xrepgrow.com`. La base augmente de 2 après deux jours réellement employés tant qu’elle est sous 15 ; ensuite, de 3 après trois jours employés entre 15 et 29, puis de 2 après trois jours employés à partir de 30, jusqu’à 43. Un jour sans envoi ne compte pas. Une interruption ne provoque aucun rattrapage ni saut de plusieurs paliers.

Une variation de -2, 0, +2, -1 ou +1 est appliquée autour de la base sur les jours d’envoi, avec une phase propre à chaque boîte. À la base de 43, cela donne 41–45 et une moyenne de 43 sur cinq jours ouvrés. Une baisse de cette variation n’est pas un incident et ne redémarre pas la période d’observation. Le même jour ne peut pas être replanifié deux fois. Cette variation gère la capacité ; elle ne prouve pas la réception des messages.

Les contrôles de connexion, de préchauffage, d’attribution et de rebonds restent nécessaires. Au-delà de 15, il faut au moins 20 destinataires distincts cumulés par boîte ; au-delà de 25, 50 ; au-delà de 35, 100. À partir de 100 destinataires sans réponse détectée, les hausses attendent une revue de la cible et des messages. Un préchauffage sain ne prouve pas la réception des vrais courriels. Les règles de baisse ou d’arrêt pour un problème de livraison sont conservées ci-dessous. Les ouvertures ne pilotent pas la montée.

Le plan ne monte pas une boîte lorsque les campagnes sont en brouillon ou en pause. Les hausses commencent après de vrais jours d’envoi sur les nouvelles campagnes. Le calendrier théorique représente environ huit à neuf semaines de jours employés depuis les bases de départ, avant éventuelles pauses ou attentes de preuves ; ce n’est pas une date garantie pour atteindre 43.

## Séquences et suivi du test

Les quatre courriels de A et les quatre de B sont réunis dans [le document du test](cold-email-senior-beta-test.md). Campagnes Smartlead préparées : **4139326 (A)** et **4139384 (B)**, chacune avec les quatre boîtes rattachées. Les deux anciennes campagnes `4023139` et `4023140` restent en pause et sont synchronisées pour conserver l’historique ; elles ne constituent plus le test à piloter.

Le registre privé `outbound_sequences` garde la version, l’empreinte des textes, les quatre étapes, la campagne et le nom d’attribution à l’inscription. Les contacts importés dans A ou B reçoivent automatiquement `sequence_id` lors de la synchronisation. Les anciens envois ne sont pas réattribués à ces nouvelles versions.

Pour le prochain import, `assign_senior_beta_sequence` réserve une version à parts égales entre A et B. La réservation est stable en cas de reprise et empêche de prendre deux personnes de la même entreprise dans cette cohorte. Le contact doit déjà être qualifié pour ce test, avoir une adresse vérifiée et ne pas avoir été contacté, avoir répondu, rebondi ou demandé l’arrêt. La [recherche et vérification des nouveaux contacts](outbound-contact-sourcing.md) est maintenant intégrée au contrôle quotidien, avec un pilote de dix profils et un renouvellement conditionné aux campagnes actives.

`scripts/import-senior-outbound.mjs` prend les identifiants Supabase d’un lot approuvé, réserve A ou B, importe dans la campagne en brouillon ou en pause, puis synchronise. Il ne cherche personne et ne lance pas les campagnes. `--dry-run` relit les données sans réserver ni importer. Ce chemin sera utilisé après la qualification et la vérification du prochain lot.

Les événements d’envoi gardent l’étape, la boîte expéditrice, les ouvertures observées, les réponses détectées hors réponses marquées automatiques et les rebonds. Leur synchronisation met à jour l’engagement sans dupliquer les envois. Elle relit toutes les statistiques et réutilise l’attribution des envois déjà prouvée. Un nouvel envoi ou un expéditeur manquant entraîne une nouvelle lecture de l’historique du contact. Les écritures sont regroupées par lots pour éviter deux requêtes de base par ancien contact chaque nuit. `reply_category` permet de confirmer les réponses positives séparément. Les vues privées `outbound_sequence_results` et `outbound_sequence_steps` donnent les résultats par version et par étape. Les inscriptions, activations et premiers résultats du produit sont regroupés selon le nom de campagne transmis par les liens A et B ; cette attribution déclarative ne prouve pas une causalité.

Chaque contrôle réel met à jour `outbound_mailbox_daily` avec le plafond observé, le plafond prévu, la base, le motif, les statistiques de préchauffage et les mesures de livraison, sans contenu commercial ni destinataire. Les exécutions et les actions détaillées restent dans les journaux privés existants. Les refus Smartlead sont désormais enregistrés avec leur code HTTP, plutôt qu’un seul message générique d’échec.

Smartlead demande maintenant `max_new_leads_per_day` et refuse l’ancien champ `max_leads_per_day` dans la mise à jour du calendrier. Le contrôle réserve la capacité des relances attendues pour le prochain jour d’envoi, d’après les derniers messages réellement envoyés et les délais de la séquence. Le reste peut démarrer de nouveaux contacts, à parts égales entre A et B. Sans relance attendue, toute la capacité des boîtes est disponible ; le démarrage n’est plus limité à un quart. Si l’historique ou les étapes sont incomplets, il garde ce quart prudent et le signale dans `sendingPlan.uncertain`. Cette prévision ne remplace pas la file d’envoi réelle de Smartlead. L’éventuel contact supplémentaire est alterné entre A et B. Les plafonds par boîte continuent de limiter tous les envois, toutes campagnes confondues.

### Mise en place vérifiée

`node --env-file=.env.local scripts/setup-senior-outbound.mjs` applique uniquement `20261013200000_outbound_sequences_and_daily_plan.sql`, prépare les campagnes sans les lancer et reprend le programme existant. Une relance du script ne remet pas à zéro la progression des boîtes ni ne réécrit une séquence déjà peuplée.

Le 13 octobre, une simulation hébergée puis un contrôle réel ont réussi avec attribution complète : quatre campagnes synchronisées, 40 contacts historiques, 22 envois et trois rebonds. Les trois notifications indiquent un destinataire indisponible (deux codes 5.1.1, un code 5.2.1) et les contacts sont bloqués dans Smartlead. Leur revue est conservée dans l’état privé ; aucune hausse ne dépend d’un effacement de l’historique. Les plafonds restent 11 / 4 / 4 / 4 tant que les nouvelles campagnes ne sont pas lancées.

Le programme `3xrep-outbound-cloud-01h` est actif. Les campagnes A et B restent en brouillon. Le [pilote de recherche et vérification](outbound-contact-sourcing.md) a ajouté quatre contacts valides, deux dans chaque campagne, sans envoi. Le remplissage des prochains lots fait partie du même programme et attend des campagnes actives. La réserve vise trois jours ouvrés sur toute la capacité des boîtes, avec des lots de remplacement après vérification et au plus 200 vérifications par jour. Le manque de stock et la cause d’arrêt sont conservés dans le journal de recherche. Le parcours de gratuité à vie sur le site doit encore être aligné avant le lancement ; cette mise en place concerne Smartlead et le suivi privé, pas une publication du site.

## Plan initial du 30 septembre — historique

Décision du 30 septembre 2026 : les deux tâches locales deviennent une fonction Supabase autonome, `outbound-control`, dans le projet **3xrep** (`lulnuqhgyqfkhjnuvpsd`). Elle synchronise les deux campagnes existantes vers Supabase et applique les plafonds autorisés par adresse. Elle ne dépend ni du Mac, ni de Codex, ni d'une publication du site. Le code a été préparé sur `feat/smartlead-cloud`, depuis `pre_main`.

## Horaire et périmètre

Une exécution par jour à **01:00 Europe/Paris**. PostgreSQL programme deux heures candidates en UTC, avec une condition sur l'heure de Paris : une seule appelle la fonction. Cela conserve 01:00 en été et en hiver sans modifier le fuseau de la base. À cette heure il est encore la veille à New York ; le contrôle prépare donc le prochain jour d'envoi américain. Aucune hausse pour un samedi ou un dimanche. Les campagnes restent du lundi au vendredi, de 09:00 à 17:00, America/New_York.

Campagnes : `4023139` et `4023140`. Quatre boîtes initialement admises : `23568551`, `24049951`, `24049938`, `24049619`. Les futures boîtes des domaines `get3xrep.com` et `3xrepgrow.com` sont découvertes mais restent candidates, sans nouveau rattachement ni hausse tant qu'elles ne sont pas admises. Les autres domaines ne sont pas pilotés.

Chaque boîte suit la date de son propre début de préchauffage. Les sept premiers jours sont sans prospection ; les sept suivants ont un plafond de 2 vrais courriels par jour ouvré ; les trois paliers suivants sont 5, 15 et 25. Le préchauffage continue. Les plafonds incluent les premiers messages et les relances, toutes campagnes confondues ; ils excluent les messages de préchauffage. Les trois nouvelles boîtes ne rejoignent les campagnes qu'au démarrage validé du palier 2, au plus tôt le 7 octobre.

Une hausse exige une connexion valide, un préchauffage actif sans blocage, des statistiques récentes, au moins 20 envois de préchauffage observés et au moins 95 % en boîte de réception dans ces statistiques. Cela ne prouve pas la réception des vrais messages. Avant 15 : cinq jours ouvrés effectivement utilisés à 5 et au moins 20 prospects distincts cumulés. Avant 25 : cinq jours effectivement utilisés à 15 et au moins 50 prospects distincts cumulés. Le calendrier seul ne suffit pas ; aucun saut de palier après une interruption.

Marge de 20 % : une majoration se calcule depuis le palier nominal et exige cinq jours effectifs, au moins 50 prospects distincts dans la fenêtre et moins de 1 % de rebonds. Maximum autorisé : 30 par boîte. Aucun bonus au palier 2. Une baisse de 20 % n'est pas répétée pour les mêmes incidents. Après une baisse, cinq jours effectifs et la résolution des incidents sont nécessaires avant de remonter.

## Rebonds et données manquantes

Les envois sont attribués à la boîte grâce à l'expéditeur du message envoyé dans l'historique Smartlead, puis reliés à la statistique par `stats_id`. Aucun taux global de campagne ne devient arbitrairement un taux par adresse. Une attribution manquante bloque les hausses. Une autre campagne associée à la même boîte doit être examinée ; tant qu'elle est hors du périmètre autorisé, aucune hausse de cette boîte.

Les rebonds sont dédupliqués par destinataire. La fenêtre couvre les sept jours précédents et surveille aussi les événements récents. Sur moins de 50 destinataires, un rebond demande une revue, sans extrapoler un pourcentage. À partir de 50 : moins de 1 % permet une hausse si les autres conditions passent ; 1–2 % maintient ; 2–5 % réduit de 20 % ; 5 % ou plus arrête la boîte. Un refus concernant l'expéditeur, une connexion défaillante, un blocage ou une plainte connue provoque aussi un arrêt. Ces seuils sont nos règles d'exploitation, pas des garanties ni des seuils officiels Smartlead.

Un incident non résolu reste dans l'état même lorsqu'il sort de la fenêtre. Pour le résoudre, un opérateur documente les preuves et ajoute son identifiant à `resolved_bounce_ids` dans l'état privé de la boîte. Ne pas effacer un incident pour débloquer une hausse sans avoir compris sa cause. Une boîte arrêtée nécessite une décision explicite pour être remise en campagne. Le contrôle bloque également une nouvelle hausse à partir de 100 prospects distincts sans réponse détectée ; les réponses détectées ne garantissent pas qu'il s'agit d'une réponse humaine pertinente et demandent une revue commerciale.

Les problèmes d'un domaine partagé bloquent les hausses de ses boîtes. Le plafond d'une boîte ne compense jamais celui d'une autre arrêtée. Les ouvertures ne pilotent pas les hausses. L'API ne donnant pas une mesure exhaustive des plaintes, l'absence de plainte dans ces résultats ne prouve pas leur absence ; une plainte connue doit être enregistrée en `known_complaint`.

## Données, sécurité et reprise

- `outbound_mailboxes` : admission et état par identifiant de boîte.
- `outbound_control_runs` : début, résultat, fin et échecs du contrôle.
- `outbound_control_actions` : chaque mutation préparée puis confirmée après relecture de Smartlead. Une action inachevée reste visible.
- `outbound_control_lease` : un verrou de cinq minutes empêche deux contrôles simultanés.

Ces quatre tables sont privées, avec accès réservé au rôle serveur. La synchronisation garde les tables portables existantes, sans contenu des messages. Les statistiques d'attribution sont calculées en mémoire ; le journal ne conserve ni destinataires, ni corps de messages, ni identifiants SMTP/IMAP. La clé Smartlead reste dans les secrets de la fonction. Un secret d'appel distinct est placé dans Supabase Vault. Même avec la vérification JWT de la passerelle désactivée, la fonction refuse tout appel sans ce secret, comparé via des empreintes SHA-256.

La synchronisation conserve l’historique complet et reste sans doublons. Depuis le 13 octobre, elle relit toutes les statistiques et réutilise les expéditeurs déjà prouvés ; les envois nouveaux ou incomplets sont relus dans l’historique Smartlead. Une panne n'entraîne jamais une hausse pour rattraper le temps écoulé. Les plafonds déjà appliqués continuent chez Smartlead. Les erreurs et les décisions sont consultables dans Supabase ; ce programme ne pousse pas de notification dans Codex lorsque l'application est fermée. Il n'envoie pas de message à un tiers.

La fonction a une durée limitée par Supabase. À un volume beaucoup plus élevé de prospects, le traitement devra être fractionné avec des points de reprise. Un dépassement ne valide pas un palier. Vérifier les dernières exécutions et les actions inachevées dans les tables privées ; une ligne `running` vieille de plus de cinq minutes signale une interruption. Le journal du programme PostgreSQL confirme l'appel, mais seul `outbound_control_runs` confirme la réussite de la fonction.

## Déploiement et exploitation

`node --env-file=.env.local scripts/deploy-outbound-cloud.mjs`

Le script vérifie le projet, applique uniquement `20260930200000_outbound_cloud_control.sql` et l'enregistre dans le registre de migrations. Il ne répare pas l'historique distant et ne rejoue pas les anciennes migrations. Pour le premier déploiement, il reprend les quatre admissions du fichier local `data/outbound/ramp-up-state.json`, hors git. Les déploiements suivants utilisent l'état déjà en base et ne le réinitialisent pas.

Il transfère uniquement les secrets nécessaires, déploie la fonction, exige un refus 401 sans secret, exécute une simulation puis un contrôle réel et vérifie l'attribution complète avant d'activer `3xrep-outbound-cloud-01h`. Il réutilise le secret d'appel existant lors d'un redéploiement et supprime ses fichiers temporaires. Ne jamais afficher les secrets ni les réponses complètes des comptes Smartlead.

Tests : `npm test` inclut les règles de volume, l'attribution, les changements d'heure, les échantillons insuffisants, les contrôles de relecture, le verrou et les droits des tables. `npm run lint` et `npm run build` vérifient le reste du projet. Les fonctions Deno sont séparées du périmètre TypeScript Next.js ; leur exécution réelle est vérifiée sur Supabase.

Pour suspendre le programme sans toucher aux campagnes : `select cron.unschedule('3xrep-outbound-cloud-01h');`. Cela arrête les futurs changements automatiques ; les plafonds déjà appliqués restent en place. Les deux tâches Codex locales ne sont désactivées qu'après la réussite du déploiement et du premier contrôle hébergé.
