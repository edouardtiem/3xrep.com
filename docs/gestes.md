# Gestes — le cycle, en VP

**Figé (la règle).** 2 septembre 2026. Édouard : s’aligner là où les packs markdown sont présents et nous non ; **garder l’aspect VP qui refuse**. Gagne sur [benchmark-skills.md](benchmark-skills.md) §4 (« on ne cherche pas à battre le cold »). Ne casse pas [cerveau.md](cerveau.md) (moteur, hiérarchie, admission). Complète [prd.md](prd.md) §7–8 (layers) : un cycle, pas un deuxième produit.

**Le décompte de dix est mort.** C’était trop gros : des étapes du terrain avaient disparu, des moments VP n’étaient pas des étapes. Catalogue réel ci-dessous. On n’ajoute pas un geste parce que Craig en a un.

Ne pas « améliorer » la règle sans casser ce fichier. On y **remplit** les yaml à la demande d’un vrai deal. Un 22e moment : seulement s’il passe le test §2.

## 1. La règle

On s’aligne sur les **moments** du cycle. On ne s’aligne pas sur les **livrables**.

Craig écrit le mail, le script, la séquence, le SOW, le battlecard. Un skill qui écrit est serviable. **Un geste 3xrep juge.** L’angle gagne : si le livrable que l’AE demande violerait une règle, le geste refuse, il ne rédige pas une version plus gentille.

Leur LLM peut habiller un mail **après** le verdict, s’ils le demandent. Ce n’est pas le produit. Le spec d’agent : tu n’es pas la bouche ([prd.md](prd.md) §9.5).

Les canaux (LinkedIn, voicemail, direct mail, tel) ne sont pas des gestes. La pièce et le réflexe sont les mêmes ; le canal est à eux.

Toujours le même moteur, 8 étages. Le geste ne change que le **cadrage** (étage 1) : quelles familles de pièces, quel contrat de sortie, quel grade min.

## 2. Test d’admission — c’est un geste si les trois

1. **L’AE s’arrête là dans la semaine.** Il demanderait au VP. Pas un canal, pas « j’ai besoin d’un mail ».
2. **Le cadrage change.** Familles de pièces, contrat de sortie, ou interdit — pas seulement le mot déclencheur.
3. **Ce n’est pas autre chose.** Pas une pièce (`qui-tranche`). Pas une action de l’étage 7 (convier l’EB, tester le champion). Pas un livrable. Pas un canal.

Si 2 échoue : c’est un **alias** du geste déjà là, pas un nouveau. Voir §5.

## 3. Catalogue réel — 21 moments

Les 10 du matin : 1, 3, 5, 7, 10, 11, 12, 17, 18, 19. Le reste était soit plié dans un trop gros, soit oublié (closing intermédiaire, after-no, QBR dans [terrain/template-parcours.md](terrain/template-parcours.md) ; inbound, silence, POC, papier, RFP, prépa exec dans la semaine d’un VP).

V0 code : **1 et 17** (Julien). Les autres se **déclarent** ici.

### Entrée

| # | Geste | Moment | Le VP refuse… |
| --- | --- | --- | --- |
| 1 | `prospection` | Premier contact outbound, relance, séquence | Écrire sans raison |
| 2 | `inbound` | Formulaire, « je veux une démo » | Booker la démo demandée |

`inbound` n’est pas `prospection`. L’interdit n’est pas le même : là ils ont déjà demandé quelque chose. Layer 0 outbound = qui voir, quoi demander, **quand arrêter**. Layer 0 inbound = **ne pas** leur donner la démo avant une pièce ouverte.

### Avant le rdv

| # | Geste | Moment | Le VP refuse… |
| --- | --- | --- | --- |
| 3 | `prepa-call` | Avant le **premier** rdv de découverte | Un plan à 15 questions |
| 4 | `prepa-suivi` | Avant le rdv 2, 3, n | Refaire la découverte |
| 5 | `prepa-demo` | Avant la démo | La visite des features |
| 6 | `prepa-exec` | Avant le rdv EB / C-level | Le récap, l’« alignment call » |

`prepa-suivi` n’est pas `prepa-call` : on ne rouvre pas le tableau, on **falsifie le claim** de la dernière fois. `prepa-exec` n’est pas une démo ni une découverte.

### Pendant / juste après l’événement

