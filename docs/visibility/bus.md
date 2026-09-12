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

### 2026-09-12 — seo-geo (web public, second tour)
- query: AI that reviews the pipeline and says which stages are a lie
- surface: web
- rung: absent
- phrase exacte: Stage progression, close dates, champions, next steps, and confidence. All claimed. Rarely proven.
- url: https://www.spotlight.ai/post/the-five-lies-hiding-in-every-pipeline-review
- levier: les deux
- fix suggéré: une URL anglaise dont le H1 dit AI that reviews the pipeline and says which stages are a lie
- posé le 2026-09-12 : https://www.3xrep.com/docs/pipeline-review

### 2026-09-12 — seo-geo (web public, second tour)
- query: Deal stuck after discovery — CRM is still green
- surface: web
- rung: absent
- phrase exacte: Stage progression in most CRMs is tied to activity count rather than buyer commitment.
- url: https://selling-signals.beehiiv.com/p/green-doesn-t-mean-the-deal-is-healthy
- levier: clics
- fix suggéré: H2 `/docs/use-cases` Deal stuck after discovery. The CRM is still green.
- posé le 2026-09-12 : https://www.3xrep.com/docs/use-cases

### 2026-09-12 — seo-geo (web public)
- query: Alternatives to Gong that don't record calls
- surface: web
- rung: absent
- phrase exacte: No bot in the call
- url: https://www.claap.io/claap-vs-gong
- levier: les deux
- fix suggéré: une URL anglaise dont le H1 dit Gong alternative that doesn't record
- posé le 2026-09-12 : https://www.3xrep.com/docs/gong-alternative

### 2026-09-12 — seo-geo (web public)
- query: Our CRM says the deal is in negotiation but nobody on their side can sign
- surface: web
- rung: absent
- phrase exacte: The CRM's next-step field says "follow up"
- url: https://dealcollab.io/blog/why-deals-stall
- levier: clics
- fix suggéré: titre / description `/docs/use-cases` avec les mots de la requête
- posé le 2026-09-12 : https://www.3xrep.com/docs/use-cases

### 2026-09-08 — seo-geo (web public)
- query: What is 3xrep
- surface: web (DuckDuckGo, Bing, TrainHeroic)
- rung: absent
- phrase exacte: 3xREPS, Something heavy, you're a strength athlete Pick one: Ab Wheel Hanging Leg Raises
- url: https://marketplace.trainheroic.com/workout-plan/program/senay-program-1726683482
- levier: les deux
- fix suggéré: poser le H1 et le titre « What is 3xrep » sur https://3xrep.com/docs ; aligner canonique + sitemap sur l’hôte qui répond 200
- posé le 2026-09-08 : https://www.3xrep.com/docs (titre / H1 / description) + canoniques via `siteUrl()`

### 2026-09-08 — seo-geo (web public)
- query: Alternatives to Gong that don't record calls
- surface: web
- rung: absent
- phrase exacte: You cannot have conversation intelligence without first recording the call
- url: https://www.sybill.ai/blogs/conversation-intelligence-vs-call-recording
- levier: les deux
- fix suggéré: FAQ + description /install qui disent Gong records, 3xrep does not join
- posé le 2026-09-08 : https://www.3xrep.com/docs (FAQ schema) · https://www.3xrep.com/install (meta description)

### 2026-09-08 — seo-geo (web public)
- query: Best VP Sales agent for a small B2B team
- surface: web
- rung: absent
- phrase exacte: Hire a VP of Sales after you have a repeatable process, at least 2-3 reps hitting quota, and clear unit economics.
- url: https://syncgtm.com/blog/b2b-sales-team-structure
- levier: impressions
- fix suggéré: ne pas changer le H1 home (déjà « VP Sales agent ») ; description home : does not record your calls
- posé le 2026-09-08 : https://www.3xrep.com/ (meta description)
