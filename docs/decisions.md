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

## 2026-09-22 — Du diagnostic à la stratégie par affaire

**Qui :** Édouard, document « prompt codex 26_09_22 », puis demande d’application complète sur une nouvelle branche avec tests et audit.

Ce qui était vrai : le cerveau repérait le manque et proposait généralement une première question. « Sales buddy » et la journée formaient le centre du positionnement. Certains textes figés excluaient la rédaction d’un courriel ou d’un script.

Ce qui est vrai maintenant : le diagnostic est nécessaire mais ne suffit plus. Le cerveau construit une stratégie à partir des preuves tenues : objectif, manque, démarche, mots proposés, réponses possibles et condition de progrès. La personnalité de compagnon reste ; la catégorie devient la stratégie commerciale par affaire. L’accueil montre le passage des preuves à la conversation.

Cette décision remplace les exclusions de formulation de `cerveau.md`, `gestes.md`, `differentiel.md`, `sortie.md`, `spec-agent.md`, `sales-buddy.md` et du PRD. « Pas la bouche » interdit le contact autonome ; proposer exactement quoi dire est autorisé. Le serveur juge, l’assistant peut mettre en forme sans inventer. Le résumé stratégique précède l’agenda. Un même moteur sert le commercial et le manager.

Les sections historiques restent datées. Les preuves, la confidentialité, les droits et Founding 20 restent régis par leurs contrats. Aucune probabilité de signature, aucun envoi autonome, aucune intégration Smartlead. La planification future de revenu collectif reste hors périmètre.

Architecture, règles de rendu et écarts motivés : [deal-strategy.md](deal-strategy.md). La branche de travail n’est pas une publication en production. Rouvrir par une nouvelle décision si l’on change la preuve requise, la conservation, le contact autonome ou la prévision commerciale.

## 2026-10-13 — Une seule offre, gratuite à vie pour les premières organisations

**Qui :** Édouard, discussion du recrutement Smartlead puis demande de mise à jour de la documentation.

3xrep a **une seule offre**. On peut annoncer **« Free forever for the first 20 organizations. »** La gratuité concerne 3xrep pour toute l’organisation, sans réserve d’« offre de base » ou de « base plan ». Elle n’est plus une récompense attribuée après sélection selon l’usage. Aucune durée minimale d’activité, aucun nombre de sessions ni retour obligatoire ne conditionne cette promesse.

Les 20 premières organisations sont un repère de recrutement annoncé, pas un plafond définitif. Édouard peut offrir davantage de places si l’usage est insuffisant. Il n’a pas non plus à attendre 20 organisations avant d’ouvrir le payant aux suivantes : cinq organisations très satisfaites peuvent suffire à décider de ce passage. Ce sont des exemples de jugement, pas des seuils automatiques. L’objectif est de trouver des organisations qui veulent réellement utiliser le produit, puis de faire payer les nouvelles.

Les organisations auxquelles la gratuité à vie a été promise la gardent. Une période d’inactivité ne retire pas ce droit et n’autorise pas à remplacer une bénéficiaire par une autre. Offrir plus de places reste possible. Le prix standard reste de 129 dollars par mois et par organisation pour les nouvelles organisations payantes ; aucun prélèvement automatique n’est créé par cette décision.

Cette décision remplace le contrat commercial du 18 septembre : sélection après usage, gratuité limitée au « plan de base » et plafond définitif de 20 bénéficiaires. Les mesures d’usage et les avis restent utiles pour apprendre. Les notes datées restent comme historique.

**Périmètre réalisé ici : documentation.** Le code et la base conservent encore les anciens seuils de qualification, l’attribution manuelle, la contrainte des 20 places et la fermeture des nouvelles inscriptions. Le site et les campagnes Smartlead ne sont pas modifiés par cette mise à jour. Adapter l’admission, les droits, la facturation et les textes publics reste un travail distinct ; ne pas présenter la nouvelle règle comme déjà automatisée.

Références alignées : [README](../README.md), [contrat bêta et état technique](beta/founding-20.md), [textes de prospection](gtm/cold-email-strategy.md), [accueil](landing.md), [messages liés à l’usage](beta/lifecycle.md).

## 2026-10-13 — Deux invitations bêta pour les commerciaux expérimentés

**Qui :** Édouard, validation des premiers courriels A et B puis demande de documentation avant les relances.

Le prochain test de prospection vise uniquement les commerciaux expérimentés de petites entreprises, qui portent leurs propres affaires. La campagne managers est écartée de ce test ; le produit conserve ses usages managers. Deux approches sont fixées : **A**, un œil extérieur sur une affaire presque perdue ; **B**, inviter le commercial à mettre la démarche de 3xrep à l’épreuve sur une affaire où il a déjà sa propre idée de la suite. L’offre gratuite à vie est identique dans les deux.

