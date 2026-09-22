# Stratégie par affaire — 22 septembre 2026

Décision d’Édouard : appliquer le document « prompt codex 26_09_22 » sur une branche dédiée. Le diagnostic est nécessaire mais ne suffit plus. 3xrep construit le chemin pour obtenir la prochaine preuve et faire avancer la décision : objectif, manque, preuves utilisables, démarche, prochain geste, formulation, réponses possibles, condition de progrès.

## Architecture

`facts → verdicts → priority → remontee → buildStrategy → Strategy`

Le moteur déterministe reste la source du jugement. `src/lib/brain/strategy.ts` définit le contrat et une petite bibliothèque de liens entre preuves tenues et pièces manquantes. Exemples : problème → accès à l’autorité ; impact → budget ; soutien interne → processus ; alternative → urgence ; échéance → contrat. Ce sont des règles 3xrep, pas une méthode universelle ni une prévision de résultat.

La sélection de méthode et les critères de preuve existants restent actifs. Les pièces explicitement fournies sont déjà ajoutées au périmètre par `selectMethod`. Le constructeur ne déclare jamais lui-même une pièce tenue. Une objection peut rouvrir un point déjà tenu ; son état reste `su`, sa validité est à retester avec le client.

`Strategy` est une sortie distincte, exposée par `audit_deal`, `next_question`, `objection_map`, les lignes de `plan_horizon` et celles de `pipe_review`. L’ancien objet `action` est conservé pour les consommateurs existants. Il représente le diagnostic historique et ne doit jamais remplacer la stratégie quand celle-ci existe. Le contrat de rendu et les instructions de l’assistant donnent cette priorité explicitement. Les formulations de stratégie ne proviennent pas des anciens objectifs contenant des prénoms illustratifs.

## Preuves et formulations

Une preuve utilisée dans `leverage` exige : pièce tenue, prospect, source réelle, citation retrouvée, question et réponse vérifiées, aucune contradiction non résolue. Les faits remplacés par une réponse ultérieure suivent `faitsCourants`. La citation affichée conserve le texte exact fourni, y compris ses espaces. Le contrôle de présence normalise seulement les espaces.

La vérification établit la présence dans le texte fourni, pas l’identité indépendante du locuteur ni la vérité dans le monde réel. Aucun titre ne prouve le pouvoir de décision. Un nom dans les seules métadonnées de l’assistant ne devient pas un interlocuteur proposé : il doit aussi apparaître dans sa source. Le destinataire recherché reste un rôle à confirmer. L’assistant peut reprendre un nom explicitement présent dans une citation, mais ne doit pas lui attribuer une autorité non établie.

Sans preuve utilisable, la stratégie donne une question générale et `missing_context`. Sans aucun document, le refus reste prioritaire : l’assistant n’affiche pas la stratégie générale comme un diagnostic de cette affaire. Les réponses dans `branches` sont hypothétiques ; elles ne prédisent jamais ce que le client dira. Les étapes et prochaines actions déclarées restent étiquetées comme telles dans `preparation`.

« Pas la bouche » signifie désormais : aucun contact autonome du prospect. Une question, une phrase, une ouverture de réunion, une réponse à une objection ou un brouillon de courriel sont permis pour exécuter la stratégie. L’assistant peut améliorer la forme dans la langue de l’utilisateur. Il conserve les citations et ne complète pas les noms, dates, chiffres ou conditions manquants. Aucune écriture automatique dans le fichier client. Aucun envoi automatique.

## Journée, semaine, mois et manager

`plan_horizon.brief` précède l’agenda, qui reste chronologique. Les priorités sont expliquées : preuve fondamentale absente à une étape avancée, message entrant à vérifier, rendez-vous, action de notre côté, retard, dossier ancien, date annoncée approchante et délais du contrat inconnus. Le classement utilise des règles fixes, jamais un montant pondéré ou une probabilité. Une seule priorité par affaire identifiée ; les affaires closes ne sont pas proposées dans le résumé. Une date de signature inscrite reste une déclaration.

1 jour : exécution. 7 jours : préparation des validations. 30 jours : anticipation des délais, notamment achats et juridique. On ne calcule pas une date de signature à partir d’une durée inventée.

`pipe_review.coaching` donne la question à travailler, la démarche et le contexte manquant par affaire. Les trous récurrents restent disponibles. Aucun classement de personnes, jugement de personnalité ou nouveau tableau de bord.

## Confidentialité et activation

Founding 20, facturation, droits et règles d’activation sont conservés. La stratégie traverse le journal existant des demandes et réponses, supprimé après 14 jours. Aucun texte de stratégie ni citation n’est ajouté au squelette permanent. Les événements d’usage actuels restent sans contenu commercial.

Décision d’implémentation : ne pas déclarer de faux événements « formulation demandée » ou « branche explorée ». Le serveur ne voit pas ces interactions dans le chat de l’assistant. Une mesure future nécessiterait des événements explicites, limités à des noms d’événements autorisés, sans texte d’affaire. Produire une stratégie ne prouve pas qu’elle a été lue ou suivie.

## Périmètre futur

Un éventuel Revenue Engine pourrait traiter un objectif collectif et les résultats historiques propres à l’organisation. Aucune intégration Smartlead, infrastructure d’envoi, prospection autonome ou projection de conversion n’est implémentée. La stratégie actuelle ne contient pas de probabilité, de score de commercial ni de revenu promis.

## Vérification

Les scénarios synthétiques lisibles sont dans `src/lib/brain/fixtures/strategy-deals.ts`. Les tests traversent les vrais contrôles de source et le moteur : accès, soutien testé ou simple contact, autorité supposée, budget, objection prix, concurrence, statu quo, préparation, citations rejetées ou remplacées, noms non sourcés, français, priorités et coaching.

La validation automatique des instructions de l’assistant ne garantit pas son obéissance en situation réelle. Une recette avec les connecteurs réels de Claude et ChatGPT Work reste distincte des tests du serveur. L’accueil le précise pour ChatGPT Work.
