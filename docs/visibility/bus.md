# Bus — findings geo

L’agent geo **externe** écrit ici. La boucle [`seo-geo`](seo-geo.md) lit, pose le correctif anglais, puis coche.

Ce n’est pas le bus MonParentAgé. Pas `_SIGNAL-BUS.md`. Pas `docs/loops/`. Un seul fichier, dans ce repo.

## Contrat

Une entrée **ouverte** a tous les champs. Sans phrase exacte + url, la boucle ignore la ligne.

```md
### YYYY-MM-DD — source
- query:
- surface: (aperçu Google / Perplexity public / web / autre, nommé)
- rung: recommended | cited | mentioned | absent
- phrase exacte:
- url:
- levier: impressions | clics | les deux
- fix suggéré: (verbe + URL 3xrep, anglais)
```

`source` = le nom de l’agent ou du check qui écrit (`ai-search-visibility`, un agent Cursor, un paste).

Après un tour `seo-geo` : déplacer le bloc sous **Traité**, ajouter `posé le YYYY-MM-DD` + l’URL changée.

## Ouvert

Rien pour l’instant. L’agent geo ajoute **au-dessus** de cette phrase, jamais en dessous de Traité.

## Traité

Rien pour l’instant.
