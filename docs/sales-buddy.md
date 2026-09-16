# Sales buddy — contrat

Branche `sales-buddy`. Pas le README. Pas la prod tant qu’Édouard n’a pas dit que c’est le live.

Claude = coquille (Gmail, Calendar, Slack, HubSpot MCP). 3xrep = cerveau. Pas d’OAuth Gmail chez nous. Pas de `write_to_crm`. Pas de table `day.md`.

## Qui fait quoi

| | Claude (eux) | 3xrep (nous) |
| --- | --- | --- |
| 1. Le matin, l’ordre du jour | Ouvre le chat. Crée `day.md`. Lit CRM, mails, calendrier via **leurs** MCP. | Tool `plan_horizon` (fenêtre 1 / 7 / 30). Juge chaque ligne : trou, méthode, geste, parfois *n’écris pas*. |
| 2. Rédiger | Écrit le mail, la propale, le brief. | Le cerveau : angle, interdit, qui. Claude habille **après**. Jamais un corps de mail dans le JSON. |
| 3. Le soir, le fichier client | HubSpot MCP **à eux**, après un oui. | Reco `corrections_crm`. On n’écrit pas. |

Un chat toute la journée. À droite : `day.md` (fait / pas fait / reporter). Pas une UI 3xrep.

## Tool `plan_horizon`

Entrée : `fenetre` 1 | 7 | 30, `maintenant` (ISO avec décalage), `items[]` que Claude a lus chez eux (`rdv` / `tache` / `mail` / `affaire` + le deal).

Sortie : `agenda[]` (heure, affaire, `action`, trou, `draft`, reco CRM), `hors_fenetre`, `refus` / `demande`.

Les tools actuels restent en dessous (`scoreDeal`, `actionPourDeal`, `next_question`). `pipe_review` reste pour le lundi / le cycle. `plan_horizon` n’est pas un 22e geste : c’est l’entrée.

Interdits inchangés : proba de close, `write_to_crm`, citation inventée.

## Onboarding

1. Dans Claude : connecteur **3xrep** + **CRM** (HubSpot / Salesforce).
2. **À minima** Gmail + Calendar (connecteurs Claude / Google). Puis tout ce qu’ils peuvent.
3. Premier geste : prompt MCP `morning` → `plan_horizon` `fenetre=1`.
4. Sans Gmail / Calendar : on juge le CRM ; on `demande` les connecteurs. On ne bloque pas comme sans clé.

## Tests

Schema `test`. Jour type : **16 septembre 2026**, horloge `2026-09-16T08:00:00+02:00`. Discovery Nordik 14 h. Propale Dune 16 h (Dune = pas de call : pas « prépare la propale »). Relance due, relance en retard. Mail de chasse entrant : `draft` = n’écris pas.

## Hors scope

OAuth Gmail / Calendar / Slack. Stocker le fichier du jour. Réécrire Stripe, orgs, essai, webhook. Landing / copie home (autre branche). README / `v0.md` / `gestes.md` : seulement si Édouard dit que c’est le live.
