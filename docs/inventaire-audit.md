# Audit — les 29 face au terrain

30 août 2026. Les 29 viennent des **catalogues**. Ici on les confronte aux **deals qui meurent**. [inventaire.md](inventaire.md) reste figé. On ne rouvre pas 28 parcours. [cadrage.md](cadrage.md) gagne.

Verdict par `id` : **tient** / **écho** / **catalogue** / **faible**.  
Écho = le trou est vrai, l’`id` est un costume d’étape. Pas un terrain de plus.  
Catalogue = vrai chez un AE enterprise SaaS, pas le mardi soir des 20.  
Faible = un geste, pas un deal déjà mal parti.

## Ce que le terrain dit (pas l’école)

Les deals ne meurent pas en 29 familles. Ils meurent de **trois trous**. Le reste est le moment où ça se voit.

| Trou | Ce que ça donne lundi | Preuve |
| --- | --- | --- |
| **1. Qui tranche n’est pas là** | Ops / champion gentil. DAF, gérant, associé : ailleurs. Fil unique. | Gong : deals single-thread ~71 % no-decision ou lost. Pas de décideur contacté ≈ 48 % d’échec. FR : « je dois en parler à mon associé » = le même trou, cycle court. |
| **2. Personne ne décide** | « On réfléchit ». Silence. Vert au CRM. | 40–60 % des deals qualifiés → no-decision, pas un concurrent. JOLT (2,5 M d’appels) : de ces no-decision, **56 % indécision** (peur de se tromper), **44 %** préférence pour rester. Enfoncer le coût de l’inaction sur de l’indécision **aggrave** (84 %). |
| **3. Le chiffre n’existe pas** | « Trop cher ». Remise. Propale. | « Lost on price » est le motif CRM n°1. Presque jamais la cause. La cause est plus tôt : pas d’enjeu, pas de métrique. |

Autour : next step pas calé (Gong : close −71 % si absent au 1er call). Feature dump (win rate 26 % → 5 %). Concurrent : réel, **minoritaire**.

Le test 1 vise le trou 1. C’est le bon. Les 20 le reconnaissent — DAF **ou** gérant **ou** associé. Le HUD reste Julien, ops. « DAF dit non » cherche. Les graines = copies, pas un 30ᵉ parcours.

## Le biais des 29

On a tranché : un parcours, **une** étape. Le moule tient. La réalité, elle, répète le **même** trou à chaque étape.

Résultat : 29 `id`. **12 tiennent** comme familles. **9 sont des échos**. **6 sont du last-mile enterprise**. **2 sont de la prep-cours**.

Les 20 du test ne jouent pas un paper process. Beaucoup n’ont pas de DAF : un gérant, un associé. L’inventaire US (POC, RFP, legal, achats) a gonflé le long.

## Verdict — les 29

### Tient — 12

Un collègue les passe en une phrase. Les deals changent. Le badge « terminé » serait un échec.

| `id` | Terrain | Note |
| --- | --- | --- |
| `daf-pas-dans-la-piece` | **Test 1.** Fil unique, mauvais pouvoir. | Tient. Graines : DAF **et** gérant / associé. Pas un `id` « l’associé ». |
| `appel-meurt` | Cold call / fil : pas d’enjeu, « envoyez un mail ». | Tient. FR phoning encore vivant. |
| `barrage` | Accueil, filtre. | Tient en FR. Moins central en outbound LinkedIn. |
| `inbound-tarif` | « Envoyez le prix / la démo ». | Tient dès qu’il y a de l’inbound. |
| `besoin-sans-enjeu` | Cahier, liste, pas de douleur chiffrée. | Tient. C’est le trou 3 **en découverte**. |
| `ils-veulent-la-demo` | Ils tirent vers le produit, tableau vide. | Tient. Surtout court (un seul call). |
| `trop-cher` | Ils l’ont dit. | Tient comme **masque**. Google le cherche. La cause est le trou 3. |
| `propale-piege` | PDF à la place du process. | Tient. Court et long. |
| `pas-de-next-step` | Bel appel, pas de date. | Tient. Gong −71 %. |
| `remise-dabord` | Le premier geste est une baisse. | Tient. Réflexe, pas une négo. |
| `concurrent` | Incumbent / bake-off. | Tient. Volume **plus bas** que le trou 2. Ne pas en faire le centre. |
| `statu-quo` | Ils ne changent pas. | Tient comme **situation**. **Invariant à resserrer** : ce n’est pas toujours « sans coût de rester ». Souvent : ils **veulent** changer et ils **n’osent pas** (JOLT). Pousser Why Change ici peut tuer le deal. |

