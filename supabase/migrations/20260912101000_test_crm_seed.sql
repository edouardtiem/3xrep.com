-- Fake B2B seed. No real people, no real customers, no Édouard PII.
-- Nordik / Dune keep the ids already in public.test_crm_opportunities.

insert into test.commerciaux (id, nom, titre) values
  ('7e1a0000-0000-4000-8000-0000000000ae', 'Léa Morel', 'Commerciale')
on conflict (id) do update set nom = excluded.nom, titre = excluded.titre;

insert into test.opportunites (
  id, commercial_id, nom, societe, etape, montant, close_date, derniere_modif, next_step, exhibits
) values
  (
    '2c11a1f1-b343-4cd0-92f1-4fc0b21c88df',
    '7e1a0000-0000-4000-8000-0000000000ae',
    'Nordik',
    'Nordik Isolants',
    'Négociation',
    90000,
    '2026-09-30',
    '2026-09-08 10:00:00+00',
    'Send contract Friday',
    $ex$[
      {"nom":"Julien","date":"2026-09-08","sens":"affirme","piece":"qui-tranche","titre":"ops","auteur":"prospect","source":"transcript","citation":"c'est moi qui fais tourner l'outil au quotidien","test_pose":false},
      {"nom":"AE","sens":"affirme","piece":"qui-tranche","auteur":"rep","source":"note","citation":"Economic Buyer: ok","test_pose":false}
    ]$ex$::jsonb
  ),
  (
    '38caa5a3-0348-434b-9185-0035d635b021',
    '7e1a0000-0000-4000-8000-0000000000ae',
    'Dune',
    'Dune Ateliers',
    'Négociation',
    45000,
    '2026-09-15',
    '2026-07-01 10:00:00+00',
    null,
    '[]'::jsonb
  ),
  (
    'a1000000-0000-4000-8000-000000000003',
    '7e1a0000-0000-4000-8000-0000000000ae',
    'Helios',
    'Helios Mécanique',
    'Proposition',
    180000,
    '2026-10-15',
    '2026-09-10 14:30:00+00',
    'Relancer Marc pour le comité du 22',
    $ex$[
      {"nom":"Marc Duhamel","date":"2026-09-10","sens":"affirme","piece":"besoin","titre":"directeur d'usine","auteur":"prospect","source":"transcript","citation":"on perd trois heures par équipe à recoller les ordres de fabrication","test_pose":false},
      {"nom":"Marc Duhamel","date":"2026-09-10","sens":"affirme","piece":"enjeu-chiffre","titre":"directeur d'usine","auteur":"prospect","source":"transcript","citation":"ça nous coûte autour de cent vingt mille euros par an en heures perdues","test_pose":false},
      {"nom":"Léa Morel","sens":"affirme","piece":"qui-tranche","auteur":"rep","source":"note","citation":"Economic Buyer: ok","test_pose":false}
    ]$ex$::jsonb
  ),
  (
    'a1000000-0000-4000-8000-000000000004',
    '7e1a0000-0000-4000-8000-0000000000ae',
    'Brume',
    'Brume Logistique',
    'Découverte',
    62000,
    '2026-11-30',
    '2026-09-09 09:15:00+00',
    'Call avec Inès la semaine prochaine',
    $ex$[
      {"nom":"Inès Calvet","date":"2026-09-09","sens":"affirme","piece":"besoin","titre":"responsable entrepôt","auteur":"prospect","source":"transcript","citation":"on rate encore des quais parce que le planning est dans trois tableurs","test_pose":false}
    ]$ex$::jsonb
  ),
  (
    'a1000000-0000-4000-8000-000000000005',
    '7e1a0000-0000-4000-8000-0000000000ae',
    'Cèdre',
    'Cèdre Courtage',
    'Qualification',
    38000,
    '2026-10-31',
    '2026-09-07 16:00:00+00',
    'Répondre au mail de Thomas',
    '[]'::jsonb
  ),
  (
    'a1000000-0000-4000-8000-000000000006',
    '7e1a0000-0000-4000-8000-0000000000ae',
    'Forge',
    'Forge Aciers',
    'Négociation',
    210000,
    '2026-10-08',
    '2026-09-11 11:00:00+00',
    'Obtenir un créneau avec le directeur financier',
    $ex$[
      {"nom":"Karim El Yazidi","date":"2026-09-04","sens":"affirme","piece":"champion-vs-coach","titre":"achats","auteur":"prospect","source":"transcript","citation":"je pousse le dossier en interne, je suis votre relais","test_pose":false},
      {"nom":"Karim El Yazidi","date":"2026-09-11","sens":"nie","piece":"qui-tranche","titre":"achats","auteur":"prospect","source":"transcript","citation":"moi je ne signe pas, ça passe au comité et le DAF a le dernier mot","test_pose":true,"reponse":"moi je ne signe pas, ça passe au comité et le DAF a le dernier mot"}
    ]$ex$::jsonb
  ),
  (
    'a1000000-0000-4000-8000-000000000007',
    '7e1a0000-0000-4000-8000-0000000000ae',
    'Nacre',
    'Nacre RH',
    'Découverte',
    28000,
    '2026-12-15',
    '2026-09-05 13:40:00+00',
    'Envoyer un résumé des quatre jours perdus',
    $ex$[
      {"nom":"Sophie Lang","date":"2026-09-05","sens":"affirme","piece":"enjeu-chiffre","titre":"responsable RH","auteur":"prospect","source":"transcript","citation":"on perd quatre jours par mois rien que sur le planning des équipes","test_pose":false},
      {"nom":"Sophie Lang","date":"2026-09-05","sens":"affirme","piece":"budget","titre":"responsable RH","auteur":"prospect","source":"transcript","citation":"si ça sort de mon enveloppe on parle de trente mille euros, pas plus","test_pose":false}
    ]$ex$::jsonb
  ),
  (
    'a1000000-0000-4000-8000-000000000008',
    '7e1a0000-0000-4000-8000-0000000000ae',
    'Silex',
    'Silex Sécurité',
    'Proposition',
    95000,
    '2026-10-20',
    '2026-09-08 17:20:00+00',
    'Préparer les questions sécurité pour Claire',
    $ex$[
      {"nom":"Claire Bosch","date":"2026-09-08","sens":"affirme","piece":"process-papier","titre":"responsable sécurité","auteur":"prospect","source":"transcript","citation":"rien ne passe sans le comité sécurité, et moi je peux bloquer","test_pose":false}
    ]$ex$::jsonb
  ),
  (
    'a1000000-0000-4000-8000-000000000009',
    '7e1a0000-0000-4000-8000-0000000000ae',
    'Lichen',
    'Lichen Coop',
    'Qualification',
    54000,
    '2026-09-20',
    '2026-06-01 08:00:00+00',
    'Relancer Marie, fiche gelée depuis juin',
    '[]'::jsonb
  ),
  (
    'a1000000-0000-4000-8000-00000000000a',
    '7e1a0000-0000-4000-8000-0000000000ae',
    'Volt',
    'Volt Énergie',
    'Découverte',
    120000,
    '2026-11-12',
    '2026-09-10 08:45:00+00',
    'Call de suivi avec Antoine le 18',
    $ex$[
      {"nom":"Antoine Perrin","date":"2026-09-10","sens":"affirme","piece":"besoin","titre":"directeur de site","auteur":"prospect","source":"transcript","citation":"chaque arrêt non prévu nous coûte une journée de production","test_pose":false}
    ]$ex$::jsonb
  )
