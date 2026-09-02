# Landing — 3xrep.com

Figé. 1er–2 septembre 2026. Gagne sur le hero / la home. Maquette live : `src/app/page.tsx` — Édouard : parfait (2 sept). Le PRD §13 (page d’intention, pas un magazine) tient. [v0.md](v0.md) tient pour le slice produit (même porte MCP).

## DA — Session (clair)

Pas les DA terrain (Surface / Console = le jeu). Pas Session dark (le default AI 2025).

Fond **presque blanc** (`#f7f7f5`, pas `#fff`). **Tout mono** (Geist Mono). Une **fenêtre de terminal** sous le hire : même papier, filet 1 px, radius 4. Pas un trou noir Cursor au milieu (cliché Linear). Pas de vert, glow, CRT, `>_`.

Un accent cuivre sur le statut MCP / `audit_deal`. Le reste se tait.

H1 en deux lignes max, measure serré. Le debrief a le droit d’être dense.

## Hero

**Hire the best VP Sales agent for 99 €/month.**

*for the entire organization* — petit, italique, tout de suite sous. Ça tue la lecture « par siège ».

Pas de deuxième H1. Pas de « tu crées / on est le cerveau » en hero : c’est le manifeste, trop interne. « VP » = le choc (un VP à 99 €). « Agent » = pas un humain. Hero EN. On ne traduit pas VP Sales.

CTA : **Start — 3 audits.** Le 99 € reste dans la H1 (le poste). Pas « Payer » en primaire. Pas de démo. Pas de Calendly.

## Preuve — la fenêtre

Session Claude Code / Cursor, même papier. Boucle 8 s, un deal :

*Débriefe le call avec Julien.* → `audit_deal` → la [sortie](sortie.md).

Titlebar minuscule (`claude code · MCP 3xrep`). Le motion *est* le mockup. Si le chrome mange le debrief, on a perdu.

## Sous la fenêtre — l’écart à Claude

Sans ça, on est un thème Cursor. Claude parle déjà. Une ligne, mute, mono. Pas une section « what we do ».

**This agent is the méthode that makes you close. Spoiler: he won’t go easy on you. That’s why it works.**

*Makes*, pas *make*. *Works*, pas *it’s working*. *On your deals* est dans *makes you close* + la fenêtre — on n’écrit pas *on top of* (en EN = « en plus de »).

Écart au PRD, **LP seulement**. Spec, tools, debrief : toujours pas « tu closes ». Pas dans la H1. Pas « more deals » / « +30 % » / « tu closes vendredi ».

## Logos

Claude Code · Cursor · Codex. Cet ordre. Sous la ligne, pas à la place.

Pas une soupe. Pas ChatGPT / Notion / Cowork dans le row. Claude (Cowork) seulement si on ajoute *un* quatrième, pas aujourd’hui.

## Wedge visiteur

Premier visiteur = founder déjà dans l’agent de code. Un AE qui ne sort pas de HubSpot n’est plus le premier écran. Assumé. Même SKU, même porte. Pas un troisième produit.

Écart à [v0.md](v0.md) § « Claude Code / Codex : bonus geek » : sur la *page*, ils sont le visage. Dans le *produit*, c’est toujours le même MCP.

## Mur avant checkout

Pas un mail. Pas un call. **3 `audit_deal`**, clé dès la page. Le 4e : le *tool* rend le lien Stripe (pas Claude qui vend). Compteur entier, pas les bodies (*don’t store*).

Checkout mute sous l’install : *Already in?* 99 € / month / organization. Ancre Modjo. Pour ceux qui paient sans passer par le quota.

## Sous le fold

Page d’intention, un scroll.

1. **Start — 3 audits. Then the card.** URL connector + spec + 3 prompts (copie).
2. Checkout mute — *Already in?*
3. Ce que ce n’est pas — Gong, CRM, cours, « you close Friday ». Quatre lignes.
4. Confiance — footer. **Pas le hero.**

Pas de logos clients, features grid, testimonials, layers en marketing, leçon MEDDIC.

## Confiance

Écarté : *We don’t have access to your data, prompts nor queries.* Faux. Le MCP est remote. `audit_deal` reçoit `evidence`. C’est de l’accès le temps de la requête.

**Ligne :** *Your CRM and your prompts stay where they are. We don’t record. We don’t store.*

« Don’t store » = contrat produit ([contournement.md](contournement.md) grade C). Si on log les bodies : on enlève la ligne.

## Interdit en copy

« On remplace Gong ». « Tu closes +30 % ». « Tu feras ×3 ». « More deals ». « Tu closes vendredi ». Démo. Per-seat. « We don’t have access to your data ». Session dark / mesh / orb / particle graph.
