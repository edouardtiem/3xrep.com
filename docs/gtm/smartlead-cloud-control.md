# Contrôle Smartlead hébergé

## Décision du 21 octobre — alerte de livraison et reprise automatique à 7

Une nouvelle alerte de livraison ramène la boîte concernée à **7 envois par jour**, sans augmenter un plafond déjà inférieur. Après **trois journées réelles d’envoi sans nouvelle alerte**, elle remonte de **2 après deux jours sains** jusqu’à sa base précédente, puis retrouve le rythme normal. Un incident déjà pris en charge ne déclenche pas une nouvelle baisse chaque nuit. La cible 44–48 reste la même.

Cette règle remplace la division de moitié et l’arrêt général sur le seul signal `sender_bounce`. Une connexion coupée, un blocage effectif du fournisseur ou une plainte connue reste un motif d’arrêt ; aucune reprise n’a lieu tant que cet état persiste. Les arrêts techniques autorisent la reprise automatique à 7 une fois la connexion et le préchauffage rétablis et l’attribution complète. Un ancien arrêt manuel inconnu n’est pas réactivé automatiquement.

Le refus Mimecast du 19 octobre est conservé dans l’historique. La boîte `edouard@get3xrep.com` est autorisée à reprendre à 7 dans A et B ; les anciennes campagnes en pause ne sont pas rattachées. Le destinataire rejeté reste terminé dans Smartlead et exclu des relances.

Les prévisions de la semaine du 19 octobre supposant quatre boîtes en montée normale sont désormais historiques. Les volumes réels suivent les trois boîtes actives et la boîte en reprise.

## Décision du 17 octobre 2026 — quatre boîtes vers 44–48 envois

Le contrôle quotidien conserve son horaire de **01:00 Europe/Paris** et devient le plan de montée des quatre boîtes admises vers une moyenne de **46 courriels par jour ouvré chacune**. Le maximum est **48**, premiers messages et relances compris. Cette décision remplace le rythme et la cible des 13 et 14 octobre pour ces quatre boîtes, sans réinitialiser leur progression. Les nouvelles boîtes restent soumises à une admission explicite.

Départ historique : 11 pour `edouard@get3xrep.com`, 4 pour `alex.dubois@3xrepgrow.com`, `edouard.carter@3xrepgrow.com` et `john.moreau@3xrepgrow.com`. Depuis la décision du 17 octobre, la base augmente de **5 après deux jours d’envoi sains**, sans dépasser **46**. Il n’y a plus de palier imposé à 20 ou 40. Les bases acquises au 17 octobre restent 14 / 7 / 7 / 7 ; leurs jours d’observation restent conservés. Une journée ne compte qu’une fois terminée dans la plage américaine. Un rebond remet à zéro la série de jours sains. Chaque hausse repart de zéro pour observer le nouveau volume. Un jour sans envoi ne compte pas. Une interruption ne provoque aucun rattrapage ni saut de plusieurs paliers.

Une variation de -2, 0, +2, -1 ou +1 est appliquée autour de la base sur les jours d’envoi, avec une phase propre à chaque boîte. À la base de 46, cela donne 44–48 et une moyenne de 46 sur cinq jours ouvrés. Une baisse de cette variation n’est pas un incident et ne redémarre pas la période d’observation. Le même jour ne peut pas être replanifié deux fois pour monter ou varier. Un nouvel incident confirmé peut toutefois déclencher une baisse ou un arrêt le même jour. Pendant la reprise après incident, la variation est suspendue. Cette variation gère la capacité ; elle ne prouve pas la réception des messages.

Les contrôles de connexion, de préchauffage, d’attribution et de rebonds restent nécessaires. Au-delà de 15, il faut au moins 20 destinataires distincts cumulés par boîte ; au-delà de 25, 50 ; au-delà de 35, 100. Depuis le 15 octobre, à partir de 100 destinataires distincts par boîte sans réponse détectée, le contrôle consigne le signal `no_reply_after_100_contacts` sans bloquer la hausse. Ce signal est conservé dans les décisions du contrôle et les mesures quotidiennes privées. Un préchauffage sain ne prouve pas la réception des vrais courriels. Les règles de baisse ou d’arrêt pour un problème de livraison sont détaillées ci-dessous. Une revue commerciale peut aussi être demandée avec `targeting_review_required` : les plafonds restent alors fixes. Les réponses négatives doivent être examinées ; leur catégorie commerciale n’est pas déduite automatiquement par le contrôleur. Les ouvertures ne pilotent pas la montée.

