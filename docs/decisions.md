# Décisions produit

**Le registre.** 7 septembre 2026. Avant : une décision vivait dans le fichier qu’elle touchait (`figé` + date) ou dans une note du jour (`docs/sessions/`). Ça se perd. Ici : les décisions qui changent le **contrat**. Une section par décision. On n’en rouvre pas une sans une nouvelle section.

Pas les gaps de méthodes ([gaps/decisions/](gaps/decisions/)). Pas le journal du jour ([sessions/](sessions/)).

## Comment on écrit

Date. Qui. Ce qui était vrai. Ce qui est vrai maintenant. Ce que ce n’est **pas**. Où ça vit. Comment on rouvre.

---

## 2026-09-06 / 07 — Journal 14 jours

**Qui :** Édouard. Tranché le 6 sept (fil usage). Confirmé le 7 sept : *on a décidé de garder de l’info, il faut changer tout le produit. L’objectif c’est d’améliorer.*

**Figé.** Gagne sur l’ancienne ligne *We don’t store* ([landing.md](landing.md) avant le 7 sept, [sessions/2026-09-01-2.md](sessions/2026-09-01-2.md)).

### Ce qui était vrai

On disait : tes prompts restent chez toi. On n’enregistre pas. **On ne stocke rien.** Faux dès qu’un outil reçoit un transcript : le serveur le voit. La phrase mentait, ou elle interdisait d’apprendre.

### Ce qui est vrai maintenant

On garde **la demande et la réponse** de chaque appel d’outil, **quatorze jours**, puis on efface.

La demande, c’est tout ce que l’outil a reçu : transcript, extraits, notes, ce que le fichier client prétend. La réponse, c’est le verdict. C’est ça qu’on relit pour améliorer. Sans les deux, le journal ne sert à rien.

On n’entre **pas** dans l’appel : pas de robot Zoom / Meet, on n’enregistre pas le son. Si le texte de l’appel arrive dans la demande (collé, ou déjà sur la fiche), on le garde avec le verdict.

Pour : analyser demande + réponse, caler le directeur, améliorer le cerveau. Pas pour vendre une mémoire. Pas pour un tableau de bord.

Ligne publique (site, install, docs) :

*We don’t join your calls. Tool inputs and verdicts are kept 14 days to improve the VP, then deleted. We don’t write to your CRM.*

### Ce que ce n’est pas

| Ça | Non — c’est |
| --- | --- |
| La mémoire « le trou du 12 » | Plus tard, hash, zéro contenu ([plg.md](plg.md), [cerveau.md](cerveau.md)) |
| Un enregistreur / « on n’a pas le call » | Pas de bot Zoom. On a le texte **s’il est dans la demande**, plus le verdict |
| Écrire chez eux | Toujours interdit |
| Garder pour toujours | 14 jours, puis delete |
| Un fichier client à nous | [portes.md](portes.md) §7 — demain, autre décision |

### Où ça vit

- Table `mcp_calls` — [migration](../supabase/migrations/20260906160000_mcp_calls.sql). Projet 3xrep. RLS. Seul le serveur écrit. Sans la table, le cerveau répond quand même.
- Machine : `src/lib/mcp-log.ts`, branché sur chaque outil.
- Copy : `TRUST_LINE` dans `src/lib/copy.ts`.
- Contrat : [landing.md](landing.md) Confiance, [contournement.md](contournement.md) grade C, [cerveau.md](cerveau.md) interdits.

### Rouvrir

Seulement si : on allonge ou on coupe les 14 jours ; on stocke autre chose que entrée + verdict ; on promet la mémoire « le 12 ». Une nouvelle section. On ne réécrit pas celle-ci.

Note du jour : [sessions/2026-09-07-4.md](sessions/2026-09-07-4.md).

---

## 2026-09-14 — Squelette, essai qui coupe, parrainage

**Qui :** Édouard. Fil du 13–14 sept. Acté le 14 sept.

