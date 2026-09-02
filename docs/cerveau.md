# Le cerveau — comment il fonctionne

**Pas figé.** 2 septembre 2026. Demande d’Édouard : structurer le **fonctionnement** du cerveau avant d’y verser le knowledge.

Ce fichier ne remplit rien. Il dit : quelles pièces, qui gagne sur qui, dans quel ordre ça tourne, et quel formulaire on remplira ensuite. Correction de [differentiel.md](differentiel.md) (voir §9). Ne casse pas [prd.md](prd.md) / [sortie.md](sortie.md) / [icp.md](icp.md) / [contournement.md](contournement.md).

## 1. En une image

```
    l’AE parle à SON agent (Claude / ChatGPT / Notion)
                      │
          geste demandé + ce que le CRM a
                      ▼
┌─────────────────────────────────────────────┐
│  MOTEUR 3xrep — 7 étages, déterministe      │
│                                             │
│   GESTES ─── quoi faire (débrief, pipe…)    │
│      │       ne contient aucune méthode     │
│      ▼                                      │
│   BIBLIOTHÈQUE ─ les pièces de méthode      │
│      │           profondes, exécutables     │
│      ▼                                      │
│   ANGLE ─────── le VP. Des règles.          │
│                 Parle 2 fois : il challenge │
│                 puis il garde la sortie.    │
└─────────────────────────────────────────────┘
                      ▼
        un verdict (JSON), pas de la prose
                      ▼
    leur LLM habille → sortie.md dans leur chat
```

Trois pièces, un moteur. **Hiérarchie : l’angle gagne sur la bibliothèque, la bibliothèque gagne sur le geste.** Un geste ne peut pas demander une sortie que l’angle interdit.

## 2. Les trois pièces

### 2.1 La bibliothèque — les méthodes, en profondeur

La meilleure logique commerciale du monde, écrite pour être **exécutée**, pas récitée. C’est l’actif qui se compose. C’est là que va le knowledge.

L’unité n’est pas « MEDDIC ». C’est **la pièce** : un point du dossier qui peut être tenu ou vide. MEDDIC, BANT, BEBEDC sont des **noms** que plusieurs écoles donnent à la même pièce. On garde les trois. On n’en choisit pas une bonne. ([methodes.md](methodes.md) reste le lexique.)

Trois niveaux dans chaque pièce :

| Niveau | Contenu | Qui s’en sert |
| --- | --- | --- |
| **1. Exécutable** | Ce qui compte comme preuve, ce qui *ressemble* à une preuve, la question qui teste, comment le deal meurt sans | Le moteur, à chaque appel |
| **2. Le pourquoi** | Psycho, humain, ce que ça change lundi | Renvoyé dans le verdict si l’AE demande « pourquoi » — pas inventé par le LLM |
| **3. Les variantes** | Cycle court / long, secteur, taille, étage en face | Plus tard |

**La profondeur sert à refuser, pas à réciter.** Un skill MEDDIC sait dire ce qu’est un Economic Buyer. Notre pièce sait dire : « l’ops a dit *c’est moi qui décide* » n’est **pas** une preuve — c’est une fausse preuve connue, cataloguée, avec la phrase qui la démasque. Ça ne se scrape pas. C’est le métier d’Édouard.

### 2.2 L’angle — le VP Sales

Pas un ton. Pas « sois dur » dans un prompt : le modèle se ramollit dès qu’il veut être utile.

Des **règles**, dans le serveur, qui tournent sur les données. Exemples (le contenu se remplit après) : un dire n’est pas une preuve · une case verte sans source est vide · jamais un verbatim absent de l’entrée · on nomme comment ça meurt, jamais une proba de close · un seul objectif · le 7/10 note le call, pas la personne.

**L’angle parle deux fois.** C’est le cœur du truc :

