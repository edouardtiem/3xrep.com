# Méthodes — rattachement

La valeur n’est pas « avoir joué ». La valeur est : **pouvoir rattacher chaque mini-situation à une méthode, ou à une partie de méthode.**

Ça ne fait pas un LMS. Pas de module MEDDIC. Pas de QCM « c’était quelle lettre ? ». [cadrage.md](cadrage.md). [recherche.md](recherche.md) §3.

Le joueur **sent** la case vide dans le deal. Le produit **nomme** ensuite la méthode. S’il sent et qu’il ne peut pas rattacher, la valeur n’est pas délivrée. S’il rattache sans avoir senti, c’est un cours. Les deux échouent.

## Vocabulaire

| Mot | C’est | Ce n’est pas |
| --- | --- | --- |
| **Méthode** | Une grille (MEDDIC, BANT, CRAC…). | Un parcours. Un cours. |
| **Partie** | Une lettre, un levier, un cran (Economic Buyer, Authority, Creuser…). | La méthode entière. |
| **Mini-situation** | Plus petit morceau jouable : une case, une question, une action, une objection. | Un cas entier. Un module. |
| **Rattachement** | Lien mini-situation → méthode + partie. Obligatoire. | Un quiz. Un badge. |

Une mini-situation **ne part pas** sans rattachement. Le lexique est **ouvert** : Édouard en oublie, on en ajoute. On n’en retire pas pour « simplifier ».

Plusieurs grilles peuvent nommer **la même** case. C’est voulu. « Le DAF n’est pas là » = MEDDIC Economic Buyer = BANT Authority = BEBEDC Décideurs. Le joueur doit pouvoir dire les trois, pas choisir la bonne.

## Lexique — figé pour entrer dans le jeu

Quatre familles. Elles ne sont pas des modules. Elles se collent aux beats A+B.

### Dossier — qualification (A, le tableau)

Les cases. Une case cochée sans preuve est vide.

| Méthode | Parties | Ce qu’elle force |
| --- | --- | --- |
| **BANT** | Budget, Authority, Need, Timeline | Qualif courte. Authority = qui tranche. |
| **MEDDIC** | Metrics, Economic Buyer, Decision criteria, Decision process, Identify pain, Champion | Dossier B2B. Lettre vide = deal qui cale. |
| **MEDDPICC** | MEDDIC + Paper process + Competition | Process papier, alternatives (y compris le statu quo). |
| **BEBEDC** | Besoin, Enjeu, Budget, Échéance, Décideurs, Concurrents | Grille FR de découverte. Décideurs ≠ l’ops en face. Enjeu ≠ besoin. |

### Motivations — humain (A et B)

| Méthode | Parties | Ce qu’elle force |
| --- | --- | --- |
| **SONCAS** | Sécurité, Orgueil, Nouveauté, Confort, Argent, Sympathie | Ce qui fait bouger **cette** personne, pas le persona. |
| **SONCASE** | SONCAS + Environnement | Même grille, levier RSE / durable. |

L’ops et le DAF n’ont pas le même levier. Parler Argent à un ops Orgueil, ou Orgueil à un DAF Argent, c’est un trou.

### Enjeu chiffré (A → fait à poser)

| Méthode | Ce qu’elle force |
| --- | --- |
| **Coût de l’inaction** | Un calcul. Pas un slogan. Combien ça coûte de ne rien faire (temps, risque, downtime, manque à gagner). C’est MEDDIC Metrics et BEBEDC Enjeu **en nombre**. Si le DAF dit « trop cher » et que tu n’as pas ce chiffre, tu n’as rien à poser. |

Le joueur **construit** le calcul (cases, hypothèses, trous). On ne lui file pas le 50 k€/h en brief.

### Argumentation — avancer (action, B)

| Méthode | Parties | Ce qu’elle force |
| --- | --- | --- |
| **CAB** | Caractéristique → Avantage → Bénéfice | Partir de l’offre. Le bénéfice est la dernière marche. |
| **BAC** | Bénéfice → Avantage → Caractéristique | Partir de **lui**. La carac n’est que la preuve. |
| **CRAC** | Creuser, Reformuler, Argumenter, Contrôler | Traiter une objection **avant** de répliquer. |
| **(A)CRAC** | Accroche optionnelle + CRAC | Même geste, entrée cadrée. |
| **Points brûlés** | Un accord verrouillé. On n’y revient pas. On avance. | Avancer dans l’argumentaire par petits oui. Pas un QCM de punchlines. |

CAB vs BAC n’est pas « une bonne, une mauvaise ». C’est un choix de départ (offre vs lui). Le rattachement nomme **lequel** tu as joué, et ce que ça a coûté.

