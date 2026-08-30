---
name: end
description: Clôture 3xrep — un geste (on finit / ok go / pousse / commit / merge). Documente s’il y a matière, rebase toutes les branches courantes sur main (prod), lander ff-only. Jamais le /end MonParentAgé ni venture-os.
---

# /end — 3xrep

Miroir Claude de `.agents/skills/end/SKILL.md`. Même geste. En cas d’écart, le fichier `.agents` gagne — aligne les deux.

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
git -c user.name="edouardtiem" -c user.email="edouard@tiemh.com" commit
```

Titre de commit clair. Un commit suffit si le delta est un. Pas de commit vide.

## 3. Lander sur `main` (production)

Cible **pour l’instant** : `main`. C’est la prod. Pas d’autre branche cible.

Rebase **toutes** les branches courantes d’un coup — pas seulement celle du travail — puis ff dans `main`.

```bash
git fetch origin --prune
git checkout main
git pull --ff-only origin main

# cursor/* distantes sans locale : les prendre
git for-each-ref --format='%(refname:short)' refs/remotes/origin/ \
  | grep -v -E '^(origin/main|origin/HEAD)$' \
  | while read -r ref; do
      b=${ref#origin/}
      git show-ref --verify --quiet "refs/heads/$b" || git branch --track "$b" "$ref"
    done

# rebase + ff, une passe, toutes les locales sauf main
for b in $(git for-each-ref --format='%(refname:short)' refs/heads/ | grep -v -E '^main$'); do
  git rebase --update-refs main "$b" \
    || { git rebase --abort; echo "CONFLIT $b — skip"; git checkout main; continue; }
  git checkout main
  git merge --ff-only "$b" \
    || echo "PAS FF $b — skip"
done

git push origin main
```

- `--update-refs` : les branches empilées bougent avec.
- Merge **ff-only** seulement. Si ça refuse : rebase encore sur le `main` neuf, jamais un merge commit pour forcer.
- Conflit sur une branche **autre** que le travail : abort, skip, le dire. Ne bloque pas le land.
- Conflit sur la branche de travail : stop. Jamais `--force`.
- **Jamais** `--force` ni `--force-with-lease` sur `main`.
- Ne pas force-push `cursor/*` distantes (un agent cloud peut tourner).
- Push `main` après les ff. La PR se ferme toute seule si GitHub le fait ; ne merge pas « à la main » une PR déjà landée.

Si on est déjà sur `main` et que le travail est commité là : `git pull --ff-only origin main`, puis la passe ci-dessus, puis push.

## 4. Rapport — court, français

Quatre lignes max :

1. Landé sur `main` (`sha`) — branches rebase / landées / skip — ou bloqué, pourquoi.
2. Ce qui est entré (fichiers / idée, pas un roman).
3. Journal : chemin, ou « pas de note ».
4. Suite éventuelle (une phrase). Pas d’appel. Pas de Stripe. Pas d’app inventée.