on conflict (id) do update set
  commercial_id = excluded.commercial_id,
  nom = excluded.nom,
  societe = excluded.societe,
  etape = excluded.etape,
  montant = excluded.montant,
  close_date = excluded.close_date,
  derniere_modif = excluded.derniere_modif,
  next_step = excluded.next_step,
  exhibits = excluded.exhibits;

-- Appels (Dune, Cèdre, Lichen : aucun)
insert into test.appels (id, opportunite_id, occurred_at, titre, transcript) values
(
  'b1000000-0000-4000-8000-000000000101',
  '2c11a1f1-b343-4cd0-92f1-4fc0b21c88df',
  '2026-09-08 10:00:00+00',
  'Découverte ops — Julien Rault',
  $t$Léa Morel: Merci d'avoir pris le créneau, Julien. Vous êtes responsable exploitation chez Nordik Isolants, c'est ça ?
Julien Rault: Oui. Je fais tourner les équipes sur trois sites. L'outil actuel, on le subit.
Léa: Qu'est-ce qui coince le lundi matin ?
Julien: Les plannings. On recopie encore des lignes à la main. Deux jours perdus par mois, minimum, à recoller ce que les chefs d'équipe ont noté sur papier.
Léa: Et pour signer, c'est qui en face ?
Julien: « de toute façon c'est moi qui fais tourner l'outil au quotidien ». Les gens viennent me voir. La direction me fait confiance là-dessus.
Léa: Il y a un directeur financier dans le circuit ?
Julien: Il valide les gros trucs, oui. Mais pour cet outil, on a l'habitude de signer en décembre. C'est notre rythme. Vous m'envoyez le contrat, je le fais circuler.
Léa: On vise fin septembre dans notre fichier. Ça tient ?
Julien: Si le contrat est propre, je ne vois pas pourquoi ça coincerait. Envoyez vendredi.$t$
),
(
  'b1000000-0000-4000-8000-000000000102',
  'a1000000-0000-4000-8000-000000000003',
  '2026-09-03 09:00:00+00',
  'Premier call — Marc Duhamel, usine',
  $t$Léa Morel: Marc, vous dirigez l'usine Helios Mécanique à Saint-Étienne. Qu'est-ce qui vous a fait accepter ce rendez-vous ?
Marc Duhamel: Les ordres de fabrication. « on perd trois heures par équipe à recoller les ordres de fabrication ». Trois équipes. Ça pourrit le lundi et le jeudi, les jours de changement de série.
Léa: Vous avez déjà chiffré ça ?
Marc: À la louche, oui. Les heures perdues, les retards client. « ça nous coûte autour de cent vingt mille euros par an en heures perdues ». Je n'ai pas fait valider ce chiffre par le contrôle de gestion. C'est mon calcul, sur le cadencier.
Léa: Qui d'autre voit ce sujet ?
Marc: Mon responsable méthodes, Léo. Il est chaud. Le siège, moins. Ils ont un projet usine du futur qui n'avance pas.
Léa: Et la signature, chez vous, ça se passe comment ?
Marc: Moi je recommande. Après, il y a un comité. Je ne tiens pas le stylo.$t$
),
(
  'b1000000-0000-4000-8000-000000000103',
  'a1000000-0000-4000-8000-000000000003',
  '2026-09-10 14:00:00+00',
  'Démo atelier — Marc et Léo',
  $t$Léa Morel: On a repris votre série du jeudi. Léo, ça ressemble à votre tableau ?
Léo Morel (méthodes): Le vrai, oui. Si on coupe la recopie, on gagne la matinée.
Marc Duhamel: Le siège veut une présentation le 22. Ils parlent de budget 2027. Moi je veux démarrer avant, même sur une ligne.
Léa: Le 22, qui sera dans la pièce ?
Marc: Le directeur industriel. Peut-être quelqu'un de la finance. « je ne sais pas encore si le DAF vient ». Léo présentera le gain de temps.
Léa: Est-ce qu'on a un critère écrit pour choisir l'outil ?
Marc: Pas encore. Ils vont comparer avec l'éditeur qu'ils ont déjà vu en mai. Je n'ai pas le nom. On a l'habitude de décider après deux démos, chez nous.$t$
),
(
  'b1000000-0000-4000-8000-000000000104',
  'a1000000-0000-4000-8000-000000000004',
  '2026-09-09 09:00:00+00',
  'Découverte entrepôt — Inès Calvet',
  $t$Léa Morel: Inès, Brume Logistique, vous tenez l'entrepôt de Rungis. C'est quoi la douleur du matin ?
Inès Calvet: Les quais. « on rate encore des quais parce que le planning est dans trois tableurs ». Un pour l'intérim, un pour le frigo, un pour le sec. Hier on a fait attendre un camion quarante minutes. Le transporteur a gueulé.
Léa: Ça arrive souvent ?
Inès: Deux, trois fois par semaine. Mon chef, Paulo, regarde le budget en octobre. Moi je n'ai pas de chiffre à lui donner, juste des histoires de quais.
Léa: C'est Paulo qui signerait ?
Inès: Je crois. Il est directeur d'exploitation. Je n'ai jamais vu le contrat d'un logiciel, moi. « je ne sais pas qui signe, moi je fais tourner l'entrepôt ».
Léa: Un concurrent déjà en place ?
Inès: Un vieux WMS. On ne le touche plus. Les gens ont leurs tableurs par-dessus.$t$
),
(
  'b1000000-0000-4000-8000-000000000105',
  'a1000000-0000-4000-8000-000000000006',
  '2026-09-04 15:30:00+00',
  'Call achats — Karim El Yazidi',
  $t$Léa Morel: Karim, vous êtes aux achats chez Forge Aciers. Le dossier, c'est vous qui le portez ?
Karim El Yazidi: Oui. « je pousse le dossier en interne, je suis votre relais ». Les chefs d'atelier en ont marre des pannes sur le planning de laminage.
Léa: L'enjeu, vous l'avez chiffré ?
Karim: Une ligne arrêtée, c'est cher. On a parlé de deux cent mille euros de contrat, sur trois ans. C'est un ordre de grandeur, pas une validation finance.
Léa: Qui tranche à la fin ?
Karim: On verra. Pour l'instant ils me laissent avancer. Je vous jure que ça va passer. J'ai déjà fait signer des outils comme ça.
Léa: Un comité ?
Karim: Il y en a un, oui, mais ils écoutent les achats quand le besoin est clair.$t$
),
(
  'b1000000-0000-4000-8000-000000000106',
  'a1000000-0000-4000-8000-000000000006',
  '2026-09-11 11:00:00+00',
  'Suivi — Karim, question qui signe',
  $t$Léa Morel: Karim, avant d'envoyer le contrat : quelqu'un d'autre dans le process de décision ?
Karim El Yazidi: Oui. « moi je ne signe pas, ça passe au comité et le DAF a le dernier mot ».
Léa: Il n'y a personne d'autre ?
Karim: Le DAF, Hélène. Elle n'était pas sur les deux derniers appels. Elle veut une note de synthèse et une comparaison avec l'offre allemande. Sans elle, on n'avance pas.
Léa: On peut l'avoir cette semaine ?
Karim: Elle est en clôture. Peut-être la semaine prochaine. Ne m'envoyez pas le contrat comme si c'était plié.$t$
),
(
  'b1000000-0000-4000-8000-000000000107',
  'a1000000-0000-4000-8000-000000000007',
  '2026-09-05 13:30:00+00',
  'Découverte RH — Sophie Lang',
  $t$Léa Morel: Sophie, Nacre RH, vous tenez le planning des équipes siège et terrain ?
Sophie Lang: Oui. « on perd quatre jours par mois rien que sur le planning des équipes ». Les managers m'envoient des messages le dimanche soir pour déplacer des gens.
Léa: Quatre jours, c'est vous qui les comptez ?
Sophie: Moi et une stagiaire. Ce n'est pas un chiffre validé par la finance. C'est notre décompte Excel.
Léa: Et le budget ?
Sophie: « si ça sort de mon enveloppe on parle de trente mille euros, pas plus ». Au-dessus, il faut passer par le CODIR. Je n'ai pas demandé.
Léa: Qui d'autre devrait être dans le prochain appel ?
Sophie: Mon directeur, peut-être. Il n'est pas au courant de ce rendez-vous. Je voulais voir si l'outil était sérieux avant de le déranger.$t$
),
(
  'b1000000-0000-4000-8000-000000000108',
  'a1000000-0000-4000-8000-000000000008',
  '2026-09-08 17:00:00+00',
  'Pré-vente sécurité — Claire Bosch',
  $t$Léa Morel: Claire, vous êtes responsable sécurité chez Silex. L'outil toucherait les accès des commerciaux. Qu'est-ce qui vous fait dire non, d'habitude ?
Claire Bosch: L'hébergement, les journaux, le SSO. « rien ne passe sans le comité sécurité, et moi je peux bloquer ». Ce n'est pas de la mauvaise volonté. On s'est fait peur l'an dernier avec un éditeur qui stockait des exports chez lui.
Léa: Le comité, c'est quand ?
Claire: Toutes les trois semaines. Le prochain est le 24 septembre. Il faut un dossier : architecture, sous-traitants, durée de rétention.
Léa: Qui signe le bon de commande, ensuite ?
Claire: Pas moi. Moi je donne un avis. Le directeur général signe les contrats au-dessus de cinquante mille. Je ne l'ai pas vu sur ce sujet.
Léa: Un concurrent déjà validé côté sécurité ?
Claire: Deux noms en short list. Je n'ai pas le droit de les citer. L'un a déjà un avis favorable de mars, périmé si rien n'est signé d'ici novembre.$t$
),
(
  'b1000000-0000-4000-8000-000000000109',
  'a1000000-0000-4000-8000-00000000000a',
  '2026-09-10 08:30:00+00',
  'Découverte site — Antoine Perrin',
  $t$Léa Morel: Antoine, Volt Énergie, vous dirigez le site de production. C'est quoi l'incident qui vous a fait prendre ce rendez-vous ?
Antoine Perrin: Un arrêt en août. « chaque arrêt non prévu nous coûte une journée de production ». Là, c'était un planning de maintenance lu trop tard. Personne n'avait la même version du fichier.
Léa: Une journée, en argent ?
Antoine: Ça dépend du palier. Sur celui-là, on a parlé de plusieurs dizaines de milliers d'euros. Je n'ai pas la feuille de calcul du contrôleur.
Léa: Qui décide d'un nouvel outil sur le site ?
Antoine: Moi je demande. Le siège achète. Il y a une grille. Je ne l'ai pas sous les yeux. On a l'habitude de grouper les demandes en novembre, pour le budget de l'année d'après.
Léa: Donc une close en novembre, c'est votre calendrier à vous, ou le leur ?
Antoine: Le mien. Je voudrais que ce soit plié avant l'hiver. Je n'ai demandé à personne si c'était réaliste.$t$
)
on conflict (id) do update set
  opportunite_id = excluded.opportunite_id,
  occurred_at = excluded.occurred_at,
  titre = excluded.titre,
  transcript = excluded.transcript;

