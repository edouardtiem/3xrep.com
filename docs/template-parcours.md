# Template de parcours — 3xrep

Le moule. [cadrage.md](cadrage.md) gagne en cas de conflit.

On ne code pas ici. On fige l’objet. Sans ça, « DAF dit non » est un one-shot et le deuxième parcours refait le produit.

## Cadre du template (Édouard, 30 août 2026)

1. Des **parcours**.
2. Des **degrés de difficulté**.
3. Une **IA qui multiplie les cas** pour chaque difficulté d’un parcours.
4. À chaque parcours, un **cadre théorique** hyper détaillé : pourquoi, comment, psychologie, humain, productivité.
5. Des **outils** qui aident le dossier — Claude Cowork, ChatGPT, Grok Bot. Pas un meeting dans le produit.

Ce run : **point 1 seulement.** Points 2–5 : nommés, pas spécifiés.

## Vocabulaire — figé pour le template

Le marché dit « parcours » pour un cours. 3xrep reprend le mot. L’objet n’est pas le même.

| Mot | C’est | Ce n’est pas |
| --- | --- | --- |
| **Parcours** | Famille nommée de deals autour d’**une** situation déjà mal partie. Unité du catalogue. | Un cours. Un module. Une partie. Un playthrough. |
| **Cas** | Un deal jouable. ~15 min. Gagné ou perdu. Unité de jeu. | Le parcours. La théorie. |
| **Quête** | La forme A+B. Les beats. Même moule pour tous les cas. | Un chapitre. Un format CYOA. |
| **Difficulté** | Réglage **dans** un parcours (point 2). | Un parcours à part. |
| **Cadre théorique** | Spine du parcours : pourquoi cette situation tue le deal (point 4). | Une leçon avant de jouer. |
| **Outil** | Aide à reconstruire le dossier (point 5). | Un roleplay. Un meeting. |

On **termine** un cas (gagné / perdu + trou nommé).  
On ne **termine** pas un parcours. Pas de badge. Pas de « formation close ». [cadrage.md](cadrage.md).

## 1. Qu’est-ce qu’un parcours

**Un parcours est une famille nommée de deals autour d’une seule situation déjà mal partie.**

C’est ce qu’on cherche sur Google. C’est ce qu’on se passe : « joue le DAF ». C’est ce qui reste quand les cas changent.

Le produit n’est pas le parcours. Le produit est le terrain. Le parcours est une **pièce** du terrain. Les cas à l’intérieur changent. On revient parce que le prochain deal n’est pas le même.

```
parcours          famille (« DAF dit non »)
  └── difficulté  réglage (point 2, pas ce run)
        └── cas   ce deal-ci, ~15 min
              └── quête A+B   les beats, toujours les mêmes
```

L’IA (point 3) multiplie les **cas**, pas les parcours. Un parcours de plus, c’est une situation de plus, pas une variante.

### Ce que c’est

- Une situation que le commercial **reconnaît avant de jouer**. « Le DAF a dit non. » Pas « Module 2 — Découverte ».
- Un **invariant** : ce qui est vrai de tous les cas de la famille. Si l’invariant bouge, c’est un autre parcours.
- Un contenant : cadre théorique + difficultés + générateur de cas + outils. Le cas est ce qu’on joue. Le parcours est ce qui **tient** les cas ensemble.
- Partageable en une phrase. Cherchable. Gratuit pour le premier test.

Pourquoi la semaine 2 peut marcher : le parcours **reste**. Les cas **changent**. Revenir ≠ recommencer le même QCM. Revenir = un autre DAF, un autre dossier vide, le même type de feu.

### Ce que ce n’est pas

- Un cursus (leçon → exercice → certif).
- Un seul scénario à une fin.
- Un niveau de difficulté.
- Un cas (« la vente Acme du 12 mars »).
- C (vacation) comme chapitre du DAF. C est un **autre** parcours, plus tard.
- Un meeting avec un bot.
- Quelque chose qu’on « finit ».