| # | Geste | Moment | Le VP refuse… |
| --- | --- | --- | --- |
| 7 | `debrief-apres-call` | Sortie de rdv (tous) | « bon call » sans exhibit |
| 8 | `no-show` | Pas venus / 3× report | Renvoyer le Calendly |
| 9 | `ghost` | Le fil meurt | « just checking in » |
| 10 | `objection` | « trop cher », silence en séance | La punchline |
| 11 | `prix` | Chiffrage, reco, SOW | Un prix sans enjeu chiffré |
| 12 | `nego` | Remise, délai, scope | Lâcher sans retour |
| 13 | `poc` | Ils demandent un essai / kickoff demain | L’essai sans critère, sans sortie, sans EB |
| 14 | `rfp` | Grille d’appel d’offres | Remplir la grille |
| 15 | `papier` | Legal, achats, DPA, sécu, IT | « c’est chez legal » |
| 16 | `closing-intermediaire` | Next step, oui verbal, MAP, RDV DAF | « on se reparle » |

Démo debrief = `debrief-apres-call`, cadrage = étape démo. Pas un 22e. `no-show` (créneau manqué) ≠ `ghost` (silence). Sécu / DPA / questionnaire IT = `papier` (process), pas un geste à part.

### Le dossier

| # | Geste | Moment | Le VP refuse… |
| --- | --- | --- | --- |
| 17 | `passe-trous` | Deal qui cale | La liste de cases vides |
| 18 | `pipe-review` | Lundi, forecast, saut d’étape CRM | La date de close comme un fait |

Étape CRM illégale (négo + EB vide) : `pipe-review`, pas un geste « stage ». Coverage × win rate : interdit (proba).

### La fin / l’installé

| # | Geste | Moment | Le VP refuse… |
| --- | --- | --- | --- |
| 19 | `autopsie` | Won / lost / no-decision | « on a perdu sur le prix » |
| 20 | `apres-non` | Ils ont dit non, le fil n’est pas mort | Le mail « si tu changes d’avis » |
| 21 | `qbr` | Revue installé, expansion | Le tour des features utilisées |

`autopsie` = dossier **fermé**, au passé. `apres-non` = encore une relation : qui d’autre, quel trou a tué, **quand on arrête**. `qbr` : l’expansion est un deal (qui tranche), pas un upsell glissé.

Cycle court : 6, 13, 14, 15, 21 souvent absents. On n’oblige personne à les jouer.

## 4. Ce que le VP fait, moment par moment

**`prospection`.** Avant d’écrire : as-tu une *raison* (pièce ouverte chez eux, pas un persona) ? Si non : **n’écris pas**. Si oui : le premier cran, pas les 80 mots. LinkedIn / mail / tel n’existent pas pour nous.

**`inbound`.** Ils ont demandé une démo. C’est une perche, pas un contrat. Une pièce à tester *avant* de booker, ou on ne booke pas. « Ils sont chauds » n’est pas une preuve.

**`prepa-call`.** Une à trois pièces à tester dans *ce* rdv, dans l’ordre de la mort. La question du cran 1 de la première. Ce qu’on n’a pas le droit de poser (pas d’exhibit, ou ça brûlerait un point). Pas une liste SPIN.

**`prepa-suivi`.** Le claim de la dernière fois (un). Le test qui le tuerait cette heure. On n’ajoute une pièce que si la mort l’exige. Refaire BEBEDC = trou.

**`prepa-demo`.** Quel **fait** la démo doit poser (BAC, points brûlés). Quelle slide est interdite tant que `qui-tranche` ou `enjeu-chiffre` est vide. « Tu n’as pas le droit de montrer le module X : tu n’as personne pour l’acheter. »

**`prepa-exec`.** Un fait que *cet* EB peut acheter. Ce qu’on ne raconte pas (le parcours ops, les features). S’il n’y a pas d’enjeu chiffré *dit par eux*, on n’a pas de rdv exec — on a un récap. Le geste le dit.

**`no-show`.** Le créneau manqué est un exhibit sur la priorité, le champion, ou `qui-tranche` — pas un problème d’agenda. 4e créneau = non, sauf pièce nouvelle. On ne « relance pas le lien ».

**`ghost`.** Quelle pièce a tué le fil (souvent next step sans date, ou EB jamais convie). Un cran, ou **arrêter**. Le checking-in est un livrable interdit.

**`objection`.** L’objection est la pièce non tenue. CRAC = le réflexe, pas la réplique. « Trop cher » sans coût de l’inaction = Metrics vide. On ne répond pas au prix.

**`prix`.** Pas de montant tant que l’enjeu n’est pas un chiffre *dit par eux*. Un SOW avant ça, c’est un claim. Le geste rend le trou, pas le tarif.

**`nego`.** Chaque concession exige un retour (accès EB, process, date, case study). Sans retour = trou Contreparties. Pas de « je peux faire 10 % ». Prépa de séance de négo = le même geste, pas un 22e.

