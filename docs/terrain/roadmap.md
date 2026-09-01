# Roadmap — 3xrep

Prochains runs. Le cadrage reste [cadrage.md](cadrage.md). Si un item ici le contredit, le cadrage gagne.

**Usine**, pas un cursus. Le moule (structure) est là. On liste ce qu’on veut couler, on verse, on joue un cas pour le test. On ne code pas auth, DB, Stripe, équipes, prix.

## Moule — fait (point 1)

Structure pour **estampiller** des parcours et des parties de parcours. Pas un catalogue déjà rempli. [template-parcours.md](template-parcours.md).

Une étape du cycle = un parcours. Un cas = un deal, A+B, ~15 min. Titres sans spoiler. Court / long = quelles pièces. Rattachement méthode obligatoire. [methodes.md](../methodes.md).

Interdit : CYOA 2 min, mini-QCM, chance, XP, badges, « module terminé », tout le cycle dans une quête.

## À couler

### 1. Inventaire

Tous les parcours / parties qu’on veut. Recherche. Les verser dans le moule.

Pas un LMS (« semaine 1 prospection »). Une liste de pièces : étape × cycle (court / long) × situation. Ce qu’on **produit**, pas un programme qu’on ferme.

### 2. Difficulté

Sans crans, pas de variantes : des **copies**. Point 2 du template, pas encore figé.

Réussite ≠ difficulté. Réussite = comment tu sors. Difficulté = comment le cas est tendu (l’ops cache, c’est politique, tu arrives tard — à figer).

### 3. Générateur

L’IA qui multiplie les **cas** pour chaque difficulté d’un parcours. Point 3. Ne crée pas un parcours. Sans les fichiers méthode, elle invente. Couche graine (pages publiques → JSON, puis fiction) : [scrapegraph.md](scrapegraph.md). Pas dans le jeu.

Cadence (Édouard, 31 août) : le **premier** cas se travaille longtemps (dossier solide, **plusieurs** trous, [jeu.md](jeu.md) §0). Le deuxième moins. Après, on en crée plus vite — ensemble, puis générateur. Pas « des cas faciles ».

### 4. Fichiers méthode

Le modèle est là : [methodes/_modele.md](../methodes/_modele.md). **MEDDIC n’est pas écrit.** Ni BANT, ni BEBEDC, etc.

Un fichier `docs/methodes/<slug>.md` par méthode (jeu, lundi, CRM, ChatGPT / Cowork / Grok Bot, psy). Skills agent plus tard. pSEO à la fin (query = titre, CTA = jouer). Pas un blog formation.

Porteurs du test 1 d’abord : MEDDIC, BANT, BEBEDC, coût de l’inaction, SONCAS, CRAC, contreparties, BAC/CAB, points brûlés.

### 5. Cas jouable — test semaine 2

**Call avec l’ops.** HUD = le deal. Google = DAF dit non. Pas de titre « le DAF n’est pas là ». [deroulement.md](deroulement.md).

C’est la **première pièce coulée**, pour voir si le moule tient. 20 commerciaux. Semaine 2, elles reviennent toutes seules. Oui = produit. Non = stop.

- Une quête A+B, `debut` = découverte. Zéro compte, zéro paywall.
- Sortie = échelle de réussite + trou nommé **avec la méthode**.
- **Design** : système figé — [design/system.md](design/system.md). HTML : [cas.html](design/cas.html). L’app Next.js porte ça. DA `/da/surface` = mémoire. Geste : [debrief.md](debrief.md). Jeu : [jeu.md](jeu.md).
- **Landing** : le cas est l’accroche. Un clic → on joue. Pas un Calendly.

## À faire — prochaine étape (app)

Le HTML n’est pas le produit. On **code l’app** (Next.js, Tailwind, shadcn) à partir de [design/system.md](design/system.md).

**Écart au cadrage / reco** : le test 1 disait zéro auth, zéro DB. Ici (31 août, soir) : **Supabase** + pages après le cas. Le kill switch (20, semaine 2) ne bouge pas. On n’invente pas Stripe / équipes / prix.

### Pages (design system → App Router)

Pas encore dessinées. Même tokens, même fiche Attio.

| Surface | Job | Quand |
| --- | --- | --- |
| **Cas** | Porter [cas.html](design/cas.html) : fiche, activité, prise, chrono manuel, dark/light | D’abord |
| **Sortie** | Trou(s) nommé(s) + méthode + échelle. Pont vers le prochain cas | Juste après le cas — le geste n’existe pas sans |
| **Dashboard** | Ce que tu ouvres en revenant : tes lectures, le prochain cas. Pas un LMS, pas un rang | Après une prise |
| **Page publique** | `3xrep.com/<pseudo>` — [ranking.md](ranking.md). Lien à envoyer. Étoile = rejouer | Après le test, ou dès qu’il y a un pseudo |
| **Prochain cas** | Geste, pas une vitrine : sur la sortie **et** le dashboard. Même type d’erreur, autre peau | Semaine 2 |

Entrée : mail / Google = le cas, un clic. Le dashboard n’est pas la landing.

Plus tard (pas ces pages) : équipe vendredi (bloc dashboard), login le jour du pseudo, pSEO méthodes, Place.

### Supabase

Connecter un projet. Sert les prises, les lectures, plus tard le pseudo / la page. Pas un CRM 3xrep. Pas un LMS.

### Usine à cas

[Générateur](#3-générateur) + premier cas **Call avec l’ops** (dossier solide, plusieurs trous) + fichiers méthode du rattachement (MEDDIC, BANT, BEBEDC… encore vides). Cadence : le 1 long, le 2 moins, ensuite plus vite.

## Hors roadmap (mémoire seulement)

Prix 3 € / 19 €, invitations, équipes, C (vacation), **autres étapes du cycle** (après le test), **pages pSEO méthodes**, acquisition Google scale : [reco.md](reco.md). Après le test semaine 2, si oui.

### Place — plus tard, pas le test

D’abord : les sales. Les faire jouer. Kill switch inchangé (20, semaine 2).

Après, si oui : artefact portable (replay / gist, pas un feed). Pas un LinkedIn. Pas de social. Page `3xrep.com/<pseudo>` : [ranking.md](ranking.md) — page ≠ tableau, étoile = rejouer, challenge = semaine. Pas le test.

Place possible : évaluer **les deux** côtés — le sales (dossier, trou nommé) **et** l’employeur (mêmes cases, de l’autre côté : territoire, ramp, buyer économique, forecast). Pas Glassdoor. Le vide nommé. Matching = superposition de deux dossiers, pas un score. L’employeur est un deuxième joueur, pas un client L&D.

Pas maintenant. Pas de profil, pas d’algo, pas de recruteurs dans le premier parcours.
