# Sales buddy — page et difficultés des commerciaux

Source : [recherche commerciale du 15 septembre](../market/recherche-commerciale.md).
Page : `/da/buddy`, conservée comme étude non indexée. La page d’accueil `/` reste celle du produit actuel. Publication du code sur `pre_main`.

## Ce que la refonte change

Conserve la promesse « Your sales day, figured out. », le papier gris, les annotations cuivre et les mascottes locales. Supprime les répétitions du planning et les illustrations provisoires pointillées. Les deux colonnes servent maintenant à confronter une situation à une réponse utile.

Le récit Acme montre trois moments : problème inconnu, coût exprimé par le client, puis interlocutrice proposée pour la prochaine réunion. Le conseil évolue. Les scènes sont explicitement des illustrations, pas des résultats clients ou une capture d’une session réelle.

Le refus Dune devient une explication et un prochain geste. Aucune promesse de bloquer techniquement l’envoi. Le commercial garde la décision.

## Vérification contre la recherche

| Difficulté retenue | Réponse dans la page | Limite |
| --- | --- | --- |
| Responsable du chiffre, même quand le client disparaît | Dès le premier écran : appel terminé, silence, chiffre à atteindre | Aucune promesse chiffrée de conversion |
| Ne sait pas quoi faire sur cette affaire après le rendez-vous | Acme : trois moments, chacun avec un geste précis | Exemple illustratif, pas une validation en conditions réelles |
| Beaucoup de temps passé à autre chose qu’à vendre | Journée priorisée, même conversation, aucun tableau de bord supplémentaire | Aucun gain de temps mesuré annoncé |
| Repart de zéro entre les échanges | Les réponses reçues font évoluer le prochain geste sur Acme | Dépend des informations réellement transmises par l’agent |
| Acheteur silencieux | Nordik : vérifier la demande restée sans réponse, apporter quelque chose d’utile | Le produit ne peut pas connaître la cause du silence sans preuve |
| Coaching absent, aide nécessaire maintenant | « You’re not on your own », conseil appliqué au dossier | Ne remplace pas une relation humaine avec un responsable |
| Rejet d’un deuxième chef qui note les appels | Aucun score personnel, aucun reproche au commercial ; « You make the call » | Le cerveau conserve sa posture critique sur les preuves du dossier |
| Méthode imposée sans tenir compte du terrain | Explique que le cycle et le comité changent la conversation utile | La page ne prétend pas valider scientifiquement chaque conseil |
| Encore un outil à alimenter | Connexion du contexte existant, trois étapes, prérequis explicites | Les connexions et parfois l’accord d’un administrateur restent nécessaires |

**Conclusion :** la page couvre les difficultés centrales de la recherche, notamment le prochain geste et l’aide sur le dossier. Cette vérification porte sur le message et sa cohérence avec le produit. Elle ne démontre ni l’adhésion des utilisateurs ni une amélioration des ventes. Les essais réels Claude et ChatGPT Work restent à faire.

## Vérifications techniques

- Affichage navigateur à 1440, 390 et 320 pixels : pas de débordement horizontal, images chargées, aucune erreur de page ou réponse réseau en erreur.
- Liens : essai `/start`, documentation `/docs`, branchement `/install`, ancre `#setup`.
- ChatGPT Work : validation de bout en bout présentée comme en cours. Aucune liste d’intégrations non validées affichée comme disponible.
- Prix repris de la constante du produit. Essai et conservation des données cohérents avec les parcours existants.
- Styles limités à la page ; règle d’impression dédiée ; contenu essentiel visible sans animation.
- Compilation Next.js, vérification TypeScript et ESLint ciblé : réussis. Les trois destinations renvoient une réponse HTTP 200.
