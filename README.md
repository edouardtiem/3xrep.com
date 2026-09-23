# 3xrep

Ils créent leur agent commercial. On est le cerveau : méthode versionnée, sur le contexte qu’ils apportent dans leur assistant, notamment les notes d’une affaire ou leur CRM connecté. $129 / mois / organisation (USD, + tax), tarif standard. **Beta** : bêta configurable sans carte, puis offre de base gratuite à vie pour 20 organisations sélectionnées après usage réel. Pas un Gong. Pas un cours. Pas un jeu.

Domaine : [3xrep.com](https://3xrep.com).

Produit : stratégie commerciale pour chaque affaire. Des preuves au diagnostic, puis à la démarche, aux mots à employer et aux suites selon la réponse. Le diagnostic est nécessaire mais ne suffit plus. Accueil : « Every deal needs a strategy. ». Résumé stratégique du matin, préparation des rendez-vous et aide après l’appel. `/da/buddy` redirige vers `/`. Décision du 22 septembre 2026, remplaçant le positionnement du 16 septembre.

## Docs

Lire dans cet ordre.

- [docs/deal-strategy.md](docs/deal-strategy.md) — décision du 22 septembre, architecture, limites et scénarios.

- [docs/prd.md](docs/prd.md) — produit, prix, tools, test
- [docs/roadmap.md](docs/roadmap.md) — ouvert : docs MCP + captures, langues, $129 US first
- [docs/audits/2026-09-16-corrections-cerveau.md](docs/audits/2026-09-16-corrections-cerveau.md) — corrections sur sales-buddy, règles de preuve et limites des essais
- [docs/cerveau.md](docs/cerveau.md) — le cerveau : bibliothèque, angle, gestes, moteur
- [docs/gestes.md](docs/gestes.md) — 21 moments du cycle, VP qui refuse
- [docs/v0.md](docs/v0.md) — Claude / ChatGPT / Notion, pas d’UI CRM
- [docs/landing.md](docs/landing.md) — accueil sales buddy et parcours de démarrage
- [docs/icp.md](docs/icp.md) — qui + posture
- [docs/sortie.md](docs/sortie.md) — ce que l’AE lit après le call
- [docs/contournement.md](docs/contournement.md) — sans transcript sur la fiche
- [docs/methodes.md](docs/methodes.md) — lexique, rattachement

Le terrain d’entraînement (30 août) est arrêté comme produit. Archive : [docs/terrain/](docs/terrain/).

Sales Game est mort. jesaisfaire est un autre git. Ce git est le git 3xrep.

## Beta, 20 équipes et paiement

Décision du 18 septembre : priorité à l’usage pendant 30–45 jours. Attribution manuelle des places. Décision du 23 septembre : l’offre publique s’appelle « Beta ». Pendant le recrutement, c’est le seul parcours de nouvelle inscription. Sans ouverture en base, ou une fois les 20 places attribuées, aucune nouvelle organisation n’est créée ; l’essai standard n’est plus proposé. Les équipes déjà inscrites gardent leurs droits. Après la bêta, les équipes non retenues choisissent si elles veulent payer le tarif standard, sans prélèvement automatique. Mise en service, administration et mesures : [docs/beta/founding-20.md](docs/beta/founding-20.md). Recrutement ciblé : [séquence Gojiberry](docs/gtm/gojiberry-sequence.md).

Chemin commercial hors bêta : [`/start`](https://3xrep.com/start) — obtenir une clé sans carte, puis [`/install`](https://3xrep.com/install) — connecter 3xrep à Claude et commencer avec une affaire. Le lien de paiement arrive ensuite dans le chat. Secrets Vercel / Price Stripe : [docs/checkout.md](docs/checkout.md). Aucune clé dans ce repo.
