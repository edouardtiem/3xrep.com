# Roadmap — 3xrep

**Live.** 6 septembre 2026. Édouard : docs MCP en détail + captures réelles (Cursor, Claude Code) + site dans toutes les langues + **$129 / mois / organisation**, US first.

Gagne sur [terrain/roadmap.md](terrain/roadmap.md) (archive jeu, 30–31 août). Le PRD tenait l’ordre *MCP → listing → page → pSEO*. Ici : ce qu’on ouvre **maintenant**. Ne pas implémenter le reste.

Live aujourd’hui : 99 € / org, `/docs` en anglais, tools ouverts. Rien de ce fichier n’est shippé.

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

Live **tant que cet item n’est pas shippé** : 99 € (hero, `/install`, Stripe EUR, [checkout.md](checkout.md)). On ne change pas le checkout en silence.

Quand on ouvre :

- Price Stripe **USD**, recurring monthly, $129. Nouveau `price_…` → `STRIPE_PRICE_ID`. Pas deux paliers sur le même product. Action humaine sur le Stripe **3xrep**.
- Copy : `$129/month. For the entire organization.` Ancre Gong (~$1,500 / seat) tient, mieux en dollar.
- Palier sept (1 org payante) tient. Le montant change, pas le kill.

199 € = territoire démo ([prd.md](prd.md) §12). $129 reste self-serve. Per-seat interdit. On ne monte pas pour soigner l’affiliation.

## Toi — pas l’agent

Tâches humaines. L’agent ne peut pas les faire. Sans elles, la [boucle visibilité](visibility/seo-geo.md) tourne quand même (bus + pages) et n’invente pas les chiffres.

### 4. Brancher Google + automation Cursor (visibilité)

Pour que la boucle `seo-geo` lise des vrais chiffres, puis les pose en anglais :

1. **Search Console** — propriété `https://3xrep.com` vérifiée. Accès lecture pour l’agent (compte de service dans l’environnement Cursor Cloud, ou un export CSV dans `docs/visibility/exports/`).
2. **Google Analytics** — le tag `G-YWQX4MDHZP` est déjà sur le site. Brancher l’**API** de la même propriété (sessions, pages). Le tag tout seul ne suffit pas à l’agent.
3. **Google Ads** — accès aux **mots du secteur** (planificateur). Budget zéro. Ne pas créer de campagne. On ne dépense pas.
4. **Automation Cursor Cloud** — une suffit. Nom `3xrep — seo geo`. Coller le brief de [seo-geo.md](visibility/seo-geo.md). Branche ce repo. Cadence : une fois par semaine.

L’agent geo externe, s’il est une autre automation : il écrit seulement dans [bus.md](visibility/bus.md). Il ne change pas le site.

Français et pages ville : item 2 + plus tard. Pas cette tâche.

## Ensuite — pas ouvert

Ordre PRD, inchangé : listings (Claude Connectors, Cursor Marketplace, PulseMCP) → page tutoriel « agent + HubSpot » → pSEO. Mémoire / ligne payant : après une vraie `pipe_review` sur un vrai CRM ([plg.md](plg.md)). Carte HubSpot = V2 ([chemin.md](chemin.md)).

**Portes** ([portes.md](portes.md)) — direction 6 sept, pas ouvert : nommer les visages (avant d’écrire, avant le rdv, lundi), dire Slack, ne pas construire Slack. Pas un item live.

## Interdit ici

Per-seat. Essai qui expire. Démo / Calendly. « On remplace Gong ». Traduire VP Sales. Captures fake. Changer le 99 € live avant l’item 3. Rouvrir le jeu / l’usine de cas.
