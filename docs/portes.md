# Portes — un visage par travail

**Direction. Pas ship. 6 septembre 2026.** Édouard : la vision est bonne. Documenter. Ne rien coder.

Ne casse pas [gestes.md](gestes.md), [landing.md](landing.md), [v0.md](v0.md), [cerveau.md](cerveau.md), [spec-agent.md](spec-agent.md). Un geste de plus = le test §2 de `gestes.md`. Une app Slack = V2, comme la carte HubSpot ([chemin.md](chemin.md)).

Le lien n’était pas dans le texte du chat. On a figé les deux sites qui collent aux notes (un agent nommé pour un travail ; outbound ; prépa de rendez-vous ; Slack / messages ; le connecteur déjà partout). Si ce n’était pas ceux-là : pointer l’URL, on amende cette section. On ne shippe rien en attendant.

## 1. La décision

On nomme les **portes**. On n’invente pas les agents.

Même cerveau. Même URL. Même prix. Plusieurs visages, un par moment de la semaine — déjà dans [gestes.md](gestes.md). Slack se **dit** plus fort. Slack se **construit** plus tard, seulement si le même jugement doit tenir d’un fil à l’autre.

Une ligne : *On nomme les portes. On n’invente pas les agents. On dit Slack plus fort. On ne construit Slack que quand le même cerveau doit tenir d’un fil à l’autre, pas pour ressembler à une équipe de robots.*

## 2. Source — capture du 6 septembre 2026

Deux pages. Les relire avant de rouvrir ce fichier. Ne pas se fier à la mémoire.

### A. Salesforce — Agentforce Sales

C’est le modèle « une équipe de spécialistes + Slack + le fichier client ». Le plus proche des trois exemples d’Édouard (outbound, prépa, Slack) et du mot connecteur.

