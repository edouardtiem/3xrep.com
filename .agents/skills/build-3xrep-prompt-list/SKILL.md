---
name: build-3xrep-prompt-list
description: Build or edit the 3xrep AI-visibility prompt list in docs/visibility/prompt-list.md. 12–20 prompts max, 5 marked top. Buyer words, not SEO jargon. EN plus FR when buyers are mixed (landing is EN). Use when creating, trimming, or validating the prompt list — not when running the weekly visibility check.
---

# Build the 3xrep prompt list

Fichier unique : [`docs/visibility/prompt-list.md`](../../../docs/visibility/prompt-list.md). Comment on s’en sert : [`docs/visibility/README.md`](../../../docs/visibility/README.md). Tourner le check → skill `ai-search-visibility`, pas ici.

## Contraintes

- **12–20** prompts. Au-delà : couper, ne pas empiler.
- **5 top** marquées. Ce sont celles qu’on tourne même si le run est court.
- **Buyer words.** Ce qu’un founder / head of sales tape ou dit à un assistant. Pas « GEO », « AEO », « programmatic », « share of model », pas les noms de tools MCP.
- **Langue :** EN d’abord (landing EN). FR si l’acheteur mixte le dirait comme ça (« DAF dit non », pas une traduction mot-à-mot d’un H1).
- Un prompt = une question, telle quelle. Pas de cluster keywords. Pas de variante « + 2026 » pour gonfler.

## Kinds (un par ligne)

| Kind | L’acheteur… | 3xrep n’est pas dans le prompt |
| --- | --- | --- |
| `category` | demande un type d’outil (VP Sales agent, sales enablement, AI sales coach for the team) | oui |
| `problem` | décrit la douleur (DAF dit non, deal stuck, discovery vide, CRM vert qui ment) | oui |
| `comparison` | part d’un nom connu (Gong, Hyperbound, Second Nature, Modjo) | 3xrep seulement si le kind est `brand` |
| `brand` | nomme **3xrep** | non — c’est le test d’identité / prix |

`comparison` peut nommer un rival. Ne pas y coller 3xrep : ça devient `brand`.

## Comment choisir

1. Lire [`landing.md`](../../../docs/landing.md), [`icp.md`](../../../docs/icp.md), [`differentiel.md`](../../../docs/differentiel.md) — pour les **mots de l’acheteur**, pas pour recaser le pitch.
2. Garder les familles que le seed vise : VP Sales agent · sales enablement · « AI sales coach for the team » · alternatives Gong / Hyperbound / Second Nature · problèmes (DAF, deal stuck, discovery) · marque `3xrep`.
3. Marquer 5 top : celles qui convertiraient un **inconnu** vers `/install` + checkout. Une `brand` suffit dans le top (identité). Le reste du top = category / problem / comparison.
4. Toute ligne que personne ne dirait à voix haute : dehors.
5. Si on dépasse 20 : tuer d’abord les doublons EN/FR qui disent la même chose, puis les `brand` au-delà de 2–3.

## Output

Réécrire `prompt-list.md` :

- Statut en tête : **seed** (à valider) ou **validée le YYYY-MM-DD** (après un vrai run + un oui).
- Table : `#` · `top` (oui/—) · `kind` · `lang` · `prompt` · `pourquoi` (une demi-ligne, mots acheteur).
- Liste **rivals seed** : noms à scorer s’ils apparaissent. Pas exclusive — le check score aussi les non-listés.
- Pas de captures ici. Pas d’action de la semaine ici.

Dire ce qui a été ajouté / tué / promu top, en trois lignes.

## Rules

- Ne pas inventer des volumes, des ranks, des « les gens tapent ça ». Si ce n’est pas dans landing / ICP / un run capturé : c’est une hypothèse, et la ligne reste **seed**.
- Ne pas glisser Édouard, Uptoo, OC, ni un réseau, dans un prompt ou un « pourquoi ».
- Ne pas publier la liste. Ne pas en faire une page. Ne pas ouvrir un repo SEO.
- Ne pas tourner le check dans cette invocation sauf si on te le demande ensuite.