**`poc`.** Critère de succès *dit par eux*, date de sortie, qui tranche à la fin, timebox. Sans ça : **pas d’essai**. Un kickoff sans critère est une démo déguisée.

**`rfp`.** Si `qui-tranche` ou critères d’achat vides : **n’y va pas** — tu es la colonne. Si tenus : le cran qui décide si on joue. On ne rédige pas la réponse.

**`papier`.** Le process réel : qui, combien de cycles, quoi bloque, quelle date n’est pas un espoir. « C’est chez legal » = pièce vide. Questionnaire sécu = le process, pas un side quest.

**`closing-intermediaire`.** Un next step a une date **et** une personne dans la pièce. Un oui verbal sans les deux n’est pas un close. MAP / « on convie le DAF » sans créneau = claim. C’est l’étape que les 10 avaient oubliée.

**`pipe-review`.** Deal par deal : quelle pièce tue le plus tôt. Une date de close sans exhibit = claim. « Cette étape est illégale » : oui.

**`autopsie`.** `passe-trous` sur un deal fermé. Même remontée, au passé. Le réflexe qui a tué. Ce n’est pas un rapport trimestre, c’est *ce* dossier.

**`apres-non`.** Le non a une pièce. Qui d’autre dans le compte, ou on arrête. Recycle sans trou nommé = prospection sans raison.

**`qbr`.** L’installé a un enjeu (chiffre *dit par eux*, maintenant). L’expansion a un `qui-tranche`. Sinon ce n’est pas un QBR, c’est une visite.

**`debrief` / `passe-trous`.** Inchangés ([sortie.md](sortie.md), [cerveau.md](cerveau.md) §7).

## 5. Pas un geste — alias ou hors catalogue

| Ça a l’air d’un moment | C’est | Où ça vit |
| --- | --- | --- |
| LinkedIn / tel / voicemail / direct mail | Canal | `prospection` / `inbound` |
| Follow-up email | Livrable | Après le JSON, *leur* LLM — [sortie.md](sortie.md) |
| Convier l’EB, tester le champion, multi-thread | Action étage 7 | Sortie de `debrief`, `passe-trous`, `closing-intermediaire` |
| Forecast coverage × win rate | Proba de close | Interdit. Date = claim dans `pipe-review` |
| Saut d’étape CRM | Même cadrage | `pipe-review` |
| Questionnaire sécu / DPA / IT | Paper process | `papier` |
| Demande de refs / cas client | Stall, souvent | `objection` |
| Concurrent nommé, champion qui part, budget glissé | Événement → dossier | `passe-trous` |
| Prépa séance de négo | Même cadrage | `nego` |
| Démo debrief | Même cadrage, autre étape | `debrief-apres-call` |
| Expansion installé comme nouveau deal | Dossier | `qbr` ou `passe-trous` |
| Handoff CS | Autre métier | `autopsie` won, plus tard |
| `sales-context`, `buyer-persona` | Spec / persona | Chez eux. SONCAS = pièce, pas livrable |
| Battlecards, `lead-research`, `sales-comp` | Livrable / fetch / autre métier | [acces.md](acces.md) pour le fetch |

Pas un 22e « follow-up email ». Si l’agent rédige, c’est *leur* LLM, après le JSON, et le spec peut l’interdire s’il n’y a pas d’objectif.

## 6. Contrat d’un geste (rappel)

Inchangé. ~20 lignes. Zéro méthode.

```yaml
id: inbound
declencheur: formulaire, demande de démo, inbound
pieces: [dossier, motivations]
contrat: une pièce à tester avant de booker, ou "ne booke pas"
grade_min: B
interdit: [lien Calendly, script de démo, "ils sont chauds"]
```

Admission : un geste qui demande un livrable que l’angle interdit **ne part pas**. C’est la hiérarchie [cerveau.md](cerveau.md).

## 7. Décision prise

1. **Alignement = le cycle, pas la copie.** 21 moments ci-dessus. Pas les 21 skills Craig (l’axe n’est pas le nombre : eux écrivent, nous jugeons).
2. **L’angle ne se négocie pas.** Un geste serviable (script, punchline, mail, % de close) est un skill Craig. On ne l’écrit pas.
3. **Les canaux ne se multiplient pas.** Un geste `prospection`, pas quatre.
4. **Un moment de plus = le test §2**, pas un repo.
5. **V0 inchangé.** Julien = `debrief-apres-call` + `passe-trous`. Remplissage yaml, dans cet ordre après les pièces Julien : `prepa-call`, `closing-intermediaire`, `objection`, `pipe-review`, puis le reste quand un vrai deal les demande.

On ne rejoue pas la règle. Le décompte de dix, si.
