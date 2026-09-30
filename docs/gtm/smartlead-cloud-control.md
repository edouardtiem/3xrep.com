# Contrôle Smartlead hébergé

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

La synchronisation relit l'historique complet et reste sans doublons. Une panne n'entraîne jamais une hausse pour rattraper le temps écoulé. Les plafonds déjà appliqués continuent chez Smartlead. Les erreurs et les décisions sont consultables dans Supabase ; ce programme ne pousse pas de notification dans Codex lorsque l'application est fermée. Il n'envoie pas de message à un tiers.

La fonction a une durée limitée par Supabase. À un volume beaucoup plus élevé de prospects, le traitement devra être fractionné avec des points de reprise. Un dépassement ne valide pas un palier. Vérifier les dernières exécutions et les actions inachevées dans les tables privées ; une ligne `running` vieille de plus de cinq minutes signale une interruption. Le journal du programme PostgreSQL confirme l'appel, mais seul `outbound_control_runs` confirme la réussite de la fonction.

## Déploiement et exploitation

`node --env-file=.env.local scripts/deploy-outbound-cloud.mjs`

Le script vérifie le projet, applique uniquement `20260930200000_outbound_cloud_control.sql` et l'enregistre dans le registre de migrations. Il ne répare pas l'historique distant et ne rejoue pas les anciennes migrations. Pour le premier déploiement, il reprend les quatre admissions du fichier local `data/outbound/ramp-up-state.json`, hors git. Les déploiements suivants utilisent l'état déjà en base et ne le réinitialisent pas.

Il transfère uniquement les secrets nécessaires, déploie la fonction, exige un refus 401 sans secret, exécute une simulation puis un contrôle réel et vérifie l'attribution complète avant d'activer `3xrep-outbound-cloud-01h`. Il réutilise le secret d'appel existant lors d'un redéploiement et supprime ses fichiers temporaires. Ne jamais afficher les secrets ni les réponses complètes des comptes Smartlead.

Tests : `npm test` inclut les règles de volume, l'attribution, les changements d'heure, les échantillons insuffisants, les contrôles de relecture, le verrou et les droits des tables. `npm run lint` et `npm run build` vérifient le reste du projet. Les fonctions Deno sont séparées du périmètre TypeScript Next.js ; leur exécution réelle est vérifiée sur Supabase.

Pour suspendre le programme sans toucher aux campagnes : `select cron.unschedule('3xrep-outbound-cloud-01h');`. Cela arrête les futurs changements automatiques ; les plafonds déjà appliqués restent en place. Les deux tâches Codex locales ne sont désactivées qu'après la réussite du déploiement et du premier contrôle hébergé.
