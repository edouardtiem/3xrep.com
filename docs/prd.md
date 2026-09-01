PRD — 3xrep (pivot 1er septembre 2026)



Collé dans ce repo : `docs/prd.md`. Copie holding (venture-os). ADR 001.

Session Filtrer /business-brainstorm · 1er septembre 2026 · Édouard Tiem.
Auteur de cette rédaction : agent CoS, d’après les décisions d’Édouard ce jour.
Le cadrage terrain ([terrain/cadrage.md](terrain/cadrage.md), 30 août) reste pour l’historique. Les méthodes : [methodes.md](methodes.md).

Compléments du soir (gagnent sur le PRD) : [icp.md](icp.md) (cible), [loop.md](loop.md) (boucle CRM).



0. Une phrase

Ils créent leur agent commercial. On est le cerveau : méthode versionnée, sur ce qui est déjà dans le CRM. 99 € / mois / organisation. Pas un Gong. Pas un cours. Pas un jeu.





1. Statut & véhicule

















Nom



3xrep — on le garde





Domaine



3xrep.com (acheté, live Vercel)





Git



edouardtiem/3xrep.com — ce git, pas jesaisfaire, pas un troisième repo





Statut



Pivot. Le terrain d’entraînement (30 août) est arrêté comme produit. Même trou, autre interface.





jesaisfaire



Parké. Founder time = 3xrep (déjà noté Notion 30 août). Tunnel live 39 €, 0 charge. Autre job (test à l’embauche). Autre Stripe. On ne recycle pas ce repo.





Dating



Gelé. Inchangé.





MonParentAgé



Ne pas affamer. Seul produit déjà vendu.





Sales Game



Mort. Inchangé.

Le STATUS holding (29 août) disait encore « premier 39 € jesaisfaire = P0 ». Caduc dès ce pivot. À passer dans holding.md au /sync-loops.





2. Le trou (inchangé depuis le 30 août)

Un commercial B2B perd rarement parce qu’il ne connaît pas le script. Il perd parce que le dossier est vide et qu’il ne le voit pas.

Le DAF dit non. Le champion est gentil. Le CRM est au vert. Personne ne peut pointer quelle case manquait — métrique, buyer économique, critère, process, douleur, champion réel.

MEDDIC / MEDDPICC / BANT / BEBEDC le disent depuis trente ans : une lettre vide, ou une case cochée sans preuve, c’est une case vide.

ChatGPT (et Claude) savent recracher SPIN, MEDDIC, Challenger. Trop générique. Ils n’ont pas ce deal. HubSpot et Salesforce, via MCP (2026), donnent aux agents les data. Ils n’ont pas la méthode fiable. Agentforce Sales / Breeze font du next-best-action générique. Gong / Modjo enregistrent et coachent ailleurs.

Le trou 3xrep : nommer le trou, le rattacher à une méthode, dire le next move — sur la fiche, pas dans un deuxième onglet, pas dans un cours.





3. Proposition



Tu crées ton agent. On amène l’expertise commerciale — de « je démarre à zéro » au deal complexe. L’agent lit mails, meetings, notes, transcripts déjà dans le CRM. Il fait la prépa, les angles morts, le follow-up, l’audit. 99 € / mois pour toute l’organisation.

Deux artefacts, pas une plateforme :





Le spec d’agent — le texte qu’il colle pour créer l’agent (Claude Project / Cursor / plus tard HubSpot Agent Builder ou Agentforce). Rôle, ce qu’il a le droit de faire, quels tools appeler. On ne le configure pas pour lui. On ne le hoste pas. Live : [spec-agent.md](spec-agent.md).



Le MCP 3xrep — le cerveau. Tools + playbooks versionnés. Lookup et scoring scriptés. Le LLM du client (Claude, Breeze, Agentforce) n’invente pas le close : il appelle audit_deal, next_question, objection_map.

Ils composent deux MCP : le leur (HubSpot ou Salesforce, officiel) + le nôtre (méthode). On ne construit pas l’intégration CRM. On ne touche pas leur Zoom.

Le site : docs d’install + checkout. Ce n’est pas le produit. Le produit est l’agent qu’ils ont créé.





4. Pivot — ce qui meurt, ce qui reste



