# Visibility — 3xrep dans les réponses AI et sur Google

Deux gestes, même dossier.

| Geste | Skill | Droit |
| --- | --- | --- |
| **Check** | [`ai-search-visibility`](../../.agents/skills/ai-search-visibility/SKILL.md) | Mesurer. Capturer. Une action nommée. **Ne pose pas** le site. |
| **Boucle** | [`seo-geo`](../../.agents/skills/seo-geo/SKILL.md) | Mesurer **et** changer le site **en anglais**. Impressions + clics. Finit par `/end`. |

Liste : [`prompt-list.md`](prompt-list.md). **Seed, à valider.** Comment shipper : [`seo-geo.md`](seo-geo.md). Bus geo : [`bus.md`](bus.md).

Pas de pub payante. Pas d’usine de pages. Pas de second git.

## Check — mesurer

1. Invoker `/ai-search-visibility` (ou « run visibility for 3xrep »).
2. L’agent lit `prompt-list.md`, tourne les **5 top** d’abord.
3. Pour chaque prompt : web search + blocs AI **publics** + sa propre réponse. Texte et liens **avant** le jugement.
4. Surfaces login (ChatGPT, Claude.ai, …) : il liste **awaiting paste**. Tu colles, il reprend. Il ne les marque pas `absent`.
5. Sortie : table + **une** action nommée avec URL. Il **ajoute** aussi une entrée au [bus](bus.md).

Ne pas lui demander d’acheter un slot, ou d’ouvrir Grok Build. Poser le site = la boucle `seo-geo`, pas ce check.

## Boucle — poser (anglais)

Automation Cursor : coller le brief dans [`seo-geo.md`](seo-geo.md). Elle **lance** `npm run visibility-google` (Search Console + Analytics), lit le bus, change le site, `/end`.

Toi : brancher les trois comptes + créer l’automation — [roadmap](../roadmap.md) « Toi ».

## Où ça vit

| Quoi | Où | Quand on crée |
| --- | --- | --- |
| Liste | [`prompt-list.md`](prompt-list.md) | déjà (seed) |
| Bus geo | [`bus.md`](bus.md) | déjà (boîte aux lettres) |
| Captures (texte + liens) | `captures/YYYY-MM-DD.md` | premier run qui capture |
| Brief de l’action semaine | `briefs/YYYY-MM-DD.md` | seulement si le **check** a besoin d’un texte à coller plus tard |
| Runs de la boucle | `runs/YYYY-MM-DD.md` | premier tour `seo-geo` |
| Exports Search Console + Analytics | `exports/YYYY-MM-DD.md` | `npm run visibility-google` |

Pas de dossier vide. On crée `captures/`, `briefs/`, `runs/`, `exports/` au premier fichier.

Une capture = le verbatim et les URLs, pas le jugement. Le jugement du check est dans le message. Le jugement de la boucle est le run + le diff.

## Règles qui tiennent

- Pas de citation inventée.
- Surface sautée ≠ absent.
- Site en anglais. Français / villes : plus tard.
- Ne jamais nommer Édouard / Uptoo / OC comme builder. Première org = inconnu, cold, online. 0 ads payants.
- La boucle `seo-geo` a le droit de poser : Édouard l’a dit. Le check, non.

## Hors scope

Usine pSEO. Crawler / `llms.txt` comme livrable. Second git « SEO ». `docs/loops/`. `_SIGNAL-BUS.md`. Acheter un clic.
