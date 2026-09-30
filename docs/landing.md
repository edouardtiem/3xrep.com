# Landing — 3xrep.com

## Décision du 30 septembre 2026 — circuit partagé, en local

Le titre d’accueil reste « Every deal needs a strategy. ». La démonstration précédente avec Julien, Maya et la mascotte est conservée en ouverture. Le circuit animé arrive juste après, dans la même affaire fictive Acme. Il montre les sources → assistant → 3xrep → prochain geste → formulation dans l’assistant. Sur grand écran assez haut, le texte de la section du circuit suit aussi le défilement, puis s’arrête à la fin de la section. Sur petit écran, il défile normalement. Le détail des preuves est dépliable sur l’accueil et reste visible dans la bibliothèque. Les six flèches restent visibles. La lecture est finie et rejouable ; la préférence de réduction des animations garde le circuit fixe.

Les deux démonstrations partagent un seul choix de réponse fictive. La sélection dans l’illustration du haut met à jour le circuit plus bas. Celui-ci reprend la branche correspondante calculée par le moteur ; la formulation reste explicitement illustrative. Le dossier de preuves reste inchangé. Un lien ramène au choix de réponse, sans second sélecteur indépendant. Le circuit utilise les résultats calculés par le cerveau. Le changement de preuve met à jour le geste et la formulation. L’offre Beta reste inchangée. Aucune publication n’est effectuée par ce changement.

## Décision du 22 septembre 2026 — en vigueur sur la branche stratégie

L’accueil montre désormais « Every deal needs a strategy. ». Même identité visuelle : papier gris, cuivre, mascotte et typographie. La démonstration part d’un problème confirmé, construit l’accès à la personne qui peut investir, propose une phrase et laisse choisir trois réponses possibles. Les exemples sont illustratifs. Le budget, les horizons et le coaching sont expliqués sans promesse de gain. L’inscription suit la configuration serveur.

Décision du 23 septembre : l’offre visible s’appelle « Beta ». L’accueil annonce la recherche de 20 équipes qui utilisent réellement 3xrep. Parmi ces équipes, celles retenues gardent l’offre de base gratuite à vie. C’est le seul parcours de nouvelle inscription pendant le recrutement : si la bêta est fermée ou que les 20 places sont attribuées, le formulaire est fermé. L’essai standard de 14 jours n’est plus proposé aux nouveaux visiteurs.

La voix de 3xrep sur le site parle au nom de l’équipe : « we », jamais « I ». Les citations illustratives des clients et les questions que le visiteur peut poser dans son chat gardent leur propre point de vue.

Le parcours `/start` commence par l’adresse professionnelle, les conditions de la Beta et la création de la clé. Décision du 23 septembre pour l’accueil local : la page suivante montre la clé une seule fois, puis la connexion 3xrep, un premier message à envoyer dans une tâche locale, les questions de présentation et le choix du dossier de mémoire. `/install` suit le même ordre ; le CRM, les courriels et le calendrier viennent ensuite. Voir [local-onboarding.md](local-onboarding.md). Les guides `/docs` commencent par une affaire et une question concrète ; les pages de confidentialité, de prix et de méthodes restent consultables. Les notes apportées dans le chat suffisent si le CRM manque encore. Le tarif après la Beta est visible avant l’inscription, sans carte ni prélèvement automatique.

Sur écran large et assez haut, le texte d’ouverture suit le défilement de la démonstration puis s’arrête avec sa section, avant le séparateur. Sur petit écran, les deux blocs défilent normalement.

Contrat : [deal-strategy.md](deal-strategy.md). Cette décision remplace les passages historiques incompatibles ci-dessous ; leur date reste conservée.


Décision du 16 septembre 2026 : la page sales buddy devient l’accueil `/`, en remplacement de la fenêtre Cowork. Publication sur `main` autorisée par Édouard.

## Page

`src/app/page.tsx` utilise `src/components/buddy/BuddyHome.tsx`. Styles propres à la page dans `buddy.module.css`. Papier gris, IBM Plex Sans, annotations manuscrites cuivre et mascottes. `/da/buddy` redirige définitivement vers `/`. `/lp` conserve sa redirection vers `/`.

Titre : **Your sales day, figured out.** La page montre une journée, puis une affaire dont le prochain geste change avec les réponses du client. Chaque mise en garde explique pourquoi et propose une action. Les exemples sont explicitement illustratifs.

## Founding 20 — 18 septembre 2026

Accueil, `/start`, `/install` et tarifs suivent la configuration serveur du programme pour l’inscription et les droits. Bêta ouverte et places restantes : « Join the beta », sans carte, attribution manuelle parmi 20 organisations. Programme fermé ou places toutes allouées : plus de nouvelles inscriptions. Style sales buddy conservé. Voir [Founding 20](beta/founding-20.md).

## Parcours standard historique

- Avant la décision du 23 septembre, « Try 3xrep now » ouvrait un essai standard de 14 jours quand la Beta était fermée. Cette voie est suspendue pour les nouvelles inscriptions pendant le recrutement.
- Guide de connexion vers `/install` ; documentation vers `/docs`.
- Prix de la constante produit : 129 dollars par mois pour toute l’entreprise, taxes applicables en plus. Essai de 14 jours sans carte.
- Prérequis de connexion expliqués. Validation de bout en bout ChatGPT Work encore en cours ; pas de promesse d’intégrations universelles.
- Confidentialité et durée de conservation présentées avant la conclusion.

## Indexation

Accueil indexable, adresse canonique `/`, titre et description dédiés, métadonnées de partage. Accueil déjà inclus dans le plan du site. Les autres études `/da/*` restent exclues de l’exploration.

## Validation des besoins

[Recherche du 15 septembre](market/recherche-commerciale.md) et [vérification de la page](audits/2026-09-16-buddy-landing.md). La cohérence du message est vérifiée. Les essais réels du produit dans Claude et ChatGPT Work restent à faire.

## Documentation publique — 18 septembre 2026

Les sept pages `/docs` suivent la voix sales buddy : journée, préparation, prochain geste et retour après un échange. Navigation complète, colonne de lecture, rubriques repliables pour les questions, méthodes et outils. Même papier gris, typographie et cuivre que l’accueil. Les exemples ne promettent ni résultat ni accès universel aux connecteurs.

`/docs/gong-alternative` conserve son adresse mais devient le guide « Context & privacy » : notes, mémoire, conservation et place des outils de capture. Suppression des comparaisons de prix concurrentes non vérifiées. La page tarifs conserve les états bêta ouverte, places complètes et parcours standard. Les adresses existantes restent accessibles et les métadonnées suivent les nouveaux textes.