insert into test.courriels (id, opportunite_id, occurred_at, sujet, corps) values
(
  'c1000000-0000-4000-8000-000000000201',
  '2c11a1f1-b343-4cd0-92f1-4fc0b21c88df',
  '2026-09-08 16:40:00+00',
  'Suite du call — contrat vendredi',
  $t$De: Léa Morel
À: Julien Rault (Nordik Isolants)

Julien, merci pour ce matin. Je vous envoie le contrat vendredi, comme convenu.

Vous avez dit que vous faisiez tourner l'outil au quotidien et que décembre était votre rythme habituel. De notre côté le dossier est en négociation, close au 30 septembre.

Dites-moi si le directeur financier doit être en copie du contrat, ou si ça reste sur votre bureau.

Léa$t$
),
(
  'c1000000-0000-4000-8000-000000000202',
  'a1000000-0000-4000-8000-000000000003',
  '2026-09-10 18:10:00+00',
  'Prépa comité du 22 — Helios',
  $t$De: Léa Morel
À: Marc Duhamel
Cc: Léo Morel

Marc, Léo,

Voici le fil du comité du 22. Vous avez chiffré cent vingt mille euros d'heures perdues — c'est votre calcul d'usine, pas encore celui du contrôle de gestion. Je le laisse tel quel, je n'invente pas une validation.

Questions encore ouvertes de notre côté : qui sera dans la pièce (vous avez dit ne pas savoir si le DAF vient), et contre quel autre éditeur on est comparés.

Léa$t$
),
(
  'c1000000-0000-4000-8000-000000000203',
  'a1000000-0000-4000-8000-000000000005',
  '2026-09-02 10:12:00+00',
  'Besoin planning — Cèdre Courtage',
  $t$De: Thomas Keller
À: Léa Morel

Léa,

On cherche à remplacer nos tableaux de suivi des polices entreprises. Les chargés de clientèle perdent du temps à recoller les échéances. Pas d'appel pour l'instant, agenda saturé jusqu'à fin septembre.

Budget dans le fichier : 38 000 euros. C'est un plafond que j'ai mis, personne en finance ne l'a vu.

Thomas Keller
Responsable développement — Cèdre Courtage$t$
),
(
  'c1000000-0000-4000-8000-000000000204',
  'a1000000-0000-4000-8000-000000000005',
  '2026-09-07 15:50:00+00',
  'Re: Besoin planning — Cèdre Courtage',
  $t$De: Léa Morel
À: Thomas Keller

Thomas, merci. Pour avancer sans rendez-vous : qui signe un contrat à 38 000 euros chez vous, et est-ce qu'un outil est déjà en place ?

Vous avez écrit que le plafond n'avait pas été vu par la finance. Je ne le traite pas comme un budget tenu.

On peut faire un quart d'heure dès que vous avez un trou.

Léa$t$
),
(
  'c1000000-0000-4000-8000-000000000205',
  'a1000000-0000-4000-8000-000000000006',
  '2026-09-11 14:22:00+00',
  'Suite call — le DAF a le dernier mot',
  $t$De: Léa Morel
À: Karim El Yazidi

Karim,

Je note votre phrase de ce matin : vous ne signez pas, ça passe au comité, le DAF a le dernier mot. Merci d'avoir été clair. Je n'envoie pas le contrat.

Dès qu'Hélène a un créneau, j'aimerais l'entendre sur la comparaison avec l'offre allemande. Sans ça, le dossier reste un dossier achats.

Léa$t$
),
(
  'c1000000-0000-4000-8000-000000000206',
  'a1000000-0000-4000-8000-000000000008',
  '2026-09-08 19:05:00+00',
  'Dossier comité sécurité du 24',
  $t$De: Claire Bosch
À: Léa Morel

Léa,

Pour le comité du 24 il me faut : schéma d'architecture, liste des sous-traitants, durée de conservation des journaux. Sans ça je mets un avis défavorable.

Je répète ce que j'ai dit au téléphone : rien ne passe sans ce comité, et je peux bloquer. Ce n'est pas moi qui signerai le bon de commande.

Claire Bosch
Responsable sécurité — Silex Sécurité$t$
),
(
  'c1000000-0000-4000-8000-000000000207',
  'a1000000-0000-4000-8000-00000000000a',
  '2026-09-10 12:00:00+00',
  'Fil du call site Volt',
  $t$De: Léa Morel
À: Antoine Perrin

Antoine, merci pour ce matin. Vous avez dit qu'un arrêt non prévu coûte une journée de production, et que le siège achète selon une grille que vous n'aviez pas sous les yeux.

Je n'ai pas de date de comité, ni de nom côté achats siège. Dès que vous avez le nom, on les met dans le prochain créneau — le 18 si ça tient.

Léa$t$
)
on conflict (id) do update set
  opportunite_id = excluded.opportunite_id,
  occurred_at = excluded.occurred_at,
  sujet = excluded.sujet,
  corps = excluded.corps;