### Écho — 9

Même invariant qu’un des 12, autre `debut`. Le moule les autorise. Ce ne sont pas 9 terrains. Après le test : copies, `titre_google`, ou on fusionne.

| `id` | Écho de | Pourquoi ce n’est pas une famille de plus |
| --- | --- | --- |
| `mauvais-siege` | `daf-pas-dans-la-piece` | Mauvais pouvoir, plus tôt. On l’avait déjà fusionné pour le champion gentil. |
| `demo-users` | `daf-pas-dans-la-piece` | L’EB n’est pas dans la salle. Démo. |
| `oui-verbal` | `daf-pas-dans-la-piece` | Tu closes le coach. Plus tard. |
| `champion-seul` | `daf-pas-dans-la-piece` | Le comité sans toi. Proche de C. |
| `pas-devent-critique` | `statu-quo` | Pas d’urgence, encore en découverte. Trou 2. |
| `on-reflechit` | `statu-quo` | Le stall **dit**. Souvent de l’indécision, pas du confort. |
| `feature-dump` | `ils-veulent-la-demo` | Gong le mesure. Côté vendeur du même deal. |
| `chiffre-sans-coi` | `trop-cher` / `besoin-sans-enjeu` | Le nombre est là. Même case vide. |
| `lacher-sans-contrepartie` | `remise-dabord` | Même geste, étape négo. |

### Catalogue — 6

Vrai. Pas les 20. Grands comptes, SaaS, paper. Après un oui semaine 2, pour qui a ce cycle.

| `id` | Où c’est vrai |
| --- | --- |
| `poc-sans-criteres` | SE / POV. Pas une PME à un call. |
| `rfp-deja-ecrit` | AO, incumbent. Rare hors grands comptes / public. |
| `veto-technique` | IT / sécu en comité. |
| `paper-jamais-ouvert` | Legal, DPA, achats. Last mile enterprise. |
| `acheteur-squeeze` | Procurement. |
| `legal-stall` | Redlines comme délai. |

### Faible — 2

| `id` | Pourquoi ça flotte |
| --- | --- |
| `liste-ment` | Lundi, vrai. Pas un deal déjà mal parti. C’est avant la pièce. |
| `prep-produit` | Un cours d’angle. Point 5 (outils) y gagne. Pas une famille qu’on se passe. |

## Trous manquants (la réalité, pas l’école)

On **n’ajoute pas** 5 parcours maintenant. On les nomme. Après le test, on décide : nouveau `id`, copie, ou `titre_google`.

| Terrain | Ce que le commercial dit | Où ça se range |
| --- | --- | --- |
| **Ghosting** | Ils ne répondent plus. | Pas dans les 29. Symptôme du trou 2 + pas de next step. Proche C. Candidat fort : on le **vit** plus souvent qu’un RFP. |
| **Indécision** (JOLT) | Ils sont d’accord. Ils ne signent pas. Peur de se tromper. | Pas un Why Change. `statu-quo` / `on-reflechit` mélangent les deux. À figer dans l’invariant, pas en 30ᵉ module. |
| **Associé / gérant** | « Je dois en voir avec mon associé. » | **Copie du test 1.** Court FR. Pas un `id`. |
| **Pas le bon moment** | « Rappelez dans 6 mois. » | Prospection. Trou 2 tôt. |
| **On a déjà un prestataire** | Premier appel. | Concurrent **ou** liste. Souvent un réflexe, pas un bake-off. |
| **Peur du rollout** | Ce n’est pas le prix, c’est le chantier. | Buyer Truths : effort d’implémentation bat le coût ~3:1. Absent. Colle au trou 2, pas à `trop-cher`. |

