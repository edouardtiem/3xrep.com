# Le cerveau — comment il fonctionne

**Figé.** 2 septembre 2026. Validé par Édouard : les six décisions du §12 sont prises. Gagne sur [prd.md](prd.md) §9 pour la **mécanique** du cerveau. Ne casse pas [sortie.md](sortie.md) / [icp.md](icp.md) / [contournement.md](contournement.md) / [v0.md](v0.md).

Ne pas « améliorer » sans casser ce fichier. On y ajoute du knowledge (§9), on ne rouvre pas la structure.

Ce fichier ne remplit rien. Il dit : quelles pièces, qui gagne sur qui, dans quel ordre ça tourne, et quel formulaire on remplira ensuite. Corrige [differentiel.md](differentiel.md) (voir §10).

## 1. En une image

```
    l’AE parle à SON agent (Claude / ChatGPT / Notion)
                      │
          geste demandé + ce que le CRM a
                      ▼
┌─────────────────────────────────────────────┐
│  MOTEUR 3xrep — 8 étages, déterministe      │
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

Deux catalogues, pas un :

- **Les pièces** — un point du dossier qui peut être tenu ou vide. L’unité n’est pas « MEDDIC » : « qui tranche » est une pièce, et MEDDIC Economic Buyer / BANT Authority / BEBEDC Décideurs en sont trois **noms**. On garde les trois. On n’en choisit pas une bonne. ([methodes.md](methodes.md) reste le lexique.)
- **Les réflexes** — transversaux, indépendants des grilles : *un pronom n’est pas une personne* · *un chiffre raconté n’est pas un chiffre validé* · *une habitude n’est pas un process* · *un accord sans date n’est pas un accord* · *l’usage n’est pas le budget*. Une pièce **pointe** vers des réflexes. C’est ce qui rend le commercial meilleur au deal suivant, pas seulement sur celui-là.

Trois niveaux dans chaque pièce :

| Niveau | Contenu | Qui s’en sert |
| --- | --- | --- |
| **1. Exécutable** | Preuve valide · fausse preuve · question qui teste · comment ça meurt · **les perches** (par quoi l’info se laisse attraper) · **l’échelle** (creuser à 3 crans, et ce que chaque cran donne) | Le moteur, à chaque appel |
| **2. Le pourquoi** | Psycho, humain, ce que ça change lundi | Renvoyé dans le verdict si l’AE demande « pourquoi » — pas inventé par le LLM |
| **3. Les variantes** | Cycle court / long, secteur, taille, étage en face | Plus tard |

**La profondeur sert à deux choses : refuser, et remonter.**

*Refuser* — un skill MEDDIC sait dire ce qu’est un Economic Buyer. Notre pièce sait dire : « l’ops a dit *c’est moi qui décide* » n’est **pas** une preuve — c’est une fausse preuve cataloguée, avec la phrase qui la démasque.

*Remonter* — la pièce sait aussi **par où l’info passait** : quelle phrase du prospect était la porte, quel réflexe l’ouvrait, et ce qu’on trouvait à trois crans en dessous. Sans ça, on rend « Budget vide », c’est-à-dire rien. C’est l’étage 6 du moteur (§3) et la passe systématique (§7).

Ça ne se scrape pas. C’est le métier d’Édouard.

### 2.2 L’angle — le VP Sales

Pas un ton. Pas « sois dur » dans un prompt : le modèle se ramollit dès qu’il veut être utile.

Des **règles**, dans le serveur, qui tournent sur les données. Exemples (le contenu se remplit après) : un dire n’est pas une preuve · une case verte sans source est vide · jamais un verbatim absent de l’entrée · on nomme comment ça meurt, jamais une proba de close · un seul objectif · le 7/10 note le call, pas la personne.

**L’angle parle deux fois.** C’est le cœur du truc :

1. **Quand tu lui racontes** (étage 4) — il attaque ce que l’AE croit. C’est là que vivent les 5 pourquoi, appliqués à l’AE, pas au prospect.
2. **Quand il te rend** (étage 8) — il coupe tout bloc qui viole une règle. Pas de deuxième essai « plus gentil ». Le bloc disparaît.

### 2.3 Les gestes — peu nombreux, vides de méthode

Ce qu’Édouard appelle les skills. **On n’empile pas.** Un geste = un moment réel : le débrief après un call, la passe systématique sur un deal qui cale (§7), la pipe review du lundi, la prépa du prochain rdv, l’objection qui tombe, la négo.

Un geste tient en ~20 lignes. Il dit : quel déclencheur, quelles **familles** de pièces appeler, quel contrat de sortie, quel grade minimum ([contournement.md](contournement.md)). Il ne contient **aucune** méthode. Il ne juge rien.

Conséquence utile : un geste peut se publier en `SKILL.md` dans les annuaires (distribution) — il est **vide sans notre MCP**. On ne donne pas la bibliothèque en le publiant.

## 3. Le moteur — les 8 étages

Ce qui tourne à chaque appel. `audit_deal` = le chemin complet. `next_question` s’arrête à 7. `objection_map` entre à 3 avec l’objection comme point de départ. Toujours les 3 tools du PRD.

| # | Étage | Le serveur fait | Leur LLM fait |
| --- | --- | --- | --- |
| 1 | **Cadrer** | Choisit les pièces selon geste + étape + layer 0/1/2 | Rien |
| 2 | **Établir les faits** | Vérifie chaque citation, range en frise chronologique | Extrait et propose |
| 3 | **Passer les pièces** | Tenu / supposé / vide / contredit | Propose le rattachement |
| 4 | **Challenger** | Applique l’angle, dégrade | Rien |
| 5 | **Chaîner la mort** | Ordonne : qui tue le plus tôt | Rien |
| 6 | **Remonter** | Pour **chaque** trou : la fenêtre ratée, le réflexe, l’échelle, le gain, le coût du retard | Rien |
| 7 | **Choisir un geste** | Un. Le plus falsifiable cette semaine | Rien |
| 8 | **Rendre + garder** | Assemble le verdict, coupe l’interdit | Habille en français |

**1. Cadrer.** On ne passe pas 40 pièces à chaque fois. Un premier prospect (layer 0) n’a pas de process papier. Un cycle court n’a pas de comité. Le geste + la forme du deal décident du jeu de pièces. C’est ce qui évite la checklist de sigles.

**2. Établir les faits.** Deux bacs : les **faits** (une phrase, une source — mail, call, note) et les **claims** (une affirmation sans source : l’AE qui dit « Julien est notre champion », ou une case CRM cochée). Règle mécanique : une citation qui n’est pas *littéralement* dans l’entrée est rejetée par le serveur. C’est comme ça qu’on ne peut pas inventer la réplique — pas parce qu’on l’a demandé gentiment.

Les faits sont rangés **dans l’ordre où ils ont été dits**. Sans cette frise, l’étage 6 ne peut pas exister : on ne sait pas *à quel moment* l’info passait.

**3. Passer les pièces.** Chaque pièce sélectionnée devient une question fermée posée aux faits. Quatre réponses : `tenu` (preuve valide), `supposé` (un claim, rien derrière), `vide` (rien), `contredit` (un fait dit l’inverse). Pas de note, pas de %.

**4. Challenger.** L’angle reprend tous les `tenu` et `supposé` et essaie de les casser, avec le niveau 1 de la bibliothèque : la preuve est-elle une preuve, ou une **fausse preuve** cataloguée ? Qui d’autre dirait exactement la même phrase ? (Un coach dit la même chose qu’un champion : la phrase ne prouve rien.) Les 5 pourquoi s’arrêtent dès qu’on touche un fait, ou au 3ᵉ cran. Sortie : des statuts **dégradés**, avec la raison.

**5. Chaîner la mort.** Chaque pièce vide porte son mode de mort (à quel étage, à quel moment, avec quelle phrase). Le moteur les ordonne : **qui tue le plus tôt**. Un dossier avec 8 trous n’a pas 8 problèmes — il en a un qui arrive avant les autres. C’est là que le cerveau bat une checklist qui rend 8 lignes à plat.

**6. Remonter.** L’étage que réclame Édouard, et le plus dur à copier. Pour **chaque** trou, le moteur repasse la frise de l’étage 2 et cherche les **perches** de la pièce : les moments où l’info se laissait attraper. Il produit cinq choses, jamais « il te manque X » :

| | |
| --- | --- |
| **La fenêtre** | Le moment exact, avec la phrase qu’il a dite. Vérifiée, jamais inventée. |
| **Le réflexe** | Ce qu’un VP aurait fait en entendant ça. Transversal, réutilisable au prochain deal. |
| **L’échelle** | Les 3 crans de creusage, et **ce que chaque cran donne**. |
| **Le gain** | Ce que tu aurais su, et ce que tu aurais pu **faire** dans le call à ce moment-là. |
| **Le coût du retard** | Ce que ça coûte de l’obtenir maintenant plutôt que là. |

Si aucune perche n’existe dans la frise, on le dit : **l’info n’était pas atteignable dans ce call**, il faut la provoquer — et où. On ne fabrique pas un reproche pour avoir l’air sévère.

**7. Choisir un geste.** Un seul. Critères : la pièce qui tue le plus tôt, testable **cette semaine**, et qui débloque les autres (le critère d’achat ne sert à rien tant qu’on ne sait pas qui tranche). Les deux suivantes deviennent le plan 1.2.3 de [sortie.md](sortie.md).

**8. Rendre et garder.** Le verdict est assemblé, puis strippé : grade B ou C sans verbatim → le 7/10 du call et la réplique **disparaissent** ([contournement.md](contournement.md)). La garde bloque : proba, promesse de close, citation non vérifiée, deuxième objectif, flatterie. Bloc supprimé, pas réécrit.

## 4. Où passe la frontière — eux / nous

On ne paie pas de LLM ([prd.md](prd.md) : unlimited possible parce que scripté).

| Chez eux (leur LLM, leurs crédits) | Chez nous (déterministe) |
| --- | --- |
| Lire le CRM, extraire les phrases | Vérifier que la phrase existe |
| Proposer un rattachement | Trancher le statut |
| Écrire le français du debrief | Décider quoi a le droit d’être écrit |

Leur LLM **lit et rédige**. Notre cerveau **juge et interdit**. Le spec d’agent oblige à coller le verdict — il n’a pas le droit d’en écrire un autre.

## 5. Les cinq formulaires à remplir

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
perches:                       # par où l'info se laissait attraper
  - signal: il revendique l'usage quotidien
    exemple: "c'est moi qui fais tourner l'outil"
    reflexe: usage-nest-pas-budget
  - signal: pronom flou sur la décision
    exemple: "après il faut que ça passe en interne"
    reflexe: pronom-nest-pas-personne
echelle:                       # creuser, et ce que ça donne
  - cran: 1
    question: "quand ça passe en budget, c'est toi qui signes ?"
    donne: un nom, ou l'aveu que ça remonte
  - cran: 2
    question: "la dernière fois que vous avez acheté un outil comme ça, ça s'est passé comment ?"
    donne: le process réel, pas le process déclaré
  - cran: 3
    question: "qui a dit non la dernière fois, et sur quoi ?"
    donne: le critère du DAF, et l'objection qui arrivera
gain:
  savoir: le nom et le critère de celui qui tranche
  faire: convier le DAF séance tenante, tant qu'il est en confiance
cout_du_retard: une relance à motiver, et l'invitation se négocie maintenant
debloque: [criteres-achat, process-papier]
pourquoi: |
  (niveau 2 — psycho, ce que ça change lundi)
```