Le plan ne monte pas une boîte lorsque les campagnes sont en brouillon ou en pause. Les hausses commencent après de vrais jours d’envoi sur les nouvelles campagnes. Les preuves de destinataires distincts restent nécessaires ; aucune date d’arrivée à 46 n’est garantie.

## Séquences et suivi du test

Les quatre courriels de A et les quatre de B sont réunis dans [le document du test](cold-email-senior-beta-test.md). Campagnes Smartlead préparées : **4139326 (A)** et **4139384 (B)**, chacune avec les quatre boîtes rattachées. Les deux anciennes campagnes `4023139` et `4023140` restent en pause et sont synchronisées pour conserver l’historique ; elles ne constituent plus le test à piloter.

Le registre privé `outbound_sequences` garde la version, l’empreinte des textes, les quatre étapes, la campagne et le nom d’attribution à l’inscription. Les contacts importés dans A ou B reçoivent automatiquement `sequence_id` lors de la synchronisation. Les anciens envois ne sont pas réattribués à ces nouvelles versions.

Pour le prochain import, `assign_senior_beta_sequence` réserve une version à parts égales entre A et B. La réservation est stable en cas de reprise et empêche de prendre deux personnes de la même entreprise dans cette cohorte. Le contact doit déjà être qualifié pour ce test, avoir une adresse vérifiée et ne pas avoir été contacté, avoir répondu, rebondi ou demandé l’arrêt. La [recherche et vérification des nouveaux contacts](outbound-contact-sourcing.md) est maintenant intégrée au contrôle quotidien, avec un pilote de dix profils et un renouvellement conditionné aux campagnes actives.

`scripts/import-senior-outbound.mjs` prend les identifiants Supabase d’un lot approuvé, réserve A ou B, importe dans la campagne en brouillon ou en pause, puis synchronise. Il ne cherche personne et ne lance pas les campagnes. `--dry-run` relit les données sans réserver ni importer. Ce chemin sera utilisé après la qualification et la vérification du prochain lot.

Les événements d’envoi gardent l’étape, la boîte expéditrice, les ouvertures et clics observés, les réponses détectées hors réponses marquées automatiques et les rebonds. Leur synchronisation met à jour l’engagement sans dupliquer les envois. Elle relit toutes les statistiques et réutilise l’attribution des envois déjà prouvée. Un nouvel envoi ou un expéditeur manquant entraîne une nouvelle lecture de l’historique du contact. Les écritures sont regroupées par lots pour éviter deux requêtes de base par ancien contact chaque nuit. `reply_category` permet de confirmer les réponses positives séparément. Les vues privées `outbound_sequence_results` et `outbound_sequence_steps` donnent les résultats par version et par étape. Les inscriptions, activations et premiers résultats du produit sont regroupés selon le nom de campagne transmis par les liens A et B ; cette attribution déclarative ne prouve pas une causalité.

Chaque contrôle réel met à jour `outbound_mailbox_daily` avec le plafond observé, le plafond prévu, la base, le motif, les statistiques de préchauffage et les mesures de livraison, sans contenu commercial ni destinataire. Les exécutions et les actions détaillées restent dans les journaux privés existants. Les refus Smartlead sont désormais enregistrés avec leur code HTTP, plutôt qu’un seul message générique d’échec.

Smartlead demande maintenant `max_new_leads_per_day` et refuse l’ancien champ `max_leads_per_day` dans la mise à jour du calendrier. Le contrôle réserve la capacité des relances attendues pour le prochain jour d’envoi, d’après les derniers messages réellement envoyés et les délais de la séquence. Le reste peut démarrer de nouveaux contacts, à parts égales entre A et B. Sans relance attendue, toute la capacité des boîtes est disponible ; le démarrage n’est plus limité à un quart. Si l’historique ou les étapes sont incomplets, il garde ce quart prudent et le signale dans `sendingPlan.uncertain`. Cette prévision ne remplace pas la file d’envoi réelle de Smartlead. L’éventuel contact supplémentaire est alterné entre A et B. Les plafonds par boîte continuent de limiter tous les envois, toutes campagnes confondues.

