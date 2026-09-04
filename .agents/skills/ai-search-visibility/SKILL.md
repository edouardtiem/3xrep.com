---
name: ai-search-visibility
description: Run visibility for 3xrep. Score how web search, public AI blocks, and this agent treat 3xrep vs rivals on the buyer prompt list (recommended / cited / mentioned / absent). Use when asked to run visibility, check AI search, GEO/AEO for 3xrep, or who shows up for VP Sales agent / Gong alternative prompts. Do not use to publish, post, buy ads, or open a separate SEO bot.
---

# Run visibility for 3xrep

Un geste. Pas un bot SEO. Pas une usine de contenu. La liste vit dans ce repo : [`docs/visibility/prompt-list.md`](../../../docs/visibility/prompt-list.md). Comment tourner : [`docs/visibility/README.md`](../../../docs/visibility/README.md).

3xrep = cerveau MCP vente B2B, 99 € / org / mois. Première org = cold / online only. Landing + checkout doivent convertir un inconnu. 0 ads.

## Ladder (un rung, le plus haut tenu)

| Rung | 3xrep est… |
| --- | --- |
| **recommended** | mis en avant comme option à prendre (shortlist, « use this », « start here ») |
| **cited** | un lien pointe vers `3xrep.com` (ou une page clairement 3xrep) |
| **mentioned** | le nom apparaît, sans endorsement, sans lien 3xrep |
| **absent** | ni le nom ni le domaine dans le texte **capturé** ni dans les liens **capturés** |

Cited + recommended → **recommended**. Mentioned + un lien 3xrep → **cited**. Pas de demi-rung. Pas de « probably ».

Même ladder pour **chaque** rival nommé dans la réponse — y compris un nom qui n’est pas sur la liste seed.

## Prompt kinds

`category` · `problem` · `comparison` · `brand`

Lire le kind sur la ligne de [`prompt-list.md`](../../../docs/visibility/prompt-list.md). Ne pas reclasser à la volée. Si la ligne est mauvaise : le noter, tourner quand même, proposer un edit via `build-3xrep-prompt-list`.

## Surfaces

1. **web-search** — résultats + extraits, liens.
2. **public-ai** — blocs AI publics (AI Overview / AI Mode / Perplexity public / Copilot public) **si** le texte et les liens sont visibles sans login.
3. **own-answer** — ta réponse à **ce** prompt, dans cette conversation, comme si un acheteur froid te le posait. Capture-la. Puis score-la. Ce n’est pas la note du check.

Login (ChatGPT, Claude.ai, Gemini, Perplexity connecté, etc.) = **pas** une surface « empty ». C’est une ligne **awaiting paste**.

## Steps

1. Lire [`docs/visibility/prompt-list.md`](../../../docs/visibility/prompt-list.md). Tourner les **5 top** d’abord. Le reste si le temps tient ; sinon le dire.
2. Pour chaque prompt × chaque surface **accessible** :
   1. Poser le prompt **tel quel**. Pas de « 3xrep » ajouté sur un prompt non-brand.
   2. **Capturer** texte + liens **avant** de juger. Fichier : `docs/visibility/captures/YYYY-MM-DD.md` (créer le dossier au premier run).
   3. Scorer 3xrep. Scorer chaque autre nom. Un nom surprise compte.
   4. Citer **une** phrase exacte (verbatim de la capture) + **un** lien. Pas de phrase = pas de rung au-dessus d’absent. Pas de lien 3xrep = pas **cited**.
3. Lister ce qui **attend un paste** (assistant login) : prompt, surface, pourquoi bloqué. Ne pas scorer ces lignes.
4. Une **seule** action nommée pour la semaine, avec URL. Pas un backlog. Pas « écrire du contenu ». L’action doit pouvoir se faire sans se nommer, sans warm-intro, sans pub.

Relire [`landing.md`](../../../docs/landing.md) / [`icp.md`](../../../docs/icp.md) seulement pour juger si une description 3xrep est **fausse**. Pas pour réécrire le check en pitch.

## Output

Table, une ligne par prompt × surface **capturée** :

| prompt | kind | surface | rung 3xrep | qui d’autre (rung) | phrase exacte | source |
| --- | --- | --- | --- | --- | --- | --- |

Puis :

- **Awaiting paste** — liste ou « aucune ».
- **Action de la semaine** — un verbe + une URL. Ex. : « poser une phrase citable sur https://3xrep.com/… ». Si rien n’est actionnable sans publier : le dire, pas inventer une page.

Écrire le brief (si l’action en a besoin) dans `docs/visibility/briefs/YYYY-MM-DD.md`. Créer le dossier au premier brief. Ne pas pousser le brief hors du repo.

## Rules

- **Never invent a citation.** Pas de lien deviné. Pas de « ChatGPT a dit » sans capture. Training data ≠ capture.
- **Never report a skipped surface as empty / absent.** Skipped = `skipped — awaiting paste` (ou raison). Absent = capturé et 3xrep n’y est pas.
- **Never publish or post without an explicit yes.** Pas de tweet, listing, commentaire, PR de copy live, `llms.txt` en prod, page pSEO. Brief dans le repo seulement.
- **Never warm-intro.** Ne jamais nommer Édouard, Uptoo, ou OC comme builder, auteur, preuve, ou réseau. L’acheteur froid ne doit pas pouvoir remonter à eux.
- Pas d’ads. Pas de cron. Pas d’UI CRM. Pas de Grok Build. Pas un second repo « SEO ».
- Ne pas fusionner cette PR / ce check avec un land `main` sauf si on te le demande.

## Hors scope (cette invocation)

Construire ou éditer la liste → skill `build-3xrep-prompt-list`.
Tourner un check ≠ shipper une page, un schema, un crawler audit.
