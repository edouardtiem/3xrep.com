---
name: end
description: Clôture 3xrep — un geste (on finit / ok go / pousse / commit / merge). Documente s’il y a matière, lander sur main (rebase, ff-only). Jamais le /end MonParentAgé ni venture-os.
---

# /end — 3xrep

Un seul geste de fin. Si Édouard dit **on finit**, **ok go**, **pousse**, **commit** ou **merge** : enchaîne. Ne redemande pas.

Ce skill est **3xrep** (`github.com/edouardtiem/3xrep.com`). Jamais le `/end` de MonParentAgé. Jamais le `/end` de venture-os.

## 3xrep n’a pas ça — no-op

Pas de loops, pas de `/sync-loops`, pas de `_SIGNAL-BUS.md`, pas de `_HUMAN-TODO.md`, pas de `docs/loops/`, pas de skill `documente`, pas de DEC/SIG. Ne les crée pas. Ignore-les.

## 1. Documenter d’abord — seulement s’il y a matière

Matière = une décision, un écart au cadrage, un trou nommé, un go/no-go. Pas « on a ouvert des fichiers ».

- Rien à dire → pas de journal. N’invente pas une note vide.
- Il y a matière → une note courte dans `docs/sessions/YYYY-MM-DD.md` (suffixe `-soir` / `-2` si plusieurs le même jour).
- Crée `docs/sessions/` **seulement** au moment d’y poser cette note. Ne crée pas le dossier tout seul.

La note est du 3xrep (terrain, quête, test semaine 2). Pas un dump holding.

## 2. Commit

Auteur **toujours** : `edouardtiem <edouard@tiemh.com>`.

```bash
git config user.name "edouardtiem"
git config user.email "edouard@tiemh.com"
```

Titre de commit clair. Un commit suffit si le delta est un. Pas de commit vide.

## 3. Lander sur `main`

```bash
git fetch origin main
git rebase origin/main
# s’il reste du travail : commit (étape 2)
git checkout main
git merge --ff-only <branche-de-travail>
git push origin main
```

- Merge **ff-only** seulement. Si ça refuse : rebase encore, jamais un merge commit pour forcer.
- **Jamais** `--force` ni `--force-with-lease` sur `main`.
- Push `main` après le ff. La PR se ferme toute seule si GitHub le fait ; ne merge pas « à la main » une PR déjà landée.

Si on est déjà sur `main` et que `origin/main` avance en ff : `git pull --ff-only origin main` puis push si on a des commits locaux.

## 4. Rapport — court, français

Quatre lignes max :

1. Landé sur `main` (`sha`) — ou bloqué, pourquoi.
2. Ce qui est entré (fichiers / idée, pas un roman).
3. Journal : chemin, ou « pas de note ».
4. Suite éventuelle (une phrase). Pas d’appel. Pas de Stripe. Pas d’app inventée.
