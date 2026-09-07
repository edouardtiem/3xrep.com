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

On garde **l’entrée et le verdict** de chaque appel d’outil, **quatorze jours**, puis on efface.

Pour : relire les premiers vrais dossiers, caler le directeur, améliorer le cerveau. Pas pour vendre une mémoire. Pas pour un tableau de bord.

Ligne publique (site, install, docs) :

*We don’t join your calls. Tool inputs and verdicts are kept 14 days to improve the VP, then deleted. We don’t write to your CRM.*

### Ce que ce n’est pas

| Ça | Non — c’est |
| --- | --- |
| La mémoire « le trou du 12 » | Plus tard, hash, zéro contenu ([plg.md](plg.md), [cerveau.md](cerveau.md)) |
| Un enregistreur | Pas de bot Zoom / Meet. On n’entre pas dans l’appel |
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
