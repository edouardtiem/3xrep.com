# Contournement — pas de transcript sur la fiche

Figé. 1er septembre 2026, soir. Complète [v0.md](v0.md) et [sortie.md](sortie.md). Gagne sur le PRD §7.4 pour *ce* geste. Pas un deuxième produit.

## Problème

Le debrief de [sortie.md](sortie.md) a besoin d’une réplique. « Tu aurais pu coller après qu’il ait dit Y. » Sans verbatim, ce bloc est un cours, ou un mensonge.

La plupart des équipes 2–15 n’ont pas Gong. Elles n’ont pas HubSpot Conversation Intelligence (Sales/Service Hub Pro). Le CRM a un deal, parfois un mail, rarement le call.

Si on exige le transcript sur la fiche le jour 1 : personne ne connecte.
Si on enregistre nous-mêmes : on est un Gong. Interdit.
Si on leur fait coller le transcript *chez 3xrep* tous les jours : ça meurt. Interdit (PRD §7.4).
Si on invente la réplique à partir de notes vagues : une case verte sans preuve. Interdit ([icp.md](icp.md)).

## Contournement

On ne capture pas. On **dégrade** l’entrée. On refuse d’inventer.

Deux MCP, deux jobs. 3xrep = cerveau (lecture + score). Le MCP CRM **du client** = data + écriture. Pas de tool `write_to_crm` chez nous.

L’admin du workspace branche 3xrep + le MCP HubSpot (ou Salesforce) une fois. Option : un notetaker → CRM (Fireflies, tl;dv, Meet recap, HubSpot CI). Ce n’est pas notre install. Ce n’est pas notre support.

## Trois grades

| Grade | Entrée | Ce que [sortie.md](sortie.md) a le droit de faire |
| --- | --- | --- |
| **A** | Transcript / recap déjà sur le deal | Les 5 blocs. C’est le rituel 99 €. |
| **B** | Mails, notes, meetings, next step sur la fiche | Trous + next move + objectif. Pas de 7/10 du call. Pas de réplique. |
| **C** | Collage **dans leur chat** Cowork / ChatGPT / Notion | Comme A si le texte est un verbatim. Comme B si ce sont des notes. 3xrep ne stocke rien. |

Le collage n’est pas « mets le transcript dans 3xrep ». C’est le message, dans *leur* agent, pour *ce* call.

Ordre, toujours : A si ça existe → sinon demander C → sinon B → sinon « il manque le call / la note ». Jamais inventer Y.

## Flux V0 (Cowork)

L’AE : « débriefe le call avec Julien. »

1. Claude lit le deal via **leur** MCP CRM. Transcript ou recap sur la fiche → grade A. Stop, on ne demande rien.
2. Rien → une phrase : « Colle le recap Meet / le mail Fireflies / tes notes. Je ne les garde pas. »
3. `audit_deal` reçoit `evidence: transcript | notes | emails | chat_paste`. Sortie dans le chat, contrat [sortie.md](sortie.md) selon le grade.
4. Claude propose : « Je pose le debrief en note sur le deal ? » Pas d’écriture silencieuse.
5. Oui → **leur** MCP CRM crée un *note engagement* associé au deal. Option : une tâche (« DAF en R2 »).

C → A pour la fois d’après : la note est sur la fiche. Le collage n’est pas le rituel. C’est le pont.

## Ce qu’on écrit / ce qu’on n’écrit pas

**Oui :** une note = le debrief (call, réplique si on l’a, 3 verrous, plan 1.2.3, objectif). Une tâche optionnelle = le geste qui coûte.

**Non :** le dump brut du transcript (job du notetaker). Les propriétés du deal (stage, montant, champs MEDDIC, proba). Un 7/10 posé sur la fiche partagée sans OK. Un tool 3xrep qui write.

« Update la carte » = la timeline. Pas le pipeline.

Si le MCP CRM refuse l’écriture (scopes, *sensitive data*) : le debrief reste dans le chat. La fiche attend. Ce n’est pas un bug 3xrep.

## Spec d’agent (à coller)

- Tu appelles uniquement les tools 3xrep pour la méthode.
- Tu lis et tu écris le CRM uniquement via le MCP HubSpot / Salesforce de l’utilisateur.
- S’il y a un transcript ou un recap sur le deal, tu t’en sers. Sinon tu demandes de coller. Tu n’inventes pas de réplique.
- Tu n’écris une note (ou une tâche) que s’il le demande, ou après confirmation.

## `audit_deal`

Entrée : `evidence` + le texte (CRM ou collage) + le deal (étape, montant, notes, mails, meetings).

Sans verbatim : sauter le 7/10 du call et la réplique. Sortir les trous + le next move + « recolle le recap, ou le prochain call n’aura pas de preuve ».

Interdit : `probability_to_win`, `write_to_crm`, « tu closes vendredi », une citation qui n’est pas dans l’entrée.

## Ce que ce n’est pas

- Un enregistreur. Pas de bot Zoom/Meet.
- Un tunnel web « colle un deal » sur 3xrep.com.
- Un SKU Layer 0 / un prix plus bas « parce qu’ils n’ont pas Gong ».
- L’install Fireflies / HubSpot CI faite par nous.
- Le V2 (bouton HubSpot, `POST /debrief`). Même cerveau. Autre porte. [chemin.md](chemin.md).

Hors cible inchangé : l’équipe qui refuse de poser ne serait-ce qu’une note. On n’est pas l’enregistreur. [icp.md](icp.md).

## Test

Le contournement est bon quand :

1. Un AE sans transcript sur la fiche colle une fois, lit [sortie.md](sortie.md) dans Cowork.
2. Il dit oui, une note apparaît sur le deal — écrite par **son** MCP CRM, pas par nous.
3. Le call suivant, s’il a branché un notetaker (ou s’il a la note), on ne lui redemande pas le collage.
4. Sans verbatim, aucune fausse réplique.

Si 1 sans 2 : le chat marche, la fiche non — on ne build pas une app HubSpot pour ça (V2).
Si 1 tous les jours sans 3 : le collage est devenu le produit. On arrête. On pousse le notetaker, on ne build pas d’upload 3xrep.
