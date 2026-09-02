# Accès — et si on n’était qu’un repo de skills ?

**Pas figé.** 2 septembre 2026. Réflexion d’Édouard : pour *bypass* la comparaison à un repo de skills sales, quels outils / données / accès ? Enrichissement ? Autre ? Rester simple, **pas d’interface**.

Ne casse pas [cerveau.md](cerveau.md) (figé) ni [prd.md](prd.md) (pas de CRM à nous, pas de Gong, unlimited parce que scripté, 99 €).

## 1. La crainte est juste

En 2026, « agent commercial » = deux piles, déjà saturées.

**Pile skills** (markdown, `npx skills add`) : [TheCraigHewitt/sales-skills](https://github.com/thecraighewitt/sales-skills) (21 skills), [Salesably](https://github.com/Salesably/salesably-marketplace), [Prospeda](https://github.com/Prospeda/gtm-skills), Composio « top 10 GTM », Intempt *deal-gauge*, `sales-deal-inspect` MEDDPICC. Tous rendent une checklist + next steps. Un gist YouTube « AI Sales Coach » fait déjà prep / score / drill.

**Pile MCP data** — cinq jobs, tous pris ([Salesmotion, août 2026](https://salesmotion.io/blog/best-mcp-servers-for-sales)) :

| Job | Qui |
| --- | --- |
| La fiche | HubSpot, Salesforce, Attio, Dynamics |
| Trouver la personne | Apollo, ZoomInfo, FullEnrich |
| Construire une liste | Clay |
| Savoir ce qui a bougé | Salesmotion |
| Le chemin chaud | relationship intel |

Plus, en FR : **Pappers a déjà son MCP officiel** (`mcp.pappers.fr`) — dirigeants, comptes, SIREN. Fireflies / Gong / Glyphic pour la bande.

Le verdict du marché, répété partout (Subagent/GTM, Salesmotion, HN) : *un skill porte la procédure, un MCP porte la connexion*. Un MCP qui n’expose qu’un prompt = « a Skill wearing the wrong hat ». C’est exactement l’accusation.

Le cerveau ([cerveau.md](cerveau.md)) est déjà la réponse **métier**. La question ici : faut-il, en plus, *donner accès* à des outils pour que ça ne *ressemble* pas à un repo ?

## 2. L’enrichissement est le mauvais bypass

Donner Apollo / Clay / Hunter / un scrape LinkedIn, c’est :

- **Le pack que tous les repos de skills bolt-on déjà** (Salesably : Perplexity, Exa, Hunter, Apify). On rentre dans la photo.
- **Le job d’un autre MCP**, souvent gratuit à connecter (Apollo le dit). On est moins bon, on a le support.
- **Le kill du 99 € unlimited.** Un agent en boucle brûle des crédits. FullEnrich le sait : il fait confirmer avant de dépenser. On n’a pas ce modèle, et on ne le veut pas.
- **Le contraire de l’angle.** L’enrichissement traite une fiche Apollo comme une vérité. Le cerveau traite un dire comme un claim. Un « CFO = Marie » sorti d’une base n’est **pas** un Economic Buyer tenu.

Salesmotion, phrase utile : *ne connecte pas huit serveurs*. Au-delà, le modèle se trompe d’outil. 3xrep doit rester **le troisième** : leur CRM + (option) capture ou registre + **nous**. Pas un hub de vingt tools.

## 3. Ce qui n’est pas un repo — et que les skills ne peuvent pas versionner

Un skill donne **plus de verbes** (draft, enrich, sequence, research). C’est pour ça qu’ils ont l’air d’une usine. Le bypass n’est pas d’en ajouter. C’est d’être le seul MCP dont le job est de **dire non**, et de dire **quoi aller chercher chez les autres** pour que le non tienne.

Trois accès, toujours sans UI, toujours dans le verdict JSON. Pas de quatrième produit.

### A. Les recettes de fetch — *leurs* outils, *notre* jugement

Quand une pièce est vide, le verdict ne s’arrête pas à « Décideurs vide ». Il dit **quoi ouvrir, dans quel MCP qu’ils ont déjà**, et comment grader ce qui revient.

```yaml
trou: qui-tranche
fetch:
  - mcp: hubspot          # le leur
    quoi: contacts du deal dont le titre ressemble DAF / CFO / VP Finance
    si_trouve: candidate   # pas tenu
  - mcp: pappers          # le leur, si FR
    quoi: représentants légaux du SIREN du compte
    si_trouve: candidate
  - mcp: crm-emails
    quoi: fils où apparaît "budget" | "signer" | "DAF"
    si_trouve: exhibit, à vérifier au call
```

Ça, un markdown ne le versionne pas : la pièce porte les perches **et** les fetch. Le runtime les rend. On ne paie pas Apollo. On ne wrappe pas Pappers (il existe). On **orchestre**.

Grade nouveau, utile ici : **D — externe, pas confirmé**. Pappers « président = Marie X » n’est pas un `tenu`. C’est un candidat à faire parler. L’enrichissement s’arrête à Marie. Nous, on dit : maintenant, la question du cran 1.

C’est le contraire d’un data product. C’est le cerveau qui se sert de la matière que le marché a déjà posée sur leur agent.

### B. Les calculettes — pas de donnée tierce

Scripté, unlimited-safe, zéro API payante.

| Tool / cran | Entrée | Sortie |
| --- | --- | --- |
| Coût de l’inaction | *leurs* chiffres (jours × coût chargé) | un montant, ou « pas un chiffre, une histoire » |
| Stage illégal | étape CRM + pièces vides | « négo + EB vide = l’étape ment » |
| Concession sans retour | une remise, un délai, un scope | le trou Contreparties, nommé |

Ce n’est pas de l’enrichissement. C’est le niveau 1 de la bibliothèque, exécutable. Les 3 tools du PRD suffisent si ça rentre dans `audit_deal` / `next_question`. Pas la peine d’en exposer vingt.

### C. La packing list — distribution, pas produit

Dans le spec d’agent et sous le fold de la page, **deux ou trois compagnons**, pas une marketplace :

1. Leur CRM (obligatoire pour le rituel 99 €).
2. Un notetaker → CRM, s’ils n’ont pas Gong (Fireflies, tl;dv, recap Meet) — [contournement.md](contournement.md) grade A.
3. Pappers, si le compte est FR — pour le fetch de `qui-tranche`, en grade D.

On ne les installe pas. On ne les facture pas. On dit : branchez ceux-là, *puis* 3xrep. Salesmotion a raison : deux ou trois, pas huit.

## 4. Ce qu’on ne wrappe pas, même « pour avoir l’air d’un vrai MCP »

| Tentation | Pourquoi ça nous fait un repo (ou un Gong, ou Clay) |
| --- | --- |
| Apollo / ZoomInfo / FullEnrich / Hunter | Job 2, déjà pris. Crédits. Fausse preuve. |
| Clay | Job 3. Il faut un ops. On n’en a pas. |
| Fireflies / Gong en propre | On enregistre. Interdit. |
| Sequences / mail send | Bouche. Interdit. |
| Benchmarks industrie (« en HVAC… ») | Cours. Interdit. |
| Un MCP Pappers *à nous* | Pappers existe. On composerait mal. |
| Vingt tools « pour faire riche » | L’assistant se trompe d’outil. HN + Salesmotion. |

## 5. Test

Deux captures, même deal Julien.

1. Claude + `npx skills add sales-skills` + Apollo MCP.
2. Claude + HubSpot MCP + 3xrep.

Si (2) enrichit une fiche ou draft un mail : on a perdu, on est (1) avec un autre logo.

Si (2) dit : *Décideurs vide. La fenêtre c’était telle phrase. Chez toi, HubSpot a un contact « Marie, DAF » jamais engagé ; Pappers pose le président. Ni l’un ni l’autre n’est une preuve. Question cran 1, cette semaine.* — on n’est pas un repo. On n’a construit ni UI ni enrichissement.

## 6. Décision proposée (pas prise)

1. **Pas d’enrichissement 3xrep.** Ni proxy, ni crédits, ni base.
2. **Oui aux recettes de fetch** dans le verdict (leurs MCP, grade D). Ça rentre dans [cerveau.md](cerveau.md) étage 6/7 — une case de plus sur la pièce, à remplir **avec** les 7 pièces Julien, pas un chantier à part.
3. **Oui aux calculettes**, dedans les 3 tools, pas en plus.
4. **Oui à une packing list** de 2–3 compagnons, sur la page / le spec. Pas un marketplace.

Si 2 + 3 + 4 ne suffisent pas à tuer la comparaison, le problème n’est pas « pas assez d’outils ». C’est que le runtime n’est pas assez dur. On durcit [cerveau.md](cerveau.md), on n’ajoute pas Apollo.
