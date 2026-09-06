---
name: scan-sales-gaps
description: Lister les gaps entre le cerveau 3xrep (pièces, gestes, lexique) et la connaissance sales B2B mondiale. Même les méthodes minuscules. Classer — ne pas intégrer. Capturer dans docs/gaps/captures/. Use when asked to scan sales methods, list MCP gaps, or run the Cursor Cloud gaps automation.
---

# Scan sales gaps — 3xrep

Un geste. Pas une usine de contenus. Pas un LMS. Cadrage : [`docs/gaps.md`](../../../docs/gaps.md).

3xrep juge un dossier B2B. L’unité est la **pièce** ([`cerveau.md`](../../../docs/cerveau.md)), pas le sigle. Trouver « FAINT » sans trou de jugement = **alias**, pas un gap à coder.

B2B seulement. B2C → `B2C`, une ligne, on passe.

## Avant

Lire, dans cet ordre :

1. [`docs/gaps.md`](../../../docs/gaps.md) — cases, interdits.
2. [`src/lib/brain/pieces.ts`](../../../src/lib/brain/pieces.ts) — pièces **codées**.
3. [`src/lib/brain/lexique.ts`](../../../src/lib/brain/lexique.ts) — `METHODES` + `EQUIVALENCES`.
4. [`docs/methodes.md`](../../../docs/methodes.md) — fichiers écrits + « encore à écrire ».
5. [`docs/gestes.md`](../../../docs/gestes.md) — 21 moments.
6. [`docs/differentiel.md`](../../../docs/differentiel.md) — kernel (y compris pièces nommées mais pas encore dans `PIECES`).

Fichier méthode absent ≠ pièce absente. Pièce du kernel absente de `PIECES` = gap `pièce`.

## Chercher

Web search, listes 2026, écoles FR, négo, discovery, cycle. **Même les petites.** Pas seulement MEDDIC.

Sources typiques (pas une allowlist) : guides qualification (BANT / MEDDPICC / SPICED / FAINT / SCOTSMAN…), méthodologies (Challenger, JOLT, Sandler, Gap, Miller Heiman, Command of the Message…), grilles FR (SONCAS, SPANCO, SIMAC, CRAC, QQOQCCP…).

Une trouvaille surprise compte. Un livrable (mail, script, close) aussi — pour le **rejeter**.

Ne pas inventer une méthode. Phrase + lien, ou la ligne n’existe pas.

## Classer

Une case par ligne ([`docs/gaps.md`](../../../docs/gaps.md) §3) :

| Case | Test |
| --- | --- |
| **alias** | La case existe déjà comme pièce (noms différents). |
| **pièce** | Le moteur ne peut pas juger ce trou. Six cases imaginables. |
| **geste** | Passe [gestes.md](../../../docs/gestes.md) §2. Sinon alias de geste. |
| **livrable** | On écrirait à leur place. |
| **cours** | Persona, DISC, mindset. |
| **B2C** | Retail, magasin, AIDA conso. |

Déjà dans `METHODES` ou `docs/methodes/<slug>.md` → noter `déjà` (pas un gap). Kernel nommé, pas dans `PIECES` → `pièce`.

## Écrire

`docs/gaps/captures/YYYY-MM-DD.md` (créer `captures/` au premier run). Un fichier par jour. Suffixe `-2` si deux runs.

```md
# Scan gaps — YYYY-MM-DD

Sources : (urls)

| trouvaille | case | déjà / pièce / geste | note |
| --- | --- | --- | --- |

## Pièces candidates (si une)

id proposé · trou · pourquoi ce n’est pas un alias · **ne pas remplir**

## Hors scope

B2C, livrables, cours — une ligne chacun.
```

Pas de yaml de pièce. Pas de PR qui ajoute une méthode « pour compléter ». Pas de %.

## Interdits

- Intégrer, remplir, « tant qu’à faire voilà FAINT.md ».
- Scanner le B2C.
- Promettre un win rate.
- Créer `docs/loops/`.
- Publier hors repo.
