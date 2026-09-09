---
name: x-language-radar
description: Scan living X/web language around 3xrep topics (sales training, AI sales coach, VP Sales agent, Claude×Salesforce, etc.). Recommend wording that works. Propose draft copy for home, /install, and README only — never edit the live site without explicit founder yes. Output = recommendations to Jon/CoS.
---

# Radar langue — reco à Jon / CoS

Scanner la langue **vivante** autour de nos sujets. Dire quels mots marchent. Proposer des **injections** précises sur home, `/install`, `README.md` **seulement**.

**On ne touche pas au site.** Sortie = recommandations. Sans oui fondateur : pas de PR copy live. (La boucle qui pose le site, c’est `seo-geo`, autre geste, autre oui.)

Copy X (si le brief en demande) : compte **Ed.**, **Je vs Il** — I = fondateur (build / prix / avis) ; he / the agent / 3xrep = geste produit. Pas de I forcé. Copy site (home, `/install`, README) : produit, sauf si le fondateur demande un visage.

## Règles partagées

Détail : [README](../README.md). Tiennent ici :

- Contexte : README + home + `/install`. Plus profond seulement si une claim est douteuse.
- Web seulement si le sujet est vivant. Sinon skip.
- Brouillons jusqu’à compte X utilisable + org payante `/install` + go explicite. Pas de message privé auto. Compte fondateur (Ed. / run @3xrep). **Je vs Il** : I = fondateur (build / prix / avis) ; he / the agent / 3xrep = geste produit. Pas de I forcé. Lien doux `https://3xrep.com/install`. Prix **$129 / org / mois**.
- Secret : cold / online. Jamais Uptoo, OC, amis comme builder ou réseau. Pas le nom légal complet dans chaque post ni sur le site.
- API X : annoncer le coût avant un appel cher. Web public + lectures cheap d’abord.

## Sujets (départ)

Pas une liste fermée. Un mot surprise compte s’il a une preuve.

sales training · AI sales coach · VP Sales agent · Claude × Salesforce · HubSpot + Claude · alternative Gong **sans** enregistrement · pipeline review · exhibits / evidence · MCP sales · « the CRM is lying »

Exemple de geste : le mot **harness** pop. Chercher s’il est déjà sur home / `/install` / README. S’il est absent : proposer **où** l’injecter, phrase exacte, anglais. S’il est déjà là : le dire, ne pas recoller.

## Surfaces qu’on a le droit de *proposer*

| Surface | Fichier typique |
| --- | --- |
| README | [`README.md`](../../../README.md) |
| Home | `src/app/page.tsx` + [`docs/landing.md`](../../../docs/landing.md) (le hero doit rester vrai) |
| `/install` | `src/app/install/page.tsx` |

Pas `/docs`, pas `/spec`, pas le cerveau, pas une URL neuve — **sauf** si une claim produit est douteuse (alors on lit plus profond pour **ne pas mentir**, on ne propose pas d’y coller du marketing).

## Avant

1. Brief : quels sujets, ou « tourer le radar ».
2. Lire README, home, `/install` tels quels (copy actuelle, y compris **$129 / org / mois**).
3. **Sujet vivant ?** Actu, outil, concurrent, mot de la semaine → web + X cheap. Mot mort / evergreen déjà tranché → **skip web**, dire pourquoi.
4. Appel X cher (archive, gros search) : annoncer le coût, attendre ([README](../README.md) § API X).

## Étapes

1. **Collecter.** Pour chaque terme : phrase exacte + URL. Pas de phrase = le terme n’existe pas dans ce tour.
2. **Présence chez nous.** Grep / lecture : README, home, `/install`. Déjà là / absent / proche (synonyme).
3. **Juger.**

   | Terme | Verdict |
   | --- | --- |
   | **garder** | On l’a, il est vrai, on ne touche pas |
   | **adopter** | Ça pop, c’est vrai pour 3xrep, on n’a pas le mot |
   | **éviter** | Ça pop, ça ferait mentir (coach de call, « on remplace Gong », win rate, per-seat) |

4. **Injecter (adopter seulement).** Une surface, une phrase, un endroit (H1, sous-titre, paragraphe 2, ligne README). Pas un dumping du mot partout. Le hero ne bouge que si l’acheteur perd **clairement** sans ce mot — et le sens (VP Sales, le fichier client qui ment, *he won’t go easy on you*) tient.
5. **Écrire la reco.** Pas le patch. Pas `seo-geo`. Pas `/end` sur du copy live. Si une phrase X est jointe : **Je vs Il** (I = build / prix / avis ; he / the agent = geste produit).

## Sortie — pour Jon / CoS

`docs/visibility/` seulement si on te demande d’y poser le brief. Sinon : le message, table + phrases.

```md
# Language radar — YYYY-MM-DD

Pour : Jon / CoS
Web : fait | skip (sujet pas vivant)
API X : pas d’appel / cheap / cher annoncé (oui/non)
Site : **aucune edit**. Reco seulement.
X (si joint) : Ed. · Je = fondateur · Il / the agent / 3xrep = produit

## Termes

| terme | preuve (phrase + url) | chez nous (README / home / install) | verdict | injection proposée |
| --- | --- | --- | --- | --- |

## Phrases à coller (si oui fondateur)

### README
avant → après (une ligne)

### Home
endroit + avant → après

### /install
endroit + avant → après

## Éviter
terme — pourquoi ça ferait mentir

## Pas fait
web skip / pas de preuve / hors trois surfaces
```

Exemple **harness** (modèle, pas une vérité) :

- Preuve : citation + URL où le mot pop pour *agent + tools*.
- Chez nous : absent du README / home / install (vérifier à chaque tour, ne pas recopier cet exemple comme fait).
- Adopter **seulement** si 3xrep *est* ça sans mentir. Sinon éviter.
- Injection : une ligne sous le schéma *Where he lives.* ou une ligne README — pas le H1.

## Interdit

- Éditer home, `/install`, README, ou le reste, sans **oui fondateur explicite**.
- Inventer un volume, un rang, une citation.
- Coller un mot à la mode qui nous fait coach de call, Gong-killer, ou promesse de signatures.
- Nommer Uptoo, OC, amis. Coller le nom légal complet sur le site ou dans chaque post.
- Usine de pages. Locale FR sur le site. Pub.
- Poster sur X (autre skill, autres gates).
