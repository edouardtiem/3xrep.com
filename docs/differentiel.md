# Différenciateur MCP — proposition

**Pas figé.** 2 septembre 2026. Réponse à : un skill MEDDIC + 5 pourquoi, demain tout le monde le copie. Qu’est-ce qui n’est pas un skill ?

Gagne sur rien tant qu’Édouard n’a pas dit oui. Ne casse pas [prd.md](prd.md) / [sortie.md](sortie.md) / [icp.md](icp.md).

## Le piège

Le PRD le dit déjà : moat 1/2, *le protocole MCP se copie demain*.

Méthodes + rattachement + 5 pourquoi + « on est dur » = un `SKILL.md` bien écrit. En 2026 ça existe :

| Ils | Ce qu’ils vendent | Pourquoi on a l’air d’eux |
| --- | --- | --- |
| Skills Claude / Cursor / GPTs | MEDDIC, SPIN, Challenger en markdown | Encyclopédie. ChatGPT gagne. |
| [Prospeda gtm-skills](https://github.com/Prospeda/gtm-skills) | Méthodes + MCP qui *draft* mails et scripts | Bouche + cours. |
| [Summit53](https://www.summit53.com/) | Skills + MCP : scores MEDDPIC, decks coaching, QBR | Checklist + PowerPoint. |
| [Salesmotion](https://github.com/salesmotion/claude-skills) | *Evidence over assertion*, MEDDIC, account intel | Intel externe, pas le dossier. |

Si `audit_deal` recrache des lettres vides et des questions utiles, on est Summit53 à 99 €. Un skill suffit.

Les 5 pourquoi dans [icp.md](icp.md) sont un **prompt**. Le LLM les saute dès qu’il veut être gentil.

## Ce qui n’est pas le différenciateur

- Plus de méthodes. [methodes.md](methodes.md) est le lexique, pas le produit.
- Mieux écrire le spec d’agent.
- La posture « VP qui refuse l’optimisme » **si** elle vit dans le LLM. Il se ramollit.
- Un score /100, une proba de close, « dans ton industrie on voit souvent ».
- Des `SKILL.md` méthode téléchargeables. Ça *est* le concurrent. Le modèle jeu ([_modele.md](_modele.md) « Skill agent ») ne part pas en MCP.
- Stocker les transcripts pour un moat data. Interdit : [landing.md](landing.md), [contournement.md](contournement.md).

## Le différenciateur

**Un compilateur de trous. Pas une bibliothèque de méthodes.**

Le skill *enseigne* MEDDIC. Le MCP *juge un dossier*. Les grilles sont des **alias** du jugement, pas la source.

Ça, un markdown ne peut pas le faire : le LLM peut l’ignorer. Un tool qui renvoie un JSON, le spec d’agent **doit** s’en servir. C’est le `ai-assembly-scripted-core` du PRD, poussé jusqu’au bout — pas seulement « lookup + score ».

### Kernel — ~12 atomes, pas 40 sigles

L’atome est le trou. La méthode est l’étiquette, dans la langue de l’équipe.

| Atome | Alias (collision voulue) |
| --- | --- |
| Qui tranche | MEDDIC EB · BANT Authority · BEBEDC Décideurs |
| Champion vs coach | MEDDIC Champion |
| Enjeu chiffré vs douleur racontée | Metrics · BEBEDC Enjeu · coût de l’inaction |
| Process réel vs « on signe en décembre » | Decision process · Paper · Timeline |
| Alternative réelle (concurrent, interne, rien) | Competition · MEDDPICC · BEBEDC Concurrents |
| Levier de **cette** personne | SONCAS(E) — pas le persona |
| Critère d’achat dit par eux | Decision criteria |
| Accès à la pièce qui compte | Contreparties · convier |
| Accord qui tient | Points brûlés |
| Concession sans retour | Contreparties |
| Claim vs fait | 5 pourquoi — sur **l’AE**, pas un script prospect |

V0 n’écrit pas les 12 fichiers. V0 **tourne** les atomes du test 1 (qui tranche, champion/coach, chiffré, process, alternative, levier, claim vs fait). Le reste s’ajoute quand une mini-situation / un audit en a besoin. Même règle que le lexique ouvert.

### Runtime — ce que le tool fait vraiment

Pas « lis MEDDIC puis rédige ». Sept crans, **dans le serveur**, à chaque `audit_deal` :

1. **Claims de l’AE.** Ce qu’*il* croit : Julien est champion, ça close en décembre, le besoin est réel. Pas les claims du prospect.
2. **Cross-exam.** 5 pourquoi sur *cette* histoire. « Pourquoi tu crois qu’il amène le DAF ? Qu’est-ce qu’un coach aurait dit pareil ? »
3. **Exhibit.** Verbatim / note / rien. Grades A/B/C déjà dans [contournement.md](contournement.md). Pas d’exhibit = trou. Jamais inventer Y.
4. **Atomes.** Map vers le kernel. Plusieurs alias sur le même trou. Voulu.
5. **Mort du deal.** Pas « EB vide ». Comment ça meurt, à quel étage, avec quelle phrase **déjà dite**. Forecast de mort, pas de close. Interdit : « tu closes vendredi ».
6. **Un geste qui falsifie.** La question ou l’action qui, cette semaine, tuerait le deal s’il est faux. Popper, pas next-best-action. Un, pas huit.
7. **Strip.** Tout bloc qui demandait une réplique absente disparaît. Déterministe. [sortie.md](sortie.md) s’assemble **depuis** ça. Pas un dump d’atomes.

Les 3 tools v1 restent (`audit_deal`, `next_question`, `objection_map`). Le contrat d’entrée/sortie de `audit_deal` s’enrichit : `claims` + `evidence` → atomes `{ id, statut: su|suppose|trou, alias[], exhibit|vide, mort, geste }`. `next_question` = le geste du cran 6. `objection_map` = l’objection **est** l’atome non tenu (facture, comme A+B dans le terrain).

### Pourquoi un skill casse ici

| | Skill / GPT | Compilateur 3xrep |
| --- | --- | --- |
| Source | Texte de méthode | Kernel d’atomes |
| Optimisme | Le modèle dit oui | Le JSON dit `trou` |
| Preuve | « Essaie de citer » | Pas de Y → pas de bloc 2 |
| Grilles | Une « bonne » | Collision |
| Next move | Liste utile | Un geste qui falsifie |
| Version | Snapshot markdown | Runtime live |
| Mémoire | La fenêtre de chat | Voir plus bas |

## Mémoire de jugement — pas maintenant

Un VP se souvient : « t’avais dit le DAF en R2 ». Un skill, non, dès que le thread meurt.

On **peut** plus tard stocker sans casser « we don’t store » : `org`, hash du deal, atome, `su|suppose|trou`, date. **Zéro contenu.** Pas de transcript, pas de prompt, pas de réplique.

Ça ferait : « EB toujours vide depuis le 12. Le geste n’a pas eu lieu. »

Pas V0. Le compilateur doit d’abord être vrai **sur un call**. Si on stocke du contenu pour « aller plus loin », on est un Gong. Si on stocke le jugement trop tôt, on a une base vide et une ligne landing à réécrire.

## Test du différenciateur

Même deal Julien, même CRM, deux agents.

1. Claude + skill MEDDIC (ou Summit53, ou un GPT).
2. Claude + MCP 3xrep.

Écart lisible en 30 secondes, forme [sortie.md](sortie.md) : 7/10 du *call*, réplique collée, 3 verrous, plan 1.2.3, objectif = DAF en R2.

Si (2) est une checklist plus propre que (1) : on a fait un skill. On arrête d’écrire des méthodes, on durcit le runtime.

Si (2) sans verbatim invente Y : on a cassé [contournement.md](contournement.md). Le compilateur a perdu.

## V0 — ce qu’on code pour que ça se voie

Pas 40 fichiers. Pas de mémoire. Pas de skill store.

1. Kernel des 7 atomes du test 1, en données (pas en prose).
2. `audit_deal` exécute les 7 crans, strip inclus.
3. Spec d’agent : tu n’inventes pas le close ; tu appelles le tool ; tu **colles** la sortie. Posture [icp.md](icp.md) = contrainte du JSON, plus un ton.
4. Page : le mockup Julien **est** déjà cet écart. S’il a l’air d’un audit MEDDIC, la LP ment.

## Décision demandée

Un go / no-go, pas un débat de méthodes.

- **Go** : le produit MCP = compilateur d’atomes. Les méthodes restent le lexique / pSEO / alias. On ne shippe pas de skill méthode.
- **No-go** : on reste playbooks + rattachement (PRD actuel). On assume moat 1/2.

Pas les deux. Un skill *et* un compilateur, c’est Prospeda demain matin.
