# Prix, essai, parrainage

**Figé le 14 septembre 2026** (Édouard). Gagne sur ce fichier au 4 sept (tools ouverts, pas d’essai, pas de comparaison). Contrat : [decisions.md](decisions.md) 2026-09-14. Live code **tant que l’item 6 n’est pas shippé** : tools encore ouverts, 129 $ encaissable, pas de mur — [checkout.md](checkout.md), [roadmap.md](roadmap.md) item 3.

Le **$129 / month / organization** (USD) tient. Jamais de siège. Palier sept : 1 org payante — inchangé.

## Ce qu’ils achètent

Pas un tool de plus. Le juge sur **leur liste**, dans **le temps**, plus le souvenir, plus — assez tard — la confirmation chez les autres maisons.

Session du 4 sept ([sessions/2026-09-04.md](sessions/2026-09-04.md)) : tant que le verdict porte sur *un call* et *le commercial*, ChatGPT suffit. La différence est le pipe + le temps. **Acté** le 14 sept : on construit ça, et on le met derrière un essai qui coupe.

## Essai

Le cerveau répond pendant N jours. N = **14**, plus des **+14** ([decisions.md](decisions.md) 2026-09-14 soir) :

| Qui | N |
| --- | --- |
| Direct | 14 |
| Direct + une org inscrite grâce à lui | 28 |
| Recommandé (14 + 14 cadeau) | 28 |
| Recommandé + une org inscrite grâce à lui | 42 |

Un bonus parrain : la **première** org filleule qui démarre un essai. Pas une pile infinie.

**Jour 0.** Stripe ou page : gratuit N jours. **Pas de carte exigée** (premier pas). Kill switch : trop peu d’inscriptions → on enlève le mur même gratuit ([decisions.md](decisions.md) §5).

**Fin d’essai, pas payé.** Chaque appel d’outil : la phrase de coupure, plus de verdict. Cible EN :

*3xrep is not answering: this organization has no active payment. Whatever follows is probably less relevant.*

Lexique / lookup : même règle — on ne laisse pas un skill déguisé après la coupure. La phrase d’abord.

## Parcours dans l’agent

Dans la fenêtre d’essai (pas quatre semaines si N = 14) :

1. Brancher le fichier client.
2. Routine revue de liste (planifié chez eux).
3. Drapeaux sur les affaires qui cassent une porte.
4. Reco d’écriture chez eux : quelle propriété, pourquoi on ne voit pas la preuve. Claude écrit via **leur** connecteur. 3xrep ne push pas. Pas inventer la valeur.
5. Suites : Claude écrit ; 3xrep dit envoie / n’envoie pas + pièce manquante.

Premier branchement : titre, mission (commercial / manager / directeur / autre), URL du site → description maison, ce qu’ils vendent, à qui. Stocké chez nous, lié à l’org. [spec-agent.md](spec-agent.md).

À la fin : ils ont vu **leur** liste mentir. Pas « +30 % de signatures ».

## Data

| Couche | Durée | Rôle |
| --- | --- | --- |
| Journal (`mcp_calls`) | 14 jours, delete | Caler le cerveau |
| Squelette | Sans fin | Souvenir + dénouement + confirmation après X |
| Profil org | Sans fin | Titre, mission, blurb maison (leur URL) |
| Roman (verbatim) | Journal seulement | Jamais le fossé |

Comparaison : [gaps.md](gaps.md) §6, [decisions.md](decisions.md) §4. Poids de la méthode, pas classement d’équipes. Montant = somme des portes cassées, pas pronostic.

## Siphon

Ils peuvent dump le lexique tant que l’essai (ou le payant) répond. Après la coupure : la phrase, pas le dictionnaire. Un export d’avril n’est pas le jugement de septembre.

ToS / DRM : théâtre. Rate-limit des dumps évidents : plus tard, en regardant l’usage.

## Interdits (tiennent)

Per-seat. Footer « propulsé par 3xrep » dans un mail **au prospect**. Plus d’une ligne d’upsell **dans une sortie de tool** (la phrase de coupure n’est pas un upsell de feature : c’est le contrat). Promettre un pourcentage de signatures. Calculette 412k × 42 %. Carte obligatoire au jour 0 — pas le premier pas.