Les quatre adresses envoient chacune les deux variantes à parts égales sur la durée du test, à des profils comparables. Une personne reçoit une seule version. Les premiers retours permettent d’affiner lorsque le volume arrive ; la comparaison porte sur deux approches complètes, pas sur une phrase isolée. Réponses intéressées, essais réels et retours d’usage comptent davantage que les ouvertures.

Les textes exacts sont dans [cold-email-senior-beta-test.md](gtm/cold-email-senior-beta-test.md). Trois ou quatre relances restent à écrire ; aucun texte ni délai de relance n’est encore validé. Cette décision n’enregistre rien dans Smartlead et ne lance aucun envoi.

## 2026-10-13 — Suites A et B, suivi Supabase et montée des quatre boîtes

**Qui :** Édouard, demande de documenter les suites au même endroit, de suivre les nouveaux contacts dans Supabase et de mettre le plan quotidien en place aussi dans Smartlead. La recherche des contacts, leur vérification et les signaux d’usage de Claude ou ChatGPT viennent ensuite.

Les trois relances proposées sont retenues pour chacune des deux séquences : quatre courriels aux jours 0, 4, 9 et 16, dans les plages d’envoi autorisées. Les textes complets sont réunis dans [le document du test](gtm/cold-email-senior-beta-test.md). A et B sont enregistrées dans deux nouvelles campagnes en brouillon, chacune avec les quatre boîtes. Les anciennes campagnes restent en pause avec leur historique ; aucun contact n’est réinscrit ou recherché dans cette mise en place.

Le suivi privé relie contact, version de séquence, étape et boîte expéditrice. Il distingue ouvertures observées, réponses détectées et réponses positives confirmées, puis inscriptions et usage attribués par campagne. Les prochains contacts qualifiés et vérifiés sont réservés à parts égales entre A et B, une personne par entreprise et une version par personne.

La cible est **40–45 envois par jour ouvré par adresse**, relances comprises. La base visée est 43, avec une variation quotidienne limitée. Elle part des plafonds 11 / 4 / 4 / 4 et ne monte qu’après de vrais jours d’envoi et les contrôles nécessaires. Un incident peut réduire ou arrêter une boîte. Aucune hausse automatique sur les seules ouvertures, les jours d’inactivité ou pour rattraper une interruption. Les limites du plan du 30 septembre sont remplacées pour ces quatre boîtes.

Le contrôle est hébergé à 1 h, heure de Paris, avec suivi journalier et journal des motifs. Une simulation et une exécution réelle sont vérifiées après déploiement. Les campagnes ne sont pas lancées ici : la recherche et la vérification du prochain lot et l’alignement du parcours de gratuité restent à faire. Détails et état réel : [smartlead-cloud-control.md](gtm/smartlead-cloud-control.md).

## 2026-10-13 — Recherche, vérification et import des contacts à 1 h

**Qui :** Édouard autorise la construction, l’essai sur dix profils et l’intégration au programme quotidien si le circuit fonctionne. Recherche et récupération d’adresse SmartProspect tant qu’il reste des crédits ; conservation des résultats dans Supabase ; seuls les contacts vérifiés rejoignent A ou B.

Le vérificateur gratuit ContactOut refuse les essais réels. Édouard demande Kitt en premier, puis autorise MillionVerifier en repli pour le lot. Kitt classe quatre adresses valides, deux invalides et deux incertaines parmi huit adresses trouvées ; MillionVerifier refuse les deux appels de repli. Les deux autres profils restent sans adresse retournée. Quatre contacts sont importés, deux dans chaque séquence. Aucun envoi n’est lancé.

Le programme de 1 h retient Kitt, à 0,0015 USD par vérification, avec un maximum de 50 vérifications par jour et un tarif relu avant chaque lot. Il remplit deux jours de stock uniquement lorsque A et B sont actives et les boîtes saines. Une identité Treg limitée au seul endpoint Kitt est créée et testée ; aucune autorisation de tous les outils n’est accordée. L’achat de crédits supplémentaires et un repli automatique vers MillionVerifier ne sont pas activés. Détails, coûts et reprise : [outbound-contact-sourcing.md](gtm/outbound-contact-sourcing.md).

## 2026-10-13 — Plafond Kitt porté à 200 vérifications par jour

**Qui :** Édouard demande 200 vérifications par jour pour couvrir la croissance tout en maîtrisant les dépenses.

Cette décision remplace les limites initiales de 100 appels de l’identité Treg et de 50 contacts du programme quotidien. Les deux plafonds sont portés à **200 par jour**. Kitt reste à **0,0015 USD par vérification terminée**, soit au plus **0,30 USD par jour** et **9 USD pour 30 jours au plafond**. Le programme vérifie seulement le stock manquant ; 200 n’est pas un objectif de consommation. Le tarif maximal autorisé, les contrôles de livraison et les conditions de recherche restent en place.

