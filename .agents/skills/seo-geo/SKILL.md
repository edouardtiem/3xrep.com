---
name: seo-geo
description: Run the 3xrep SEO + GEO loop. Read Search Console, Analytics, Google Ads keywords (no spend), and the GEO memory bus. Ship English on-site fixes that raise impressions and clicks. End with /end. Use when asked to run seo-geo, the visibility ship loop, or the Cursor Cloud SEO automation.
---

# SEO + GEO — une boucle, on pose

Un geste. Mesurer, puis **changer le site en anglais**. Pas un second git. Pas une usine de pages. Pas d’achat de clic.

Repo : `github.com/edouardtiem/3xrep.com`. Comment coller l’automation : [`docs/visibility/seo-geo.md`](../../../docs/visibility/seo-geo.md).

## Objectif

Deux leviers, **les deux** à chaque tour :

| Levier | On cherche | On joue sur |
| --- | --- | --- |
| **Impressions** | Plus de fois où 3xrep apparaît (Google + réponses d’assistants) | Requête sans page, titre trop étroit, phrase qu’un assistant peut citer, lien interne, sitemap |
| **Clics** | Plus de visites depuis ces apparitions | Titre / description qui gagnent le clic, H1 aligné, extrait, page qui répond vraiment |

Un levier sans l’autre = tour incomplet. Ne pas n’optimiser que le taux de clic (on perd des impressions) ni que la couverture (on gagne des impressions sans clic).

## Langue

**Anglais seulement** sur ce qui part en ligne. Home, docs, install, spec, titres, descriptions. Le français et les autres langues : plus tard ([roadmap](../../../docs/roadmap.md) item 2). Pas de page ville. Pas de préfixe `/fr`.

Les consignes acheteur en français (liste de visibilité) se **lisent**. Le correctif sur le site reste anglais.

## Sources — dans cet ordre

1. **Bus geo** — [`docs/visibility/bus.md`](../../../docs/visibility/bus.md). L’agent geo externe **écrit** ici. Tu **lis** tout ce qui est encore ouvert. Une ligne sans citation + url ne compte pas.
2. **Dernières captures** — `docs/visibility/captures/` si le dossier existe. Le check [`ai-search-visibility`](../ai-search-visibility/SKILL.md) peut aussi avoir ajouté au bus.
3. **Search Console** — requêtes, pages, impressions, clics, taux de clic, position. 28 jours vs 28 jours d’avant. Anglais d’abord.
4. **Google Analytics** — sessions depuis la recherche, pages vues, ce que font les gens après le clic (`/`, `/docs`, `/install`).
5. **Google Ads (mots seulement)** — idées de mots du secteur (agent VP Sales, alternative à Gong, sales enablement, AI sales coach). **Ne pas dépenser. Ne pas créer de campagne.**
6. **Le site tel qu’il est** — titres, descriptions, H1, sitemap, `robots`, liens internes.

Si Search Console / Analytics / Ads **ne sont pas branchés** : le dire en une ligne. Continuer avec le bus, les captures, le web public, l’audit de page. **Ne pas inventer un volume, un rang, un taux de clic.**

## Avant de coder

Lire, court :

- [`docs/visibility/seo-geo.md`](../../../docs/visibility/seo-geo.md)
- [`docs/visibility/bus.md`](../../../docs/visibility/bus.md)
- [`docs/landing.md`](../../../docs/landing.md) — le hero doit rester vrai
- [`docs/visibility/prompt-list.md`](../../../docs/visibility/prompt-list.md) — mots d’acheteur, pas à recaser en pitch

Relire le cerveau seulement pour **ne pas mentir** (on n’enregistre pas, on n’écrit pas dans leur fichier client, 99 € tant que le 129 dollars n’est pas shippé).

## Étapes

1. **Lire le bus.** Copier les findings ouverts. S’il est vide et qu’il n’y a pas de capture récente : tourner les **5 top** du check visibilité (web + blocs AI publics seulement). Écrire les findings dans le bus, puis continuer. Surfaces login = awaiting paste, pas `absent`.
2. **Tirer les chiffres** si les comptes sont là. Sinon passer.
3. **Juger.** Une table (dans le run, pas dans le chat seul) :

   | requête / consigne | source | impressions | clics | geo (rung) | levier | fix |
   | --- | --- | --- | --- | --- | --- | --- |

   `fix` = un verbe + une URL 3xrep. Pas « écrire du contenu ».
4. **Poser.** Le plus petit jeu de changements anglais qui tient les deux leviers. Preuve pour chaque changement : une ligne Search Console, un mot Ads, ou une citation geo + url. Sans preuve = on ne touche pas.
5. **Écrire le run** : `docs/visibility/runs/YYYY-MM-DD.md` (créer `runs/` au premier fichier). Suffixe `-2` si deux tours le même jour.
6. **Cocher le bus.** Les findings traités passent sous **Traité**, avec la date et l’URL changée.
7. **Finir par `/end`.** Lire [`.agents/skills/end/SKILL.md`](../end/SKILL.md) et enchaîner. Ne pas redemander. C’est le land sur `main`.

## Ce que tu as le droit de changer

Dès qu’une preuve dit que ça monte les impressions ou les clics :

- Titres, descriptions, Open Graph, canonique.
- H1, sous-titres, phrases dans le corps **en anglais**.
- Liens internes, sitemap, `robots` (ne pas ouvrir `/da`, `/merci`, `/api`).
- Schema déjà là (`pageMeta`, FAQ, SoftwareApplication) — corriger, pas un nouveau type inventé.
- **Une** nouvelle URL anglaise **par tour**, seulement si une requête a de la demande (Search Console, mot Ads, ou bus geo) **et** qu’aucune adresse actuelle ne la porte. CTA = `/install`. Pas un article de formation. Pas une page méthode usine.

Le hero : seulement si une requête perd clairement parce que le H1 ne dit pas les mots de l’acheteur. Garder le sens : VP Sales, le fichier client qui ment, *he won’t go easy on you*. Pas une farce de mots-clés.

## Interdit

- Français (ou autre langue) sur le site.
- Page ville / « local ».
- Acheter un clic, créer une campagne, monter un budget.
- Inventer une citation, un volume, un rang.
- Nommer Édouard, Uptoo, OC comme builder, preuve, ou réseau.
- Changer 99 € en 129 dollars. Le checkout live ne bouge pas ici.
- Promettre un pourcentage de signatures.
- Usine de pages. Plus d’une URL neuve par tour.
- Second git « SEO ». `docs/loops/`. `_SIGNAL-BUS.md`. `_HUMAN-TODO.md`.
- Ouvrir `/da` aux robots.
- S’arrêter à un brief sans poser, alors qu’un fix anglais a une preuve.

## Sortie du run

`docs/visibility/runs/YYYY-MM-DD.md` :

```md
# SEO + GEO — YYYY-MM-DD

Comptes : Search Console oui/non · Analytics oui/non · Ads (mots) oui/non
Bus : N ouverts, N traités

## Chiffres (ou « pas branché »)

| requête | page | impressions | clics | position |
| --- | --- | --- | --- | --- |

## Geo repris du bus

| query | surface | rung | phrase exacte | source |
| --- | --- | --- | --- | --- |

## Posé

| levier | URL | avant → après | preuve |
| --- | --- | --- | --- |

## Pas posé

Une ligne : compte manquant, ou pas de preuve, ou français / ville / pub.
```

Puis `/end`.