« Deal au forecast, dossier vide » et vacation : déjà hors catalogue, ça reste juste.

## Test des 4 — les 29 en bloc

| Critère moule | Les 29 | Le terrain |
| --- | --- | --- |
| Reconnaître la situation | Les 12 oui. Les 6 catalogue : seulement si tu vis l’enterprise. Les 2 faibles : on reconnaît le **geste**. | Un commercial FR dit « j’ai pas le décideur », « ils ghost », « trop cher », « on réfléchit ». Pas « paper process ». |
| Une phrase à un collègue | « Joue celui du DAF / de l’ops. » « Joue trop cher. » « Joue l’appel qui meurt. » | « Joue le legal stall » ne se passe pas entre collègues à 3 €. |
| Même invariant, deals qui changent | Oui **à l’intérieur** d’un `id`. Entre `id` : 9 fois le même invariant. | 3 trous, beaucoup de costumes. |
| Pas de badge terminé | Oui partout. | — |

Le découpage par étape **n’est pas faux**. Il a **multiplié les costumes**. Difficulté = copies : les échos devraient y aller, pas dans l’inventaire comme familles.

## Test 1 — tient

Call avec l’ops. Qui tranche n’est pas dans l’appel. Semaine 2 possible : le prochain ops n’est pas Julien.

À ne pas rater dans les graines (copies, point 2 — pas encore figé) :

- Le « DAF » est souvent un **gérant** ou un **associé**. Même invariant.
- L’ops qui cache, le process politique, tu arrives tard : déjà dit. Pas de nouvel `id`.
- Ne pas pitcher un ROI (Gong : ROI tôt ↔ close −27 %). Le joueur **construit** le coût de l’inaction. Ça reste vrai.

## Après un oui semaine 2 — ordre de coulée

Pas les 28. Les 12. D’abord ceux que Google et le mail portent déjà :

1. Reste sur le test 1 (cas qui changent).
2. `trop-cher` / `besoin-sans-enjeu` (trou 3, masque puis cause).
3. `appel-meurt` ou `inbound-tarif` (entrée).
4. `pas-de-next-step` / `propale-piege` (le deal pourrit).
5. `statu-quo` **après** avoir serré l’invariant JOLT vs confort.

Échos : pas un run chacun. Catalogue : seulement si les 20 qui reviennent **sont** de l’enterprise.

## Ce que cet audit n’est pas

- Un dégel des 29. L’inventaire liste ce qu’on **a le droit** de couler.
- Un 30ᵉ parcours. Ghosting / JOLT / associé : nommés, pas estampillés.
- Un LMS « d’abord les 12 ». On ne termine toujours rien.
- La difficulté (point 2). Les copies (gérant, ops qui cache) vivent là.

## Sources

- Gong Labs : next step 1er call (−71 %), feature dump (26 % → 5 %), single-thread / multithreading, last thing first, ROI tôt (−27 %). [short sales cycle](https://www.gong.io/blog/short-sales-cycle), [Chris Orlob / 1 M+ calls](https://www.linkedin.com/posts/chrisorlob_during-the-five-years-i-worked-at-gong-i-activity-7244767666995929088-jfqS).
- No-decision 40–60 % vs concurrent. JOLT (Dixon / McKenna, 2,5 M d’appels) : 56 % indécision / 44 % statu quo ; Why Change sur de l’indécision → pire. [jolteffect.com](https://www.jolteffect.com/blog/what-is-the-jolt-effect).
- « Lost on price » ≠ cause. Win-loss : [Clozd / Discera](https://discera.ai/blog/win-loss-analysis-gong-calls).
- FR : associé, trop cher, on réfléchit — [Level Up objections phoning](https://www.levelup-sales.fr/blog/objections-prospection-telephonique-b2b), terrain closer / setting.
- Implémentation > prix comme raison de rester : Buyer Truths 2026 (cité via analyses no-decision).
