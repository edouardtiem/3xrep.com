# Retours dans la conversation — 30 septembre 2026

Décision : trois parcours, pendant la bêta et dans la version payante. Avis ciblé après l’aide, suivi de l’action sur un retour naturel à la même affaire, message spontané. Pas de message autonome du serveur.

## Demander et transmettre

Le serveur ajoute `feedback.ask_now` aux résultats utiles. Il réserve atomiquement une invitation pour l’organisation entière, au premier résultat puis au maximum une par sept jours. La réservation ne prouve pas que l’assistant a posé la question. Une question ignorée n’entraîne pas de relance. L’assistant traduit la question dans la langue de la personne, après l’aide complète, et la saute si une question de suivi est déjà posée ou si le travail est urgent.

L’assistant montre les mots qui seront envoyés à 3xrep et explique la conservation de 180 jours. Il demande l’accord, sauf si la personne vient explicitement de demander l’envoi de ce texte. Aucun avis déduit du silence. Aucun client, courriel ou transcription ajouté au retour. Si une suppression est nécessaire, la personne approuve le texte expurgé. Une catégorie peut être déduite séparément ; la réponse exacte ne devient pas un résumé.

`share_feedback` sépare `opinion`, `action`, `outcome` et `spontaneous`. Une action ou un résultat ne reçoit pas de note de satisfaction. Un retour spontané peut n’avoir aucun `output_id`. Le serveur vérifie l’appartenance d’un résultat à l’organisation ; la base impose aussi cette séparation. Un nouvel avis sur le même résultat met à jour l’avis sans écraser l’action ni le résultat rapporté. Les anciens résultats restent acceptés avec une version moteur déclarée inconnue.

## Suivi de l’affaire

Uniquement si un dossier local est déjà autorisé, l’assistant garde dans la note de l’affaire l’identifiant du résultat, la prochaine action et l’état de la question de suivi. Sur un retour naturel à cette affaire, il demande si l’action a été essayée et ce qui s’est passé. Une seule question de retour par conversation. Pas de rendez-vous automatique. Les fichiers locaux ne sont pas des retours envoyés à 3xrep. Un dossier perdu ou une conversation sans mémoire ne garantit pas le suivi. Un identifiant perdu donne un retour spontané sans lien inventé.

## Stockage et traitement

`feedback_outputs` garde seulement outil, version du contrat moteur et date. Aucun texte de stratégie ou citation automatiquement recopié. `shared_context` est un extrait court approuvé, facultatif. Cela explique un avis après la purge de quatorze jours, sans promettre une reproduction complète du jugement. La version doit être mise à jour quand le moteur ou son contrat change.

`user_feedback` garde question, mots exacts, type, note explicite éventuelle, catégorie, contexte approuvé et état de traitement. Les corrections ne prolongent pas la date d’expiration initiale. Les données expirent après 180 jours ; une tâche horaire les supprime. La même durée s’applique aux anciens avis bêta. L’organisation est connue, pas une personne fiable avec une clé partagée.

Liste privée : `GET /api/admin/feedback`, protégée par la même authentification que l’administration Founding. Traitement : `PATCH` avec `id`, `status` (`new`, `reviewing`, `fixed`, `needs_details`) et `note` facultative. Cette route fonctionne indépendamment de l’ouverture de la bêta. Le tableau Founding expose aussi `productFeedback` à côté des anciens avis. Aucun courriel envoyé automatiquement.

## Mise en service et recette

Appliquer les migrations `20260930190000_user_feedback.sql` et `20260930190100_feedback_retention_job.sql`, puis déployer le serveur. Ce document ne confirme pas leur application en production.

Dans chaque application cible, vérifier : première aide puis question courte, seconde aide sans nouvelle invitation, question ignorée sans relance, partage refusé sans appel, message explicitement envoyé sans confirmation répétée, mots exacts conservés, suivi sur la bonne affaire depuis la note locale, action et résultat distincts, aucune affirmation de sauvegarde après une erreur. Les instructions MCP ne garantissent pas l’obéissance de l’assistant ; cette recette reste nécessaire.