4.1 Produit du 30 août (arrêté)

Terrain d’entraînement. Faux deal. Parcours ~15 min. On joue, copains, collègues. Test : 1 parcours gratis, 20 commerciaux, semaine 2 elles reviennent seules. Prix en mémoire : 3 € / sem perso, 19 € / sem équipe.

Arrêté. On n’implémente pas le parcours « Call avec l’ops » / « DAF dit non ». On ne code pas le graphe de jeu. On ne lance pas le go/no-go semaine 2.

4.2 Ce qui reste du 30 août







Reste



Pourquoi





Nom, domaine, git



Véhicule. « 3xrep » tient mieux sur un agent que sur un gymnase.





Le trou (dossier vide)



C’est le même produit intellectuel.





Les méthodes + rattachement



docs/methodes.md + docs/methodes/<slug>.md. Cœur.





Pas de cours, pas de CPF, pas de meeting dans le produit



Inchangé.





Pas de QCM, pas de scoreboard, pas de « une seule bonne grille »



Inchangé.





Fichiers méthode : sections CRM + ChatGPT/Cowork/Grok



C’était déjà le pont. On coupe la section jeu comme interface. On garde le fond.





pSEO méthode plus tard



« MEDDIC economic buyer » — page = rattachement + brancher l’agent, plus « jouer le cas ».





Cycle par étape



Layers / playbooks, plus parcours jouables.



4.3 Ce qui change







Avant (30 août)



Maintenant (1er sept)





Interface = jeu, faux deal



Interface = agent + MCP, vrai deal





On sent le trou sur un cas



On nomme le trou sur leur opportunité





Test = elles rejouent semaine 2



Test = ils connectent et rappellent les tools sur un deal réel





3 € / 19 € semaine



99 € / mois / organisation





Zéro auth, zéro Stripe (le test jeu)



Remote MCP + Stripe + clé / OAuth





Mail = le cas jouable



Mail / page = spec d’agent + URL MCP





CTA = jouer



CTA = créer l’agent, brancher le cerveau

On ne fait pas les deux (jeu + MCP). Side-project. Un produit.

La copy du nom ne promet pas « tu feras ×3 ». Manifeste : aucune promesse de résultat garanti.





5. Ce que ce n’est pas





Un Gong / Modjo / Chorus. On n’enregistre pas. Pas de bot Zoom/Meet. Pas de bibliothèque d’appels. Pas de scorecard manager. Pas de talk-ratio.



Un CRM. Pas un HubSpot. Pas un Salesforce.



Une formation, un LMS, du CPF, de l’OPCO.



Un meeting dans le produit (visio, roleplay vocal, avatar).



Une encyclopédie de techniques (ChatGPT gagne).



Un wrapper LLM à nos frais (« unlimited » + GPT derrière chaque request = kill marge).



Un CLI comme accès principal (les commerciaux n’y vivent pas). Le CLI, seulement si un user le demande, même API que le MCP.



Un setup Agentforce / HubSpot fait par nous (agence = kill).



Du SDR / influenceurs / YouTube comme moteur.



jesaisfaire (embauche). Simple Sales / cabinet (autre git).

« On remplace Gong » est interdit en copy. Vrai : on rend Gong facultatif pour qui a déjà les artefacts dans le CRM. Ils peuvent garder Gong pour la capture et nous prendre pour la méthode.





6. Cible

La coupure utile n’est pas B2C / B2B. C’est la complexité du deal.

6.1 Wedge — aujourd’hui

















Primaire



Founder-seller, AE autonome, ou Sales Ops déjà sur Claude ou Cursor + HubSpot ou Salesforce





Taille



2–15 personnes. Ceux qui ont dit non à Modjo (~99 € / siège, souvent min. de sièges, démo, annuel) et à Gong (ordre de grandeur 100 k€, ~1 300–1 600 $ / user / an)





Besoin



Prépa, angles morts, follow-up, audit — sur la fiche, sans deuxième usine





Achat



Carte. Self-serve. Pas de comité.



6.2 Demain — même SKU

Sales Ops d’une scale-up (~40 sales) qui saura créer des agents seul et voudra tuer une ligne Modjo / réduire le coût. Même produit : une clé, 99 € la boîte, ils branchent.

