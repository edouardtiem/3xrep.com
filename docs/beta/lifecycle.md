# Messages liés à l’usage

Aucun fournisseur de courriel n’existe dans le dépôt. `beta_lifecycle` fournit les segments ; aucune tâche ne les envoie. Ne pas brancher une boîte personnelle comme expéditeur automatique.

Décision du 13 octobre : [3xrep gratuit à vie pour les premières organisations](../decisions.md#2026-10-13--une-seule-offre-gratuite-à-vie-pour-les-premières-organisations). Une seule offre, sans sélection après usage. Les segments techniques existent encore selon les anciennes règles ; `qualified` ne doit plus servir à annoncer une candidature conditionnelle. Une organisation bénéficiaire de la promesse à vie ne reçoit pas de message de fin d’accès, même si son attribution technique reste à finaliser.

À l’ajout d’un fournisseur : mémoriser `(organisation, type de message, version)` avec une contrainte unique avant envoi ; utiliser sa clé d’idempotence ; respecter désinscription et arrêt après réponse ; maximum un message comportemental par semaine, hors confirmation d’attribution demandée. Recontrôler le segment juste avant envoi. Ne jamais utiliser un résultat commercial dans le message.

| Segment | Déclencheur | Objet | Texte anglais |
| --- | --- | --- | --- |
| `not_activated` | Inscription depuis 2 jours, seuil d’activation non atteint | your first deal | Open your usual AI chat and ask 3xrep about one real deal. Your saved connector key is all you need. If you got stuck connecting it, tell me where. |
| `activated` | Seuil d’activation atteint | did it help? | You’ve used 3xrep across a few days. What did it help you do? What missed the mark? A short reply is enough. |
| `qualified` | Ancien segment de qualification après usage | — | Ne plus utiliser ce segment pour annoncer une sélection : la décision du 13 octobre supprime cette condition. |
| `founding_granted` | Attribution terminée et facturation vérifiée | your 3xrep workspace | Your organization now has free forever access to 3xrep. Thank you for helping shape 3xrep. |
| `inactive` | Premier résultat utile puis aucune activité depuis 7 jours | worth keeping? | Has 3xrep been useful enough to come back to? If something got in the way, I’d like to understand it. No need to manufacture another use. |
| `beta_ending` | Fin d’accès individuel dans les 7 jours, sans gratuité à vie promise | your beta access | Your beta access ends on DATE. You can choose whether to continue on the paid plan. We won’t charge you automatically. Ask 3xrep for your workspace status to see your options. |

`DATE` est un champ à remplir depuis la base, pas une variable Gojiberry. Les confirmations d’attribution ne sont envoyées que pour l’état `founding`, jamais `pending`. Les droits et la date de fin sont aussi renvoyés dans le dialogue par `workspace_status`.
