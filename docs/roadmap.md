# Roadmap — 3xrep

Prochains runs. Le cadrage reste [cadrage.md](cadrage.md). Si un item ici le contredit, le cadrage gagne.

Ordre : template → **méthodes dans le dur** → premier parcours → design → landing. pSEO méthodes à la fin. On ne code pas auth, DB, Stripe, équipes, prix.

## 1. Template de parcours / quête

Le moule. Pas un LMS. Pas des modules.

Cadre du template (5 points) : parcours → difficultés → IA qui multiplie les cas → cadre théorique → outils (dossier, pas meeting).

- **Point 1 figé** — qu’est-ce qu’un parcours : [template-parcours.md](template-parcours.md). Famille de deals. `debut` = étape du cycle (prep, prospection, découverte, démo, objection, closing intermédiaire, prix, négo). Test 1 = découverte.
- **Rattachement figé** — [methodes.md](methodes.md). Une mini-situation sans méthode ne part pas.
- Points 2–5 : nommés, pas spécifiés. Prochain template : difficultés. Les fichiers méthode (§ 2) avancent **en parallèle**.
- Graphe JSON + graines au niveau du **cas**. Beats A+B : [deroulement.md](deroulement.md).
- Interdit dans le template : CYOA 2 min, mini-QCM, chance, XP, badges, « module terminé ».

## 2. Méthodes dans le dur

Les écrire **dans ce git**. Pas un slide. Pas un Notion à côté.

- Un fichier `docs/methodes/<slug>.md` par méthode (et par partie si elle se Google). Copier [methodes/_modele.md](methodes/_modele.md).
- Dedans, obligatoire : jeu + trou nommé, **lundi** (vie réelle), **CRM**, **ChatGPT / Cowork / Grok Bot** (dossier, pas meeting), pourquoi psy / humain / prod.
- Skill agent : `.agents/skills/methodes/<slug>/` — même fond, pour générer des cas et coller le rattachement (point 3).
- En chercher **plus**. Liste ouverte dans [methodes.md](methodes.md) (CHAMP, SPIN, SPICED, SPANCO, SIMAC, CAP, DISC, Challenger, Sandler, …).
- Ordre d’écriture : d’abord les porteurs du test 1 (MEDDIC, BANT, BEBEDC, coût de l’inaction, SONCAS, CRAC, contreparties, BAC/CAB, points brûlés).
- **pSEO à la fin** (pas le test 1) : une URL par slug, query = le titre, CTA = jouer le cas. Hyper bon pour l’acquisition (on cherche « MEDDIC economic buyer », pas « 3xrep »). Pas un blog formation. Pas un Calendly.

Sans ces fichiers, le générateur IA invente, le trou nommé reste flou, le pSEO n’a pas de matière.

## 3. Premier parcours gratuit

Le test go / no-go. Un seul parcours. Gratis. **Call avec l’ops.** HUD = le deal. Google = DAF dit non. Pas de titre « le DAF n’est pas là ».

- Une quête A+B par cas, qui **commence** en découverte avec l’ops. C (vacation) = autre parcours, hors test.
- Zéro compte. Zéro paywall.
- Sortie = échelle de réussite + trou nommé **avec la méthode**. Interdit = « je ne sais pas ce qui s’est passé » **et** un trou sans rattachement.
- 20 commerciaux. Semaine 2, elles reviennent toutes seules. Oui = produit. Non = stop.

Détail du ressenti : [deroulement.md](deroulement.md). Pourquoi ce cas : [recherche.md](recherche.md).

## 4. Design template

L’écran du terrain. Pas l’écran d’un cours.

- Next.js App Router, TypeScript, Tailwind, shadcn. [reco.md](reco.md).
- Tableau de deal, cases vides, tension. Début / milieu / fin visibles.
- Ça se sent jeu (échelle de réussite, rejouer). Ça ne se sent pas formation, meeting, QCM, ligue.
- Un design qui tient pour le premier parcours **et** les suivants. Pas un one-off « DAF ».

Pas de v0 / Grok Build pour poser le produit.

## 5. Landing page

Entrée du test. Pas une page « booker 15 min ».

- Le cas est l’accroche (ex. DAF dit non), pas la marque.
- Un clic → on joue. Pas un Calendly. Pas un pitch deck.
- Cohérent avec le design template. Zéro auth, zéro Stripe.

## Hors roadmap (mémoire seulement)

Prix 3 € / 19 €, invitations, équipes, C (vacation), **autres étapes du cycle**, **pages pSEO méthodes**, acquisition Google scale : [reco.md](reco.md). Après le test semaine 2, si oui.
