# PLG — la ligne gratuit / payant

Figé. 2 septembre 2026. Gagne sur le PRD §12 (essai) et §13.2 (affiliation).

## La ligne

**Le gratuit nomme ce qui est là. Le payant nomme ce qui manque.**

Techniquement : si l'appel porte une donnée de leur CRM, c'est payant. Sinon c'est gratuit, sans compte, sans expiration.

## Pourquoi une ligne de nature, pas un quota

Un quota est arbitraire, il se contourne avec un second compte, il oblige à authentifier dès le premier appel et il crée du support. Une ligne de nature se vérifie dans le schéma d'entrée du tool.

Elle est aussi inviolable par construction. Nommer un trou demande le dossier entier : c'est de l'espace négatif. Une phrase isolée ne peut que confirmer une présence. Qui abuse du gratuit obtient la liste de ce qu'il a déjà — l'inverse du produit (§2).

Et c'est le positionnement : ChatGPT est générique, 3xrep est sur *ce* deal. On offre la zone où le concurrent est déjà gratuit.

## Découpage

| Tool | Entrée | Prix |
| --- | --- | --- |
| `methode_lookup` | Une méthode, une lettre, une notion | Gratuit à vie, sans auth |
| `rattacher` | **Une phrase** entendue en call | Gratuit à vie, sans auth |
| `audit_deal` | Étape, montant, notes, mails, meetings, transcript, next step | 99 € / org |
| `next_question` | Idem | 99 € / org |
| `objection_map` | Idem | 99 € / org |
| Spec d'org versionné | — | 99 € / org |

`rattacher` : cap serveur strict, une phrase, pas un dossier. Au-delà, refus + une ligne factuelle qui dit où est le mur. Rate limit par IP, rien de plus.

Pas d'essai. Pas de quota. Pas d'expiration. Le tool gratuit **est** l'essai et il ne finit jamais.

## Pourquoi gratuit à vie et pas un essai

Un essai qui expire fait désinstaller le connector : on disparaît de leur liste pour toujours. Un serveur qui rend encore un petit service reste branché — distribution dormante, coût nul.

Le LLM appelle les tools seul. Une bonne description de `rattacher` suffit à être invoqué pendant le travail normal, sans que l'humain pense à nous.

Les deux tools gratuits sont du lookup scripté : pas de LLM à nos frais (§9.1).

## Voir le produit avant de payer

Zéro audit gratuit sur leurs données. La démo se passe sur **nos** cas fictifs — [terrain/](terrain/), déjà écrits, aucun risque de confidentialité, et c'est la page pSEO. Le « try before buy » est sur notre contenu, jamais sur leur CRM.

Trois surfaces, dans l'ordre : page publique (la sortie sur un cas fictif) → MCP gratuit (lexique + rattacher) → 99 € (leur deal).

## Le reste du PLG

**L'unité est l'org, jamais l'utilisateur.** À 99 € sans siège, le 12e AE qui connecte coûte de l'infra et rapporte 0 €. Toute mécanique se juge sur : est-ce que ça crée une nouvelle org ? La diffusion interne ne compte que comme preuve avant l'achat.

**L'artefact produit n'est pas viral.** La sortie est une critique privée sur des données confidentielles. Personne ne la partage hors de sa boîte. Ne pas construire la croissance dessus.

**Ce qui se partage, c'est le progrès, pas le trou.** Une case passée de vide à prouvée en six jours : vrai, flatteur pour l'AE, racontable. Seul moment de partage naturel — l'instrumenter.

**Le signal d'achat.** Chaque user OAuth avec son compte. Trois personnes du même domaine = signal. Le produit peut le dire à l'admin. Boucle Figma sans le per-seat.

**Referral en statut, pas en cash.** 20 % de 99 € = 20 € / mois, personne ne bouge. Un playbook co-signé, oui : le co-auteur le partage lui-même, il amène son audience, et chaque playbook épaissit le moat (1/2).

**Les consultants multiplient les orgs.** Un fractional head of sales a 5 à 20 clients. Il publie son playbook privé pour eux, il installe. Self-serve, pas de call — sinon c'est une agence, et c'est le kill du §17.

**Le spec est l'objet viral, pas le MCP.** Un markdown, à eux, qui contient notre URL, et qui voyage quand ils changent de boîte. Exportable, gratuit.

**Les cinq blocs de la [sortie](sortie.md) sont le logo.** On reconnaît un screenshot à sa forme. Ne jamais banaliser la silhouette.

## Interdits

- Footer « propulsé par 3xrep » dans un mail vers le prospect. L'AE le supprime et on perd sa confiance.
- Gamifier les invitations internes : des users sans org, donc du coût pur.
- Plus d'une ligne d'upsell dans une sortie de tool. Le directory review le reproche.
- Un SKU perso à 20 € pour rattraper le layer 0 (§6.3).

## Métrique

Dans l'ordre : install (annuaire) → premier appel gratuit → premier `audit_deal` authentifié → répétition dans la semaine → Stripe. L'install remplace le paiement comme premier événement de conversion ; le reste du §16 est inchangé.
