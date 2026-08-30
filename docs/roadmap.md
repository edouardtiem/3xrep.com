# Roadmap — 3xrep

Prochains runs. Le cadrage reste [cadrage.md](cadrage.md). Si un item ici le contredit, le cadrage gagne.

Ordre : template contenu → premier parcours → design → landing. On ne code pas auth, DB, Stripe, équipes, prix.

## 1. Template de parcours / quête

Le moule. Pas un LMS. Pas des modules.

Cadre du template (5 points) : parcours → difficultés → IA qui multiplie les cas → cadre théorique → outils (dossier, pas meeting).

- **Point 1 figé** — qu’est-ce qu’un parcours : [template-parcours.md](template-parcours.md). Famille de deals, pas un cours. Unité de catalogue. L’unité de jeu est le **cas**. Début **dans** la découverte (ops, DAF absent), pas au non.
- Points 2–5 : nommés, pas spécifiés. Prochain : difficultés.
- Graphe JSON + graines au niveau du **cas**. Beats A+B : [deroulement.md](deroulement.md).
- Interdit dans le template : CYOA 2 min, mini-QCM, chance, XP, badges, « module terminé ».

## 2. Premier parcours gratuit

Le test go / no-go. Un seul parcours. Gratis. **Le DAF n’est pas dans la pièce.** Cas d’entrée (titre) : DAF dit non.

- Une quête A+B par cas, qui **commence** en découverte avec l’ops. C (vacation) = autre parcours, hors test.
- Zéro compte. Zéro paywall.
- Sortie = échelle de réussite + trou nommé. Interdit = « je ne sais pas ce qui s’est passé ».
- 20 commerciaux. Semaine 2, elles reviennent toutes seules. Oui = produit. Non = stop.

Détail du ressenti : [deroulement.md](deroulement.md). Pourquoi ce cas : [recherche.md](recherche.md).

## 3. Design template

L’écran du terrain. Pas l’écran d’un cours.

- Next.js App Router, TypeScript, Tailwind, shadcn. [reco.md](reco.md).
- Tableau de deal, cases vides, tension. Début / milieu / fin visibles.
- Ça se sent jeu (échelle de réussite, rejouer). Ça ne se sent pas formation, meeting, QCM, ligue.
- Un design qui tient pour le premier parcours **et** les suivants. Pas un one-off « DAF ».

Pas de v0 / Grok Build pour poser le produit.

## 4. Landing page

Entrée du test. Pas une page « booker 15 min ».

- Le cas est l’accroche (ex. DAF dit non), pas la marque.
- Un clic → on joue. Pas un Calendly. Pas un pitch deck.
- Cohérent avec le design template. Zéro auth, zéro Stripe.

## Hors roadmap (mémoire seulement)

Prix 3 € / 19 €, invitations, équipes, C (vacation), acquisition Google scale : [reco.md](reco.md). Après le test semaine 2, si oui.