### Test — est-ce un parcours ?

Oui seulement si les quatre tiennent :

1. Un commercial peut le **Googler** comme situation (pas comme marque, pas comme module).
2. On peut le **passer à un collègue** en une phrase.
3. Tous les cas partagent le **même invariant**, et les deals **changent**.
4. Poser un badge « parcours terminé » serait un **échec produit**.

| Ça | C’est |
| --- | --- |
| DAF dit non | **Parcours** (le premier, le test) |
| Champion gentil, zéro pouvoir | Parcours possible, plus tard |
| Deal au forecast, dossier vide | Parcours possible, plus tard |
| Vacation, le deal vit sans toi | Parcours possible (C), hors test |
| Cette vente-ci, ce DAF-ci | **Cas** |
| Niveau « tu arrives trop tard » | **Difficulté** (point 2) |
| Module Découverte | **Interdit** |

Les noms de parcours futurs viennent des recherches déjà listées dans [recherche.md](recherche.md) §6. On n’en ouvre aucun tant que le premier n’a pas dit oui.

### Contrat — ce qu’un parcours déclare

Chaque parcours, dans le template, porte au minimum :

| Champ | Rôle | Ex. premier parcours |
| --- | --- | --- |
| `id` | Slug stable | `daf-dit-non` |
| `nom` | Query Google + phrase de partage | DAF dit non |
| `invariant` | Vrai pour **tous** les cas. Si ça bouge → autre parcours. | Tu arrives **après** le non du buyer économique. Le tableau est vide. |
| `pression` | Pourquoi ça brûle **maintenant** | Le non est déjà là. Le champion n’a pas tenu. |
| `cases` | Les cases du dossier qui **existent** (pas celles qui sont remplies) | Métrique, process, champion réel, critère, douleur, buyer |
| `quete` | Forme de jeu | A+B seulement. Beats : [deroulement.md](deroulement.md) |
| `cadre` | Point 4 | *pas ce run* |
| `difficultes` | Point 2 | *pas ce run* |
| `generateur` | Point 3 — multiplie les cas | *pas ce run* |
| `outils` | Point 5 — aident le dossier | *pas ce run* |

`quete` n’est pas un choix par parcours. C’est le moule du terrain. Un parcours qui demanderait un QCM, un CYOA 2 min, ou un meeting, n’entre pas dans 3xrep.

Le graphe JSON + graines ([reco.md](reco.md)) vit au niveau du **cas**. Le parcours est le contrat au-dessus : ce que tous ces graphes ont le droit d’être.

### Premier test

Un seul parcours : **DAF dit non**. Gratis. [cadrage.md](cadrage.md).

- 1 parcours ≠ 1 cas. Le test a besoin de **cas** qui changent, sinon la semaine 2 n’a rien à rejouer.
- Les premiers cas peuvent être des graines écrites à la main. Le générateur IA (point 3) est dans le template ; il n’est pas requis pour poser la première graine.
- Auth, DB, Stripe, équipes, prix : toujours hors test.

### Points 2–5 — nommés, pas ouverts

| # | Objet | Une phrase, pour ne pas dériver |
| --- | --- | --- |
| 2 | Difficulté | Réglage **dans** le parcours. Pas un parcours nouveau. |
| 3 | IA | Multiplie les **cas** d’une difficulté. Ne crée pas un parcours. |
| 4 | Cadre théorique | Spine du parcours (pourquoi / comment / psy / humain / prod). Le joueur ne la subit pas en leçon. Il la rencontre au **trou nommé**. |
| 5 | Outils | Claude Cowork, ChatGPT, Grok Bot : **dossier**, pas bouche. Pas de visio, pas d’avatar, pas de roleplay vocal. |

Si le point 4 devient un cours, ou le point 5 un meeting, on a cassé le cadrage.

Prochain run de template : **point 2 — degrés de difficulté.**
