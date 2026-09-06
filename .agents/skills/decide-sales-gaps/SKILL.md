---
name: decide-sales-gaps
description: Décider d’intégrer ou non les gaps listés par scan-sales-gaps. Rare. Admission à six cases. Go seulement si un vrai deal ou une query pSEO tient. Use when asked to integrate sales gaps, decide MCP updates, or run the less-frequent Cursor Cloud decide automation.
---

# Décider les gaps — 3xrep

Un geste, rare. Cadrage : [`docs/gaps.md`](../../../docs/gaps.md). Scan d’abord : skill `scan-sales-gaps`. Sans capture récente, **stop** — tourner le scan, ne pas inventer.

L’automation **propose**. Elle ne shippe pas une pièce. Édouard (ou le land) tranche.

## Avant

1. Dernière capture `docs/gaps/captures/`.
2. [`docs/cerveau.md`](../../../docs/cerveau.md) §9 — ordre de remplissage, admission.
3. [`src/lib/brain/pieces.ts`](../../../src/lib/brain/pieces.ts) — ce qui est déjà exécutable.
4. Un **vrai deal** ou une query pSEO qui tient ? Si non : tout `pièce` = **wait**. C’est la règle. On n’écrit pas pour compléter une grille.

## Pour chaque ligne `pièce` de la capture

Trois portes. Les trois, ou **no-go**.

1. **Pas un alias.** Impossible de rattacher à une pièce existante sans mentir.
2. **Admission.** On *pourrait* remplir les six cases (preuve valide, fausse preuve, test, mort, perches, échelle 3 crans). Si une case est du vent : no-go. Ne pas les remplir ici.
3. **Demande.** Un deal réel, une `pipe_review` chez un user, ou une query pSEO qui tient. « C’est dans tous les blogs 2026 » ≠ une demande.

`alias` → éventuellement fichier `docs/methodes/<slug>.md` **si** pSEO. Pas une pièce.
`geste` → déclarer dans [gestes.md](../../../docs/gestes.md) seulement si §2. Yaml plus tard.
`livrable` / `cours` / `B2C` → no-go. Toujours.

## Écrire

`docs/gaps/decisions/YYYY-MM-DD.md` (créer `decisions/` au premier run).

```md
# Décision gaps — YYYY-MM-DD

Capture : docs/gaps/captures/…

| trouvaille | porte | go / wait / no-go | pourquoi |
| --- | --- | --- | --- |

## Suite

Une action, ou « rien ». Pas un backlog.
```

Si go pièce : **ne pas** écrire le yaml dans ce run sauf demande explicite (« remplis `criteres-achat` »). La décision pointe. Le remplissage suit [cerveau.md](../../../docs/cerveau.md) §9.

## Interdits

- Pièce incomplète.
- Intégrer parce que le scan est long.
- B2C.
- Win rate, « ça nous rend plus complets ».
- Force-push, land `main` sauf `/end`.