**Figé.** Gagne sur : [plg.md](plg.md) (tools ouverts, pas d’essai, pas de comparaison), [gaps.md](gaps.md) « pas de benchmark industrie », [cerveau.md](cerveau.md) « mémoire plus tard », [roadmap.md](roadmap.md) « essai qui expire » interdit, [differentiel.md](differentiel.md) « mémoire pas maintenant ». Ne casse pas le journal 14 jours ci-dessus : le **texte** de l’appel s’efface toujours. Ne casse pas : pas d’enregistrement, pas de `write_to_crm` **chez 3xrep**, pas de proba de close, pas de pourcentage de signatures promis. Écrire dans leur fichier = **leur** agent, via **leur** connecteur, d’après nos reco — [§8](#8-écrire-chez-eux--reco-pas-nous).

### Ce qui était vrai

Journal : demande + verdict, 14 jours, delete. Pas de souvenir « vide depuis le 12 ». Pas de comparaison aux autres maisons. Tous les tools ouverts, pas de cadenas, pas d’essai. Payer = org + clé, ça ne débloque pas un tool. La mémoire et la ligne payant attendaient une vraie `pipe_review`.

### Ce qui est vrai maintenant

Trois couches de data, plus un essai, plus un parcours dans l’agent.

#### 1. Journal — inchangé

Demande + verdict : **14 jours**, puis delete. Caler le cerveau. Pas le fossé.

#### 2. Squelette — sans limite de temps

On garde, **sans date de fin** :

| On garde | On ne garde pas |
| --- | --- |
| `org` + hash de l’affaire (pas le nom) | Le verbatim, les mails, les notes en dur |
| Pièce + `su \| suppose \| trou` + date | Un fichier client (noms, étapes, tâches) |
| Tranche de montant, étape **prétendue** | Un classement de commerciaux |
| Plus tard : gagné / perdu / encore ouvert, **quand une routine ramène le dénouement** | Leur case « pourquoi perdu » comme vérité |

Ça permet : « cette pièce est vide depuis le 12 ». Chez **eux**, une fois des fins : « quand elle était vide, l’affaire est plus souvent passée à perdu ». Pas un roman. Pas HubSpot chez nous.

#### 3. Profil au premier branchement

La première fois, l’agent demande (et on stocke **chez nous**, lié à l’org) :

- Titre.
- Mission : commercial / manager / directeur commercial / autre.
- URL du site de **leur** société → on en tire une description (ce qu’ils vendent, à qui). Ils corrigent.

Ce n’est pas de l’enrichissement de prospects ([acces.md](acces.md)). C’est **leur** maison, **leur** URL. Les variables du [spec-agent.md](spec-agent.md) (`company_name`, offre, comptes visés…) cessent d’être un copier-coller vide : elles se remplissent ici.

Pas un carnet au hasard (« il aime les mails courts »). Pas un `soul.md` qui avale tout.

#### 4. Comparaison — poids de la méthode, après X

Le trou d’aujourd’hui reste le trou. Dès qu’on a **X histoires terminées sur cette pièce** (jugement puis gagné ou perdu), on peut ajouter :

*Chez les maisons qu’on voit, ce trou précède un perdu dans N % des fins.*

X se cale au ship (assez pour que N ne soit pas du bruit). Une pièce rare n’affiche pas de N. En dessous de X : le trou seulement.

Montant dit **simplement** : somme des lignes qui cassent une porte déjà vraie sans nous (étape « on signe » sans budget tenu ; personne qui tranche ; etc.). La méthode dit : fragile. On additionne ce qui est écrit.

Trois phrases. 1 et 2 oui. 3 non.

1. Chez toi : ces affaires cassent cette porte. Somme écrite : 412 000 dollars.
2. Chez ceux qu’on voit : quand ce trou était là, 42 % des fins sont passées à perdu.
3. Donc tes 412 000 × 42 % vont mourir — ou « 412 000 en danger » au sens *cet argent s’envole / revient si tu paies*.

Le 42 % confirme la **règle**. Il ne multiplie pas **leur** liste. Pas de calculette. Pas « les équipes comme vous convertissent à 51 % ». Pas un classement Sarah.

#### 5. Essai qui coupe

Le cerveau répond pendant l’essai. À la fin, sans paiement : on **coupe le jugement**.

Ce qui reste, à **chaque** appel d’outil : une phrase, puis plus de verdict 3xrep. L’assistant continue à parler tout seul — on le dit.

Cible EN (copy au ship) :

*3xrep is not answering: this organization has no active payment. Whatever follows is probably less relevant.*

Pas un silence. Pas un 401 vide. Pas le lexique qui continue comme si de rien.

**Jour 0 — premier pas.** Stripe (ou page) : *gratuit N jours*. **Carte pas exigée** pour ce premier pas. Si Stripe permet un essai sans moyen de paiement, on le prend. Sinon : inscription essai, carte plus tard.

**Kill switch.** Si trop peu d’inscriptions : on enlève le mur Stripe **même gratuit** (retour outils ouverts sans compte). Édouard l’a dit. Sans org identifiée, on ne peut plus couper à la fin de l’essai — c’est le prix du switch. Le paiement redevient dû seulement quand une org existe.

**À la fin de l’essai :** paiement obligatoire (129 $ / mois / org) ou la phrase ci-dessus.

#### 6. Durées — parrainage d’organisations

Unité = une **organisation**, pas un siège. Un bonus : **la première** org filleule qui démarre un essai. Pas +14 par filleul à l’infini (à rouvrir si on voit l’usage).

| Qui | Essai | S’il parraine une org |
| --- | --- | --- |
| Inscription directe | **14 jours** | **28 jours** (14+14) |
| Org recommandée | **30 jours** (15+15 du parrainage) | **45 jours** (30+15) |

Le filleul part déjà avec 15 jours offerts par le lien. Le parrain (direct) gagne +14. Le parrain déjà filleul gagne +15 pour coller à 45.

#### 7. Parcours dans l’agent (pendant l’essai)

Une chose à la fois, **dans la fenêtre d’essai** (14 / 28 / 30 / 45 jours — pas quatre semaines calendaires pour le premier user) :

1. Brancher le fichier client.
2. Routine : revue de la liste (lundi / planifié Claude ou ChatGPT).
3. Drapeaux sur des affaires (étape qui ment, pièce vide).
4. Suites : l’agent écrit le mail ; 3xrep dit si ça devrait partir, quelle pièce manque. On n’envoie pas. On n’est pas la bouche.
5. Reco d’écriture **chez eux** : quelle propriété changer, parce qu’on ne voit pas la preuve ([§8](#8-écrire-chez-eux--reco-pas-nous)).

À la fin de l’essai, ils ont **vu** leur liste mentir. La carte fait moins mal. On ne promet pas un pourcentage de signatures. Feeling visé : *je peux générer plus de revenu avec ça* — hero déjà : *make you sign more deals*, sans chiffre. Spec et tools : toujours pas « tu closes ».

#### 8. Écrire chez eux — reco, pas nous

**3xrep n’écrit jamais** dans HubSpot / Salesforce / Notion. Pas de tool `write_to_crm`. La ligne publique *We don’t write to your CRM* tient : **nous**.

**Leur agent (Claude, ChatGPT…)** lit et écrit via **leur** connecteur fichier client. C’est déjà [v0.md](v0.md) / [contournement.md](contournement.md).

Le verdict **recommande** quoi écrire, et pourquoi. Exemple : *cette propriété dit « négociation » ; on ne voit personne qui tranche dans les preuves. Propose de la corriger (étape, champ, note) — après confirmation.* Autre : *le champ budget est coché ; aucun chiffre dit par eux. Ne le laisse pas vert.*

On recommande de **retirer le mensonge** (case verte sans preuve, étape illégale). On ne recommande pas de **remplir le trou en inventant** (poser un nom de DAF qu’on n’a pas). Une reco sans exhibit = « vide, va chercher », pas « écris Marie ».

Confirmation avant d’écrire : tient. L’humain dit oui, ou l’agent a déjà la règle dans la consigne. 3xrep ne pousse pas le champ.

### Ce que ce n’est pas

| Ça | Non |
| --- | --- |
| Garder les appels pour toujours | Le roman (journal) reste 14 j. Le squelette, lui, reste. |
| Gong / enregistreur | Pas de bot. Pas de bande. |
| HubSpot chez nous | Pas les fiches. Profil maison + squelette de jugement. |
| Pronostic / forecast | Somme des portes cassées + confirmation de la règle. Pas 412k × 42 %. |
| Classement d’équipes | Pas « similar teams 34 % ». |
| Séquenceur / on écrit le mail | Claude habille. On juge. |
| 3xrep pousse les champs HubSpot | Reco dans le verdict. Eux écrivent. Pas remplir une case sans preuve. |
| Essai silencieux | On coupe le cerveau ; on laisse la phrase. |
| Tools ouverts pour toujours (live actuel) | Live jusqu’au ship. Après ship : essai puis mur. Kill switch si l’acquisition meurt. |

### Où ça vit

- Contrat : cette section. Opération : [plg.md](plg.md). Cerveau : [cerveau.md](cerveau.md) §7. Feuille de route : [roadmap.md](roadmap.md) item 6. Page : [landing.md](landing.md) Confiance (cible au ship). Checkout : [checkout.md](checkout.md) (cible). Spec : [spec-agent.md](spec-agent.md) premier branchement + parcours.
- Code live **inchangé** tant qu’on ne shippe pas : `mcp_calls` 14 j, tools ouverts, `TRUST_LINE` actuelle, org créée au paiement Stripe.
- Au ship : table squelette ; table / champs org (essai, fin, parrain, profil) ; cadenas ; phrase de coupure.

### Rouvrir

Nouvelle section si : on exige la carte au jour 0 ; on empile les bonus parrainage ; on change les durées ; on affiche le 42 % avant X ; on promet que le montant « en danger » revient ; on tient leur fichier client ; **3xrep** write chez eux ; on renvoie un vrai verdict après la coupure. Kill switch (enlever le mur) : Édouard, pas un agent.

Note du jour : [sessions/2026-09-14.md](sessions/2026-09-14.md).

---

## 2026-09-14 (soir) — Essai : base 14, on empile

**Qui :** Édouard. Même jour. Gagne sur le tableau §6 de la section 2026-09-14 ci-dessus (les 15 / 30 / 45).

**Figé.** Le reste de cette section tient (squelette, coupure, reco d’écriture, un bonus parrainage pas une pile infinie).

### Ce qui était vrai (ce matin)

Direct : 14, ou 28 s’il parraine. Filleul : 30 (15+15), ou 45 s’il parraine.

### Ce qui est vrai maintenant

**Base = 14 jours.** On n’additionne que des **+14**.

| Qui | Comment on compte | Total |
| --- | --- | --- |
| Inscription directe | base | **14** |
| Direct + une org qui s’inscrit grâce à lui | base + parrain | **28** |
| Org recommandée | base + cadeau filleul | **28** |
| Filleul + une org qui s’inscrit grâce à lui | base + filleul + parrain | **42** |

Quatre briques, toujours 14 :

1. Essai.
2. +14 si **une** nouvelle org s’inscrit (parrain).
3. +14 cadeau si on est arrivé par un lien (filleul).
4. Le filleul peut aussi gagner le +14 parrain.

Toujours **la première** org filleule qui démarre un essai. Pas +14 par filleul à l’infini.

### Rouvrir

Nouvelle section. Celle du matin, on ne la réécrit pas.

Note : [sessions/2026-09-14.md](sessions/2026-09-14.md).

---

## 2026-09-14 (ship item 6) — Carte J+7, avoir 129, horloge au jugement

**Qui :** Édouard. Même jour, après le soir. Gagne sur : carte « plus tard » sans date ; parrain qui gagne des **jours** ; horloge à l’inscription ; tools ouverts ; afficher le 42 % dans ce ship. Ne réécrit pas les sections du matin ni du soir.

**Figé et shippé.**

### Ce qui était vrai (matin + soir)

Essai 14 / 28 / 42 en empilant des +14. Parrain : jours offerts, **la première** org filleule. Carte pas exigée au jour 0, sans dire quand. Horloge dès l’inscription. Live code : tools ouverts. Le 42 % était la phrase 2, à caler au ship.

### Ce qui est vrai maintenant

Les choix du matin tiennent : juge, squelette sans roman, on n’écrit pas chez eux, 129 dollars / mois / organisation.

Ce qui change, parce que ça fait plus d’argent :

- **Pas de carte le premier jour.** Carte obligatoire **7 jours après le premier jugement**. Le cerveau continue pendant ces 7 jours. 0 euro tant que l’essai n’est pas fini.
- L’horloge de 14 jours **démarre au premier jugement réel** (`pipe_review` / `audit_deal` / `next_question` / `objection_map`), pas à l’inscription. Le dictionnaire ne démarre pas l’horloge. Une org qui ne juge jamais ne coûte presque rien.
- Le filleul arrivé par un lien : **28 jours**. Le parrain **n’a plus de jours offerts**. Il gagne **129 dollars d’avoir par filleul qui paie au moins une fois**, sans plafond, uniquement sur la facture 3xrep, jamais un virement. Le filleul « compte » pour l’argent seulement s’il a **payé**. Les +14 jours filleul tombent dès le lien (`trial_days=28`).
- **Rien sans clé** : ni jugement, ni dictionnaire. Phrase si pas de clé : commence l’essai, colle ta clé.
- On demande l’argent **deux fois** : lien carte dans le premier verdict (après l’horloge), puis phrase de coupure si l’essai est fini et pas payé.
- On shippe : **votre liste ment + souvenir des trous + reco d’écriture**. Le « 42 % chez les autres maisons » se calcule plus tard. On stocke déjà le squelette pour y arriver. Pas d’affichage 42 % dans ce ship.
- Voie rapide : payer 129 dollars tout de suite **reste**. Org `active`, pas d’horloge.
- Kill switch : variable `MCP_OPEN_TOOLS=1`. Édouard seulement. Retour tools ouverts.

Phrase de coupure (paiement), une fois, sans doublon :

*3xrep is not answering: this organization has no active payment. Whatever follows is probably less relevant.*

Jour 7 sans carte : autre phrase — poser la carte. Dès que la carte est là, le cerveau reprend jusqu’à la fin de l’essai.

### Ce que ce n’est pas

| Ça | Non |
| --- | --- |
| Carte obligatoire au jour 0 | Premier pas = mail + clé |
| Parrain gagne des jours | Il gagne 129 dollars d’avoir, sans plafond, si le filleul paie |
| Horloge à l’inscription | Au premier jugement |
| 42 % / calculette / « similar teams » | Colonnes prêtes, zéro affichage |
| Mail de récupération de clé | Clé montrée une fois. Portail Stripe une fois la carte posée. Resend plus tard |
| OAuth directory Claude | Listings = plus tard |
| `write_to_crm` chez 3xrep | Reco ; leur agent écrit après confirmation ; pas inventer une valeur |

### Où ça vit

- Code : `src/lib/trial.ts`, `src/lib/access.ts`, `src/lib/mcp-gate.ts`, `src/lib/skeleton.ts`, `src/lib/referrals.ts`, `/start`, checkout `mode=card`.
- Tables : [migration item 6](../supabase/migrations/20260914180000_item6_trial.sql). `mcp_calls` **inchangé**.
- Copy : `TRUST_LINE`, phrases de coupure, consigne MCP. Page : hero *Start 14 days free*.
- Kill switch : `MCP_OPEN_TOOLS` — **absente** en prod au ship.

### Rouvrir

Nouvelle section si : on exige la carte au jour 0 ; on plafonne les avoirs parrain ; on affiche le 42 % ; on démarre l’horloge à l’inscription ; on rouvre les tools sans clé en prod. Kill switch : Édouard.

Note : [sessions/2026-09-14.md](sessions/2026-09-14.md).


## 2026-09-18 — Founding 20

**Qui :** Édouard, cadrage validé puis « ok go » pour l’implémentation.

Priorité pendant 30–45 jours : retours après usage et retour régulier dans le produit. Bêta sans carte. Jusqu’à 20 organisations reçoivent manuellement une offre de base gratuite à vie, après qualification par usage. Une inscription ne prend pas de place. Le prix standard de 129 dollars reste disponible hors bêta. Les anciens clients ne sont pas automatiquement convertis.

Cette décision ouvre un recrutement ciblé par X et Gojiberry, contrairement à l’ancienne exclusion de la prospection dans le PRD. Pas de promesse de résultat commercial. Pas de nouvelle intégration au fichier client.

Droits séparés de Stripe, places permanentes, règles configurables. Trois sessions sur trois jours et trois résultats utiles au départ. Les horizons 1 / 7 / 30 jours existants sont conservés. Les événements d’usage sans contenu commercial sont conservés au-delà des 14 jours du journal détaillé pour mesurer le retour à 30 jours. Les avis sont volontaires et reliés à l’organisation ; pas d’identité individuelle inventée.

Implémentation et procédure de mise en service : [Founding 20](beta/founding-20.md). La validation du code n’est pas une publication sur `main`, ni une activation de campagne.