1. **Quand tu lui racontes** (étage 4) — il attaque ce que l’AE croit. C’est là que vivent les 5 pourquoi, appliqués à l’AE, pas au prospect.
2. **Quand il te rend** (étage 7) — il coupe tout bloc qui viole une règle. Pas de deuxième essai « plus gentil ». Le bloc disparaît.

### 2.3 Les gestes — peu nombreux, vides de méthode

Ce qu’Édouard appelle les skills. **On n’empile pas.** Un geste = un moment réel : le débrief après un call, la pipe review du lundi, la prépa du prochain rdv, l’objection qui tombe, la négo.

Un geste tient en ~20 lignes. Il dit : quel déclencheur, quelles **familles** de pièces appeler, quel contrat de sortie, quel grade minimum ([contournement.md](contournement.md)). Il ne contient **aucune** méthode. Il ne juge rien.

Conséquence utile : un geste peut se publier en `SKILL.md` dans les annuaires (distribution) — il est **vide sans notre MCP**. On ne donne pas la bibliothèque en le publiant.

## 3. Le moteur — les 7 étages

Ce qui tourne à chaque appel. `audit_deal` = le chemin complet. `next_question` s’arrête à 6. `objection_map` entre à 3 avec l’objection comme point de départ. Toujours les 3 tools du PRD.

| # | Étage | Le serveur fait | Leur LLM fait |
| --- | --- | --- | --- |
| 1 | **Cadrer** | Choisit les pièces selon geste + étape + layer 0/1/2 | Rien |
| 2 | **Établir les faits** | Vérifie que chaque citation existe dans l’entrée | Extrait et propose |
| 3 | **Passer les pièces** | Tenu / supposé / vide / contredit | Propose le rattachement |
| 4 | **Challenger** | Applique l’angle, dégrade | Rien |
| 5 | **Chaîner la mort** | Ordonne : qui tue le plus tôt | Rien |
| 6 | **Choisir un geste** | Un. Le plus falsifiable cette semaine | Rien |
| 7 | **Rendre + garder** | Assemble le verdict, coupe l’interdit | Habille en français |

**1. Cadrer.** On ne passe pas 40 pièces à chaque fois. Un premier prospect (layer 0) n’a pas de process papier. Un cycle court n’a pas de comité. Le geste + la forme du deal décident du jeu de pièces. C’est ce qui évite la checklist de sigles.

**2. Établir les faits.** Deux bacs : les **faits** (une phrase, une source — mail, call, note) et les **claims** (une affirmation sans source : l’AE qui dit « Julien est notre champion », ou une case CRM cochée). Règle mécanique : une citation qui n’est pas *littéralement* dans l’entrée est rejetée par le serveur. C’est comme ça qu’on ne peut pas inventer la réplique — pas parce qu’on l’a demandé gentiment.

**3. Passer les pièces.** Chaque pièce sélectionnée devient une question fermée posée aux faits. Quatre réponses : `tenu` (preuve valide), `supposé` (un claim, rien derrière), `vide` (rien), `contredit` (un fait dit l’inverse). Pas de note, pas de %.

**4. Challenger.** L’angle reprend tous les `tenu` et `supposé` et essaie de les casser, avec le niveau 1 de la bibliothèque : la preuve est-elle une preuve, ou une **fausse preuve** cataloguée ? Qui d’autre dirait exactement la même phrase ? (Un coach dit la même chose qu’un champion : la phrase ne prouve rien.) Les 5 pourquoi s’arrêtent dès qu’on touche un fait, ou au 3ᵉ cran. Sortie : des statuts **dégradés**, avec la raison.

**5. Chaîner la mort.** Chaque pièce vide porte son mode de mort (à quel étage, à quel moment, avec quelle phrase). Le moteur les ordonne : **qui tue le plus tôt**. Un dossier avec 8 trous n’a pas 8 problèmes — il en a un qui arrive avant les autres. C’est là que le cerveau bat une checklist qui rend 8 lignes à plat.

