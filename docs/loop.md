# Boucle CRM

V0 : [v0.md](v0.md). Ce fichier décrit encore le **V2** (bouton dans HubSpot). Ne pas builder ça tant que le MCP n’a pas de vrais users sur Claude / ChatGPT / Notion.

## V0 — une phrase

Ils sont dans Cowork, ChatGPT ou Notion. L’admin a branché le CRM (officiel) + 3xrep. L’AE dit « débriefe le call avec Julien ». Il lit [sortie.md](sortie.md) **dans ce chat**. Sans transcript : [contournement.md](contournement.md). 3xrep ne touche pas HubSpot — si une note part sur le deal, c’est **leur** MCP CRM, après confirmation.


## Où ça s’affiche

Sur la fiche. Carte HubSpot, ou la même sortie posée en note. Le lien `3xrep.com/deal/{id}` n’est qu’un **boot** d’install (OAuth, plans sans carte). Ce n’est pas l’usage quotidien.

Un bouton. Libellé du genre **Débriefer ce call**. Pas quatre produits (audit / mail / plan / prep) : une sortie, des actions en dessous (copier le mail, poser la tâche « DAF en R2 »).

## Ce qu’on construit — un client, pas deux ISV

Le cerveau reste les tools scriptés (`audit_deal`, `next_question`, `objection_map`). Deux clients du même cerveau :

| Client | Pour qui | v1 |
| --- | --- | --- |
| **App 3xrep** (OAuth HubSpot) | L’AE, l’ops | Oui. C’est le produit. |
| **MCP 3xrep** | Ops / HoS déjà dans Claude Code | Oui, même tools. Pas le pitch AE. |
| App card HubSpot native | L’AE, dans la sidebar | Dès que la page deal marche. Même API. |
| Salesforce (OAuth, puis Agentforce) | Même app | Après HubSpot. Pas de LWC v1. |

On **lit** le CRM via OAuth au moment du clic. Comment on y arrive depuis le MCP : [chemin.md](chemin.md).

## Comment l’AE clique — du plus simple au plus natif

Une extension HubSpot *distribuée par toi* (app publique / lien d’install) marche sur Pro, pas seulement Enterprise. Une UI extension *privée dans leur portail* exige Enterprise — on ne fait pas ça.

Plus simple qu’une app Marketplace le jour 1 :

1. **Lien sur la fiche** — propriété HubSpot `3xrep` = `https://3xrep.com/deal/{id}` (workflow ou snippet). Ils cliquent, OAuth une fois, les 4 actions. Tous les plans HubSpot, y compris Starter. C’est déjà un bouton.
2. **Page `/pipeline`** dans la même app — l’ops, le matin, dans le navigateur. Pas Claude Code.
3. **App card HubSpot** (sidebar deal) — tu la build dans un *developer account*, ils installent. Quatre boutons natifs : Audit, Mail, Plan, Prep. Même backend que (1). C’est le SKU « on dirait une extension ».
4. Chrome extension = plan B si le listing HubSpot traîne. Pas le chemin principal : l’IT les bloque, Salesforce Lightning casse.

Salesforce v1 : même page, second OAuth. Pas une deuxième extension.

## Les 4 actions (sur le deal)

Remplacé. Un bouton, une [sortie](sortie.md). Mail / plan = actions sous le debrief, pas des écrans séparés.

## Mail — qui parle

« Un agent chez eux » = idéal si leur HubSpot Agent Hub / Agentforce appelle notre MCP : *leur* LLM, *notre* cerveau, *leur* crédits. Setup admin, pas v1 pour tout le monde.

v1 dans l’app 3xrep : le cerveau sort le geste ; un brouillon est assemblé (playbook + LLM **borné**, pas unlimited à nos frais). 99 € + drafts LLM illimités = kill marge. Ils relisent et envoient.

## `/pipeline`

Reste. Il vit sur `3xrep.com/pipeline` après OAuth, lancé par l’ops. Claude Code peut appeler les mêmes tools. Ce n’est plus le seul trigger.

## Interdit

Webhook à chaque activité. Carte *privée* à builder dans *leur* Enterprise. Deux ISV HubSpot + Salesforce le même mois. `probability_to_win`. 3xrep envoie le mail. Audit automatique. Promettre Breeze Copilot (le copilote natif n’appelle pas un MCP custom).
