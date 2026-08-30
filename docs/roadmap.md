# Roadmap — 3xrep

Prochains runs. Le cadrage reste [cadrage.md](cadrage.md). Si un item ici le contredit, le cadrage gagne.

Ordre : template contenu → premier parcours → design → landing. On ne code pas auth, DB, Stripe, équipes, prix.

## 1. Template de parcours / quête

Le moule. Pas un LMS. Pas des modules. Une quête A+B rejouable.

- Graphe JSON + graines.
- Beats figés : entrée (cas déjà mal parti, tableau vide) → construire les cases → questionner les trous → objection = facture → une action (poser un fait) → gagné / perdu + trou nommé.
- Ressenti cible ~15 min (12–25). [deroulement.md](deroulement.md).
- Rejouable : autre stratégie, autre trou, autre fin.
- Interdit dans le template : CYOA 2 min, mini-QCM, chance, XP, badges, « module terminé ».

Sans ce template, chaque parcours est un one-shot. Avec, on peut en poser un deuxième sans refaire le produit.

## 2. Premier parcours gratuit

Le test go / no-go. Un seul. Gratis. Cas : **DAF dit non**, tableau vide.

- Une quête A+B. C (vacation) hors test.
- Zéro compte. Zéro paywall.
- Sortie valide = le trou a un nom. Sortie interdite = « je ne sais pas ce qui s’est passé ».
- 20 commerciaux. Semaine 2, elles reviennent toutes seules. Oui = produit. Non = stop.

Détail du ressenti : [deroulement.md](deroulement.md). Pourquoi ce cas : [recherche.md](recherche.md).

## 3. Design template

L’écran du terrain. Pas l’écran d’un cours.

- Next.js App Router, TypeScript, Tailwind, shadcn. [reco.md](reco.md).
- Tableau de deal, cases vides, tension. Début / milieu / fin visibles.
- Ça se sent jeu (gagner / perdre, rejouer). Ça ne se sent pas formation, meeting, QCM, ligue.
- Un design qui tient pour le premier parcours **et** les suivants. Pas un one-off « DAF ».

Pas de v0 / Grok Build pour poser le produit.

## 4. Landing page

Entrée du test. Pas une page « booker 15 min ».

- Le cas est l’accroche (ex. DAF dit non), pas la marque.
- Un clic → on joue. Pas un Calendly. Pas un pitch deck.
- Cohérent avec le design template. Zéro auth, zéro Stripe.

## Hors roadmap (mémoire seulement)

Prix 3 € / 19 €, invitations, équipes, C (vacation), acquisition Google scale : [reco.md](reco.md). Après le test semaine 2, si oui.
