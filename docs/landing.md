# Landing — 3xrep.com

Figé 1er–2 septembre 2026 pour la **structure** (page d’intention, un scroll, la fenêtre = la preuve). **Copie rouverte le 4 sept** : le pipe, pas le rep ([sessions/2026-09-04.md](sessions/2026-09-04.md)). Le design est à refaire (Édouard, 4 sept : pas satisfait — second temps). Maquette live : `src/app/page.tsx`. Le PRD §13 tient. [v0.md](v0.md) tient pour le slice produit (même porte MCP).

## DA — Session (clair)

Pas les DA terrain (Surface / Console = le jeu). Pas un trou noir Cursor **sur du blanc** (cliché Linear).

Fond **quasi-noir** (`#0e0e0c`). **Tout mono** (Geist Mono). Texte `#e8e8e4`. Filet `#2a2a26`. La page **est** le terminal : même papier. La fenêtre Session est un cran plus noire (`#000`). Pas de vert, glow, CRT, mesh, orb. Accent cuivre sur MCP / `audit_deal`.

Un accent cuivre sur le statut MCP / `audit_deal`. Le reste se tait.

H1 en trois lignes max, measure serré. Le debrief a le droit d’être dense.

Desktop (≥ lg) : un tiers texte / deux tiers fenêtre, toute la largeur. Le bloc texte (mesure 24 rem, lignes à gauche) est collé à la barre, face à la fenêtre. Sticky, hauts alignés avec le H1. La gauche emmène le manifeste + **Copy the agent prompt** + l’URL connector dès le premier écran. Mobile : H1 → session (hauteur fixe, s’arrête à Bolt) → manifeste → bouton → URL.

## Hero

**Hire the VP Sales agent who doesn’t believe your CRM and make you sign more deals.**

*$129/month. For the entire organization.* — petit, italique, tout de suite sous. Ça tue la lecture « par siège ».

Avant (2 sept) : *Hire the best VP Sales agent for 99 €/month.* Écarté le 4 sept : ça vend un coach de call, exactement la forme où ChatGPT « le fait moins bien mais le fait ». Le hero dit maintenant ce que le CRM ne peut pas dire de lui-même. « VP » reste le choc. Hero EN. On ne traduit pas VP Sales.

Pas de deuxième H1. Pas de « tu crées / on est le cerveau » en hero.

CTA : **Copy the agent prompt.** Colle dans l’agent (Claude Code, Cursor, n’importe lequel). L’URL connector reste dessous, pas le premier geste. Nav : **docs** → `/docs` (SEO, pas le fold). Pas « Payer » en primaire. Pas de démo. Pas de Calendly.

## Preuve — la fenêtre

Session Claude Code / Cursor, même papier. Un passage, puis ça s’arrête :

*Monday. Review my pipe. What’s blocked?* → `pipe_review` → 9 deals, 4 contradictions, 1 trou qui se répète. Acme : « Negotiation » dans HubSpot, personne qui signe, la réplique de Julien, *this stage is illegal*. Bolt : date de close = claim. Cora : 46 jours sans modif. Le trou systémique + la question. Dune : pas de call, *I won’t fill the gap*.

Avant : *Débriefe le call avec Julien.* → `audit_deal` → la [sortie](sortie.md). Toujours vrai dans le produit ; sur la page, c’est le pipe qui montre l’écart.

Titlebar minuscule (`claude code · MCP 3xrep`). Le motion *est* le mockup. Si le chrome mange le debrief, on a perdu. Fenêtre à **hauteur fixe** : le texte défile dedans. Mobile : on s’arrête à Bolt (pas Cora / Dune).

Marques sous la fenêtre, blanc sur noir. Deux lignes : *Works with every agent.* (Claude · ChatGPT · Gemini · Cursor · Notion) puis *And these CRMs.* (HubSpot · Salesforce · Pipedrive · Attio · Close). Notion est un agent, pas un fichier client.

## Sous la fenêtre — l’écart à Claude

Sans ça, on est un thème Cursor. Claude parle déjà. Une ligne, mute, mono. Pas une section « what we do ».

**Your CRM is green because someone ticked a box. This agent reads the calls behind the fields and says what your CRM can’t: this stage is a lie. He won’t go easy on you. That’s why it works.**

Avant : *This agent is the méthode that makes you close.* Gardé : *he won’t go easy on you. That’s why it works.*