| | |
| --- | --- |
| Annonce | [Agentforce Sales: The 24/7 Digital Workforce…](https://www.salesforce.com/news/stories/agentforce-sales-announcement/) — 16 mars 2026 |
| Produit Slack | [Agentforce Sales in Slack](https://www.salesforce.com/sales/agentforce-sales-in-slack/) |
| Phrase d’accroche | *every seller works alongside a team of AI agents* / *digital workforce that ends the sales grind* |
| Où ça vit | Sales Cloud, Slack, ChatGPT, Teams. « *Your digital workforce lives where you already work.* » |
| Connecteur | *Powered by Salesforce MCP* — agents + fichier client + contexte entreprise, un seul endroit |

**Agents nommés (un job chacun)** — dispo à l’annonce, sauf prospection (30 mars 2026) :

| Agent | Job qu’ils vendent | Chez nous c’est déjà | On ne prend pas |
| --- | --- | --- | --- |
| Prospecting | Chasse, classe, liste toujours fraîche à partir d’un profil idéal | Geste `prospection` | Écrire / chasser à leur place |
| Engagement | Nurture, booke le rendez-vous. *You just focus on the meeting.* | `inbound` + `prospection` | Booker, envoyer |
| Account Research & Meeting Prep | Brief de compte, activité récente, bloqueurs, next steps, dans Slack | `prepa-call` / `prepa-suivi` / `prepa-demo` / `prepa-exec` | Le brief de quinze questions, l’« instant expert » |
| Pipeline Management | Met les champs à jour, recommande le next step après chaque touch | `pipe-review` | Écrire dans leur fichier client |
| Quoting | Devis conforme, permissions | `prix` / `nego` | Sortir le tarif |
| Partner Success | Copilote partenaires 24/7 | Hors catalogue | Enablement canal |

Slack, aujourd’hui (page produit) : Slackbot met à jour une fiche, résume une *deal room*, prépare un rendez-vous, **dans le fil**. Promis ensuite : remonter les meilleurs prospects, les passer à l’agent Engagement, faire avancer les affaires.

Promesses marketing (à ne pas copier) :

- *Sellers save up to 25 hours per week.*
- *Revenue grows faster than headcount.*
- *30% of sales leaders saw increased revenue* (leur State of Sales).
- Box : 75–80 % du travail commercial dans Slack ; 76 % alignment, 75 % visibilité, 30 % accès au contexte plus vite.
- Salesforce en interne : 130 000 leads contactés, 3 200 opportunités en 4 mois.

Prix (page Slack, capture 6 sept) : add-on **125 $ / siège / mois** (Enterprise / Unlimited) **ou** Edition Agentforce 1 Sales **550 $ / siège / mois** (agents + Data 360 + Slack + Tableau). Aussi un modèle crédits. Per-seat. L’ancre inverse de nous (99 € / org, pas de siège).

Différenciateur qu’ils clament : seuls à unir fichier client + Agentforce + Slack ; sync auto ; permissions Salesforce qui suivent dans Slack.

Citations utiles (le grind, pas le jugement) :

> Almost two-thirds of a seller's week is spent on non-selling tasks, like updating CRM records and prepping for meetings. (Kris Billmaier)

> At Salesforce, we use agents to work all our untouched leads. We used to let these leads fall to the floor like sawdust. (Adam Alfano)

### B. Dust — un agent nommé pour un travail

C’est le modèle « tu nommes l’agent, tu l’appelles dans Slack ». Plus proche de la phrase *agent for one work*. Entreprise française. Pas le concurrent métier (ils écrivent, ils cherchent, ils remplissent). La **forme** : un nom, un job, partout.

| | |
| --- | --- |
| Page Sales | [dust.tt/home/solutions/sales](https://dust.tt/home/solutions/sales) |
| Article | [What is an AI sales agent? (2026)](https://dust.tt/blog/ai-sales-agent) |
| Slack | [How teams use Slack AI agents](https://dust.tt/blog/slack-ai-agents) — `@dust ~NOM` |
| Accroche Sales | *Smart automations, more deals* / *Build custom agents without writing a single line of code* |
| Chiffres page | 90 % plus vite sur les appels d’offres ; 8 h / semaine / commercial |

**Templates nommés** (un travail, un `@`) :

| Nom | Job | Équivalent geste / interdit |
| --- | --- | --- |
| `@salesAccountSummary` | Brief de compte (fichier client, tickets, usage, marché) — prépa et handoff. PayFit, Alan. | `prepa-*`. On juge, on ne rédige pas le brief. |
| `@salesOutboundDraft` / `@FollowUpAgent` | Cold + follow-up depuis transcript + fiche + industrie | Bouche. Interdit. |
| `@ProspectIQ` + `@SignupRadar` + `@CompanySearch` | Recherche, funding, stack, score vs profil idéal | Enrichissement. [acces.md](acces.md) : non. |
| `@securitySam` / `@salesCopilot` | RFP, questions prospect | `rfp` dit souvent : n’y va pas. On ne rédige pas. |
| `@transcriptInsights` / `@salescoach` | Analyse d’appels, coach le pitch | Coach de *rep*. On note le *call*. |
| `@ProspectIQ` etc. en chaîne | « Multi-agent » : recherche → qualif → un chef d’orchestre | Relais entre spécialistes. Chez nous : même jugement. |

Cinq étapes qu’ils vendent (à voler comme **clarté**, pas comme produit) : choisir un template → brancher les outils → le rendre à soi en français simple → **l’utiliser n’importe où** (navigateur, Slack, autres) → améliorer.

PayFit (leur cas, article) : trois agents — knowledge, account summary, call summary (Modjo → cases MEDDICC). Chrome, pas un nouvel outil. 2 h / semaine. C’est Craig + Gong-lite dans un workspace partagé.

Phrase à garder : *They work where you work* / *Use it anywhere*. C’est (a) insister. Leur (b) = Spaces + contexte qui s’accumule dans Dust. Notre (b) = le **même** trou, lundi dans Slack, jeudi avant le rendez-vous — pas un deuxième cerveau.

### C. Ce que les deux sites ont en commun (et que le marché va répéter)

1. Un **nom** par job. Le commercial sait qui appeler.
2. Ça vit dans **Slack** (et Teams, mail). Pas dans un onglet de plus.
3. Relais : l’un chasse, l’autre booke, l’autre briefe, l’autre met la fiche à jour.
4. Promesse : moins de grind, plus de signatures, des heures rendues.
5. Ils sont **la bouche** et **le stylo** du fichier client.

Gumloop ([meeting-prep-agent](https://www.gumloop.com/use-cases/meeting-prep-agent)) dit la même chose en plus brut : `@Briefbot` dans `#sales-prep`, brief 30 min avant, watcher calendrier → agent contexte → agent brief. Relais. Livrable. On n’en fait pas une troisième source.

## 3. Produit — ce qu’on prend

Les 21 gestes **sont** déjà les agents-pour-un-travail. On ne crée pas huit serveurs, huit prix, huit cerveaux.

On nomme trois portes d’abord (les plus lues) :

| Porte (nom de travail) | Geste | Le directeur refuse |
| --- | --- | --- |
| Avant d’écrire | `prospection` | Écrire sans raison |
| Avant le rendez-vous | `prepa-call` (puis suivi / démo / exec) | Le plan à quinze questions |
| Le lundi sur la liste | `pipe-review` | La date de close comme un fait |

Le piège s’appelle « agent outbound ». Le marché entend : il écrit la séquence. Chez nous le geste dit souvent **n’écris pas**. Si le nom promet un rédacteur, on a perdu.

**Slack — deux couches, pas la même date.**

1. **Insister (copy, plus tard).** Celui qui a déjà le connecteur peut nous appeler dans Slack, Teams, Claude, Cursor. La page dit : il vit au-dessus du fichier client. Elle montre Cursor. Elle ne dit pas Slack. Le commercial qui n’ouvre jamais Cursor vit dans Slack. Phrase à garder : *même adresse, même verdict, dans le fil où vous parlez déjà de l’affaire.* Pas un quatrième logo ([landing.md](landing.md) : pas de soupe).
2. **Liaison vraie (plus tard, après une vraie `pipe_review`).** Coller l’URL une deuxième fois n’est pas une liaison. Une liaison : on le mentionne dans le fil de l’affaire, il lit le même dossier, il répète le trou de lundi quand on prépare le jeudi. Ce n’est pas le robot qui met HubSpot à jour et envoie le « just checking in ».

Pas d’application Slack cette semaine. Deuxième produit, comme la carte ([chemin.md](chemin.md)).

## 4. Marketing — ce qu’on prend

Eux : une équipe de spécialistes qui font le sale boulot. Nous : **une seule personne qui refuse**. Si on aligne les noms « outbound, prépa, pipe » comme une roster, on a l’air d’eux, en moins riche.

On prend :

- **La semaine, pas la fiche technique.** « Avant le rendez-vous » se comprend. « Embauche un directeur commercial » moins. Les quatre phrases sous *Start.* ([landing.md](landing.md)) = portes nommées, pas des fonctions. Même homme. Un prix.
- **Où il vit, dit au commercial.** Cursor reste le premier visage. Slack = la phrase pour l’équipe. Pas un logo.
- **La continuité comme écart.** Eux : les agents se passent le relais. Nous : ce n’est pas un relais, c’est le même jugement. *Lundi il a dit que l’étape mentait. Jeudi il ne te laisse pas faire la démo.* Intention, pas promesse de mémoire ([plg.md](plg.md)).

On ne prend pas :

- « On te booke. » « On met la fiche à jour. » « On écrit le mail. »
- Les heures rendues, le *25 hours*, le *more deals*.
- La requête « meilleur agent d’outbound » — elle veut une bouche. « Préparer un rendez-vous » et « la liste ment » : oui, la réponse reste le VP.

Ancre prix utile : eux vendent **125 $ / siège** (Salesforce) pour écrire et synchroniser. Nous : 99 € / organisation pour dire que l’étape ment. Ne pas ouvrir une guerre de sièges. L’écart se dit : pas de siège, pas d’enregistrement, pas de stylo dans leur fichier.

## 5. Quand on rouvre

Pas avant :

1. Une vraie `pipe_review` sur un vrai HubSpot ([plg.md](plg.md), [roadmap.md](roadmap.md)).
2. Une phrase Slack à ajouter sous *Where he lives.* — copy seulement, pas une app.
3. La mémoire de jugement (hash, zéro contenu) — alors (b) devient un produit, pas une intention.

Rouvrir ce fichier = une de ces trois, ou une URL source différente à coller en §2.

## 6. Interdit

- Huit MCP, huit SKU, « Agentforce 3xrep ».
- Un agent qui écrit le mail, booke, ou `write_to_crm`.
- Slack comme logo dans le row Cursor · Claude Code · Codex.
- Promettre la mémoire ou un pourcentage de signatures.
- Copier leur roster pour « être complet ».