### Mise en place vérifiée

`node --env-file=.env.local scripts/setup-senior-outbound.mjs` applique uniquement `20261013200000_outbound_sequences_and_daily_plan.sql`, prépare les campagnes sans les lancer et reprend le programme existant. Une relance du script ne remet pas à zéro la progression des boîtes ni ne réécrit une séquence déjà peuplée.

Le 13 octobre, une simulation hébergée puis un contrôle réel ont réussi avec attribution complète : quatre campagnes synchronisées, 40 contacts historiques, 22 envois et trois rebonds. Les trois notifications indiquent un destinataire indisponible (deux codes 5.1.1, un code 5.2.1) et les contacts sont bloqués dans Smartlead. Leur revue est conservée dans l’état privé ; aucune hausse ne dépend d’un effacement de l’historique. Les plafonds restent 11 / 4 / 4 / 4 tant que les nouvelles campagnes ne sont pas lancées.

Le programme `3xrep-outbound-cloud-01h` est actif. Les campagnes A et B ont été activées explicitement le 14 octobre. Le [pilote de recherche et vérification](outbound-contact-sourcing.md) a ajouté quatre contacts valides, deux dans chaque campagne, sans envoi. Le remplissage des prochains lots fait partie du même programme pour les campagnes actives. La réserve vise trois jours ouvrés sur toute la capacité des boîtes, avec des lots de remplacement après vérification et au plus 200 vérifications par jour. Le manque de stock et la cause d’arrêt sont conservés dans le journal de recherche. Le parcours de gratuité à vie sur le site reste à aligner ; le lancement Smartlead a été explicitement autorisé le 14 octobre et ne publie pas le site.

Le rythme accéléré du 14 octobre est déployé dans la fonction existante avec `scripts/deploy-outbound-stock.mjs`. Simulation `5c077bcf-0138-4ce7-8e3a-b4eb195eb49b`, puis contrôle réel `4fc6f308-b353-4299-b1c3-99ae06894071` : attribution complète, politique `accelerated-2026-10-14` relue dans le journal privé, plafonds 11 / 4 / 4 / 4 maintenus faute de jours réellement employés. A et B sont relues actives, quatre étapes et quatre boîtes chacune, suivi activé et arrêt après réponse. Réserve : 35 contacts prêts dans A, 34 dans B. Le programme de 1 h est actif avec sa condition sur l’heure de Paris. Les 229 tests et le contrôle de style passent, notamment la réduction unique, la reprise après trois jours sains et le refus de valider un plafond sans relecture native réussie.

## Prévision du 17 octobre

Depuis les bases 14 / 7 / 7 / 7, avec une journée saine déjà acquise au nouveau palier, des envois chaque jour ouvré, une réserve suffisante, les preuves de destinataires nécessaires et aucun incident : lundi 19 octobre, 35 envois ; mardi 20, 58 ; mercredi 21, 51 ; jeudi 22, 79 ; vendredi 23, 72. Ce sont des plafonds quotidiens pour les quatre boîtes réunies, premiers messages et relances compris. Les variations expliquent les baisses ponctuelles. Cette prévision remplace celle du 14 octobre ; le bilan commercial reste fixé à 500 personnes distinctes.

À terme : 184 envois par jour en moyenne, avec au plus 48 par boîte et donc 192 si les quatre plafonds culminaient ensemble. Les phases étant décalées, ce maximum théorique global n’est pas un objectif quotidien.

## Activation et prévision du 14 octobre — historique

A et B sont relues avec le statut `ACTIVE`, quatre étapes conformes et les quatre boîtes. Le suivi Smartlead est entièrement activé (`track_settings=[]`), notamment les clics auparavant désactivés. Les reprises courtes partagent le budget quotidien ; `20261014030000_outbound_reconciliation_queue.sql` permet au plus quatre suites automatiques après une reprise ayant avancé puis atteint sa durée limite. Le verrou et la lecture du budget des passages précédents évitent les doublons.

