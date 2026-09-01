# Chemin — du MCP hors CRM au bouton dans le CRM

**V0 = on ne prend pas ce chemin.** On reste sur la porte MCP. Voir [v0.md](v0.md).

Ce qui suit est le **V2**, si les AE n’ouvrent jamais Cowork et qu’il faut le debrief sur la fiche HubSpot.

On ne « déménage » pas le MCP dans HubSpot. Le MCP n’est pas un endroit. C’est **une prise** : un LLM appelle `audit_deal`. La carte HubSpot n’est pas un LLM. Elle n’a pas besoin de MCP. Elle a besoin du **même cerveau**, derrière une autre porte.

## Les deux portes, un process

```
Cerveau (playbooks + audit_deal / next_question / objection_map)
    ├── porte MCP     → Claude Code, Codex          (ops geek)
    └── porte HTTP    → POST /debrief               (AE, carte HubSpot)
```

Aujourd’hui (schéma PRD) : Claude lit le CRM via **le MCP HubSpot**, puis appelle **le MCP 3xrep**. 3xrep ne parle pas à HubSpot.

Dans le CRM : la carte a déjà le `dealId`. Ton app a un OAuth HubSpot. Au clic, **3xrep lit la fiche** (transcript, boîte, contacts, notes), tourne le cerveau, renvoie l’objet [sortie.md](sortie.md). La carte l’affiche. Option : écrire une note sur le deal.

Ce n’est plus « on ne touche pas leur CRM ». C’est : on lit au clic. On n’enregistre pas. On n’envoie pas le mail.

## Les 4 builds, dans l’ordre

| # | Quoi | Pour qui | Ce que ça débloque |
| --- | --- | --- | --- |
| 1 | Le cerveau en fonctions. Même contrat de sortie que [sortie.md](sortie.md). | Toi | Rien de visible. Sans ça, les portes sont vides. |
| 2 | Porte MCP. Custom connector Claude. | Ops geek | Le PRD d’origine. On ne le jette pas. |
| 3 | App HubSpot (OAuth lecture deals + engagements). `POST /debrief`. | Install org | 3xrep sait lire **ce** deal. |
| 4 | App card, un bouton **Débriefer ce call**. HubSpot passe le `dealId`. | L’AE | Le geste. Ils ne quittent pas la fiche. |

Le lien `3xrep.com/deal/{id}` = le #3 sans le #4. Boot d’install, pas l’usage.

## Ce qu’on ne fait pas pour « entrer dans le CRM »

Brancher le MCP 3xrep dans Agent Hub / Breeze et espérer que leur agent écrive la [sortie](sortie.md). Ça, c’est **leur** LLM, **leur** crédits, **leur** prose. Plus tard, si l’admin le veut (même URL MCP que #2). Pas le v1 : on ne contrôle pas les cinq blocs.

Salesforce : même #1–#3, OAuth SF. Carte / Agentforce = après.

## Test

Le chemin est bon quand un AE, dans HubSpot, sur un deal qui a un transcript, appuie une fois et lit le debrief **sans ouvrir Claude**.
