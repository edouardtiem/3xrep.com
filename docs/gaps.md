# Gaps — le monde, le cycle, le siphon

**Pas figé.** 6 septembre 2026. Édouard : une automation Cursor qui liste les gaps vs la connaissance sales mondiale ; une loop plus rare qui décide d’intégrer ; le MCP qui propose un audit mensuel du cycle user ; comment se protéger de qui vide le MCP puis arrête de payer ; quelle data force à rester.

Ne casse pas [cerveau.md](cerveau.md) (admission à six cases, la bibliothèque est l’actif, **plus de méthodes n’est pas le moat**). Ne casse pas [plg.md](plg.md) (tools ouverts). Ne casse pas [differentiel.md](differentiel.md). Ne crée pas `docs/loops/`.

B2B d’abord. B2C : park, jusqu’à ce qu’on l’ouvre.

## 1. Ce que ce n’est pas

Empiler des sigles. Une page FAINT, SCOTSMAN, SIMAC, n’est pas un gap produit. [methodes.md](methodes.md) est le lexique. L’unité du moteur est la **pièce**.

Le scan cherche des **trous de jugement**. Pas une encyclopédie à jour.

## 2. Deux loops internes — Cursor Cloud

Pas un cron dans Vercel. Un agent sur ce repo, comme [visibility](visibility/README.md).

| Loop | Cadence | Skill | Sortie | Droit |
| --- | --- | --- | --- | --- |
| **Scan** | souvent (2 sem. / mois) | [`scan-sales-gaps`](../.agents/skills/scan-sales-gaps/SKILL.md) | [captures](gaps/captures/) | Lister. Classer. **Pas** écrire une pièce. |
| **Décider** | rare (trimestre, ou quand un vrai deal tient) | [`decide-sales-gaps`](../.agents/skills/decide-sales-gaps/SKILL.md) | [decisions](gaps/decisions/) | Go / no-go. Admission [cerveau.md](cerveau.md) §9. |

Cursor ne crée pas l’automation tout seul. Coller le brief §7 dans le dashboard. L’agent tourne le skill, commit la capture, s’arrête.

## 3. Classification — une ligne, un verdict

Chaque méthode / partie / école trouvée (même minuscule) tombe dans **une** case :

| Case | C’est | On fait |
| --- | --- | --- |
| **alias** | Nouveau nom pour une pièce déjà là (FAINT Funds ≈ BANT Budget) | Noter l’alias. Fichier méthode plus tard, si une query pSEO tient. |
| **pièce** | Un trou que le kernel ne juge pas (six cases possibles) | Documenter. **Ne pas** remplir tant qu’un vrai deal (ou une query) ne le demande. |
| **geste** | Un moment du cycle absent, qui passe [gestes.md](gestes.md) §2 | Déclarer dans gestes.md. Yaml à la demande. |
| **livrable** | Mail, script, séquence, punchline, close | Rejeter. Craig. |
| **cours** | DISC, persona, mindset, « sois Challenger » | Rejeter. Ou lexique, jamais une pièce. |
| **B2C** | Magasin, phoning, AIDA retail | Park. Pas de scan B2C tant qu’on n’ouvre pas. |

Un sigle déjà dans `METHODES` / `docs/methodes/<slug>.md` n’est pas un gap. Une pièce du [kernel](differentiel.md) **pas encore dans** `PIECES` — ça, c’est un gap.

## 4. Loop user — une fois par mois, le cycle

Pas un nouveau tool. C’est `pipe_review` sur **tout** le pipe ouvert.

Le MCP le **propose** (instructions + prompt `cycle_audit`). Leur agent lit le CRM, passe les artefacts, colle le JSON.

Sortie, en plus des contradictions et du trou systémique : des **recommandations de process**. Pas un %.

| Type | Exemple |
| --- | --- |
| `question-mandatory` | Rendre obligatoire avant le prochain rdv la question du cran 1. |
| `gate-stage` | Cette étape CRM n’existe pas tant que la pièce n’est pas tenue. Gater, ou la supprimer. |
| `train-reflex` | Former le réflexe (usage ≠ budget), pas un module MEDDIC. |

Interdit dans cette sortie : taux de conversion, « de x à y », coverage, win rate, « vous closerez plus ». Le test, c’est le `pipe_review` d’après : le trou systémique a bougé, ou pas.

Plus tard, pas V0 : la [mémoire de jugement](cerveau.md) §7 (identifiant de réflexe, hash, date — **zéro contenu**). Alors on peut dire « tu loupes cette porte pour la quatrième fois ». Sans ça, un mois de pipe tient déjà.

Former les sales = le réflexe, sur leurs deals. Pas un LMS.

## 5. Siphon — ils peuvent tout prendre ?

Oui, **le lexique**. `methode_lookup` est ouvert. Un client motivé dump les sigles, puis résilie. C’est le même markdown que GitHub donne déjà gratis.