### Négociation

| Méthode | Ce qu’elle force |
| --- | --- |
| **Contreparties** | On ne lâche rien sans rien. Remise, délai, scope, accès : chaque concession a un retour (autre concession, engagement, accès au DAF, process). Donner sans contrepartie, c’est un trou. |

## Où ça se colle dans la quête

Pas un module par méthode. Une mini-situation, un rattachement, dans **la même** quête A+B.

| Beat | Familles qui collent souvent |
| --- | --- |
| 1. Entrée, pièce fausse | MEDDIC Champion vs Economic Buyer. BANT Authority. BEBEDC Décideurs. SONCAS de l’ops. |
| 2. Construire les cases | Tout le dossier : BANT, MEDDIC/MEDDPICC, BEBEDC. Métrique = coût de l’inaction. |
| 3. Questionner les trous | Quelle lettre tuerait le deal. Pas « j’ai fait mes huit lettres ». |
| 4. Facture | CRAC / (A)CRAC. L’objection = la case non tenue. Prix sans coût de l’inaction = Metrics vide. |
| 5. Une action | BAC/CAB + points brûlés pour poser le fait. Contreparties si tu négocies l’accès au DAF. Convier = MEDDIC EB. |
| 6. Sortie | Trou nommé **avec** la méthode et la partie. |

Le tableau ci-dessus est celui du premier parcours (`debut` = découverte). Un parcours `preparation` ou `prospection` a les **mêmes** beats A+B, d’autres mini-situations, d’autres rattachements (ICP / Authority avant le call, BAC sur l’accroche, SONCAS du gatekeeper…). On ne vide pas MEDDIC en checklist avant le premier contact.

## Contrat — une mini-situation

Chaque mini-situation du graphe déclare :

| Champ | Rôle |
| --- | --- |
| `id` | Slug |
| `beat` | 1–6 |
| `rattachements` | Liste `{ methode, partie }`. **≥ 1.** Plusieurs grilles OK. |
| `trou` | Comment ça s’appelle si c’est vide / raté |

Exemple (premier parcours) :

```
mini-situation : l’ops est seul dans l’appel
beat           : 1–3
rattachements  :
  - MEDDIC / Economic Buyer
  - MEDDIC / Champion (coach, pas champion)
  - BANT / Authority
  - BEBEDC / Décideurs
trou           : le DAF n’est pas dans la pièce, c’est lui qui tranche
```

Sortie **valide** : « Pas inclus. MEDDIC Economic Buyer — j’avais un coach, pas le DAF. BANT Authority vide. »  
Sortie **interdite** : « +20 XP Qualification. » / « Mauvaise réponse, c’était MEDDIC. » / un trou sans méthode.

## Premier parcours — ce qui est porteur

On n’enseigne pas le lexique entier dans le premier cas. On **rattache** tout ce qui se joue. Porteur ici :

- MEDDIC / MEDDPICC : Economic Buyer, Champion
- BANT : Authority
- BEBEDC : Décideurs, Enjeu
- Coût de l’inaction : le chiffre que le DAF peut entendre
- SONCAS(E) : levier de l’ops ≠ levier du DAF
- CRAC : le non du DAF
- Contreparties : inclure le DAF sans le voir n’est pas gratuit
- BAC/CAB + points brûlés : poser le fait, avancer

Le reste du lexique reste dans le moule pour les cas suivants. Une mini-situation du premier cas qui n’a **aucun** rattachement ne part pas.

## Liste ouverte — ce qu’Édouard n’a pas cité

À ajouter quand une mini-situation en a besoin. Pas un backlog de cours.

- SPIN (Situation, Problem, Implication, Need-payoff)
- CAP / APB (Caractéristique, Avantage, Preuve)
- QQOQCCP
- SIMAC
- SPANCO / ANACE
- GPCTBA/C&I
- Challenger, Sandler

Si une mini-situation ne rentre dans **aucune** grille, on ajoute la méthode. On ne force pas MEDDIC par défaut.

## Ce que ça n’est pas

- Un cursus « semaine 1 BANT, semaine 2 MEDDIC ».
- Un QCM de sigles.
- Un scoreboard de méthodes maîtrisées.
- Une leçon avant le beat 1.
- Une seule « bonne » grille par trou.

Point 4 (cadre théorique) : le **pourquoi** de chaque rattachement (psy, humain, prod). Pas ouvert ici. Le rattachement, lui, est figé : sans lui, point 4 n’a rien à nommer.

Objet parcours : [template-parcours.md](template-parcours.md). Beats : [deroulement.md](deroulement.md).
