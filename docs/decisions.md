# Décisions produit

**Le registre.** 7 septembre 2026. Avant : une décision vivait dans le fichier qu’elle touchait (`figé` + date) ou dans une note du jour (`docs/sessions/`). Ça se perd. Ici : les décisions qui changent le **contrat**. Une section par décision. On n’en rouvre pas une sans une nouvelle section.

Pas les gaps de méthodes ([gaps/decisions/](gaps/decisions/)). Pas le journal du jour ([sessions/](sessions/)).

## Comment on écrit

Date. Qui. Ce qui était vrai. Ce qui est vrai maintenant. Ce que ce n’est **pas**. Où ça vit. Comment on rouvre.

---

## 2026-09-06 / 07 — Journal 14 jours

**Qui :** Édouard. Tranché le 6 sept (fil usage). Confirmé le 7 sept : *on a décidé de garder de l’info, il faut changer tout le produit. L’objectif c’est d’améliorer.*

**Figé.** Gagne sur l’ancienne ligne *We don’t store* ([landing.md](landing.md) avant le 7 sept, [sessions/2026-09-01-2.md](sessions/2026-09-01-2.md)).

### Ce qui était vrai

On disait : tes prompts restent chez toi. On n’enregistre pas. **On ne stocke rien.** Faux dès qu’un outil reçoit un transcript : le serveur le voit. La phrase mentait, ou elle interdisait d’apprendre.

### Ce qui est vrai maintenant

On garde **la demande et la réponse** de chaque appel d’outil, **quatorze jours**, puis on efface.

La demande, c’est tout ce que l’outil a reçu : transcript, extraits, notes, ce que le fichier client prétend. La réponse, c’est le verdict. C’est ça qu’on relit pour améliorer. Sans les deux, le journal ne sert à rien.

On n’entre **pas** dans l’appel : pas de robot Zoom / Meet, on n’enregistre pas le son. Si le texte de l’appel arrive dans la demande (collé, ou déjà sur la fiche), on le garde avec le verdict.

Pour : analyser demande + réponse, caler le directeur, améliorer le cerveau. Pas pour vendre une mémoire. Pas pour un tableau de bord.

Ligne publique (site, install, docs) :

*We don’t join your calls. Tool inputs and verdicts are kept 14 days to improve the VP, then deleted. We don’t write to your CRM.*

### Ce que ce n’est pas

| Ça | Non — c’est |
| --- | --- |
| La mémoire « le trou du 12 » | Plus tard, hash, zéro contenu ([plg.md](plg.md), [cerveau.md](cerveau.md)) |
| Un enregistreur / « on n’a pas le call » | Pas de bot Zoom. On a le texte **s’il est dans la demande**, plus le verdict |
| Écrire chez eux | Toujours interdit |
| Garder pour toujours | 14 jours, puis delete |
| Un fichier client à nous | [portes.md](portes.md) §7 — demain, autre décision |

### Où ça vit

- Table `mcp_calls` — [migration](../supabase/migrations/20260906160000_mcp_calls.sql). Projet 3xrep. RLS. Seul le serveur écrit. Sans la table, le cerveau répond quand même.
- Machine : `src/lib/mcp-log.ts`, branché sur chaque outil.
- Copy : `TRUST_LINE` dans `src/lib/copy.ts`.
- Contrat : [landing.md](landing.md) Confiance, [contournement.md](contournement.md) grade C, [cerveau.md](cerveau.md) interdits.

### Rouvrir

Seulement si : on allonge ou on coupe les 14 jours ; on stocke autre chose que entrée + verdict ; on promet la mémoire « le 12 ». Une nouvelle section. On ne réécrit pas celle-ci.

Note du jour : [sessions/2026-09-07-4.md](sessions/2026-09-07-4.md).

---

## 2026-09-06 / 07 — Prix 129 dollars

**Qui :** Édouard. Tranché le 6 sept (roadmap US first). Confirmé live le 7 sept (Stripe + copy). Confirmé le 7 sept soir : *ne garde pas les deux — on passe à 129 dollars.*

**Figé.** Gagne sur l’ancre 99 € du 1er–3 sept ([prd.md](prd.md), [landing.md](landing.md) avant ce jour). Gagne sur [roadmap.md](roadmap.md) item 3 « pas encore shippé ».

### Ce qui était vrai

99 euros / mois / organisation. Ancre Modjo (un siège France). Checkout Stripe en euros. Le 129 dollars était une intention : marché US, pas le checkout.

### Ce qui est vrai maintenant

**129 dollars / mois / organisation.** Ancre US. Une organisation, jamais un siège. Devise et langue au checkout (Adaptive Pricing). Pas deux prix. Pas un palier 99 et un palier 129.

Ligne publique (hero, install, docs) :

*From $129/month. For the entire organization.*

### Ce que ce n’est pas

| Ça | Non — c’est |
| --- | --- |
| Un siège | Toujours l’organisation |
| 199 euros | Territoire démo. 129 reste self-serve |
| Deux Prices sur le même product | Un Price USD. L’ancien 99 euros ne vit plus |
| Changer le montant en silence | Cette section. On ne revient pas à 99 |

### Où ça vit

- Copy : `LIST_PRICE_USD` dans `src/lib/stripe-checkout-session.ts` (hero, install, layout).
- Stripe : Price récurrent 129,00 USD → `STRIPE_PRICE_ID`. [checkout.md](checkout.md).
- Contrat : [landing.md](landing.md), [plg.md](plg.md), [prd.md](prd.md) (complément : ce registre gagne).

### Rouvrir

Seulement si : on change le montant ; on ajoute un siège ; on rouvre un palier euros. Une nouvelle section. On ne réécrit pas celle-ci.

Note du jour : [sessions/2026-09-07-5.md](sessions/2026-09-07-5.md).
