# Boucle SEO + GEO

**Live.** 7 septembre 2026. Une boucle. Anglais sur le site. On pose, puis `/end`.

Pas le système de loops MonParentAgé. Pas `docs/loops/`. Skill : [`.agents/skills/seo-geo/SKILL.md`](../../.agents/skills/seo-geo/SKILL.md).

Le check assistants ([README](README.md), skill `ai-search-visibility`) **mesure**. Cette boucle **mesure et change le site**.

## Ce que ça fait

1. **Va sur Search Console et Google Analytics** — `npm run visibility-google`. Pas optionnel.
2. Lit le [bus geo](bus.md) (ce que l’agent externe a trouvé).
3. Google Ads **mots du secteur** — s’ils sont branchés. Pas de dépense.
4. Juge impressions **et** clics.
5. Change le site **en anglais** (titres, textes, une URL neuve au plus s’il manque une page).
6. Écrit `runs/YYYY-MM-DD.md`. Coche le bus.
7. Enchaîne [`/end`](../../.agents/skills/end/SKILL.md) — commit, rebase, `main`.

Français et pages ville : plus tard. Pas maintenant.

## Pages — ce que ça veut dire

On change d’abord les adresses qui existent (`/`, `/docs`, `/install`, `/spec`, les pages docs).

On n’en **crée** une (anglais, une par tour) que si une requête a de la demande **et** qu’aucune adresse actuelle ne la porte. Pas 80 pages. Pas un article formation.

## Toi — brancher (l’agent ne peut pas)

Sans les secrets, `npm run visibility-google` sort `pas branché`. La boucle continue (bus + pages). Elle n’invente pas les chiffres. Le tag `G-YWQX4MDHZP` dans la page **n’est pas** une lecture.

1. Compte Google Cloud. Activer **Search Console API** et **Google Analytics Data API**.
2. Compte de service, rôle lecture. Télécharger le JSON.
3. **Search Console** — propriété `https://3xrep.com` (ou `sc-domain:3xrep.com`). Ajouter l’email du compte de service (droits lecture).
4. **Analytics** — même email, Viewer sur la propriété 3xrep. Copier l’id numérique (Admin → Property settings), pas le tag `G-…`.
5. **Google Ads** — mots du secteur seulement. Budget = 0. Aucune campagne.
6. **Cursor Cloud** — coller le brief. Secrets dans l’environnement de l’automation (pas dans git) :

| Nom | Quoi |
| --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | le JSON entier du compte de service (alias : `GA4_SERVICE_ACCOUNT_JSON`) |
| `GSC_SITE_URL` | `https://3xrep.com/` (défaut si vide) |
| `GA4_PROPERTY_ID` | id numérique de la propriété Analytics |

Noms aussi dans [`.env.example`](../../.env.example). Export à la main seulement si l’API refuse : `docs/visibility/exports/` (créer au premier fichier). La commande reste obligatoire.

## Brief automation (à coller dans Cursor)

Nom : `3xrep — seo geo`. Branche ce repo. Prompt :

> Tourne le skill `.agents/skills/seo-geo/SKILL.md`. Repo 3xrep.com. Anglais seulement sur le site. **D’abord** `npm run visibility-google` (Search Console + Analytics — obligatoire, ne pas sauter). Lis le bus `docs/visibility/bus.md` (findings geo de l’agent externe — reprends-les dans le fix). Google Ads : mots du secteur seulement, ne pas dépenser. Objectif : plus d’impressions et plus de clics. Pose les correctifs. Écris `docs/visibility/runs/YYYY-MM-DD.md`. Finis par le skill `.agents/skills/end/SKILL.md` (commit, rebase, main). Ne crée pas `docs/loops/` ni `_SIGNAL-BUS.md`.

Cadence suggérée : une fois par semaine. Search Console a du retard ; plus souvent n’aide pas.

L’agent geo externe, s’il est une **autre** automation : il n’écrit **que** dans [`bus.md`](bus.md) (section Ouvert). Il ne change pas le site. C’est cette boucle qui pose.

## Hors scope

Acheter un clic. Campagne Ads. Pages ville. Locale française. Usine pSEO. Second git. Changer le $129 live. Nommer le builder.