On ne les chasse pas aujourd’hui. Champion Gong, DPA, admin Salesforce, CRO : le switch est politique. Pas de meeting. Le produit que le Sales Ops de 2027 installe sans nous, c’est celui qu’on refuse d’enterprisifier en 2026 (pas de démo, pas de SSO custom, pas d’onboarding 40 seats, pas de per-seat).

« Réduire les coûts » ouvre la porte Ops. Ce n’est pas la promesse. HubSpot / Salesforce bundleront un agent générique. Gong baissera. Le job reste : méthode sur ce deal.

6.3 Hors cible





VP Sales / CRO qui veut un « remplacement Gong » et une démo.



Équipe qui n’a rien dans le CRM et refuse d’y mettre mails / notes / transcripts — on n’est pas l’enregistreur.



Acheteur qui veut qu’on crée l’agent pour eux.



L&D / formation / CPF.



Layer 0 seul (un individu qui veut un coach perso à 20 €, style ChatGPT Plus) — on accepte qu’il paie 99 € org s’il veut, on ne build pas un SKU perso.





7. Comment ils s’en servent (3 rituels)

L’agent est à eux. Les data restent chez eux.

7.1 Je démarre de zéro (layer 0)

Pas de CRM, ou un tableur. Claude / ChatGPT. Spec d’agent + clé MCP. « Premier prospect, je fais quoi cette semaine. » L’agent sort le geste, pas un cours : qui voir, quoi demander, quoi écrire, quand arrêter. HubSpot pas obligatoire. Un playbook layer 0.

7.2 Pipeline, deals simples (layer 1) — le rituel qui justifie 99 €

MCP HubSpot ou Salesforce déjà là. Ils ajoutent 3xrep. Le matin : « qu’est-ce qui est bloqué, challenge. » L’agent lit les opportunités chez eux, appelle nos tools. Après un call : notes (déjà sur la fiche, ou collées une fois dans le CRM — pas un flux 3xrep). Next move, mail de follow-up, angles morts.

7.3 Deal complexe (layer 2)

Même agent, autre couche. Comité, champion faible, pas de Metric, juridique, process papier. Pas un cours SPIN. Un plan de deal : qui manque, quelle question, quel risque. Le tool choisit le layer selon ce deal, pas selon un persona marketing.

7.4 Ce qu’on ne leur demande pas

« Mets ton transcript dans 3xrep. » Si c’est un copier-coller quotidien vers nous, ça meurt. L’agent lit la fiche. Mails et meetings y sont déjà. Les transcripts y arrivent de plus en plus (HubSpot, Fireflies → CRM). S’il n’y a rien : l’agent dit « il manque le call / la note » — il n’enregistre pas.





8. Layers — tout le layer sales, un MCP

Vision : de zéro au deal complexe, un serveur, plusieurs playbooks. Pas une encyclopédie jour 1.







Layer



Situation



Playbook porteur (v1)





0



Rien / premier prospect



Gestes de démarrage (offre, premier entretien, quand arrêter)





1



Cycle court, peu d’interlocuteurs



Qualif + next move + follow-up (BANT / BEBEDC / CRAC)





2



Cycle long, comité



MEDDIC / MEDDPICC : lettres vides, EB, champion, process, papier

Le lexique ouvert de docs/methodes.md reste la source. On n’enseigne pas le lexique. On rattache. Plusieurs grilles peuvent nommer la même case (Economic Buyer = Authority = Décideurs). Voulu.

Wedge v1 : layer 1–2, rituel challenge / next move / follow-up / prépa sur un deal qui existe. Layer 0 = deuxième playbook, pas un deuxième produit. On n’ouvre pas 200 techniques.





9. MCP — le produit



9.1 Nature

Remote HTTPS. C’est la nouveauté. Un agent code le sort plus facilement qu’un tunnel web (UX, copy, mobile). Schémas + tools + JSON/YAML de playbooks.

Pattern portfolio ai-assembly-scripted-core (jesaisfaire) : l’IA assemble / lit, le cœur est déterministe. On ne vend pas « l’IA décide si ça close ».

