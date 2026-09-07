# Roadmap — 3xrep

**Live.** 6 septembre 2026. Édouard : docs MCP en détail + captures réelles (Cursor, Claude Code) + site dans toutes les langues. Le **129 dollars / mois / organisation** (US first) est **shippé** — [decisions.md](decisions.md).

Gagne sur [terrain/roadmap.md](terrain/roadmap.md) (archive jeu, 30–31 août). Le PRD tenait l’ordre *MCP → listing → page → pSEO*. Ici : ce qu’on ouvre **maintenant**. Ne pas implémenter le reste.

Live aujourd’hui : 129 dollars / org, `/docs` en anglais, tools ouverts. Restent ouverts ici : le détail des docs et les langues.

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

### 3. Prix — $129 / mois / organisation — **shippé** (7 sept)

US first. L’ancre 99 euros était Modjo (siège France). Close. Catalogue : **$129 / month / organization**. Toujours une org, jamais un siège. [decisions.md](decisions.md). [checkout.md](checkout.md).

199 euros = territoire démo ([prd.md](prd.md) §12). 129 dollars reste self-serve. Per-seat interdit. On ne monte pas pour soigner l’affiliation. On ne rouvre pas le 99 euros.

## Ensuite — pas ouvert

Ordre PRD, inchangé : listings (Claude Connectors, Cursor Marketplace, PulseMCP) → page tutoriel « agent + HubSpot » → pSEO. Mémoire / ligne payant : après une vraie `pipe_review` sur un vrai CRM ([plg.md](plg.md)). Carte HubSpot = V2 ([chemin.md](chemin.md)).

**Portes** ([portes.md](portes.md)) — direction 6 sept, pas ouvert : nommer les visages (avant d’écrire, avant le rdv, lundi), dire Slack, ne pas construire Slack. Pas un item live.

## Interdit ici

Per-seat. Essai qui expire. Démo / Calendly. « On remplace Gong ». Traduire VP Sales. Captures fake. Rouvrir le 99 euros. Rouvrir le jeu / l’usine de cas.
