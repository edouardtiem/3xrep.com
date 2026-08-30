# Roadmap — 3xrep

Prochains runs. Le cadrage reste [cadrage.md](cadrage.md). Si un item ici le contredit, le cadrage gagne.

**Usine**, pas un cursus. Le moule (structure) est là. On liste ce qu’on veut couler, on verse, on joue un cas pour le test. On ne code pas auth, DB, Stripe, équipes, prix.

## Moule — fait (point 1)

Structure pour **estampiller** des parcours et des parties de parcours. Pas un catalogue déjà rempli. [template-parcours.md](template-parcours.md).

Une étape du cycle = un parcours. Un cas = un deal, A+B, ~15 min. Titres sans spoiler. Court / long = quelles pièces. Rattachement méthode obligatoire. [methodes.md](methodes.md).

Interdit : CYOA 2 min, mini-QCM, chance, XP, badges, « module terminé », tout le cycle dans une quête.

## À couler

### 1. Inventaire — figé

[inventaire.md](inventaire.md). 29 parcours (étape × cycle × situation). **1 ouvert** : Call avec l’ops. Les 28 autres ne s’ouvrent pas tant que la semaine 2 n’a pas dit oui.

Audit terrain : [inventaire-audit.md](inventaire-audit.md). 12 tiennent, 9 échos du même trou, 6 last-mile enterprise, 2 faibles. On ne dégèle pas. Après un oui : couler les 12, pas les 28.

Pas un LMS. Pas un module par méthode. Champion gentil = la même famille que le test 1. Difficulté = copies, pas des `id` de plus.

### 2. Difficulté

Sans crans, pas de variantes : des **copies**. Point 2 du template, pas encore figé. **Défaut déjà tranché :** les copies sont dures (marché FR). Pas de mode facile. [disclaimer.md](disclaimer.md).

Réussite ≠ difficulté. Réussite = comment tu sors. Difficulté = comment le cas est tendu (l’ops cache, c’est politique, tu arrives tard — à figer).

### 3. Générateur

L’IA qui multiplie les **cas** pour chaque difficulté d’un parcours. Point 3. Ne crée pas un parcours. Sans les fichiers méthode, elle invente.

### 4. Fichiers méthode

Le modèle est là : [methodes/_modele.md](methodes/_modele.md). **MEDDIC n’est pas écrit.** Ni BANT, ni BEBEDC, etc.

Un fichier `docs/methodes/<slug>.md` par méthode (jeu, lundi, CRM, ChatGPT / Cowork / Grok Bot, psy). Skills agent plus tard. pSEO à la fin (query = titre, CTA = jouer). Pas un blog formation.

Porteurs du test 1 d’abord : MEDDIC, BANT, BEBEDC, coût de l’inaction, SONCAS, CRAC, contreparties, BAC/CAB, points brûlés.

### 5. Cas jouable — test semaine 2

**Call avec l’ops.** HUD = le deal. Google = DAF dit non. Pas de titre « le DAF n’est pas là ». [deroulement.md](deroulement.md).

C’est la **première pièce coulée**, pour voir si le moule tient. 20 commerciaux. Semaine 2, elles reviennent toutes seules. Oui = produit. Non = stop.

- Une quête A+B, `debut` = découverte. Zéro compte, zéro paywall.
- Sortie = échelle de réussite + trou nommé **avec la méthode**.
- **Design** : écran du terrain (Next.js, Tailwind, shadcn). Pas v0 / Grok Build.
- **Landing** : le cas est l’accroche. Un clic → on joue. Pas un Calendly.

## Hors roadmap (mémoire seulement)

Prix 3 € / 19 €, invitations, équipes, C (vacation), **autres étapes du cycle** (après le test), **pages pSEO méthodes**, acquisition Google scale : [reco.md](reco.md). Après le test semaine 2, si oui.