Unlimited requests : OK parce que c’est du lookup + scoring scripté, pas un LLM à nos frais.

9.2 Tools — trois, pas plus, en v1







Tool



Job





audit_deal



Cases / lettres : su / supposé / trou. Rattachement méthode + partie. Pas un score /100 de close.





next_question



La question ou le geste qui coûte (convier l’EB, chiffrer l’inaction, tester le champion).





objection_map



Objection → case non tenue → CRAC / contrepartie / coût de l’inaction. Pas une punchline.

Plus tard (pas v1) : prep_meeting, draft_followup (brouillon, le commercial envoie), playbooks layer 0.

Interdit en tool : forecast_close_date, probability_to_win, write_to_crm (ils écrivent via leur MCP CRM s’ils veulent). On ne promet pas le close.

9.3 Contrat d’un audit (même esprit que la mini-situation du 30 août)

Entrée (depuis le CRM MCP ou le message) : étape, montant, notes, mails, meetings, transcript s’il est sur la fiche, next step.

Sortie :





trous nommés { methode, partie, preuve | vide }



next move (une action)



layer utilisé (0 / 1 / 2)



ce qui est interdit : « +20 XP », « tu closes vendredi », « mauvaise réponse c’était MEDDIC »



9.4 Auth & listing







Étape



Auth



Où





Jour 1



Clé API ou OAuth — custom connector



Claude : Settings → Connectors → Add custom connector. Cursor : mcp.json





Listing Claude / Cursor



OAuth 2.1 + PKCE obligatoire pour le directory Claude. Une clé dans un fichier = refusé au listing



Construire vers OAuth même si la clé marche en custom

Claude Team (~50 $/mois, 2 sièges) pour soumettre le Connectors Directory. Coût d’entrée après que le custom connector marche. Privacy policy, 3 prompts d’exemple, HTTPS, /.well-known/oauth-protected-resource.

Cursor Marketplace : plugin + mcp.json, review, souvent open source.

9.5 Spec d’agent (l’objet qu’on forward)

Un texte, versionné dans le repo. Colle dans un Claude Project / GPT / recette Cursor. Dit :





tu es le coach de dossier, pas la bouche (tu n’appelles pas le client)



tu lis le CRM via le MCP HubSpot / Salesforce de l’utilisateur



tu appelles uniquement les tools 3xrep pour la méthode



tu ne promets pas le close



tu nommes le trou avec méthode + partie

Même esprit pour le builder HubSpot / Agentforce plus tard (instructions + actions MCP).





10. « Dans le CRM » — deux endroits, un cerveau



10.1 Jour 1 — à côté du CRM (self-serve)

Claude, Cursor, ChatGPT. Eux créent l’agent. HubSpot MCP ou Salesforce MCP = les data. 3xrep MCP = la méthode. 10 minutes. On n’est pas dans la boucle.

C’est le produit.

10.2 Plus tard — dans le builder CRM (distribution)

HubSpot Agent Builder (2026) : admin (Super Admin / Agent Builder) crée un agent, ajoute des actions MCP. Brancher un MCP externe passe souvent par une app HubSpot + review écosystème (beta). Pas « coller une URL » pour tout le monde.

Salesforce Agentforce : admin enregistre un serveur MCP (Setup), l’ajoute à un agent. Licence Agentforce. MCP encore jeune / beta selon les orgs.

Même tools. L’agent vit dans le CRM.

Pas la v1. Admin, review, tickets. Si c’est le chemin principal : support CRM = kill (contrainte solo).

On ne vend pas « on vous installe Agentforce ».





11. Gong / Modjo — cadre honnête

Ordres de grandeur marché (sources publiques 2026, pas une preuve portfolio) :

















Gong



~1 300–1 600 $ / user / an ; TCV souvent 65–130 k€+ ; démo ; capture (bot) + revenue intelligence





Modjo



~80–99 € / user / mois ; souvent minimum de sièges ; démo ; annuel ; FR/EU, GDPR ; capture + coaching + sync CRM

Ils se font payer surtout pour capturer (le bot entre dans le Meet) et pour le manager qui réécoute.

3xrep n’a pas ça. Fireflies, tl;dv, Otter, HubSpot le font déjà, moins cher que Gong. Le CRM se remplit.

