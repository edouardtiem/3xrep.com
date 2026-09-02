# Benchmark — packs markdown gratuits

**Pas figé.** 2 septembre 2026. Demande d’Édouard : coller 3xrep aux packs cités, ceux qui sont **gratuits**. Pas leur pitch. Ce qu’ils *font* sur un call.

Ouverts et lus (clone local, 2 sept) :

| Pack | Ce que c’est vraiment | Licence |
| --- | --- | --- |
| [TheCraigHewitt/sales-skills](https://github.com/thecraighewitt/sales-skills) | 21 `SKILL.md`. Le plus proche. MIT. Repo déplacé vers `TheCraigHewitt/skills`. | Gratuit |
| [Salesably/salesably-marketplace](https://github.com/Salesably/salesably-marketplace) | Plugin Claude Code. 9 skills sales + 10 marketing. Grille maison POWERFUL. | Gratuit |
| [Prospeda/gtm-skills](https://github.com/Prospeda/gtm-skills) | « 2 500+ prompts ». Un `SKILL.md` routeur + des fichiers `Qualify this deal using MEDDPICC` à coller. MCP = recherche / outreach, pas un jugement. | Gratuit |
| [Composio « top 10 »](https://composio.dev/content/best-sales-and-gtm-skils) | Un **annuaire**, pas un pack. #1 = leur MCP 1000 apps. #2 = un autre router `/sales-do`. Les items 7–8 (meeting notes, transcript) sont des skills Codex étroits. | Mixte (MCP Composio ≠ markdown) |
| [Gist YouTube 16](https://gist.github.com/meirworkspace99-eng/48360f1528c74691f23f686caee40c0b) — RevGenAI / Meir | Template « AI Sales Coach ». 5 critères binaires, UN fix, **roleplay**. Lead magnet d’une vidéo. | Gratuit |

Référent 3xrep : [cerveau.md](cerveau.md), [sortie.md](sortie.md). Le test : le call Julien.

## 1. Sur les axes qui comptent

| | Craig | Salesably | Prospeda | Composio liste | Gist YT | 3xrep |
| --- | --- | --- | --- | --- | --- | --- |
| Forme | Prompt long, le LLM joue le VP | Prompt + grille POWERFUL | Prompt à trous | Skills + MCP apps | Prompt + score 0–5 | JSON déterministe |
| Le modèle peut ramollir | Oui | Oui | Oui | Oui | Oui | Non (étage 8) |
| Citation absente | Le template *demande* un quote. Le modèle en invente | Pareil | Pareil | — | « Direct quote required » — pas d’enforcer | Rejet serveur |
| Case verte sans preuve | Score 1–5 quand même | Rating 0–100 % | Red/Yellow/Green | — | Yes/no, encore un score | `vide` / `supposé` |
| Collision de grilles | Non. Discovery = SPIN. Qualif = **PACT** (« forget BANT ») | Une grille (POWERFUL) | Une à la fois (MEDDPICC *ou* SPIN) | — | CARE / two-call close | Voulu (EB = Authority = Décideurs) |
| Remonter (fenêtre, réflexe, 3 crans, gain, coût) | Signale un missed follow-up. Pas l’échelle ni le coût du retard | « Strategic suggestions » | « Next steps to improve » | Recap | ONE fix (le *rep*, pas le trou) | Étage 6, geste `passe-trous` |
| Objection = case non tenue | ACRC + playbook de punchlines | Extraite, pas rattachée | Prompt MEDDPICC | — | Pas le sujet | `objection_map` |
| Note le *call*, pas la personne | Score /30, talk-ratio, coaching RH | 0–100 % deal | Deal score | — | 5 critères sur **toi** | 7/10 du call. Interdit RH |
| Bouche (mail, séquence, cold) | **Oui** — c’est le README | Follow-up + cold call | 400+ SDR | Oui | Roleplay | Non. Spec : dossier, pas bouche |
| Enregistre / roleplay | Demande d’enregistrer | Transcript | — | — | Drill vocal | Interdit |
| Versionné côté serveur | Snapshot git chez l’user | Plugin | Snapshot | — | Gist | Runtime live |
| Prix | 0 € | 0 € | 0 € | Freemium MCP | 0 € | 99 € / org |

## 2. Pack par pack

### Craig — le seul vrai concurrent

`call-debrief` fait ~400 lignes. C’est un bon manager. Principes justes : faits avant le feeling, next step calendré ou DQ, red flags qui ne vieillissent pas.

Là où ça *ressemble* à nous : « I'm not the decision-maker but I can influence » est un red flag. « We need to discuss internally » sans date. Talk-ratio. Coach le missed follow-up sur une réplique.

Là où ça **n’est pas** le cerveau :

- Ça **remplit un template**. 10 sections, score /30, mail de follow-up, reco CRM (stage, close date, amount). C’est Gong-lite + enablement, dans un markdown.
- Discovery impose **PACT** et dit *forget BANT*. Une grille gagne. Chez nous c’est interdit.
- L’objection a un framework **ACRC** (proche CRAC) puis un **playbook de répliques** (« Compared to what ? »). Chez nous l’objection *est* la pièce vide, pas une punchline.
- Négociation : « trade never give » — on a ça (contreparties). Chez eux c’est un script de closer. Chez nous c’est un trou nommé.
- Le missed moment s’arrête à « tu n’as pas creusé ». Pas : perche → réflexe (`usage-nest-pas-budget`) → 3 crans avec ce que chacun *donne* → ce que tu pouvais *faire* dans la minute → coût du retard.
- Rien n’empêche Claude d’inventer le 14:32 et le $400K.

**Ce qu’ils gagnent, honnêtement.** Ils shippent aujourd’hui. Ils couvrent cold email, séquence, demo, win-loss, *comp plan* — tout le métier *sauf* le jugement dur. Un founder qui veut un agent qui *écrit* prend Craig. Un founder qui veut un VP qui *refuse* ne peut pas.

### Salesably — une grille maison + extract

`call-analysis` sort : next steps, les 8 lettres POWERFUL avec quotes, un **0–100 %**, 3–5 suggestions. `account-qualification` = tiering ICP (prospection, pas le dossier). `powerful-framework` = les questions de la grille.

C’est un extracteur. Pain / budget / exec influence, extraits du transcript, puis un pourcentage. Le pourcentage est exactement ce que [prd.md](prd.md) interdit (`probability_to_win`). Pas de fausse preuve cataloguée. Pas de collision. Pas de remontée.

### Prospeda — l’encyclopédie

Le fichier MEDDPICC tient en une page :

> *Qualify this deal using MEDDPICC. Pour chaque élément : status, gap, risk R/Y/G, next steps. End with overall deal score.*

C’est le produit que ChatGPT gagne. 2 500 prompts, 24 tonalités, packs industrie. Le MCP maison fait de la recherche et de l’outreach. **Le jugement n’est pas un système.** C’est un texte que tu colles.

Champion testing : « generate questions to test if my champion is real ». Chez nous le test est dans la pièce, exécutable, et un coach dit la même phrase qu’un champion — donc la phrase ne prouve rien. Eux, ils génèrent encore des questions.

### Composio — hors sujet, utile à classer

Ce n’est pas un concurrent métier. C’est un **pont d’apps** (HubSpot, Gmail, Slack) + une liste d’autres skills. Ça confirme [acces.md](acces.md) : le marché vend la connexion. On n’a pas à la vendre. Item 8 (`meeting-insights-analyzer`) = thèmes / objections / owners manquants dans un transcript. Recap. Pas un cerveau.

### Gist YouTube — le score du commercial

Cinq yes/no : Business Pain, Emotional Stake, Direct Ask, Dialogue (talk-ratio), Word Usage. Puis **THE ONE FIX** — sur *toi*. Puis un drill où l’IA *joue le prospect*.

C’est Hyperbound dans un gist. [terrain/recherche.md](terrain/recherche.md) l’a écarté : on entraîne la bouche, pas le dossier. Le 7/10 de [sortie.md](sortie.md) note le *call*. Eux notent le *rep*. Interdit chez nous.

## 3. Le même call Julien

Phrase du transcript : « de toute façon c’est moi qui fais tourner l’outil au quotidien. » L’AE enchaîne sur le rollout.

| | Ce qu’ils rendent | Ce qu’on rend |
| --- | --- | --- |
| Craig | Authority /5. Red flag « not the DM ». Coaching : tu n’as pas demandé qui signe. Mail de recap. Reco : bouger le stage ? | `qui-tranche` = **vide**. Fausse preuve cataloguée (usage ≠ budget). Fenêtre = la phrase. Réflexe = séparer qui s’en sert / qui paie, phrase d’après. Échelle 3 crans (nom → process réel → critère du DAF). Gain = le convier *séance tenante*. Coût du retard = l’invitation se négocie. Objectif : DAF en R2. **Pas de mail. Pas de /30.** |
| Salesably | POWERFUL.E = « ops claims he runs the tool ». Rating ~55 %. Suggestion : engage finance. | Idem cerveau. Le 55 % n’existe pas. |
| Prospeda | E = Yellow. « Gap: identify EB. Next: ask who signs. » | Idem, plus la remontée. Pas de Yellow. |
| Gist | Criterion 1 maybe yes (pain). 3 maybe no (no ask). ONE FIX: « ask for the next meeting ». Score 3/5 sur **Julien-le-rep**. | Le 7/10 est le call. Le trou n’est pas « pas d’ask ». C’est Décideurs, et on dit *où* ça se prenait. |

Si les quatre sorties tiennent dans un même paragraphe « il manque le DAF, pose la question », on a perdu. La nôtre doit être illisible comme un skill : trop précise, trop méchante, trop rattachée.

## 4. Ce qu’on ne cherche pas à battre

Ils gagnent, et c’est voulu, sur :

- le cold, la séquence, le demo script, le win-loss deck, le plan de comp ;
- le « envoie le recap dans les 2 h » ;
- le zéro euro, `npx skills add`, aujourd’hui.

Les prendre sur ce terrain = devenir Craig. [prd.md](prd.md) l’interdit (bouche, LMS, scoreboard). Le benchmark utile est **la zone de recouvrement** : débrief, qualif, objection, négo. Là, le markdown le plus fort (Craig) s’arrête à un template + un score. Le nôtre doit s’arrêter à un verdict + une remontée.

## 5. Ce que ça change pour nous

Rien à figer. Trois lectures :

1. **Craig est la capture d’écran concurrente**, pas Prospeda. Le test [differentiel.md](differentiel.md) « Claude + skill MEDDIC vs Claude + 3xrep » : remplacer MEDDIC par **Craig `call-debrief`**. C’est plus dur, donc plus honnête.
2. La profondeur qui manque chez eux, et qui est déjà dans [cerveau.md](cerveau.md) : **fausse preuve + perches + échelle**. Si on shippe des pièces sans ça, on a écrit un Craig plus court.
3. Ne pas ajouter cold-email / recap mail « pour être complet ». C’est exactement leur README. On aurait l’air d’eux, en payant 99 €.

## 6. Sources

Clones du 2 sept : `/tmp/skills-bench/{craig,salesably,prospeda}`. Fichiers lus en entier ou quasi : Craig `call-debrief`, `discovery-call`, `objection-handling`, `pipeline-review`, `negotiation` ; Salesably `call-analysis`, `powerful-framework`, `account-qualification` ; Prospeda `methodology/meddpicc.md`, README ; gist RevGenAI. Composio : article du 8 juin 2026, pas un repo à nous.