**Un réflexe** (transversal, pointé par les pièces) :

```yaml
id: usage-nest-pas-budget
quand: quelqu'un revendique l'usage quotidien de l'outil
alors: séparer qui s'en sert de qui paie, dans la phrase suivante
piege: prendre l'enthousiasme de l'ops pour de l'autorité
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

**Le verdict** (ce que le tool renvoie) : les pièces avec statut + preuve ou vide + alias, la mort ordonnée, **la remontée par trou** (fenêtre, réflexe, échelle, gain, coût du retard), **un** geste, le plan, le grade, ce qui a été strippé et pourquoi.

## 6. La trace — le call Julien

Même cas que [sortie.md](sortie.md), pour voir le moteur tourner.

1. **Cadrer** — geste `debrief-apres-call`, étape découverte, layer 2 (comité). 7 pièces retenues, pas 40.
2. **Faits** — fait : « de toute façon c’est moi qui fais tourner l’outil au quotidien » (transcript, vérifié). Fait : « deux jours perdus par mois » (non chiffré en €). Claim de l’AE : « Julien est notre champion ». Claim CRM : `closing = décembre`.
3. **Pièces** — `qui-tranche` : vide. `champion-vs-coach` : supposé. `enjeu-chiffre` : supposé (des jours, pas des euros). `process-papier` : supposé (« on signe en décembre » = une habitude).
4. **Challenger** — « c’est moi qui fais tourner l’outil » est une **fausse preuve** cataloguée de `qui-tranche` : ça prouve l’usage, pas le budget. Champion → dégradé en coach : un coach dit exactement la même phrase. « Décembre » n’est pas un process, c’est un souvenir.
5. **Mort** — le plus tôt : `qui-tranche`, à la signature, phrase attendue « il faut que j’en parle en interne ». Le reste meurt après.
6. **Remonter** — la fenêtre de `qui-tranche` est la phrase sur l’outil quotidien ; réflexe `usage-nest-pas-budget` ; à trois crans, le critère du DAF ; le gain perdu : le convier séance tenante. Idem pour chaque autre trou — détail en §7.
7. **Geste** — faire nommer par Julien qui signe quand ça passe en budget. Testable cette semaine. Débloque critères et process.
8. **Rendre** — grade A, donc les 5 blocs. La réplique est citée parce qu’elle est dans l’entrée. Objectif : le DAF est dans la pièce en R2.

Sans transcript, mêmes étages : les blocs 1 et 2 tombent à l’étage 8. Le reste tient.

## 7. La passe systématique — l’autopsie du dossier

Geste à part : `passe-trous`. Le débrief de [sortie.md](sortie.md) reste court (une fenêtre, la plus chère, trois verrous). La passe, elle, prend **tous** les trous. À la demande, ou quand un deal cale, ou en pipe review. Pas après chaque call : ce serait un cours.

**Ce que ce n’est pas :** « Budget vide. Décideurs vide. » Ça, n’importe quelle grille le fait, et ça n’apprend rien.

**Ce que c’est :** par trou, la remontée de l’étage 6. Exemple sur le call Julien, en BEBEDC (forme, pas un cas client) :

> **Décideurs — vide.**
> *La fenêtre.* « De toute façon c’est moi qui fais tourner l’outil au quotidien. » Tu as enchaîné sur le rollout. C’était la porte.
> *Le réflexe.* L’usage n’est pas le budget. Quand quelqu’un revendique l’usage, tu sépares qui s’en sert de qui paie — dans la phrase d’après, pas dix minutes plus tard.
> *L’échelle.* 1) « Quand ça passe en budget, c’est toi qui signes ? » → un nom, ou l’aveu que ça remonte. 2) « La dernière fois que vous avez acheté un outil comme ça, ça s’est passé comment ? » → le process réel. 3) « Qui a dit non la dernière fois, et sur quoi ? » → le critère du DAF, et l’objection qui arrive.
> *Le gain.* Tu avais le nom **et** son critère. Tu pouvais le convier séance tenante, pendant que Julien était en confiance.
> *Le coût du retard.* Maintenant l’invitation a besoin d’un motif, et elle se négocie.
>
> **Budget — vide.**
> *La fenêtre.* « Deux jours perdus par mois. » Tu l’as pris pour de l’enjeu. C’était aussi la porte du budget : un chiffre l’ouvre.
> *Le réflexe.* Un chiffre raconté n’est pas un chiffre validé. Tu le fais convertir par **lui**, à voix haute.
> *L’échelle.* 1) « Deux jours de qui, à quel coût chargé ? » → un montant. 2) « Sur un an ça fait tant — c’est un budget qui existe déjà quelque part ? » → ligne budgétaire, ou pas. 3) « Si ce n’est pas budgété, qui arbitre, et quand ? » → on retombe sur Décideurs et Échéance.
> *Le gain.* Le coût de l’inaction en euros, dit par lui. L’objection prix devient une soustraction.
> *Le coût du retard.* Le chiffre que tu poses toi après coup ne vaut pas celui qu’il a dit.
>
> **Concurrents — vide, pas de fenêtre.** Rien dans ce call ne l’ouvrait. À provoquer au prochain, juste après le chiffre : « à part nous, vous regardez quoi — y compris ne rien faire ? »

Trois choses que ça donne, qu’une liste de cases ne donne pas :

1. **Le chaînage.** Budget et Décideurs ne sont pas deux trous : c’est un trou et sa conséquence. Le cran 3 de Budget retombe sur Décideurs. La passe le dit, et l’ordre suit la mort (étage 5), pas l’ordre des lettres de la grille.
2. **Le réflexe, pas l’info.** L’info sert ce deal. Le réflexe sert les suivants. C’est là qu’on entraîne, sans faire un cours — ce que le terrain visait, obtenu sur un vrai dossier.
3. **L’honnêteté.** Un trou sans fenêtre est marqué « pas atteignable ici ». On ne fabrique pas un remords.

**Plus tard, pas V0 :** si on stocke l’identifiant du réflexe raté (jamais le contenu — [contournement.md](contournement.md)), on peut dire « tu loupes cette porte pour la quatrième fois ». C’est le VP qui se souvient. Il faut d’abord que la passe soit vraie sur un call.

## 8. Pourquoi les agents CRM ne font pas ça

Le vrai concurrent n’est pas un skill. C’est l’agent que le CRM donne **gratuitement** — HubSpot Breeze / Smart Deal Progression (post-call automatique : champs, mail de suite, actions), Salesforce Agentforce (prospection, brief, next best action), Attio AI (résumé, enrichissement).

| | Eux | Nous |
| --- | --- | --- |
| Job | Remplir la fiche, avancer l’étape | Dire que la fiche est vide |
| Sortie | Champs mis à jour, mail, next best action | Un verdict, une mort, une remontée, un geste |
| Le manque | « Champ Décideur : à compléter » | Le moment où tu l’avais, et le réflexe |
| Preuve | La donnée du CRM fait foi | Une case sans source est vide |
| Posture | Serviable. Leur produit doit paraître au vert | Dur. Notre produit doit dire non |
| Méthode | Générique, un LLM sur des records | Bibliothèque exécutable, versionnée |

**Ils ne peuvent pas être durs.** Un CRM ne vend pas « ton pipe est faux » — son écran doit être au vert et son agent doit rendre l’outil agréable. Nous, on n’a pas de fiche à défendre. C’est l’écart structurel, pas une histoire de meilleur prompt.

Ils ne sont pas l’ennemi non plus : ils remplissent le CRM, donc ils nous **fabriquent la matière**. Smart Deal Progression pose un recap sur la fiche → notre grade A arrive tout seul ([contournement.md](contournement.md)). On les laisse capturer. On juge.

## 9. Ce qu’on remplit ensuite (pas maintenant)

Ordre, quand la structure est validée :

1. Les ~10 réflexes transversaux. Ils sont réutilisés par toutes les pièces : les écrire d’abord évite de les recopier dix fois.
2. Les ~7 pièces du cas Julien, niveau 1 seulement — perches et échelle comprises.
3. Deux gestes : `debrief-apres-call` et `passe-trous`.
4. Les règles d’angle du contrat [sortie.md](sortie.md).
5. Niveau 2 (le pourquoi) sur ces 7 pièces. Puis on élargit **quand un vrai deal le demande**, jamais pour compléter une grille.

**Règle d’admission :** une pièce ne part pas sans ses six cases — preuve valide, fausse preuve, test, mort, **perches**, **échelle à 3 crans**. Sans fausse preuve, c’est une définition, et les définitions sont gratuites sur internet. Sans perche ni échelle, on sait dire qu’il manque quelque chose sans savoir où on l’a perdu : c’est exactement le produit qu’on ne veut pas.

C’est cette règle qui rend le remplissage lent. C’est voulu : c’est elle, le moat.

## 10. Écarts avec differentiel.md

- « Compilateur, **pas** une bibliothèque » → mal dit. C’est **une bibliothèque profonde + un angle + un moteur**. La bibliothèque est l’actif.
- Le « kernel d’atomes » ne remplace pas les méthodes. C’est l’**index** : la pièce, que plusieurs méthodes nomment.
- « On ne shippe pas de skill » → trop large. On ne shippe pas de skill **qui contient la méthode**. Des gestes vides qui appellent le MCP, oui : c’est de la distribution.

## 11. Interdits (inchangés)

Pas de stockage de contenu. Pas de proba de close. Pas de `write_to_crm`. Pas d’enregistrement. Pas de citation inventée. Pas de score /100. Pas une méthode « officielle 3xrep » qui gagne sur les autres. Pas de fenêtre ratée inventée pour avoir l’air sévère.

## 12. Décisions prises (2 septembre 2026, Édouard)

Gravé. On ne les rejoue pas.

1. **Le cerveau = trois pièces + un moteur.** Bibliothèque, angle, gestes.
2. **Hiérarchie : angle > bibliothèque > geste.** Un geste ne peut pas demander une sortie que l’angle interdit.
3. **L’angle est un jeu de règles serveur**, pas un ton dans un prompt. Il parle deux fois : étage 4, étage 8.
4. **Règle d’admission : six cases par pièce** — preuve valide, fausse preuve, test, mort, perches, échelle à 3 crans. Une pièce incomplète ne part pas. C’est le moat, et c’est pour ça que le remplissage est lent.
5. **Les gestes sont publiables** en annuaire : vides sans le MCP.
6. **La passe systématique est un geste à part** (`passe-trous`). Le débrief quotidien reste [sortie.md](sortie.md), court.

Reste ouvert (pas une décision de structure) : la mémoire du jugement (§7, plus tard, identifiant de réflexe seulement, jamais de contenu).

Suite : remplir, dans l’ordre du §9.