**6. Choisir un geste.** Un seul. Critères : la pièce qui tue le plus tôt, testable **cette semaine**, et qui débloque les autres (le critère d’achat ne sert à rien tant qu’on ne sait pas qui tranche). Les deux suivantes deviennent le plan 1.2.3 de [sortie.md](sortie.md).

**7. Rendre et garder.** Le verdict est assemblé, puis strippé : grade B ou C sans verbatim → le 7/10 du call et la réplique **disparaissent** ([contournement.md](contournement.md)). La garde bloque : proba, promesse de close, citation non vérifiée, deuxième objectif, flatterie. Bloc supprimé, pas réécrit.

## 4. Où passe la frontière — eux / nous

On ne paie pas de LLM ([prd.md](prd.md) : unlimited possible parce que scripté).

| Chez eux (leur LLM, leurs crédits) | Chez nous (déterministe) |
| --- | --- |
| Lire le CRM, extraire les phrases | Vérifier que la phrase existe |
| Proposer un rattachement | Trancher le statut |
| Écrire le français du debrief | Décider quoi a le droit d’être écrit |

Leur LLM **lit et rédige**. Notre cerveau **juge et interdit**. Le spec d’agent oblige à coller le verdict — il n’a pas le droit d’en écrire un autre.

## 5. Les quatre formulaires à remplir

C’est ça, la structure. Le knowledge, c’est remplir ces cases. Formes indicatives.

**Une pièce de bibliothèque :**

```yaml
id: qui-tranche
famille: dossier
alias: [meddic/economic-buyer, bant/authority, bebedc/decideurs]
question: qui signe le bon de commande sur ce deal
preuve_valide:
  - un nom, une fonction, et une phrase de lui (mail ou call)
  - le process décrit par eux, pas par nous
fausse_preuve:
  - l'ops dit "c'est moi qui décide"   # il décide de l'usage, pas du budget
  - une case CRM remplie sans source
test: "quand ça passe en budget, c'est encore toi qui signes, ou ça remonte ?"
mort:
  etage: signature
  quand: fin de cycle
  phrase: "il faut que j'en parle en interne"
debloque: [criteres-achat, process-papier]
pourquoi: |
  (niveau 2 — psycho, ce que ça change lundi)
```

**Un geste :**

```yaml
id: debrief-apres-call
declencheur: débriefe le call avec X
pieces: [dossier, motivations, enjeu-chiffre]   # familles, pas une liste figée
contrat: sortie.md
grade_min: B    # sous B : on demande le collage, on n'invente pas
```

**Une règle d’angle :**

```yaml
id: un-dire-nest-pas-une-preuve
etage: [4, 7]
exige: une source pour tout statut tenu
si_viole: degrade en suppose
```

**Le verdict** (ce que le tool renvoie) : les pièces avec statut + preuve ou vide + alias, la mort ordonnée, **un** geste, le plan, le grade, ce qui a été strippé et pourquoi.

## 6. La trace — le call Julien

Même cas que [sortie.md](sortie.md), pour voir le moteur tourner.

1. **Cadrer** — geste `debrief-apres-call`, étape découverte, layer 2 (comité). 7 pièces retenues, pas 40.
2. **Faits** — fait : « de toute façon c’est moi qui fais tourner l’outil au quotidien » (transcript, vérifié). Fait : « deux jours perdus par mois » (non chiffré en €). Claim de l’AE : « Julien est notre champion ». Claim CRM : `closing = décembre`.
3. **Pièces** — `qui-tranche` : vide. `champion-vs-coach` : supposé. `enjeu-chiffre` : supposé (des jours, pas des euros). `process-papier` : supposé (« on signe en décembre » = une habitude).
4. **Challenger** — « c’est moi qui fais tourner l’outil » est une **fausse preuve** cataloguée de `qui-tranche` : ça prouve l’usage, pas le budget. Champion → dégradé en coach : un coach dit exactement la même phrase. « Décembre » n’est pas un process, c’est un souvenir.
5. **Mort** — le plus tôt : `qui-tranche`, à la signature, phrase attendue « il faut que j’en parle en interne ». Le reste meurt après.
6. **Geste** — faire nommer par Julien qui signe quand ça passe en budget. Testable cette semaine. Débloque critères et process.
7. **Rendre** — grade A, donc les 5 blocs. La réplique est citée parce qu’elle est dans l’entrée. Objectif : le DAF est dans la pièce en R2.

