<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 3xrep

Nouveau chat : lis [docs/README.md](docs/README.md) dans l’ordre. C’est le produit. Ne te fie pas à la mémoire d’un autre fil.

**Live aujourd’hui** (sur `main`) :

- Cerveau qui juge des preuves (exhibits), pas des formes. [cerveau.md](docs/cerveau.md).
- Journal des appels : entrée + verdict **14 jours**, puis delete. Décision : [docs/decisions.md](docs/decisions.md). On n’entre pas dans les appels. On n’écrit pas dans leur fichier client. Plus « on ne stocke rien ».
- Prix encaissable : **129 dollars / mois / organisation**. Stripe USD. [checkout.md](docs/checkout.md).
- Essai **14 jours** (28 si parrainage). L’horloge part au premier jugement. Carte obligatoire 7 jours après. Tout derrière une clé. Parrain : **129 dollars d’avoir** si le filleul paie. Souvenir des trous + reco d’écriture. Pas le 42 %. Kill switch : `MCP_OPEN_TOOLS=1` (Édouard, absente en prod).

**Direction, pas ship** : [portes.md](docs/portes.md) — un visage par travail, Slack plus tard. Une base à nous = demain, pas un fichier client sans fenêtre. Confirmation 42 % = plus tard.

Cloud : le disque peut dater d’un snapshot. Avant de dire « ça n’existe pas » : `git fetch origin main` et lis `main`.

Édouard dans le chat : [.agents/skills/francais-simple/SKILL.md](.agents/skills/francais-simple/SKILL.md).
