# Landing — 3xrep.com

Figé 1er–2 septembre 2026 pour la **structure** (page d’intention, un scroll, la fenêtre = la preuve). **Copie rouverte le 4 sept** : le pipe, pas le rep ([sessions/2026-09-04.md](sessions/2026-09-04.md)). Le design est à refaire (Édouard, 4 sept : pas satisfait — second temps). Maquette live : `src/app/page.tsx`. Le PRD §13 tient. [v0.md](v0.md) tient pour le slice produit (même porte MCP).

## DA — Session (clair)

Pas les DA terrain (Surface / Console = le jeu). Pas un trou noir Cursor **sur du blanc** (cliché Linear).

Fond **quasi-noir** (`#0e0e0c`). **Tout mono** (Geist Mono). Texte `#e8e8e4`. Filet `#2a2a26`. La page **est** le terminal : même papier. La fenêtre Session est un cran plus noire (`#000`). Pas de vert, glow, CRT, mesh, orb. Accent cuivre sur MCP / `audit_deal`.

Un accent cuivre sur le statut MCP / `audit_deal`. Le reste se tait.

H1 en deux lignes max, measure serré. Le debrief a le droit d’être dense.

Desktop (≥ lg) : texte à gauche, session sticky à droite. La gauche emmène URL + *What the VP can do.* (4 prompts, une ligne) + checkout mute, pour que la session suive jusqu’en bas. Mobile : H1 → session → manifeste → URL.

## Hero

**Hire the VP Sales who doesn’t believe your CRM.**

*99 €/month. For the entire organization.* — petit, italique, tout de suite sous. Ça tue la lecture « par siège ».

Avant (2 sept) : *Hire the best VP Sales agent for 99 €/month.* Écarté le 4 sept : ça vend un coach de call, exactement la forme où ChatGPT « le fait moins bien mais le fait ». Le hero dit maintenant ce que le CRM ne peut pas dire de lui-même. « VP » reste le choc. Hero EN. On ne traduit pas VP Sales.

Pas de deuxième H1. Pas de « tu crées / on est le cerveau » en hero.

CTA : **Start.** sur la page (connector). Nav : **docs** → `/docs` (SEO, pas le fold). Pas « Payer » en primaire. Pas de démo. Pas de Calendly.

## Preuve — la fenêtre

Session Claude Code / Cursor, même papier. Un passage, puis ça s’arrête :

*Monday. Review my pipe. What’s blocked?* → `pipe_review` → 9 deals, 4 contradictions, 1 trou qui se répète. Acme : « Negotiation » dans HubSpot, personne qui signe, la réplique de Julien, *this stage is illegal*. Bolt : date de close = claim. Cora : 46 jours sans modif. Le trou systémique + la question. Dune : pas de call, *I won’t fill the gap*.

Avant : *Débriefe le call avec Julien.* → `audit_deal` → la [sortie](sortie.md). Toujours vrai dans le produit ; sur la page, c’est le pipe qui montre l’écart.

Titlebar minuscule (`claude code · MCP 3xrep`). Le motion *est* le mockup. Si le chrome mange le debrief, on a perdu.

## Sous la fenêtre — l’écart à Claude

Sans ça, on est un thème Cursor. Claude parle déjà. Une ligne, mute, mono. Pas une section « what we do ».

**Your CRM is green because someone ticked a box. This agent reads the calls behind the fields and says what your CRM can’t: this stage is a lie. He won’t go easy on you. That’s why it works.**

Avant : *This agent is the méthode that makes you close.* Gardé : *he won’t go easy on you. That’s why it works.*

Écart au PRD, **LP seulement**. Spec, tools, debrief : toujours pas « tu closes ». Pas dans la H1. Pas « more deals » / « +30 % » / « tu closes vendredi ».

## Logos

Claude Code · Cursor · Codex. Cet ordre. Sous la ligne, pas à la place.

Pas une soupe. Pas ChatGPT / Notion / Cowork dans le row. Claude (Cowork) seulement si on ajoute *un* quatrième, pas aujourd’hui.

## Wedge visiteur

Premier visiteur = founder déjà dans l’agent de code. Un AE qui ne sort pas de HubSpot n’est plus le premier écran. Assumé. Même SKU, même porte. Pas un troisième produit.

Écart à [v0.md](v0.md) § « Claude Code / Codex : bonus geek » : sur la *page*, ils sont le visage. Dans le *produit*, c’est toujours le même MCP.

## Install

Pas un mail. Pas un call. Connector, dès la page. Le spec voyage dans le MCP (`instructions` à initialize). Hub crawlable : `/docs`. Long form : `/spec`.

Checkout sous l’install : *Already in?* 99 € / month / organization + bouton Stripe. Ancre Gong (~$1,500 / seat). Chemin 2 min : `/install` puis Stripe ([checkout.md](checkout.md)).

## Sous le fold

Page d’intention, un scroll.

1. **Start.** URL connector (*next to your HubSpot, Salesforce, or Notion MCP. Run it on your pipe.*) + *What the VP says.* (4 prompts, copie : pipe review lundi, debrief, close date = claim, objection). Pas le markdown spec.
2. Checkout — *Already in?* 99 € / org + bouton Stripe (3 sept, palier 1 org payante). *Gong is ~$1,500 a seat and records your calls. Here it’s 99 € for the whole pipe, no seats, and we don’t record.*
3. Ce que ce n’est pas — Gong ; **Not your CRM’s assistant. It fills the fields. We say which ones are empty.** ; cours ; « you close Friday ». Puis ce que c’est : *We name the hole that kills the deal. And the stage that lies.*
4. Confiance — footer. **Pas le hero.**

Pas de logos clients, features grid, testimonials, layers en marketing, leçon MEDDIC.

## Confiance

Écarté : *We don’t have access to your data, prompts nor queries.* Faux. Le MCP est remote. `audit_deal` reçoit `evidence`. C’est de l’accès le temps de la requête.

**Ligne :** *Your CRM and your prompts stay where they are. We don’t record. We don’t store.*

« Don’t store » = contrat produit ([contournement.md](contournement.md) grade C). Si on log les bodies : on enlève la ligne.

## Interdit en copy

« On remplace Gong ». « Tu closes +30 % ». « Tu feras ×3 ». « More deals ». « Tu closes vendredi ». Démo. Per-seat. « We don’t have access to your data ». Session dark / mesh / orb / particle graph. Un pourcentage de forecast, un pipeline pondéré, un classement de reps (le VP juge le pipe, pas les gens).