La migration `20261014020000_outbound_click_tracking.sql` ajoute `outbound_send_events.clicked_at` et les nombres de messages avec clic observé aux vues privées par séquence et étape. La synchronisation relit les statistiques pour récupérer les clics tardifs, sans garder les liens cliqués ni les corps des messages. Les envois, ouvertures, réponses détectées, réponses positives confirmées, rebonds, désinscriptions, inscriptions et usage attribué restent suivis. Les pixels et clics automatiques ne prouvent pas une lecture humaine.

Prévision recalculée avec le rythme accéléré du 14 octobre, départ mercredi 14 octobre, capacité utilisée chaque jour ouvré, préchauffage et connexions sains, aucune nouvelle anomalie, réserve suffisante et aucune suspension commerciale décidée manuellement. Les relances utilisent les délais 4 / 5 / 7 jours et passent avant les nouveaux contacts dans la simulation. Ce sont des plafonds possibles, pas des envois acquis.

| Date / période | Prévision totale, relances comprises |
| --- | --- |
| Premier jour, 14 octobre | 23 envois maximum |
| Vendredi 23 octobre | Environ 56 envois par jour : première boîte 18, trois autres 11–15 |
| Semaine du 19 au 23 octobre | Environ 250 envois |
| Du 14 au 23 octobre | Environ 330 envois cumulés |

Sous ces hypothèses, la première boîte atteint une base de 43 vers le **5 novembre**, les trois autres vers le **13 novembre**. Les premiers jours à 45 arrivent vers le **10 novembre** pour la première et entre le **13 et le 19 novembre** pour les autres, selon leurs variations. Cette prévision remplace celle de mi-décembre calculée avant l’accélération. La simulation supprime les relances du contact qui a répondu ; ses réponses et envois sont fictifs et ne sont jamais enregistrés dans Supabase. La cible durable est une moyenne de 43, avec 41–45 selon les jours : environ 172 envois par jour pour les quatre boîtes, pas 180 tous les jours. Une pause, un manque de stock, une attribution incomplète ou une suspension commerciale décidée manuellement peut retarder ces dates. Le programme ne pousse pas les volumes pour tenir une date.

## Plan initial du 30 septembre — historique

Décision du 30 septembre 2026 : les deux tâches locales deviennent une fonction Supabase autonome, `outbound-control`, dans le projet **3xrep** (`lulnuqhgyqfkhjnuvpsd`). Elle synchronise les deux campagnes existantes vers Supabase et applique les plafonds autorisés par adresse. Elle ne dépend ni du Mac, ni de Codex, ni d'une publication du site. Le code a été préparé sur `feat/smartlead-cloud`, depuis `pre_main`.

## Horaire et périmètre

Une exécution par jour à **01:00 Europe/Paris**. PostgreSQL programme deux heures candidates en UTC, avec une condition sur l'heure de Paris : une seule appelle la fonction. Cela conserve 01:00 en été et en hiver sans modifier le fuseau de la base. À cette heure il est encore la veille à New York ; le contrôle prépare donc le prochain jour d'envoi américain. Aucune hausse pour un samedi ou un dimanche. Les campagnes restent du lundi au vendredi, de 09:00 à 17:00, America/New_York.

Campagnes : `4023139` et `4023140`. Quatre boîtes initialement admises : `23568551`, `24049951`, `24049938`, `24049619`. Les futures boîtes des domaines `get3xrep.com` et `3xrepgrow.com` sont découvertes mais restent candidates, sans nouveau rattachement ni hausse tant qu'elles ne sont pas admises. Les autres domaines ne sont pas pilotés.

Chaque boîte suit la date de son propre début de préchauffage. Les sept premiers jours sont sans prospection ; les sept suivants ont un plafond de 2 vrais courriels par jour ouvré ; les trois paliers suivants sont 5, 15 et 25. Le préchauffage continue. Les plafonds incluent les premiers messages et les relances, toutes campagnes confondues ; ils excluent les messages de préchauffage. Les trois nouvelles boîtes ne rejoignent les campagnes qu'au démarrage validé du palier 2, au plus tôt le 7 octobre.

Une hausse exige une connexion valide, un préchauffage actif sans blocage, des statistiques récentes, au moins 20 envois de préchauffage observés et au moins 95 % en boîte de réception dans ces statistiques. Cela ne prouve pas la réception des vrais messages. Avant 15 : cinq jours ouvrés effectivement utilisés à 5 et au moins 20 prospects distincts cumulés. Avant 25 : cinq jours effectivement utilisés à 15 et au moins 50 prospects distincts cumulés. Le calendrier seul ne suffit pas ; aucun saut de palier après une interruption.

