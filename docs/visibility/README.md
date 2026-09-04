# Visibility — 3xrep dans les réponses AI

Pas un bot SEO. Pas une cron. Pas de pub. Le check vit **dans ce repo**, tourné à la main par un agent qui lit les skills.

Skills :

- [`.agents/skills/ai-search-visibility/SKILL.md`](../../.agents/skills/ai-search-visibility/SKILL.md) — **run visibility for 3xrep**
- [`.agents/skills/build-3xrep-prompt-list/SKILL.md`](../../.agents/skills/build-3xrep-prompt-list/SKILL.md) — construire / éditer la liste

Liste : [`prompt-list.md`](prompt-list.md). **Seed, à valider.** Ne pas la traiter comme figée.

## Comment tourner

1. Invoker `/ai-search-visibility` (ou « run visibility for 3xrep »).
2. L’agent lit `prompt-list.md`, tourne les **5 top** d’abord.
3. Pour chaque prompt : web search + blocs AI **publics** + sa propre réponse. Texte et liens **avant** le jugement.
4. Surfaces login (ChatGPT, Claude.ai, …) : il liste **awaiting paste**. Tu colles, il reprend. Il ne les marque pas `absent`.
5. Sortie : table + **une** action nommée avec URL.

Ne pas lui demander de publier, poster, acheter un slot, ou ouvrir Grok Build.

## Où ça vit

| Quoi | Où | Quand on crée |
| --- | --- | --- |
| Liste | [`prompt-list.md`](prompt-list.md) | déjà (seed) |
| Captures (texte + liens) | `captures/YYYY-MM-DD.md` | premier run qui capture |
| Brief de l’action semaine | `briefs/YYYY-MM-DD.md` | seulement si l’action a besoin d’un texte à coller **plus tard**, après un oui |

Pas de dossier vide. On crée `captures/` et `briefs/` au premier fichier.

Une capture = le verbatim et les URLs, pas le jugement. Le jugement est dans le message (et peut être recopié en bas du fichier du jour).

## Règles qui tiennent

- Pas de citation inventée.
- Surface sautée ≠ absent.
- Rien ne sort du repo (post, page, listing) sans **yes** explicite.
- Ne jamais nommer Édouard / Uptoo / OC comme builder. Première org = inconnu, cold, online. 0 ads.

## Hors scope

Routines cron. Ads. UI CRM. Merge. Usine pSEO. Crawler / `llms.txt` / schema comme livrable. Second git « SEO ».