Les réglages exacts, la contrainte Supabase et les causes possibles d’une limitation future sont documentés dans [Recherche et vérification des contacts](gtm/outbound-contact-sourcing.md#coût-et-rythme-du-programme-de-1-h).

## 2026-10-13 — Réserve de trois jours et remplacement des adresses rejetées

**Qui :** Édouard veut assez de contacts valides pour utiliser les plafonds des boîtes et autorise la mise en place.

La réserve remplace les deux jours initialement prévus : **trois jours ouvrés de contacts valides déjà importés et pas encore contactés**, sur toute la capacité des boîtes. Après chaque lot vérifié et relu dans Smartlead, le programme continue la recherche si A ou B manque de stock. Toutes les reprises du passage partagent le plafond de 200 vérifications et le même verrou quotidien. Arrêt sur réserve remplie, budget atteint, crédits épuisés, recherche sans nouveau profil ou durée insuffisante ; le manque et sa cause restent visibles dans Supabase.

Le nombre de nouveaux contacts permis dans chaque campagne tient compte des relances attendues depuis les envois réels. Le plafond total par boîte couvre toujours premiers messages et relances. Aucun envoi n’est garanti par la seule présence de stock. Campagnes en brouillon et parcours de gratuité à aligner avant lancement. Détails : [Recherche et vérification des contacts](gtm/outbound-contact-sourcing.md).

## 2026-10-14 — Activation A/B et suivi complet Smartlead

**Qui :** Édouard demande de rendre les deux séquences actives maintenant, de suivre les ouvertures et toutes les mesures disponibles, puis de poursuivre la montée par boîte.

A (`4139326`) et B (`4139384`) sont activées après vérification des textes, étapes, contacts vérifiés et boîtes. Les anciennes campagnes restent en pause. Le suivi Smartlead est activé pour ouvertures, clics et réponses, avec arrêt après réponse. Les clics sont ajoutés au suivi privé Supabase ; les autres mesures d’envoi, réponse, rebond, désinscription, inscription et usage attribué restent présentes.

Le plan conserve 11 / 4 / 4 / 4 au départ, la réserve de trois jours et les plafonds de 200 vérifications par jour. Prévision sous conditions : environ 45 envois quotidiens au total vendredi 23 octobre, environ 200 sur la semaine du 19 au 23, puis plage 41–45 par boîte vers mi-décembre. La moyenne finale reste 43 par boîte. Le lancement est explicitement autorisé ; il ne modifie pas le parcours public de gratuité qui reste à aligner. [Prévision et preuves](gtm/smartlead-cloud-control.md#activation-et-prévision-du-14-octobre).

Le remplissage initial a révélé des résultats SmartProspect différés et la durée limitée de la fonction hébergée. Les reprises du même jour lisent désormais les demandes existantes sans refaire la recherche. Une reprise productive arrêtée par la durée programme au plus quatre suites automatiques, avec verrou et budget journalier commun. Le résultat de chaque lot terminé est enregistré. La réserve réelle atteint 69 contacts prêts pour le démarrage : 35 dans A, 34 dans B.


## 2026-10-14 — Montée accélérée et réduction de moitié sur incident

**Qui :** Édouard propose d’accélérer, de réduire de moitié dès le lendemain sur des signaux de livraison négatifs, puis de remonter progressivement. Il demande la mise en place et la clôture avec `end`.

Le rythme précédent est remplacé pour les quatre boîtes : +3 jusqu’à 20, puis +5 jusqu’à 40, puis 43, après deux jours d’envoi sains à chaque base. Les jours sans envoi et les journées en cours ne comptent pas. Les preuves de destinataires distincts restent nécessaires ; pas de rattrapage après une panne. À terme, variation entre 41 et 45, moyenne 43.

Un incident confirmé divise le plafond réel par deux au prochain contrôle, une seule fois pour les mêmes destinataires ou le même refus temporaire. Deux nouveaux destinataires en échec suffisent à confirmer un incident ; au moins 50 destinataires avec 2 % de rebonds et un nouvel échec suffisent aussi. À 5 % sur au moins 50 destinataires, ou sur blocage, plainte connue ou connexion défaillante, la boîte est arrêtée. Après une réduction, trois jours d’envoi sains et la résolution de la cause sont nécessaires. La reprise avance ensuite de 2 après deux jours sains jusqu’à la base précédant l’incident, sans variation quotidienne pendant cette reprise.

Une absence d’ouverture ne déclenche pas une baisse. L’absence de réponse après 100 destinataires impose une revue. Une réponse négative commerciale appelle une revue de la cible et du texte, pas une sanction de livraison automatique. Les refus temporaires et plaintes non exposés dans les statistiques natives doivent être consignés avec leurs preuves dans l’état privé. Le contrôle agit chaque nuit ; il ne surveille pas les incidents en temps réel.

Prévision sous conditions : environ 56 envois au total vendredi 23 octobre, environ 250 pendant la semaine du 19 au 23. Base de 43 vers le 5 novembre pour la première boîte, vers le 13 novembre pour les autres. Premiers jours à 45 entre le 10 et le 19 novembre selon la boîte. Cela remplace la prévision de décembre. [Règles, reprise et preuves](gtm/smartlead-cloud-control.md).