L’ancre prix / copy :



Modjo, c’est ~99 € le siège. 3xrep, c’est 99 € toute l’équipe.

On n’est pas un Gong low-cost. On est l’autre métier : ce qu’on fait du deal une fois les artefacts sur la fiche.





12. Pricing

















Prix



99 € HT / mois / organisation





Unité



Une clé = un workspace = un portail CRM (un HubSpot ou un Salesforce)





Sièges



Aucun. On ne passera jamais au per-seat. Ça casserait l’histoire.





Requests



Unlimited (lookup + score scripté)





Essai



À trancher à l’implémentation : clé limitée N audits ou 7 jours. Pas un call.





Stripe



Compte produit 3xrep, pas jesaisfaire, pas MonParentAgé (deux comptes live jamais mélangés — et ici un troisième produit = son Stripe)

49 € / connexion (idée de départ) : écarté. Trop gadget pour le job. 49 € / boîte : encore trop bas. 199 € : territoire démo.

On ne monte pas le prix pour soigner l’affiliation.

Layer 0 solo vs 99 € : on assume. On vend le rituel d’équipe sur la fiche, pas un coach à 20 €.





13. Distribution (pas un site vitrine)

Le risque n’est pas le build. C’est quelqu’un connecte.

Ordre strict :





Custom connector — URL + spec. Ça marche avant toute review. Le lien checkout = ça.



Annuaires — le vrai canal. Claude Connectors (claude.ai, un clic, progressive discovery). Cursor Marketplace. Registre MCP / PulseMCP / Glama (coût ~0). Un repo, plusieurs manifests.



Une page d’intention — « Créer un agent commercial Claude + HubSpot », tutoriel 10 min, checkout au milieu. Pas un magazine.



pSEO (pseo-programmatic) après — même query × CRM × situation (… deal complexe, … DAF dit non, … MEDDIC economic buyer). Page = rattachement + brancher, pas un article formation. Pas 80 pages avant le premier Connect.



HubSpot Marketplace / AppExchange — seulement quand des gens paient déjà via Claude.



13.1 Interdit comme moteur





Outbound SDR, même automatisé, même « sans call ».



YouTube / mails « sponsoring » des influenceurs sales. Ils vendent un insert 1 500–8 000 €, pas 20 % de 99 €. Commentaire YouTube = spam. Leur inbox sponsor ≠ affiliation SaaS.



Démo, Calendly, « booker 15 min ».



13.2 Affiliation — plus tard, self-serve

Programme (Rewardful / Tolt + Stripe), 20–30 %, payout auto. Pas de négo, pas de brief, pas de call.

20 clients × 99 € × 20 % ≈ 396 € / mois pour le créateur — encore loin d’un insert. La médiane d’un affilié froid = 0.

Ça vient après : MCP qui se connecte, un Stripe, 2–3 users qui ne sont pas nous.

Seeding honnête, à la main, max ~10 personnes qui parlent déjà agents + HubSpot / Claude / MCP : clé, essaie sur un deal, s’ils aiment ils prennent le lien. Pas un volume mondial.

Explee (5–10 $/j, signup, pas de calendrier) : test de message seulement, si on a une URL qui inscrit. Pas le GTM.





14. Acquisition — hypothèse

Les Sales Ops et founders qui ont déjà Claude + un CRM cherchent « créer un agent commercial HubSpot / Claude » et « alternative Modjo ». Ils nous trouvent via le listing Claude/Cursor, puis une page tutoriel. Ils paient 99 € parce qu’un siège Modjo coûte ça, pour toute l’équipe, sans démo.

Canal principal jour 1 : annuaires MCP + une page. pSEO = levier ensuite, pas le moteur de la v1.





15. Wedge MVP (un soir d’agent, pas une usine)

Pas de tunnel web « colle un deal ». Pas de CLI. Pas de 200 techniques. Pas de bot Zoom. Pas de parcours jeu.





Remote MCP : les 3 tools, un playbook (MEDDIC + chevauchements BANT / BEBEDC déjà dans methodes.md).



Spec d’agent (un markdown).



Page : URL custom connector + Stripe 99 € / org + 3 prompts d’exemple.



