# Gestes — le cycle, en VP

**Figé.** 2 septembre 2026. Édouard : s’aligner là où les packs markdown sont présents et nous non ; **garder l’aspect VP qui refuse**. Gagne sur [benchmark-skills.md](benchmark-skills.md) §4 (« on ne cherche pas à battre le cold »). Ne casse pas [cerveau.md](cerveau.md) (moteur, hiérarchie, admission). Complète [prd.md](prd.md) §7–8 (layers) : un cycle, pas un deuxième produit.

Ne pas « améliorer » sans casser ce fichier. On y **remplit** les yaml, on n’ajoute pas un geste parce que Craig en a un.

## 1. La règle

On s’aligne sur les **moments** du cycle. On ne s’aligne pas sur les **livrables**.

Craig écrit le mail, le script, la séquence, le SOW, le battlecard. Un skill qui écrit est serviable. **Un geste 3xrep juge.** L’angle gagne : si le livrable que l’AE demande violerait une règle, le geste refuse, il ne rédige pas une version plus gentille.

Leur LLM peut habiller un mail **après** le verdict, s’ils le demandent. Ce n’est pas le produit. Le spec d’agent : tu n’es pas la bouche ([prd.md](prd.md) §9.5).

## 2. Catalogue — dix gestes, pas vingt-et-un

Un par moment. Les canaux (LinkedIn, voicemail, direct mail) ne sont pas des gestes. La pièce et le réflexe sont les mêmes ; le canal est à eux.

| # | Geste | Moment | Le VP refuse… | Ce n’est pas (Craig) |
| --- | --- | --- | --- | --- |
| 1 | `debrief-apres-call` | Sortie de rdv | « bon call » sans exhibit | `call-debrief` : score /30, talk-ratio, mail, reco CRM |
| 2 | `passe-trous` | Deal qui cale | La liste de cases vides | Un audit MEDDPICC R/Y/G |
| 3 | `prepa-call` | Avant le rdv | Un plan à 15 questions | `discovery-call` : script SPIN |
| 4 | `prepa-demo` | Avant la démo | La visite des features | `demo-script` : story arc |
| 5 | `objection` | « trop cher », silence | La punchline | `objection-handling` : playbook ACRC |
| 6 | `prix` | Chiffrage, reco, SOW | Un prix sans enjeu chiffré | `proposal-pricing` : packaging, ancrage |
| 7 | `nego` | Remise, délai, scope | Lâcher sans retour | `negotiation` : BATNA + closing techniques |
| 8 | `prospection` | Premier contact, relance, séquence | Écrire sans raison | `cold-email` / `cold-call` / `linkedin` / `outbound-sequence` |
| 9 | `pipe-review` | Lundi, forecast | La date de close comme un fait | `pipeline-review` + `forecast` : coverage × win rate |
| 10 | `autopsie` | Won / lost | « on a perdu sur le prix » | `win-loss-analysis` : patterns trimestre |

Toujours le même moteur, 8 étages. Le geste ne change que le **cadrage** (étage 1) : quelles familles de pièces, quel contrat de sortie, quel grade min.

V0 code : 1 et 2 (Julien). Les autres se **déclarent** ici ; on les remplit quand un vrai deal les demande, pas pour coller à Craig.

## 3. Ce que le VP fait, moment par moment

**`prepa-call`.** Une à trois pièces à tester dans *ce* rdv, dans l’ordre de la mort. La question du cran 1 de la première. Ce qu’on n’a pas le droit de poser (on n’a pas l’exhibit, ou ça brûlerait un point). Pas une liste SPIN.

**`prepa-demo`.** Quel **fait** la démo doit poser (BAC, points brûlés). Quelle slide est interdite tant que `qui-tranche` ou `enjeu-chiffre` est vide. « Tu n’as pas le droit de montrer le module X : tu n’as personne pour l’acheter. »

