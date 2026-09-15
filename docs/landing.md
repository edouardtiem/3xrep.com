# Landing — 3xrep.com

**Live (15 sept 2026, `pre_main`) :** la maison claire. IBM Plex Sans. Papier `#eef0f2`. Home = la fenêtre Cowork, pas un terminal. L’ancienne page noire Geist Mono est **supprimée**. Ne pas la restaurer.

Maquette live : `src/app/page.tsx` → `src/components/home/Home.tsx`. Preuve : `src/components/home/CoworkDemo.tsx`. `/lp` redirige en 308 vers `/`. Les études `/da/*` restent à part (sombres, Geist, noindex).

Le PRD tient. [v0.md](v0.md) tient pour le slice produit (même porte).

## Maison

Fond papier (`#eef0f2`). Texte `#16171a`. Mute `#5c6168`. Filet `#d5d8dc`. Raise blanc. Police **IBM Plex Sans**. Pas tout mono. Pas de vert, glow, CRT, mesh, orb.

La fenêtre Cowork est un îlot sombre (`#181818`) dans la page claire — le chrome Claude, pas le costume du site.

Même papier sur `/`, `/start`, `/docs`, `/install`, `/spec`, `/merci`. Un header : wordmark → `/`, docs, start.

Desktop (≥ lg) : un tiers texte / deux tiers fenêtre. Gauche sticky : H1 + essai + **Start 14 days free**. Droite : Cowork. Mobile : H1 → fenêtre (chrome téléphone Claude, pas une maison vide, pas le clavier).

## Hero

**Your AI believes your CRM. We don't.**

*14 days free. Then $129 a month for the whole company.* — tout de suite sous. Ça tue la lecture « par siège ». Pas le mot agent. *He lives in Claude.*

CTA : **Start 14 days free** → `/start`. *No card today.* Nav : **docs** → `/docs`. Payer 129 dollars plus bas, pas dans le premier écran. Pas de démo Calendly. Pas d’URL connecteur dans le hero (la clé est sur `/start`).

## Preuve — la fenêtre Cowork

Pas un terminal Cursor. Un juge dans Claude, à côté de HubSpot.

Quatre questions, **le même fil** : *What's stuck this week?* / *Debrief last call* / *Close dates* / *Too expensive.* On clique, ça continue. Claude seul vs Claude + 3xrep : on garde HubSpot, on échange la dernière réponse.

Copy de la fenêtre : plus d’« illegal » (ce n’est pas une négo). Plus de « trou » sur la page. Punch : *He remembers what's missing, not the call.*

Téléphone : chrome Claude, chips, composer. Desktop : sidebar + fil.

## Logos

Bandeau sous le premier écran. *Works with every agent.* Claude · ChatGPT · Gemini · Cursor · Notion. *And these CRMs.* HubSpot · Salesforce · Pipedrive · Attio · Close. Défilement lent. Notion est un agent, pas un fichier client.

## Sous le fold

1. Premier écran : H1 + essai + Start + fenêtre. Un tiers / deux tiers. Sticky.
2. *He lives in Claude or ChatGPT, next to HubSpot. Not inside HubSpot.*
3. Logos.
4. Prix — *$129 a month for the whole company.* Après l’essai. *Gong is about $1,250 a month for a team of ten. We are $129 a month for the whole company.* Bouton Stripe.
5. Ce que ce n’est pas — Gong (*We don't join your calls.*) ; **Not your CRM's assistant. It fills the fields. We say which ones are empty.** ; cours ; « you close Friday ». Puis ce que c’est : *We name what's missing. And the stage in HubSpot that isn't true.*
6. Confiance — footer. **Pas le hero.**

Pas de logos clients, features grid, testimonials, leçon MEDDIC.

## Install / start

Premier geste : **Start 14 days free**. Trois temps, puis l’e-mail. La clé une fois. Claude puis ChatGPT. Cursor plié. Mode d’emploi long : `/install` (manuel après la clé, payer en bas). Spec : `/spec`.

Checkout : *Already in?* $129 / month for the whole company + bouton Stripe. Ancre Gong (~$1,250 / mois pour dix). Chemin : `/install` puis Stripe ([checkout.md](checkout.md)).

## Confiance

**Ligne live (14 sept, item 6) :** *We don’t join your calls. Call text is kept 14 days, then deleted. We keep a hole log (no transcripts) to remember and, with enough cases, to confirm the rule. We don’t write to your CRM.*

On log les bodies des tool calls 14 jours (`mcp_calls`), puis delete. On n’enregistre pas les calls. **Nous** n’écrivons pas dans leur fichier client. La confirmation 42 % n’est **pas** affichée.

## Interdit en copy

« On remplace Gong ». « Tu closes +30 % ». « Tu feras ×3 ». « Tu closes vendredi ». Démo Calendly. Per-seat. « We don’t have access to your data ». Terminal noir / mesh / orb. Un pourcentage de forecast, un classement de reps. *More deals* : pas dans le hero actuel. Pas dans le spec ni les tools. Calculette « $412k × 42% at risk ». « Similar teams convert at 51% ». Le mot **illegal** sur la page publique. Restaurer `SessionTerminal`.

## Histoire (ne pas ship)

1er–4 sept : hero *Hire the VP Sales agent…*, page = terminal Geist Mono, fenêtre Session. Écarté le 14–15 sept : public = gens qui vendent déjà avec Claude / ChatGPT, pas des fondateurs Cursor. Le mock Session reste dans `src/lib/landing.ts` (`SESSION`) pour la densité des posts X — pas pour la home.
