# Roadmap — 3xrep

**Live.** 6 septembre 2026. Édouard : docs MCP en détail + captures réelles (Cursor, Claude Code) + site dans toutes les langues + **$129 / mois / organisation**, US first.

Gagne sur [terrain/roadmap.md](terrain/roadmap.md) (archive jeu, 30–31 août). Le PRD tenait l’ordre *MCP → listing → page → pSEO*. Ici : ce qu’on ouvre **maintenant**. Ne pas implémenter le reste.

Live aujourd’hui : **$129 / org / mois** (USD, Stripe), `/docs` en anglais, tools ouverts. Item 3 (prix) **shippé** le 11 sept 2026. Items 1–2 encore ouverts.

## Ouvert — dans cet ordre

### 1. Docs MCP — le détail, pas la liste

`/docs` aujourd’hui : où ça vit, l’URL, six tools, quatre prompts. Ça ne montre pas **comment** ça tourne.

Rentrer dans le détail :

- L’agent (Claude Code, Cursor, Codex, Claude, ChatGPT, Notion) a **deux** connectors : le CRM (HubSpot / Salesforce / Notion) et 3xrep. 3xrep ne lit pas le CRM. Il reçoit les artefacts et rend un JSON. Leur LLM habille.
- Une URL : `https://3xrep.com/api/mcp`. Rien dans HubSpot. Pas d’onglet. Pas de store chez nous.
- Chaque tool : quand l’appeler, quoi lui passer, ce qu’il refuse. `pipe_review` vs `audit_deal` — le pipe, pas le call.
- Config réelle : Cursor (`mcp.json` / Settings → MCP) et Claude Code (`.mcp.json` / `claude mcp add`). JSON à coller, déjà sur `/install`. Pas un schéma d’archi.

**Captures — requêtes réelles, pas le mockup.** La fenêtre Session de la home n’est pas une preuve. On photographie une vraie session :

| Surface | Ce qu’on voit |
| --- | --- |
| Cursor | Connector 3xrep vert, à côté du CRM. Puis une requête vraie → tool call visible → verdict collé. |
| Claude Code | Pareil. Titlebar *claude code · MCP 3xrep*. |

Requêtes à tourner (déjà sur la page) :

1. *Monday. Review my pipe. What’s blocked?* → `pipe_review`
2. *Debrief my last client call.* → `audit_deal`
3. *Which close date this month is a claim, not a fact?*
4. *They said it’s too expensive. Which piece isn’t held?* → `objection_map`

Un deal sans call : le refus à l’écran (*I won’t fill the gap*). Sans ça, on a l’air d’un skill MEDDIC.

Pas de captures inventées. Pas de GIF du `SessionTerminal`. Si on n’a pas encore tourné sur un vrai HubSpot, on attend — [plg.md](plg.md) : la première vraie `pipe_review` est le test.

### 2. Toutes les langues

Le **cerveau** écrit déjà dans la langue de l’user, sinon celle du prompt. Jamais le français par défaut ([copy.ts](../src/lib/copy.ts), contrat `langue: user, else prompt`).

Le **site** est anglais seulement (`/`, `/docs`, `/install`, `/spec`). US first : l’anglais reste la locale par défaut. « VP Sales » ne se traduit pas ([landing.md](landing.md)).

À faire : `/docs` et `/install` (puis home / spec) dans toutes les langues qu’on ship. Même geste, même ordre, même interdits. Pas un dump FR des notes internes. Pas une locale fantôme à 40 %.

Détection : `Accept-Language` + préfixe (`/fr/docs`, `/de/docs`…). EN sans préfixe. Le connector et le JSON MCP ne changent pas.

### 3. Prix — $129 / mois / organisation

US first. L’ancre 99 € était Modjo (siège FR). On vise les US : **$129 / month / organization**. Toujours une org, jamais un siège.

**Shippé** 11 sept 2026 (Édouard : remplacer tous les 99 € du site par 129 $). Hero, `/install`, Stripe USD, [checkout.md](checkout.md). Copy : `$129/month. For the entire organization.` Ancre Gong (~$1,500 / seat). Palier sept (1 org payante) tient. Le montant a changé, pas le kill.

199 € = territoire démo ([prd.md](prd.md) §12). $129 reste self-serve. Per-seat interdit. On ne monte pas pour soigner l’affiliation.

## Toi — pas l’agent

Tâches humaines. L’agent ne peut pas les faire. Sans elles, `npm run visibility-google` sort `pas branché`. La [boucle visibilité](visibility/seo-geo.md) continue (bus + pages) et n’invente pas les chiffres.

### 4. Brancher Google + automation Cursor (visibilité)

La boucle **va** sur Search Console et Analytics via `npm run visibility-google`. Toi tu poses les clés :

1. **Search Console** — propriété `https://3xrep.com`. Ajouter l’email du compte de service (lecture).
2. **Analytics** — même email, Viewer. Id numérique de la propriété (`GA4_PROPERTY_ID`). Le tag `G-YWQX4MDHZP` ne suffit pas.
3. Secrets Cursor Cloud : `GOOGLE_SERVICE_ACCOUNT_JSON`, `GSC_SITE_URL`, `GA4_PROPERTY_ID` — détail dans [seo-geo.md](visibility/seo-geo.md).
4. **Google Ads** — mots du secteur seulement. Budget zéro. Pas de campagne.
5. **Automation Cursor Cloud** — nom `3xrep — seo geo`. Coller le brief de [seo-geo.md](visibility/seo-geo.md). Cadence : une fois par semaine.

L’agent geo externe, s’il est une autre automation : il écrit seulement dans [bus.md](visibility/bus.md). Il ne change pas le site.