insert into test.notes (id, opportunite_id, occurred_at, corps) values
(
  'd1000000-0000-4000-8000-000000000301',
  '2c11a1f1-b343-4cd0-92f1-4fc0b21c88df',
  '2026-09-08 11:30:00+00',
  $t$Economic Buyer: ok. Champion: Julien. Stage = Negotiation.
Julien est notre champion. Il fait tourner l'outil, la direction lui fait confiance. Closing visé au 30 septembre (lui a parlé de décembre). Envoyer le contrat vendredi.$t$
),
(
  'd1000000-0000-4000-8000-000000000302',
  'a1000000-0000-4000-8000-000000000003',
  '2026-09-10 15:00:00+00',
  $t$Economic Buyer: ok. Champion: Marc + Léo.
Enjeu: 120 k€ / an d'heures perdues — chiffre de Marc, pas du contrôle de gestion.
Comité siège le 22. DAF : pas confirmé. Concurrent vu en mai, nom inconnu.
Next: ne pas envoyer de contrat avant le 22.$t$
),
(
  'd1000000-0000-4000-8000-000000000303',
  'a1000000-0000-4000-8000-000000000004',
  '2026-09-09 10:00:00+00',
  $t$Découverte Brume. Douleur quais / trois tableurs. Inès ne sait pas qui signe. Paulo (exploitation) « regarde le budget en octobre » — c'est un dire d'Inès, Paulo n'était pas là.
Champion: à voir. Inès est ops, pas acheteuse.$t$
),
(
  'd1000000-0000-4000-8000-000000000304',
  'a1000000-0000-4000-8000-000000000005',
  '2026-09-07 16:05:00+00',
  $t$Champion: oui — Thomas Keller, développement. Pas d'appel. Fil mail seulement.
Budget: 38 k€ saisis par Thomas, finance pas dans la boucle.
Close 31 octobre dans le fichier = mon espoir, pas le leur.$t$
),
(
  'd1000000-0000-4000-8000-000000000305',
  'a1000000-0000-4000-8000-000000000006',
  '2026-09-11 11:40:00+00',
  $t$Karim n'est pas champion. Coach. Il l'a dit : il ne signe pas, comité + DAF (Hélène).
Ne pas envoyer le contrat. Étape Négociation dans le fichier = trop tôt.
Concurrent: offre allemande, pas de nom, pas de grille.$t$
),
(
  'd1000000-0000-4000-8000-000000000306',
  'a1000000-0000-4000-8000-000000000007',
  '2026-09-05 14:10:00+00',
  $t$Sophie (RH) : 4 jours / mois sur le planning — son Excel, pas la finance.
Budget: « trente mille si ça sort de mon enveloppe ». Directeur pas au courant du call.
Economic Buyer: non. On n'a parlé qu'à RH.$t$
),
(
  'd1000000-0000-4000-8000-000000000307',
  'a1000000-0000-4000-8000-000000000008',
  '2026-09-08 18:00:00+00',
  $t$Sécurité = veto possible (Claire). Comité 24 sept. DG signe au-dessus de 50 k€ — dire de Claire, DG absent.
Deux concurrents en short list, un avis sécu de mars. Paper process existe, on n'a pas le document.$t$
),
(
  'd1000000-0000-4000-8000-000000000308',
  'a1000000-0000-4000-8000-000000000009',
  '2026-06-01 08:10:00+00',
  $t$Economic Buyer: ok. Champion: Marie.
Call prévu « après les foins ». Rien depuis. Fiche laissée en qualification, close 20 septembre.
Marie Giraud, coopérative, a dit en mai (souvenir, pas de transcript) que le bureau validerait. Aucune preuve dans le dossier.$t$
),
(
  'd1000000-0000-4000-8000-000000000309',
  'a1000000-0000-4000-8000-00000000000a',
  '2026-09-10 09:20:00+00',
  $t$Antoine (site) : arrêt août, journée de production. Pas de chiffre validé.
Siège achète, grille inconnue. Close 12 novembre = calendrier d'Antoine, pas du siège.
Next step: nommer l'acheteur siège avant le 18.$t$
)
on conflict (id) do update set
  opportunite_id = excluded.opportunite_id,
  occurred_at = excluded.occurred_at,
  corps = excluded.corps;

-- Mirror on the existing public dogfood table so supabase-js (public API) can load DealInput.
alter table public.test_crm_opportunities add column if not exists societe text;
alter table public.test_crm_opportunities add column if not exists commercial text;

insert into public.test_crm_opportunities (
  id, nom, societe, commercial, etape, montant, close_date, derniere_modif,
  notes, mails, meetings, transcript, next_step, evidence, exhibits
)
select
  id, nom, societe, commercial, etape, montant, close_date, derniere_modif,
  notes, mails, meetings, transcript, next_step, evidence, exhibits
from test.deal_input
on conflict (id) do update set
  nom = excluded.nom,
  societe = excluded.societe,
  commercial = excluded.commercial,
  etape = excluded.etape,
  montant = excluded.montant,
  close_date = excluded.close_date,
  derniere_modif = excluded.derniere_modif,
  notes = excluded.notes,
  mails = excluded.mails,
  meetings = excluded.meetings,
  transcript = excluded.transcript,
  next_step = excluded.next_step,
  evidence = excluded.evidence,
  exhibits = excluded.exhibits;

comment on table public.test_crm_opportunities is
  'Denormalized mirror of test.deal_input (schema test). Fake CRM for brain tests. Not the product. Not customer data.';