Compteur : Connect (pas nous) · audit_deal sur un vrai deal · répétition dans la semaine · un Stripe.

Si 1 sans 2 : curiosité MCP. Si 2 sans 3 : gadget. On arrête d’écrire des playbooks, on regarde le spec.

Le site « audit dans le navigateur » testerait un autre produit. On ne le fait pas pour « valider le PMF ».





16. Métriques

Dans l’ordre. Pas de vanity (opens, « ils ont bien noté », meetings bookés).





Quelqu’un d’autre que nous connecte.



audit_deal (ou équivalent) part sur une opportunité réelle.



Ça se répète dans la semaine.



Un paiement Stripe 99 €.

Listing live (Claude et/ou Cursor) = leading indicator, pas le succès.

Interdit comme KPI de go : démo bookée, « le directeur commercial veut voir », NPS du jeu, semaine 2 du parcours.





17. Hard filters (portfolio)







Filtre



Verdict





Solo, zéro embauche



Pass — pas de capture, pas d’onboarding humain





Self-serve, zéro support structurel



Pass si docs d’install. KO si on débogue OAuth HubSpot des clients





Pas de sales call



Pass — 99 € carte





PLG



Pass — valeur = agent branché + premier audit





Side-project



Pass — MCP borné ; kill si on devient Gong





Éthique



Pass — audit, pas « tu closes +30 % »





B2B / split buyer



Zone grise — OK tant que buyer ≈ user (founder / Ops + carte)

Anti-pattern « CRM enterprise » : on évite tant qu’on ne touche pas leur CRM et qu’on ne vend pas à un comité.





18. Leviers portfolio







ID



Statut



Comment on branche





ai-assembly-scripted-core



hypothèse



Tools déterministes, LLM client





stack-saas-solo



planned



Next (page + docs) + Stripe ; le cœur = serveur MCP





self-serve-checkout



planned



99 € / org





pseo-programmatic



planned



Après le premier Connect — méthode × situation × CRM





acquisition-engine



ne pas compter



Dogfood interne plus tard. Pas le canal. Spine jesaisfaire off

Pas orphelin. Acq jour 1 = annuaires, pas encore pSEO — d’où le score Acq 1→2 selon qu’on compte le pSEO branchable (oui, plus tard).





19. Score Filtrer (1er septembre 2026)

Score sur le produit pivoté (méthode sur la fiche, MCP, 99 € org), pas sur le terrain.







Critère



Points



Note





Fit



1 / 2



Naturel en Claude ; « dans le CRM » natif = friction admin. 0 si on enregistre ou on onboard.





Levier



2 / 2



Scripted core + stack + checkout + pSEO branchable





Build



2 / 2



3 tools + playbook + page : un week-end agent





Acq



2 / 2



Listings + « alternative Modjo » / « agent HubSpot » ; pSEO ensuite





WTP



2 / 2



Refus Modjo / Gong = budget réel. 99 € = un siège, toute l’équipe





Moat



1 / 2



Playbooks + rattachement. Le protocole MCP se copie demain





Total



10 / 12



keep (wedge = MCP, pas le jeu)

Risque unique : se réveiller en train de builder un Gong — ou une agence « on vous crée l’agent ».





20. Décisions figées (checklist)

Ne pas « améliorer » sans casser ce PRD.





Nom 3xrep. Domaine 3xrep.com. Ce git.



Ils créent l’agent. On est le cerveau.



99 € / mois / organisation. Jamais de per-seat.



Ancre : un siège Modjo, toute l’équipe.



MCP remote, 3 tools v1, scoring scripté, unlimited.



Pas de CLI v1. Pas de jeu. Pas les deux.



Pas d’intégration HubSpot / Salesforce à nous. Pas de bot d’enregistrement.



Claude / Cursor d’abord. Builder CRM ensuite.



Pas de démo. Pas de SDR. Pas de sponsoring YouTube comme moteur.



Affiliation self-serve après des Connect + un Stripe.



jesaisfaire parké. Pas ce repo. Pas ce Stripe.



Pas de promesse de close, pas « on remplace Gong », pas « tu feras ×3 ».



Une case verte sans preuve = vide. Trou nommé avec méthode + partie.