Sans transcript, mêmes étages : les blocs 1 et 2 tombent à l’étage 7. Le reste tient.

## 7. Pourquoi les agents CRM ne font pas ça

Le vrai concurrent n’est pas un skill. C’est l’agent que le CRM donne **gratuitement** — HubSpot Breeze / Smart Deal Progression (post-call automatique : champs, mail de suite, actions), Salesforce Agentforce (prospection, brief, next best action), Attio AI (résumé, enrichissement).

| | Eux | Nous |
| --- | --- | --- |
| Job | Remplir la fiche, avancer l’étape | Dire que la fiche est vide |
| Sortie | Champs mis à jour, mail, next best action | Un verdict, une mort, un geste |
| Preuve | La donnée du CRM fait foi | Une case sans source est vide |
| Posture | Serviable. Leur produit doit paraître au vert | Dur. Notre produit doit dire non |
| Méthode | Générique, un LLM sur des records | Bibliothèque exécutable, versionnée |

**Ils ne peuvent pas être durs.** Un CRM ne vend pas « ton pipe est faux » — son écran doit être au vert et son agent doit rendre l’outil agréable. Nous, on n’a pas de fiche à défendre. C’est l’écart structurel, pas une histoire de meilleur prompt.

Ils ne sont pas l’ennemi non plus : ils remplissent le CRM, donc ils nous **fabriquent la matière**. Smart Deal Progression pose un recap sur la fiche → notre grade A arrive tout seul ([contournement.md](contournement.md)). On les laisse capturer. On juge.

## 8. Ce qu’on remplit ensuite (pas maintenant)

Ordre, quand la structure est validée :

1. Les ~7 pièces du cas Julien, niveau 1 seulement.
2. Un geste (`debrief-apres-call`).
3. Les règles d’angle du contrat [sortie.md](sortie.md).
4. Niveau 2 (le pourquoi) sur ces 7 pièces. Puis on élargit **quand un vrai deal le demande**, jamais pour compléter une grille.

**Règle d’admission :** une pièce ne part pas sans ses quatre cases (preuve valide, fausse preuve, test, mort). Une pièce sans fausse preuve n’a aucune valeur — c’est une définition, et les définitions sont gratuites sur internet.

## 9. Écarts avec differentiel.md

- « Compilateur, **pas** une bibliothèque » → mal dit. C’est **une bibliothèque profonde + un angle + un moteur**. La bibliothèque est l’actif.
- Le « kernel d’atomes » ne remplace pas les méthodes. C’est l’**index** : la pièce, que plusieurs méthodes nomment.
- « On ne shippe pas de skill » → trop large. On ne shippe pas de skill **qui contient la méthode**. Des gestes vides qui appellent le MCP, oui : c’est de la distribution.

## 10. Interdits (inchangés)

Pas de stockage de contenu. Pas de proba de close. Pas de `write_to_crm`. Pas d’enregistrement. Pas de citation inventée. Pas de score /100. Pas une méthode « officielle 3xrep » qui gagne sur les autres.

## 11. Décisions demandées

1. **Les trois pièces + le moteur** : c’est bien ça, le cerveau ?
2. **Hiérarchie angle > bibliothèque > geste** : validée ?
3. **L’angle en règles serveur** (pas en prompt), qui parle deux fois : validé ?
4. **La règle d’admission** (pas de fausse preuve, pas de pièce) : on tient ? C’est elle qui rend le remplissage lent et bon.
5. **Les gestes publiables** en annuaire, vides sans le MCP : ok ?

Après ces cinq oui, on remplit. Pas avant : sinon on écrit 40 fichiers dans une forme qui bouge.