**`objection`.** L’objection est la pièce non tenue. CRAC = le réflexe, pas la réplique. « Trop cher » sans coût de l’inaction = Metrics vide. On ne répond pas au prix.

**`prix`.** Pas de montant tant que l’enjeu n’est pas un chiffre *dit par eux*. Un SOW avant ça, c’est un claim. Le geste rend le trou, pas le tarif.

**`nego`.** Chaque concession exige un retour (accès EB, process, date, case study). Sans retour = trou Contreparties. Pas de « je peux faire 10 % ».

**`prospection`.** Avant d’écrire : as-tu une *raison* (pièce ouverte chez eux, pas un persona) ? Si non : **n’écris pas**. Si oui : le premier cran, pas les 80 mots. LinkedIn / mail / tel n’existent pas pour nous. Layer 0 vit ici : « premier prospect, je fais quoi » = qui voir, quoi demander, **quand arrêter** — pas « voici le cold email ».

**`pipe-review`.** Deal par deal : quelle pièce tue le plus tôt. Une date de close sans exhibit = claim. Coverage 3× et win rate : interdits (proba). « Cette étape est illégale » (négo + EB vide) : oui.

**`autopsie`.** `passe-trous` sur un deal fermé. Même remontée, au passé. Le réflexe qui a tué. Ce n’est pas un rapport trimestre, c’est *ce* dossier.

**`debrief` / `passe-trous`.** Inchangés ([sortie.md](sortie.md), [cerveau.md](cerveau.md) §7).

## 4. Hors catalogue — on ne s’aligne pas

| Craig | Pourquoi on passe |
| --- | --- |
| `sales-context`, `buyer-persona` | Leur spec / CLAUDE.md. Un persona n’est pas *cette* personne (SONCAS est une pièce, pas un livrable). |
| `competitive-intel` battlecards | La pièce `alternative` suffit. Un PDF de traps, c’est un cours. |
| `lead-research` | Fetch chez eux ([acces.md](acces.md)). Pas un rapport d’intel. |
| `direct-mail`, `event-networking`, `referral-intro` (le mail) | Canal / bouche. |
| `forecast` (coverage × win rate × ACV) | Proba de close. Interdit. |
| `sales-comp` | Autre métier. |

Pas un onzième geste « follow-up email ». [sortie.md](sortie.md) : le mail est une action *sous* le verdict, copiée par eux. Si l’agent rédige, c’est *leur* LLM, après le JSON, et le spec peut l’interdire s’il n’y a pas d’objectif.

## 5. Contrat d’un geste (rappel)

Inchangé. ~20 lignes. Zéro méthode. Exemple pour un moment qu’on n’avait pas :

```yaml
id: prospection
declencheur: premier mail, relance, séquence, cold
pieces: [dossier, motivations]   # souvent : qui-tranche, enjeu, levier
contrat: un cran, ou "n'écris pas"
grade_min: B
interdit: [brouillon d'email, objet, séquence à 8 touches]
```

Admission : un geste qui demande un livrable que l’angle interdit **ne part pas**. C’est la hiérarchie [cerveau.md](cerveau.md).

## 6. Décision prise

1. **Alignement = le cycle, pas la copie.** Dix gestes ci-dessus. Pas les 21 skills.
2. **L’angle ne se négocie pas.** Un geste serviable (script, punchline, mail, % de close) est un skill Craig. On ne l’écrit pas.
3. **Les canaux ne se multiplient pas.** Un geste `prospection`, pas quatre.
4. **V0 inchangé.** Julien = `debrief` + `passe-trous`. Le catalogue se remplit à la demande d’un vrai deal, dans cet ordre après les pièces Julien : `prepa-call`, `objection`, `pipe-review`, puis le reste.

On ne rejoue pas. Si un onzième moment apparaît sur un deal réel, on l’ajoute ici avec la même règle. On n’ajoute pas un geste parce qu’un repo en a un.
