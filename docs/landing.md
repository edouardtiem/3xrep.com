# Landing — 3xrep.com

Décision du 16 septembre 2026 : la page sales buddy devient l’accueil `/`, en remplacement de la fenêtre Cowork. Publication sur `main` autorisée par Édouard.

## Page

`src/app/page.tsx` utilise `src/components/buddy/BuddyHome.tsx`. Styles propres à la page dans `buddy.module.css`. Papier gris, IBM Plex Sans, annotations manuscrites cuivre et mascottes. `/da/buddy` redirige définitivement vers `/`. `/lp` conserve sa redirection vers `/`.

Titre : **Your sales day, figured out.** La page montre une journée, puis une affaire dont le prochain geste change avec les réponses du client. Chaque mise en garde explique pourquoi et propose une action. Les exemples sont explicitement illustratifs.

## Founding 20 — 18 septembre 2026

Accueil, `/start`, `/install` et tarifs suivent la configuration serveur du programme. Bêta ouverte : « Join the beta », sans carte, attribution manuelle parmi 20 organisations. Une fois les places allouées, le site annonce que la bêta reste ouverte mais sans nouvelle place gratuite à vie. Programme fermé : parcours standard ci-dessous. Style sales buddy conservé. Voir [Founding 20](beta/founding-20.md).

## Parcours standard

- Boutons « Start 14 days free » vers `/start`.
- Guide de connexion vers `/install` ; documentation vers `/docs`.
- Prix de la constante produit : 129 dollars par mois pour toute l’entreprise, taxes applicables en plus. Essai de 14 jours sans carte.
- Prérequis de connexion expliqués. Validation de bout en bout ChatGPT Work encore en cours ; pas de promesse d’intégrations universelles.
- Confidentialité et durée de conservation présentées avant la conclusion.

## Indexation

Accueil indexable, adresse canonique `/`, titre et description dédiés, métadonnées de partage. Accueil déjà inclus dans le plan du site. Les autres études `/da/*` restent exclues de l’exploration.

## Validation des besoins

[Recherche du 15 septembre](market/recherche-commerciale.md) et [vérification de la page](audits/2026-09-16-buddy-landing.md). La cohérence du message est vérifiée. Les essais réels du produit dans Claude et ChatGPT Work restent à faire.
