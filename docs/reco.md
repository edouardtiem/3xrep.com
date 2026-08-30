# Reco — figée

Ne pas « améliorer » sans casser le cadrage. Si ça contredit [cadrage.md](cadrage.md), le cadrage gagne.

## Produit

1. **Nom 3xrep. Domaine 3xrep.com.** Sales Game mort. Ce git est le git.
2. **Terrain**, pas cours. Cas qui changent. Jouer. Copains, collègues.
3. **Pas de meeting** dans le produit. **Pas de CPF.**
4. **Format test : A+B, une seule quête.** Dossier reconstruit **dans** le deal. C (vacation) hors test.
5. **Ressenti ~15 min** (12–25). [deroulement.md](deroulement.md).
6. **Rejeté :** 2 min CYOA, mini-QCM, chance, points, ligues.
7. **Échec produit :** le joueur ne sait pas ce qui s’est passé. Le trou doit être nommé.
8. **Premier parcours :** `nom_joueur` = Call avec l’ops. `nom_auteur` = Le DAF n’est pas dans la pièce (pas le HUD). `titre_joueur` = le deal. `titre_google` = DAF dit non. [template-parcours.md](template-parcours.md).
9. **Méthodes :** lexique dans le jeu, rattachement obligatoire. **Dans le dur** : un fichier par méthode (lundi, CRM, ChatGPT/Cowork/Grok). Skills + pSEO plus tard. [methodes.md](methodes.md).
10. **Cycle :** un parcours, une étape (prep, prospection, découverte, démo, objection, closing intermédiaire, prix, négo). Test 1 = découverte. Pas tout le cycle dans une quête.

## Premier test

- 1 parcours gratis.
- 20 commerciaux.
- Semaine 2, elles reviennent toutes seules.
- Oui = produit. Non = stop, jesaisfaire.

Pas d’auth, pas de DB, pas de Stripe, pas d’équipes, pas de 3 €, pas de 19 € dans le test. Un parcours. Un graphe. Des graines.

## Stack — quand on coderait, pas ce run

| | |
| --- | --- |
| App | Next.js App Router, TypeScript, Tailwind, shadcn |
| Contenu | Graphe JSON + graines |
| Interdit | Auth, DB, Stripe, Grok Build |

Pas de v0 / Grok Build pour poser le produit. Ce repo n’est pas un sync v0.

## Prix — en mémoire seulement

Ne pas implémenter. Ne pas mettre sur un écran. Ne pas créer de produit Stripe.

| | |
| --- | --- |
| 1 parcours | offert (le test) |
| Perso | 3 € / semaine |
| Équipe | 19 € / semaine |
| Invite | personnes seules, crédits Stripe — **plus tard** |

Le 19 € n’est pas un siège Salesforce. C’est « on joue entre collègues », pas un rollout L&D.

## Acquisition — en mémoire seulement

- Google : cas précis (ex. DAF dit non), pas la marque.
- Plus tard : Google méthode / partie (pSEO) — « MEDDIC economic buyer ». Page = rattachement + jouer. Pas un article formation.
- Mail = le cas, ~2 min, jouable. Pas un Calendly pour vendre 3xrep.
- Pas de landing « booker 15 min ».

## Ce run

Docs dans ce GitHub. Rien d’écran. Pas d’app.

Prochain run (si Édouard le lance) : coder **uniquement** le parcours A+B « Call avec l’ops » (google : DAF dit non ; HUD : le deal, pas le piège), graphe JSON, zéro compte.
