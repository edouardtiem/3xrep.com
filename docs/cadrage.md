# Cadrage — 3xrep

Figé. 30 août 2026. Auteur : Édouard Tiem.

## Identité

| | |
| --- | --- |
| Nom | **3xrep** |
| Domaine | **3xrep.com** (acheté) |
| Git | **ce repo** — plus Sales Game, plus l’Origin tmp |
| Quoi | Terrain d’entraînement vente B2B |
| Pour qui | Commerciaux. On joue. Copains, collègues. |

3xrep n’est pas une formation. Ce n’est pas un LMS. Ce n’est pas un outil de meeting. Ce n’est pas un dossier CPF.

Les cas changent. On ne « termine » pas un programme. On revient parce que le prochain deal n’est pas le même.

## Ce que c’est

Un deal déjà mal parti. Un tableau vide. Tu reconstruis le dossier **dans** le deal. Tu questions tes trous. L’objection qui arrive est la facture de ta découverte. Une action — poser un fait. Sortie qui **nomme le trou** — pas seulement gagné / perdu binaire ; une échelle de réussite si le parcours en a une.

Si à la fin tu te dis « je ne sais pas ce qui s’est passé », le produit a échoué. Pas le joueur.

## Ce que ce n’est pas

- Un cours qu’on ferme (modules, certification, badge de fin).
- Un meeting dans le produit (visio, roleplay vocal, avatar qui parle).
- Du CPF, de l’OPCO, de la « formation éligible ».
- Un classement (points, ligues, XP, streaks comme produit).
- Sales Game (nom mort).
- jesaisfaire (autre produit : test de savoir-faire à l’embauche).

L’aspect jeu est gardé. Le scoreboard n’existe pas.

## Premier test — go / no-go

Une seule question.

1. Un parcours gratis.
2. Vingt commerciaux.
3. Semaine 2, elles reviennent **toutes seules**.

Oui → c’est un produit.  
Non → on arrête 3xrep. jesaisfaire reste.

Pas d’autre KPI pour décider. Pas de « elles ont bien noté ». Pas de « le directeur commercial veut un démo ». La semaine 2, sans relance.

## Format figé du test

- **A + B, une seule quête.** Tu reconstruis le dossier **dans** le deal. Pas un module « découverte » puis un module « objection ».
- **C (vacation)** hors test.
- Ressenti **~15 min** (fenêtre 12–25).
- 2 min CYOA / mini-QCM / chance : **rejeté** par Édouard.
- Parcours d’entrée : **Le DAF n’est pas dans la pièce.** Tu commences **dans** la découverte avec un manager ops. Le DAF n’est pas là. Pas après le non. Pas au premier mail.
- **« DAF dit non »** = titre du cas (Google, mail) **et** sortie si tu ne l’inclus pas. Pas le beat 1.
- Sortie : échelle de réussite (voir le DAF > l’inclure sans le voir > ne pas l’inclure). Trou nommé. Pas un scoreboard.

Détail du ressenti : [deroulement.md](deroulement.md). Objet parcours : [template-parcours.md](template-parcours.md). Pourquoi ce format : [recherche.md](recherche.md). Reco complète : [reco.md](reco.md).

## Amendement — entrée (30 août 2026, Édouard)

Le premier parcours ne commence pas au non. On commence plus tôt : call de découverte, manager opérationnel, DAF absent. Il faut le convier, sinon il dit non. L’inclure dans la décision sans le voir est moins bien que le voir, mieux que ne pas l’inclure. L’appel est la situation du deal, pas un meeting dans le produit.

## Hors ce run, hors le premier test

Ce run n’implémente pas l’app. Pas d’écran.

Même plus tard, le premier test n’embarque pas :

- auth
- base
- Stripe
- équipes
- 3 € / sem
- 19 € / sem
- invitations payantes

Le prix existe **en mémoire seulement** (voir [reco.md](reco.md)). Il ne se code pas tant que le test semaine 2 n’a pas dit oui.

## Acquisition (intention, pas ce run)

Google sur un cas précis — exemple : « DAF dit non ».  
Le mail **est** le cas, en deux minutes. Pas un Calendly pour vendre 3xrep.

## Stack (quand on coderait — pas ce run)

Next.js App Router, TypeScript, Tailwind, shadcn.  
Graphe JSON + graines.  
Zéro auth, zéro DB, zéro Stripe.  
Grok Build interdit.
