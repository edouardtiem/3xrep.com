# Boucle SEO + GEO

**Live.** 7 septembre 2026. Une boucle. Anglais sur le site. On pose, puis `/end`.

Pas le système de loops MonParentAgé. Pas `docs/loops/`. Skill : [`.agents/skills/seo-geo/SKILL.md`](../../.agents/skills/seo-geo/SKILL.md).

Le check assistants ([README](README.md), skill `ai-search-visibility`) **mesure**. Cette boucle **mesure et change le site**.

## Ce que ça fait

1. Lit le [bus geo](bus.md) (ce que l’agent externe a trouvé).
2. Lit Search Console, Google Analytics, Google Ads **mots du secteur** — s’ils sont branchés. Pas de dépense.
3. Juge impressions **et** clics.
4. Change le site **en anglais** (titres, textes, une URL neuve au plus s’il manque une page).
5. Écrit `runs/YYYY-MM-DD.md`. Coche le bus.
6. Enchaîne [`/end`](../../.agents/skills/end/SKILL.md) — commit, rebase, `main`.

Français et pages ville : plus tard. Pas maintenant.

## Pages — ce que ça veut dire

On change d’abord les adresses qui existent (`/`, `/docs`, `/install`, `/spec`, les pages docs).

On n’en **crée** une (anglais, une par tour) que si une requête a de la demande **et** qu’aucune adresse actuelle ne la porte. Pas 80 pages. Pas un article formation.

## Toi — brancher (l’agent ne peut pas)

Sans ça, la boucle tourne quand même (bus + web public + pages). Elle n’invente pas les chiffres.

1. **Search Console** — propriété `https://3xrep.com`. Vérifiée. Un accès lecture pour l’agent (compte de service, ou export CSV posé dans `exports/` au premier fichier).
2. **Google Analytics** — le tag public est déjà `G-YWQX4MDHZP`. Il faut l’**API** (même compte, propriété 3xrep) pour que l’agent lise sessions / pages, pas seulement le tag dans la page.
3. **Google Ads** — accès **planificateur de mots** / idées de requêtes du secteur. Budget = 0. Aucune campagne à créer.
4. **Automation Cursor Cloud** — coller le brief ci-dessous. Une automation suffit. Branche ce repo.

Où poser les secrets : environnement Cursor Cloud du repo 3xrep (pas dans git). Noms suggérés, quand tu branches :

| Compte | Quoi |
| --- | --- |
| Search Console | clé / compte de service + propriété `https://3xrep.com` |
| Analytics | même clé + id de propriété |
| Ads | même clé ou token développeur, **lecture mots seulement** |

Si tu préfères un export à la main : `docs/visibility/exports/YYYY-MM-DD-gsc.csv` (créer `exports/` au premier fichier). La boucle lit ça.

## Brief automation (à coller dans Cursor)

Nom : `3xrep — seo geo`. Branche ce repo. Prompt :

> Tourne le skill `.agents/skills/seo-geo/SKILL.md`. Repo 3xrep.com. Anglais seulement sur le site. Lis le bus `docs/visibility/bus.md` (findings geo de l’agent externe — reprends-les dans le fix). Lis Search Console, Google Analytics, Google Ads (mots du secteur, ne pas dépenser) s’ils sont branchés. Objectif : plus d’impressions et plus de clics. Pose les correctifs. Écris `docs/visibility/runs/YYYY-MM-DD.md`. Finis par le skill `.agents/skills/end/SKILL.md` (commit, rebase, main). Ne crée pas `docs/loops/` ni `_SIGNAL-BUS.md`.

Cadence suggérée : une fois par semaine. Search Console a du retard ; plus souvent n’aide pas.

L’agent geo externe, s’il est une **autre** automation : il n’écrit **que** dans [`bus.md`](bus.md) (section Ouvert). Il ne change pas le site. C’est cette boucle qui pose.

## Hors scope

Acheter un clic. Campagne Ads. Pages ville. Locale française. Usine pSEO. Second git. Changer le 99 €. Nommer le builder.
