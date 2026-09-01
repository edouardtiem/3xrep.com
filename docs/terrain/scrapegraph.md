# ScrapeGraphAI — pour l’usine, pas pour le jeu

31 août 2026. Recherche. Ne rouvre pas le cadrage. [cadrage.md](cadrage.md) gagne.

**Verdict :** outil d’**usine**. Il tourne une page web en JSON typé (prompt + schéma). Ça nourrit le **générateur de cas** (point 3) et, plus tard, la recherche de `titre_google` / pSEO. Ça n’entre **pas** dans le produit. Ça n’entre **pas** dans le test 1. Les premières graines s’écrivent à la main. [template-parcours.md](template-parcours.md). [roadmap.md](roadmap.md).

Pas d’API key dans cet environnement : pas d’extract live ici. Docs officielles : [services](https://docs.scrapegraphai.com/llms.txt), [v2 API](https://docs.scrapegraphai.com/api-reference/introduction).

## Ce que c’est

API v2, un host (`https://v2-api.scrapegraphai.com`). Tu décris ce que tu veux. Pas de CSS, pas d’Actors Apify. Cinq services :

| Service | Entrée | Sortie | Crédits |
| --- | --- | --- | --- |
| `scrape` | URL connue | Markdown, HTML, liens, images, résumé, screenshot, JSON | 1 markdown / 2 screenshot / 5 branding. Somme des formats. |
| `extract` | URL, HTML ou Markdown + prompt (+ schéma) | JSON typé | 5 / appel |
| `search` | Requête web | Pages + contenu, ou JSON si prompt | 2 / résultat ; 5 / résultat avec prompt |
| `crawl` | URL de départ | Job async, N pages | 2 au start + scrape par page |
| `monitor` | URL + cron | Diffs, webhook | scrape par tick + 5 si changement |

Stealth anti-bot : +4 à +5. JS render : 0 crédit de plus.

SDK Python (`scrapegraph-py` ≥ 2.1) et JS (`scrapegraph-js` ≥ 2.1, Node ≥ 22). MCP hébergé : `https://mcp.scrapegraphai.com/mcp` (Cursor, OAuth Google ou `SGAI_API_KEY`).

Plans (juin 2026) : Free 500 crédits one-shot ; Starter 10 k / 20 $/mois ; Growth 100 k / 100 $ ; Pro 750 k / 500 $.

Open-source library à part (graphes de nodes, LLM local). Pour nous : **l’API v2**, pas la lib à self-host.

## Ce que ça peut faire pour 3xrep

Le trou du générateur : sans matière réelle, l’IA invente. [roadmap.md](roadmap.md) item 3. Un cas 3xrep a besoin d’un **deal qui sent le lundi** (offre, taille, qui apparaît sur le site, comité ou gérant) — puis on **fictionnalise** (Acme, Julien, ops). Le HUD n’est pas une fiche entreprise scrapée. [deroulement.md](deroulement.md).

| Job 3xrep | Service | Quand | Comment |
| --- | --- | --- | --- |
| **Graines de cas** (point 3) | `extract` + schéma | Après les graines manuscrites du test 1. Usine. | URL publique (site, about, équipe, pricing) → JSON `graine` (secteur, offre, taille signalée, rôles visibles, signaux comité / gérant). Puis **alias**. Jamais le vrai nom dans le HUD publié. |
| **`titre_google` / pSEO** | `search` + `locationGeoCode: "fr"` | Mémoire jusqu’au test semaine 2. Acquisition après oui. | Queries que les sales tapent (« DAF dit non », « MEDDIC economic buyer »). Pas un article formation. CTA = jouer. [methodes/_modele.md](methodes/_modele.md) §8. |
| **Fichiers méthode** | `scrape` markdown / `crawl` section | Quand on écrit `docs/methodes/<slug>.md` | Sources canoniques (pas pour coller du verbatim dans le jeu). Le fichier reste le nôtre : jeu, lundi, CRM, outils. |
| **Agent Cursor qui verse un cas** | MCP `extract` / `search` | Runs d’usine | L’agent lit une page, remplit le moule, rattache. Pas un meeting. Pas un roleplay. |
| **Veille concurrent** | `monitor` | Hors test. Basse priorité. | Hyperbound / Second Nature / pricing. Utile pour [recherche.md](recherche.md), pas pour le kill switch. |

Le schéma d’une graine — **sortie d’extract, pas un cas**. Le générateur (point 3, pas encore ouvert) mappe ça sur le moule.

```json
{
  "source_url": "https://exemple.fr",
  "secteur": "ERP atelier",
  "offre_publique": "planning + GPAO",
  "taille_signalee": "ETI 200–800",
  "cycle_signale": "long",
  "roles_visibles": ["DG", "DAF", "directeur d'usine"],
  "signaux": {
    "comite": true,
    "buyer_economique_nomme": true,
    "ops_en_page": true
  },
  "fiction": {
    "alias_compte": "Acme",
    "alias_ops": "Julien",
    "titre_joueur": "Call Acme — Julien, ops"
  }
}
```

`cycles` court / long se lit dans les signaux (gérant vs comité), pas dans un crawl LinkedIn. Les 20 du test : DAF **ou** gérant **ou** associé. Le scrape du site dit souvent lequel. L’inventaire (PR #4) le dit déjà.

### Coût usine, ordre de grandeur

Une graine = 1 `extract` (5 crédits) sur about + éventuellement 1 `scrape` markdown (1). Vingt copies dures d’un parcours ≈ 120 crédits. Le Free (500) tient un essai. Le Starter (20 $) tient l’usine tant qu’on ne crawle pas le web.

`search` 5 résultats FR avec prompt = 25 crédits. Assez pour caler une poignée de `titre_google`, pas pour un pSEO scale.

## SDR automatisé — ce que ça fait, ce que ça n’est pas

Leur page Lead Generation dit vrai **sur une couche** : `search` trouve des sites ; `extract` sort nom, rôle, description, parfois un mail générique (`contact@`) depuis /équipe ou /about. Ça, c’est des **comptes** (et des noms **déjà écrits** sur une page publique). Pas un pipe.

Un SDR automatisé, c’est cinq machines. ScrapeGraph n’en est qu’une, et encore : la plus faible.

| Couche | Job | ScrapeGraph | Ce qui le fait vraiment |
| --- | --- | --- | --- |
| 1. Comptes | Trouver des boîtes qui matchent un ICP | `search` + `extract` sur le site | Clay, Apollo, bases SIRENE / Pappers |
| 2. Personnes | Le bon siège, pas la page « équipe » | Noms **s’ils sont sur le site**. Pas LinkedIn. Pas un graphe. | LinkedIn Sales Nav, PhantomBuster, Clay |
| 3. Coordonnées | Un mail qui arrive | Pas une base. Pas de waterfall. Un `contact@` n’est pas un DAF. | Dropcontact, Hunter, Apollo, Kaspr |
| 4. Envoi | Séquence, warmup, domaine | Rien | Instantly, Lemlist, Smartlead |
| 5. Suite | Réponse, relance, CRM, RDV | Rien | Inbox + humain (ou un vrai sequencer) |

Mettre « ScrapeGraph + un prompt + Make » n’est pas du SDR. C’est une liste de pages, avec des champs parfois hallucinés (l’extract LLM invente un rôle s’il n’est pas sûr). Pas d’e-mail vérifié. Pas de deliverability. LinkedIn : leur propre cookbook le cite ; ToS + RGPD, la charge est **sur nous**, pas sur eux. Ils n’ont pas de fichier contacts. [Jay Mount — GTM atlas](https://jaymountconsulting.com/data-sources/scrapegraphai).

La note consultant de juin 2025 disait déjà la stack complète : Clay / PhantomBuster / Perplexity → Airtable → Relay pour le mail. ScrapeGraph **remplace Perplexity-sur-le-site**, pas Clay, pas Phantom, pas le sequencer. [Notion — automatiser l’activité](https://app.notion.com/p/20c97d1a0fc480979044d15ced455257).

**Simple Sales / le cabinet**, si on rouvre l’acquisition : oui, on *peut* brancher `extract` comme lecture de site dans un waterfall. Ce n’est pas « mettre ScrapeGraph et le SDR tourne ». C’est reconstruire le produit que Clay vend.

**3xrep :** non. L’acquisition figée = Google sur le cas, le mail **est** le cas. Pas 150 prospects / semaine. Pas un Calendly. Le kill switch = 20, semaine 2. Empiler un SDR à côté, c’est le deuxième produit mort. [cadrage.md](cadrage.md). [recherche.md](recherche.md) §6–7.

## Ce que ça ne doit pas faire (3xrep)

Le marketing ScrapeGraph vend du **lead gen**, du LinkedIn, des contacts. Couche 1, ci-dessus. **Pas le jeu.** [cadrage.md](cadrage.md). [recherche.md](recherche.md).

| Tentation | Pourquoi non |
| --- | --- |
| Scraper **dans** le jeu (le joueur colle une URL, on remplit le dossier) | Le produit est reconstruire le dossier **dans** le deal. Un extract qui pré-remplit = le cours. Auth / DB / live web : hors test. |
| Garder le **vrai nom** d’une boîte dans un cas publié | Graine = matière. Cas = fiction. Réputation + droit. |
| LinkedIn / emails / phones | ToS, RGPD, et ça n’entraîne pas le dossier. Point 5 = ChatGPT / Cowork / Grok sur **le dossier**, pas de scraping de personnes. |
| Remplacer les fichiers méthode par du crawl MEDDIC Academy | On écrit le rattachement 3xrep. On ne clone pas un LMS. |
| Apify / Clay « 150 prospects / semaine » | Simple Sales. Kill switch 3xrep = 20 commerciales, semaine 2. Pas un pipe. |
| Monitorer 3xrep.com | Rien à voir. |

Firecrawl (déjà vu dans Notion, 2025) est la même famille : page → markdown. ScrapeGraph gagne sur **`extract` + schéma** (la graine). Pas besoin des deux.

## jesaisfaire / Simple Sales

Hors ce git. Une ligne pour ne pas mélanger.

- **jesaisfaire** : un extract sur une offre d’emploi / page carrière → QCM métier, éventuellement. Autre produit, autre test.
- **Simple Sales** : `extract` = lecture de site dans un waterfall. Le SDR complet, c’est la section du dessus. Pas 3xrep.

Si on ouvre ScrapeGraph, le compte et la clé restent **usine 3xrep**. Pas un outil commercial partagé.

## Essai (quand Édouard a une clé)

Free 500 crédits. Dashboard : [scrapegraphai.com/dashboard](https://scrapegraphai.com/dashboard).

1. MCP Cursor : `{"mcpServers":{"sgai":{"url":"https://mcp.scrapegraphai.com/mcp"}}}` — login Google. Ou `SGAI_API_KEY`.
2. Un `extract` sur **un** site public FR (ETI, about + équipe), schéma `graine` ci-dessus.
3. Vérifier : les rôles visibles suffisent-ils à tendre un cas « Call avec l’ops » (DAF / gérant / associé ailleurs) ? Si non, la page ne nourrit pas le moule — on n’invente pas le DAF.
4. Fictionnaliser à la main. Jouer le graphe. Si le joueur sent le lundi, la graine tient.

SDK dans l’app Next : **interdit** tant que le test n’a pas dit oui. Zéro auth, zéro DB, zéro appel externe joueur.

Point 3 du template reste fermé. Cette note dit seulement : **si** on ouvre le générateur, ScrapeGraph est la couche graine. Pas le générateur. Le générateur multiplie les cas d’une difficulté. Le scrape fournit la matière d’**une** copie.