Non, **le produit**. Ce qu’ils emportent est une définition. Sans fausse preuve, sans perche, sans angle serveur, c’est un skill MEDDIC. [differentiel.md](differentiel.md) : les définitions sont gratuites.

Ce qu’ils ne peuvent pas emporter en collant « prend tout » :

1. **Le runtime sur LEUR pipe.** L’étape illégale, la date-claim, le trou qui se répète — ça n’existe que branché à leur CRM, call après call.
2. **La continuité.** La mémoire (plus tard) et l’audit mensuel. Un dump d’avril est un snapshot. Le jugement de septembre, non.
3. **L’angle.** Règles serveur, pas un prompt. Le modèle se ramollit dès qu’il recopie.

Coller le lexique dans **leurs** skills, puis résilier : oui, pour le dictionnaire, ils n’ont plus besoin de nous. Un skill est un texte. Le modèle l’ignore, se ramollit, invente une réplique. Ils n’emportent pas la machine qui juge **leur** pipe. Sur un call, un skill volé + ChatGPT peut sembler assez proche — déjà le doute du 4 sept. La différence tient sur la liste et sur le mois d’après.

Donc : **ne pas cacher la bibliothèque pour se protéger.** En faire le paywall tue l’acquisition ([plg.md](plg.md) : le lexique reste ouvert). Se protéger = que la valeur vive dans le jugement **de leurs deals dans le temps**, pas dans un export de méthodes.

Ce qu’on ne fait pas : watermark, DRM, « tu n’as plus le droit de te souvenir ». Un ToS anti-scraping est du théâtre. Un Bearer trop tôt, on n’apprend plus qui s’en sert.

Plus tard, **en regardant l’usage** : rate-limit les dumps évidents (cent `methode_lookup` vides). Ligne payant = pipe + mémoire, déjà le candidat. Pas avant une vraie `pipe_review` chez eux.

## 6. Quelle data change la qualité — maintenant / plus tard

La connaissance, un jour, tient dans un prompt. D’accord. **Leur pipe, non.**

| Quand | Data | Pourquoi ça change le résultat | Interdit |
| --- | --- | --- | --- |
| **Maintenant** | Leurs artefacts + ce que le CRM prétend (étape, close, dernière modif) | `pipe_review` + reco de process. Zéro stockage 3xrep. | Transcripts chez nous. Proba. |
| **Maintenant** | Recettes de fetch dans la pièce ([acces.md](acces.md)) | « HubSpot a Marie DAF, Pappers le président — ni l’un ni l’autre n’est tenu. » | Enrichir nous-mêmes. |
| **Dès qu’ils tournent** | Compte de pièces vides / étapes illégales **dans l’appel**, pas chez nous | L’audit mensuel. Le process (question mandatory, stage gatée) est **à eux** — on le juge au suivant. | « Dans ton industrie, 32 %. » |
| **Plus tard** | Mémoire : `org` + hash deal + pièce + `su\|suppose\|trou` + id réflexe + date | « Verrou 2, promis le 12. » Le VP se souvient. | Contenu, bande, prompt. |
| **Plus tard** | Leur cycle comme graphe (étapes qu’ils ont gatées / dropées après un audit) | Le moteur cadre sur **leur** process, pas une grille générique. | Un playbook 3xrep officiel. |

Ce n’est pas plus de méthode. C’est **leur** historique de jugement + **leur** process. Un prompt tout seul n’a ni l’un ni l’autre.

B2C, le jour où on l’ouvre : d’autres pièces (pas d’EB, pas de papier). On ne les scanne pas avant.

## 7. Brief automation (à coller dans Cursor)

**Scan** — nom `3xrep — scan sales gaps`. Branche ce repo. Prompt :

> Tourne le skill `.agents/skills/scan-sales-gaps/SKILL.md`. B2B seulement. Classe chaque trouvaille (alias / pièce / geste / livrable / cours / B2C). Écris `docs/gaps/captures/YYYY-MM-DD.md`. Ne remplis aucune pièce. Ne merge pas. Commit la capture.

**Décider** — nom `3xrep — decide sales gaps`. Plus rare. Prompt :

> Tourne le skill `.agents/skills/decide-sales-gaps/SKILL.md` sur la dernière capture. Admission à six cases. Go seulement si un vrai deal ou une query pSEO tient. Écris `docs/gaps/decisions/YYYY-MM-DD.md`. Pas de pièce incomplète.

## 8. Décision — ce run

1. **Scan ≠ encyclopédie.** On classe vers les pièces. On n’écrit pas FAINT pour FAINT.
2. **Intégrer = rare, humain, admission.** L’automation propose. Elle ne shippe pas une pièce.
3. **Audit mensuel user = `pipe_review` + reco de process.** Pas un % de conversion. Prompt MCP `cycle_audit`.
4. **Siphon du lexique : on l’accepte.** Le lock-in est le jugement dans le temps, pas le markdown.
5. **Data maintenant : leur CRM + les recos.** Data plus tard : mémoire de jugement, zéro contenu. Pas de benchmark industrie.