Layer = complexité du deal, pas B2C vs B2B.





21. Stack (quand on code)

















MCP



Remote HTTPS, tools JSON, playbooks fichiers (reprendre docs/methodes/)





Auth



Clé → OAuth (directory)





Page



Next.js déjà dans ce repo (docs + checkout). Pas un tunnel « colle un deal »





Paiement



Stripe produit 3xrep





Interdit



Grok Build comme usine produit. Bot Zoom. App HubSpot v1. Spine Smartlead. Parcours jeu

Grok = tuyau. Cursor Cloud code. Auteur git edouardtiem <edouard@tiemh.com>.





22. Docs 3xrep — quoi faire de l’existant

Fait le 1er sept soir : [README.md](README.md). Live = `prd.md` + `icp.md` + `loop.md` + `methodes.md`. Le 30 août → `docs/terrain/`.

Consigne d’origine (holding), pour mémoire :







Fichier



Devenir





docs/cadrage.md



Garder. Bandeau en tête : terrain 30 août — arrêté comme produit ; le trou et les méthodes restent. Gagnant : docs/PRD.md.





docs/reco.md



Prix 3 € / 19 € et test semaine 2 = caducs. Pointer ici.





docs/recherche.md



Utile (pourquoi pas Hyperbound / LMS / CYOA). Le trou §1 reste.





docs/methodes.md + docs/methodes/*



Cœur. Section « dans le jeu » → optionnelle / archive. Sections CRM + agent = source des tools.





docs/template-parcours.md, deroulement.md



Archive terrain. Ne pas implémenter.





docs/roadmap.md



Réécrire : MCP → listing → page → pSEO. Plus : moule / générateur de cas / ScrapeGraph usine jeu.





docs/scrapegraph.md



Hors scope du pivot (usine de faux cas). Ne pas relancer.





README.md



Remplacer « terrain d’entraînement » par la phrase §0.





23. Hors scope / plus tard (pas maintenant)





App HubSpot / listing Agentforce.



CLI.



Affiliation live.



pSEO à l’échelle.



Layer 0 comme SKU séparé.



draft_followup / prep_meeting si les 3 tools suffisent.



Mesurer quelles checks prédisent un move de stage (moat data — après usage).



Palier cash septembre : ce PRD n’oblige pas à shipper cette semaine. MonParentAgé continue. jesaisfaire ne reprend pas le founder time.





24. Prochain incrément (repo 3xrep, pas venture-os)





Coller ce fichier en docs/PRD.md.



Bandeau sur cadrage.md / README.md.



Ensuite (run CEO 3xrep) : les 3 tools + un playbook MEDDIC + la page connector.

Pas de CEO holding qui clone depuis venture-os. ADR 001.





25. Historique de la conversation (1er septembre 2026)

Pour ne pas rejouer les débats.





Idée initiale : DB de techniques sales, site gratuit, CLI/MCP 49 € / connexion, unlimited, brancher SF/HS MCP. Filtrer : encyclopédie kill, couche méthode pour agents keep.



Édouard : le MCP est la nouveauté ; le site « colle un deal » est un faux test et plus dur à shipper avec un agent code. Concedé. CLI v1 non.



Usage : vendre la création de l’agent par le client + toute l’expertise, zéro → deal complexe. Rituels et layers. Claude d’abord, CRM builder ensuite.



Distribution : custom → annuaires Claude/Cursor → une page → pSEO. OAuth pour lister.



SDR influenceurs YouTube / mails sponsor / 20 % / 20 clients. Rejeté comme moteur. Affiliation self-serve plus tard. On ne prixe pas pour YouTube.



« On remplace Gong/Modjo, tout dans le CRM, 49 € la boîte. » Intuition oui, slogan non. Pas de capture. 49 € trop bas.



Scale-up 40 sales : demain Ops saura, voudra couper les coûts. Même SKU, pas chassés aujourd’hui.



Prix : 99 € / org / mois, pas 99 € / user. Ancre Modjo. Figé.



jesaisfaire mis de côté pour 3xrep. Pivot 3xrep sur ce projet. On garde le nom.



Fin du PRD. Coller dans edouardtiem/3xrep.com → docs/PRD.md.