Français et pages ville : item 2 + plus tard. Pas cette tâche.

## Ensuite — pas ouvert

Ordre PRD, inchangé : listings (Claude Connectors, Cursor Marketplace, PulseMCP) → page tutoriel « agent + HubSpot » → pSEO. Mémoire / ligne payant : après une vraie `pipe_review` sur un vrai CRM ([plg.md](plg.md)). Carte HubSpot = V2 ([chemin.md](chemin.md)).

**Portes** ([portes.md](portes.md)) — direction 6 sept, pas ouvert : nommer les visages (avant d’écrire, avant le rdv, lundi), dire Slack, ne pas construire Slack. Pas un item live.

### 5. Pan croissance — leurs utilisateurs (pas nous)

**Direction. Pas ship.** 12 septembre 2026. Édouard : un pan **produit**. Le commercial (ou l’équipe) qui se sert de 3xrep. Guider **leurs** utilisateurs à prendre des rendez-vous.

**Ce n’est pas** la croissance de 3xrep : pas notre acquisition, pas notre LinkedIn, pas notre siphon, pas notre prospection à nous.

**Tout canal est optionnel.** Téléphone, courriel, Aircall, transcription : aucun n’est un must — ni pour l’utilisateur, ni pour Édouard. On annule « téléphone / Aircall obligatoires dans le produit » et « courriel seul = chemin complet imposé ».

**Must du cerveau, pas d’un canal.** Sur *ce* dossier : voilà les preuves qu’on a, voilà ce qui manque, est-ce normal, et proposer de brancher la source. Eux branchent. Eux collent. On n’écrit pas dans leur fichier client.

Exemples (pas copy figée) :

- « Sur cette affaire : pas d’échanges téléphone. Trois courriels et une transcription de réunion. C’est normal ? Si tu appelles, branche ton téléphone sur internet (Aircall et équivalents) à ton fichier client, pour que les appels remontent aussi. »
- S’il n’y a que des notes manuelles de l’utilisateur : lui dire de brancher ses courriels, ou un outil de transcription.
- Plus tard : proposer d’utiliser son assistant (Claude Cowork, ChatGPT) pour coller de la donnée en note dans le fichier client. **On la classe comme telle : pas un mot dit par le client. C’est le retour de l’utilisateur.** Le cerveau ne prend pas ça pour une citation / une preuve « dite par eux » ([cerveau.md](cerveau.md), [contournement.md](contournement.md)).

Aircall (et équivalents) : **dans le pan**, comme source possible à brancher. Pas une obligation. On ne construit pas Aircall maintenant.

À venir, pour eux (tout optionnel) :

- Préparer la prospection téléphonique
- Téléphone / Aircall / VoIP — source à brancher, pas un must
- Créer des listes
- Enrichir : lignes directrices et outils, puis comment installer
- Plusieurs canaux : email, téléphone, LinkedIn, WhatsApp, messages vocaux
- Rédiger des emails
- Guider vers le rendez-vous

Pas live. Ne pas coder. Ne pas ouvrir comme les items 1–4.

**Tension — on ne la cache pas.** Le cerveau juge des preuves, pas des formes ([cerveau.md](cerveau.md)). On n’entre pas dans les appels. On n’écrit pas dans leur fichier client ([decisions.md](decisions.md)).

Proposer Aircall **sans** entrer dans l’appel : juger le transcript s’il arrive dans la demande. Pas de bot. Pas de bande. Le connecteur guide. Eux décrochent. Eux collent.

| Ils demandent | Déjà interdit / déjà dit |
| --- | --- |
| Un canal obligatoire | Non. Le must = preuves sur *ce* dossier, trou, « c’est normal ? », source à brancher. |
| Brancher Aircall / courriels / transcription | Eux branchent chez eux. On propose. On n’écrit pas dans leur fichier. Un transcript **s’il arrive dans la demande** est une preuve, comme aujourd’hui ([decisions.md](decisions.md)). |
| Note collée via l’assistant | Retour de l’utilisateur. Pas une citation du client. Pas un exhibit « dit par eux ». |
| Rédiger des emails, des séquences | Geste `prospection` : souvent **n’écris pas** ([gestes.md](gestes.md)). [portes.md](portes.md) : « on écrit le mail » on ne prend pas. Une séquence poussée dans HubSpot = écrire dans leur fichier. Le connecteur guide. Eux collent et envoient. |
| Guider vers le rendez-vous | Guider ≠ booker. « On te booke » : non. `inbound` refuse déjà de booker la démo demandée. |
| Enrichir (outils + installer) | [acces.md](acces.md) : on ne devient pas Apollo / Clay. Lignes directrices + **leurs** outils, oui. Un hub d’enrichissement à nous, non. Une fiche enrichie n’est pas une preuve. |
| Plusieurs canaux | [gestes.md](gestes.md) : un geste `prospection`, pas quatre. Le canal est le leur. Aucun canal n’est un must. |

La porte « avant d’écrire » existe déjà. Ce pan n’est pas un deuxième cerveau. C’est le même jugement — preuves, trou, source à brancher — **sans** devenir la bouche ni le stylo.

Rouvrir seulement si Édouard tranche la tension (écrire vs juger, booker vs guider, enrichir chez eux vs chez nous, proposer Aircall sans entrer dans l’appel). Pas avant.

## Interdit ici

Per-seat. Essai qui expire. Démo / Calendly. « On remplace Gong ». Traduire VP Sales. Captures fake. Revenir au 99 €. Rouvrir le jeu / l’usine de cas. Coder le pan croissance. Brancher Aircall maintenant. Confondre ce pan avec notre acquisition. Imposer un canal (téléphone, courriel, Aircall). Prendre une note collée par l’utilisateur pour une citation du client.
