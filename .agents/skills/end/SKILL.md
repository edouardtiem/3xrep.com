---
name: end
description: Clôture 3xrep — un geste (on finit / ok go / pousse / commit / merge). Documente s’il y a matière, lander ff-only sur pre_main. Prod (main) seulement s’il le dit. Jamais le /end MonParentAgé ni venture-os.
---

# /end — 3xrep

Un seul geste de fin. Si Édouard dit **on finit**, **ok go**, **pousse**, **commit** ou **merge** : enchaîne. Ne redemande pas.

Ce skill est **3xrep** (`github.com/edouardtiem/3xrep.com`). Jamais le `/end` de MonParentAgé. Jamais le `/end` de venture-os.

## 3xrep n’a pas ça — no-op

Pas les loops MonParentAgé : pas de `/sync-loops`, pas de `_SIGNAL-BUS.md`, pas de `_HUMAN-TODO.md`, pas de `docs/loops/`, pas de skill `documente`, pas de DEC/SIG. Ne les crée pas. Ignore-les.

Les gestes 3xrep (`seo-geo`, `ai-search-visibility`, `scan-sales-gaps`) ne sont pas ça. Le bus visibilité est [`docs/visibility/bus.md`](../../../docs/visibility/bus.md).

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

Titre de commit clair. Un commit suffit si le delta est un. Pas de commit vide. Ne pas écrire `git config`.

## 3. Lander sur `pre_main`

Cible par défaut : `pre_main` (avant la prod). Pas `main`.

`main` seulement s’il dit que c’est **la prod**.

On lande **la branche du travail**, pas toutes les branches. Les autres essais restent.

```bash
git fetch origin --prune
work=$(git branch --show-current)

if [ "$work" = "main" ]; then
  echo "SUR MAIN — stop, sauf s’il a dit que c’est la prod"
  exit 1
fi

git checkout pre_main
git pull --ff-only origin pre_main

if [ "$work" != "pre_main" ]; then
  git checkout "$work"
  if git rev-parse --abbrev-ref '@{u}' >/dev/null 2>&1; then
    git merge --ff-only '@{u}' \
      || git rebase '@{u}' \
      || { git rebase --abort; echo "UPSTREAM DIVERGÉ $work — stop"; exit 1; }
  fi
  git rebase --update-refs pre_main \
    || { git rebase --abort; echo "CONFLIT $work — stop"; exit 1; }
  git checkout pre_main
  git merge --ff-only "$work" \
    || { echo "PAS FF $work — stop"; exit 1; }
fi

git push origin pre_main
```

- Merge **ff-only** seulement. Si ça refuse : rebase encore sur le `pre_main` neuf, jamais un merge commit pour forcer.
- Conflit sur la branche de travail : stop. Jamais `--force`.
- **Jamais** `--force` ni `--force-with-lease` sur `main` ni `pre_main`.
- Ne pas force-push `cursor/*` distantes (un agent cloud peut tourner).
- Ne pas créer de branche locale nommée `origin`.

Si on est déjà sur `pre_main` et que le travail est commité là : `git pull --ff-only origin pre_main`, puis push.

## 3b. Prod — seulement s’il le dit

S’il a dit que c’est **la prod** :

```bash
git checkout main
git pull --ff-only origin main
git merge --ff-only pre_main \
  || { echo "PAS FF pre_main → main — stop"; exit 1; }
git push origin main
```

Jamais `--force` sur `main`. Ne pas merger un essai directement dans `main`.

## 3c. Branche de travail

Toujours finir sur `pre_main` (ou `main` si prod).

Si la branche du travail n’a **aucun** commit hors de `pre_main` : la supprimer (`git branch -D`, `git push origin --delete` si elle a un distant). C’est la branche de l’essai. Elle ne reste pas.

Ne jamais supprimer `main` ni `pre_main`. Ne pas balayer les autres essais.

`$work` = la branche du pas 3 (déjà capturée avant le checkout `pre_main`).

```bash
git checkout pre_main

if [ "$work" != "pre_main" ] && [ "$work" != "main" ]; then
  extra=$(git rev-list --count pre_main.."$work")
  if [ "$extra" = "0" ]; then
    git branch -D "$work"
    git push origin --delete "$work" 2>/dev/null || true
  else
    echo "HORS PRE_MAIN $work ($extra commits) — gardée"
  fi
fi
```

## 4. Rapport — court, français

Quatre lignes max :

1. Landé sur `pre_main` (`sha`) — ou prod `main` — ou bloqué, pourquoi.
2. Ce qui est entré (fichiers / idée, pas un roman).
3. Journal : chemin, ou « pas de note ».
4. Suite éventuelle (une phrase). Pas d’appel. Pas de Stripe. Pas d’app inventée.
