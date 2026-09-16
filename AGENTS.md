<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 3xrep

Lis [README.md](README.md). C’est le produit. Ne te fie pas à un autre fil.

Si on décide le contraire du README : corrige le README, ou propose si c’est gros.

Si la façon de travailler (ce fichier) ne colle plus : mets à jour `AGENTS.md`.

Un choix déjà pris, c’est le live. Ce n’est pas un stop à la discussion. S’il explore (« c’est possible ? », « et si ? », « je pense ») : dire le choix, puis les autres options, ce que ça casserait, ce que ça ouvrirait. On ne change le README que s’il décide. S’il demande de faire : la décision gagne, sauf s’il la rouvre.

## Te parler

Comme un humain. Un enfant de quinze ans doit tout comprendre, du premier coup.

Français. Phrases courtes. Une idée par phrase. Mots de tous les jours.

Pas d’abréviation. Pas de mot anglais s’il existe en français. Pas de jargon à nous (« le pipe est vert », « l’étape est illégale », « la liste ment »). Pas de tic (« lundi » pour dire la suite, « wait / go »).

Pas un cours. Pas deux idées collées avec « tu as raison… tu as tort… ». Pas six chiffres dans le même souffle. S’il ne suit plus : une chose à la fois, on recommence.

Le site, le cerveau, le code : leur voix à eux. On ne les réécrit pas dans ce français-là, sauf s’il le demande.

## Copie pour le visiteur

Lui, il ouvre Claude. Il voit les mails, le calendrier, le fichier client, et 3xrep qui dit quoi faire. Pour lui, on suit la journée. Une phrase comme *he keeps track of everything else* parle de ça. Ce n’est pas un mensonge.

Le code, lui : on n’avale pas Gmail. On n’écrit pas dans HubSpot. On garde un squelette (les trous, pas le roman) pour se souvenir et apprendre.

Ne pas tuer une ligne de la page parce que « le fichier n’est pas chez nous ». Couper seulement si ça promet qu’on entre dans leur boîte, qu’on écrit le fichier client, ou qu’on garde les appels pour toujours.

## Branches

Dis tout de suite sur quelle branche on est.

- `main` = prod. On n’y touche que s’il dit que c’est la prod.
- `pre_main` = avant la prod. Défaut pour un chat. On atterrit ici.
- Toute autre branche = un essai. Elle peut ne pas être dans `pre_main`.

Un chat peut partir de n’importe quelle branche. Question, faute, petite copie : rester où on est.

Nouvelle fonction, ou vrai changement : nouvelle branche depuis `pre_main`, nom `feat/sujet` ou `fix/sujet`.

Le dossier ouvert n’est pas tout le git. Avant de dire « ça n’existe pas » : `git fetch`, puis regarder `pre_main` et les autres branches (noms, derniers commits, demandes de fusion ouvertes).

S’il parle d’un travail déjà commencé : trouver la branche, aller dessus. Ne pas recommencer sur `pre_main`. Ne pas ouvrir une branche neuve. Ce qui n’est pas enregistré dans git est invisible.

## Cloud

Le disque peut dater d’un snapshot. `git fetch` avant de conclure.
