# Design — références

Études d’écran, pas le produit. Cadrage : [cadrage.md](cadrage.md).

## Rejeté — v1 (30 août 2026)

Hypothèse de départ : un terminal / env. de dev. pour dire « la vente n’est pas du hasard, c’est une méthode ».

`/adhd` a écarté le terminal trop tôt (premières réponses interdites). Deux DA posées à la place, puis **rejetées par Édouard** :

| DA | Où | Pourquoi on n’en veut pas |
| --- | --- | --- |
| **Notaire** | `/da/notaire` | Concept de studio. Un commercial vit déjà dans les actes. Ça sent le bureau, pas le terrain, pas le jeu. |
| **Compensation** | `/da/compensation` | Même piège (liasses, tampons). Risque Memory / QCM. |

À garder des deux : **le trou est de l’architecture** (ligne vide, même taille qu’une ligne pleine), pas un tooltip.

Pages conservées en mémoire visuelle. Ne pas en faire le template.

## Anti-références — conseil / enablement / CRM vente

Ce qu’ils font, et qu’on ne veut pas sur l’écran du terrain.

### HubSpot Sales

![HubSpot Sales Hub](refs/anti-hubspot-sales.png)

- Hero serif + orange + « Get a demo ».
- Dashboard cartes : tasks, outreach, calendar, **Assistant** étoile.
- Chatbot « HubBot — Powered by AI ».
- Copy : AI-powered, pipeline, close deals.

**Interdit chez nous :** demo Calendly, cartes KPI, assistant, orange friendly, serif de brochure.

### Gong

![Gong](refs/anti-gong.png)

- « Revenue AI OS ». Violet, coins ronds, ombres.
- Book a demo. Enablement, Forecast, Agents.
- L’app montrée : chat « How can I help? », objection handling en module.

**Interdit :** OS du revenue, waveform d’appel, coaching live, meeting dans le produit.

### Salesforce Trailhead

![Trailhead](refs/anti-trailhead.png)

- « Apprendre en prenant du plaisir ». Badges, parcours, points, certifications.
- Mascotte, illustration friendly.
- Gamification LMS (exactement le scoreboard que le cadrage tue).

**Interdit :** badge, module terminé, palier, parcours qu’on clôture.

### MEDDIC Academy

![MEDDIC Academy](refs/anti-meddic-academy.png)

- Enroll, modules vidéo, badge LinkedIn, 8 piliers en leçon.
- La méthode devient un **cours** + certif.

**Interdit :** checklist MEDDIC à cocher, certif, « Master the Art of Qualification ».

### Même famille (pas capturés, même verdict)

Highspot / Seismic / Allego / Mindtickle — content + LMS. Outreach / Salesloft — cadences. Clari — forecast. 30MPC — sales-twitter, punchlines. Altify — MEDDIC **dans** Salesforce.

## Références — sites qu’on aime

Linear, Vercel, Stripe (demandés). Étendu : Attio, Raycast, Superhuman, Warp, Resend, GitHub.

On vole le **craft**, pas le métier.

### Linear — l’app, pas le pitch

![Linear](refs/like-linear.png)

- Noir vrai. Densité. Filet, pas d’ombre.
- Couleur = statut / diff, pas glow de marque.
- Liste + panneau de propriétés. Vide = calme.
- Sans pour le chrome, presque-mono pour IDs / diffs.
- Pas de mascotte, pas de « Get a demo » comme thèse.

**Voler :** densité, propriétés, vide architectural, couleur fonctionnelle.  
**Pas voler :** issues de code, agent coding, sidebar produit.

### Vercel

![Vercel](refs/like-vercel.png)

- Noir / blanc. Zéro illustration. Le produit est le message.
- Geist. Boutons pills noirs. Pas d’orange HubSpot.

**Voler :** discipline N&B, pas d’habillage.  
**Pas voler :** le hero marketing « Agentic Infrastructure ».

### Stripe

![Stripe](refs/like-stripe.png)

- Marketing = mesh gradient (ne pas copier — trop « Stripe 2018 »).
- Ce qu’on aime vraiment : **précision** (petit compteur, hiérarchie, une accent).

**Voler :** un accent, le reste se tait. Densité d’info (dashboard, pas le hero).  
**Pas voler :** ruban gradient, « infrastructure financière ».

### Attio

![Attio](refs/like-attio.png)

- Même famille que Linear, appliquée au **CRM**.
- Danger : bento, charts, pipeline. C’est un HubSpot mieux dessiné.

**Voler :** calme, contraste, type.  
**Pas voler :** le CRM. 3xrep n’est pas Attio.

### Autres (liste, pas de capture)

| Site | Pourquoi |
| --- | --- |
| Raycast | Palette commande, clavier, dark sans Matrix |
| Superhuman | Densité, raccourcis, pas de ligue |
| Warp | Terminal **dessiné**, pas un film hacker |
| Resend | Transactionnel, noir, une chose à l’écran |
| GitHub | Listes, diffs, vide de PR |

## Anti-AI look (dark + mono)

Le default IA dark = noir + **vert acide** + glow + scanlines + curseur qui clignote. Gong / « Revenue OS » = violet arrondi + chat.

Pour sortir :

1. **Pas de vert terminal.** Ni vermillon néon.
2. **Pas de glow, pas de CRT, pas de `>_` décoratif.**
3. Couleur = un état (su / supposé / trou), pas une marque.
4. Radius 0–4px. Pas d’ombre. Pas d’orb.
5. Mono pour les **faits**. Sans pour le chrome — ou tout mono si on teste le terminal, sans le costume Matrix.
6. Une deal à l’écran. Pas un dashboard.

## Juste milieu → deux nouvelles DA

Le message d’Édouard tient : méthode, pas chance. Le véhicule se teste **maintenant**, avec le craft Linear/Vercel, pas le costume hacker.

| DA | Où | Pari |
| --- | --- | --- |
| **Console** | `/da/console` | Terminal testé pour de vrai. Tout mono. Noir Linear. Zéro vert. Le dossier est un buffer. |
| **Surface** | `/da/surface` | Milieu : chrome Linear (sans), faits en mono. Deal = une issue. Le DAF = propriété non assignée. |

Les deux : cases vides = architecture. Cas DAF dit non. Pas de score, pas de demo, pas de badge.