Marge de 20 % : une majoration se calcule depuis le palier nominal et exige cinq jours effectifs, au moins 50 prospects distincts dans la fenêtre et moins de 1 % de rebonds. Maximum autorisé : 30 par boîte. Aucun bonus au palier 2. Une baisse de 20 % n'est pas répétée pour les mêmes incidents. Après une baisse, cinq jours effectifs et la résolution des incidents sont nécessaires avant de remonter.

## Alertes de livraison et données manquantes

Un rebond ou refus nouveau, y compris un signal `sender_bounce`, déclenche la reprise à 7 sur la boîte concernée. Les événements d’un même destinataire déjà pris en charge ne provoquent pas une nouvelle baisse. Les identifiants traités restent dans `handled_bounce_ids` et `handled_delivery_incident_ids` ; l’historique et les anciens éléments de résolution sont conservés. Les adresses rejetées, désinscrites ou ayant répondu restent exclues de la prospection. Une nouvelle alerte pendant la reprise recommence l’observation à 7, une seule fois pour cet incident.

Les refus temporaires connus peuvent être consignés dans `delivery_incidents` avec leur identifiant, leur date et `confirmed=true`. Ils suivent la même règle à 7 ; il n’est plus nécessaire de supprimer l’incident ou de lui attribuer une résolution manuelle pour compter des journées saines après sa prise en charge. Une absence d’ouverture ou de réponse n’est pas une alerte de livraison. L’absence de réponse après 100 contacts reste un signal sans blocage commercial automatique ; le bilan reste prévu à 500 personnes distinctes.

**Reprise :** au moins trois journées effectivement utilisées à volume réduit sans nouvel incident, puis +2 après deux journées saines jusqu’à `daily_plan.recovery_target`. La variation est suspendue pendant cette remontée. Une journée sans envoi ne compte pas. Le retour à la base précédente permet ensuite de reprendre +5 après deux jours sains et la variation autour de la cible de 46.

Une connexion défaillante, un blocage déclaré par le fournisseur ou une plainte connue arrête les envois. Le contrôle peut rétablir une boîte marquée `auto_delivery_recovery=true` à 7 une fois les conditions techniques rétablies. Une plainte connue doit être examinée avant de lever son indicateur. Les arrêts manuels sans autorisation de reprise restent arrêtés. La réassociation ne porte que sur les campagnes contrôlées et actives ; jamais sur une ancienne campagne en pause. Chaque changement de plafond et de rattachement est relu dans Smartlead. Un échec de rattachement conserve le plafond déjà vérifié et l’état arrêté pour permettre une reprise sûre.

Les données manquantes et l’attribution incomplète empêchent une hausse automatique. Les seuils de destinataires distincts restent nécessaires au-dessus de 15, 25 et 35. Le contrôle agit à 1 h ; il ne surveille pas les incidents en temps réel.

**Capacité des relances :** l’expéditeur d’origine est retrouvé dans l’historique. Les relances d’une boîte absente des campagnes actives ne réservent aucune place aux autres boîtes. Une boîte reprise à 7 ne réserve au plus que 7 places, même si elle a 19 relances en attente. Les autres places restent disponibles pour de nouveaux contacts. Les relances différées restent visibles dans `sendingPlan.deferredFollowups` ; une attribution manquante conserve un calcul prudent signalé par `uncertain`. Le remplissage de la réserve suit la capacité effectivement active et reste possible pendant les trois jours d’observation d’une boîte à 7.

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

### Reprise après une erreur temporaire — 26 octobre

Le contrôle de 1 h a échoué le 26 octobre sur une réponse 502 de Smartlead. Les lectures Smartlead retentent désormais jusqu'à trois fois les erreurs temporaires et les erreurs de connexion. Les écritures ne sont pas répétées automatiquement. Trois contrôles de secours sont programmés à 1 h 15, 1 h 30 et 1 h 45, heure de Paris. Ils ne démarrent qu'après un échec du jour, en l'absence d'un contrôle réel réussi ou encore en cours. Le verrou du contrôle et les règles de planification restent en place.