Écart au PRD, **LP seulement** (7 sept, Édouard) : le hero a le droit de dire *and make you sign more deals* — l’objet de la page, sans chiffre. Spec, tools, debrief : toujours pas « tu closes ». Pas « +30 % ». Pas « tu closes vendredi ».

## Où il vit (4 sept)

Édouard : on ne comprend pas où vit l’agent. Le dire, et le dire vendeur : **il vit là où tu travailles déjà, au-dessus du CRM, pas dedans.** Rien à installer dans HubSpot, pas d’onglet 3xrep.

Section *Where he lives.* sous le manifeste, avant *Start.* Trois lignes mono (la page est le terminal) :

```
your agent   Claude · ChatGPT · Cursor · Notion…
 ├─ your CRM  HubSpot · Salesforce · Pipedrive · Attio…
 └─ 3xrep     one URL → the verdict
```

Tient dans la colonne gauche (24 rem) sans scroll horizontal.

Puis la condition, en une phrase : *He needs both. Without your CRM connected, he has nothing to read.* Pas un schéma d’archi. Pas « MCP server » en gras dans le hero. Le mot MCP n’apparaît qu’une fois (*one MCP URL*). Remplace la ligne de logos seule (Claude Code · Cursor · Codex), qui disait la plateforme sans dire la place.

## Logos

Sous la fenêtre Session, blanc sur noir. *Works with every agent.* Claude · ChatGPT · Gemini · Cursor · Notion. *And these CRMs.* HubSpot · Salesforce · Pipedrive · Attio · Close. Pas à la place du schéma *Where he lives.* Notion n’est pas dans la ligne CRM.

## Wedge visiteur

Premier visiteur = founder déjà dans l’agent de code. Un AE qui ne sort pas de HubSpot n’est plus le premier écran. Assumé. Même SKU, même porte. Pas un troisième produit.

Écart à [v0.md](v0.md) § « Claude Code / Codex : bonus geek » : sur la *page*, ils sont le visage. Dans le *produit*, c’est toujours le même MCP.

## Install

Pas un mail. Pas un call. Premier geste : coller la consigne dans l’agent. L’URL reste sur la page. Le spec voyage dans le MCP (`instructions` à initialize). Hub crawlable : `/docs`. Long form : `/spec`.

Checkout sous l’install : *Already in?* $129 / month / organization + bouton Stripe. Ancre Gong (~$1,500 / seat). Chemin 2 min : `/install` puis Stripe ([checkout.md](checkout.md)).

## Sous le fold

Page d’intention, un scroll.

1. Premier écran : H1 + prix + manifeste + **Copy the agent prompt** + cadran URL connector. Un tiers texte (bloc collé à la barre) / deux tiers fenêtre. Sticky, hauts alignés avec le H1.
2. Sous le fold : *Where he lives.* + *What the VP says.* (4 prompts). Pas de second cadran URL.
3. Checkout — *Already in?* $129 / org + bouton Stripe (3 sept, palier 1 org payante ; 11 sept : USD). *Gong is ~$1,500 a seat and records your calls. Here it’s $129 for the whole pipe, no seats.*
4. Ce que ce n’est pas — Gong (*We don’t join your calls.*) ; **Not your CRM’s assistant. It fills the fields. We say which ones are empty.** ; cours ; « you close Friday ». Puis ce que c’est : *We name the hole that kills the deal. And the stage that lies.*
5. Confiance — footer. **Pas le hero.**

Pas de logos clients, features grid, testimonials, layers en marketing, leçon MEDDIC.

## Confiance

Écarté : *We don’t have access to your data, prompts nor queries.* Faux. Le MCP est remote. `audit_deal` reçoit `evidence`. C’est de l’accès le temps de la requête.

**Ligne :** *We don’t join your calls. Tool inputs and verdicts are kept 14 days to improve the VP, then deleted. We don’t write to your CRM.*

« Don’t store » retiré le 6–7 sept 2026 : [decisions.md](decisions.md). On log les bodies des tool calls 14 jours (`mcp_calls`), puis delete. On n’enregistre toujours pas les calls (pas de bot Zoom). On n’écrit pas dans leur CRM.

## Interdit en copy

« On remplace Gong ». « Tu closes +30 % ». « Tu feras ×3 ». « Tu closes vendredi ». Démo. Per-seat. « We don’t have access to your data ». Session dark / mesh / orb / particle graph. Un pourcentage de forecast, un pipeline pondéré, un classement de reps (le VP juge le pipe, pas les gens). *More deals* : oui dans le hero, sans chiffre. Pas dans le spec ni les tools.
