# Préparation à la production — 23 septembre 2026

Branche examinée : `feat/deal-strategy`, devant `origin/pre_main`. Aucune fusion ni publication effectuée pendant cet examen.

## Vérifié

- Le moteur de stratégie est livré dans `eecb49e` et exposé par les cinq outils commerciaux. L’audit détaillé du développement est dans [l’audit du 22 septembre](2026-09-22-deal-strategy.md).
- `npm test` : 142 réussites, aucun échec. `npm run lint` et `npm run build` : réussis. La recette du connecteur contre le serveur local sur le port 3005 passe après la mise à jour du libellé du bouton.
- Le projet Supabase lié est `3xrep`. Son historique distant contient la migration `20260918120000_founding_20`. Plusieurs autres numéros de migration diffèrent entre les historiques local et distant ; la présence de cette entrée ne valide pas à elle seule tout le schéma ou le parcours réel.
- Le projet Vercel `3xrep-com` possède les noms de variables nécessaires à Supabase, Stripe et l’administration Beta en production. Leurs valeurs n’ont pas été lues ni testées. Le dernier déploiement de production est prêt et les domaines `3xrep.com` et `www.3xrep.com` y sont associés. La page publique répond en HTTP 200 après redirection vers `www`.

## À faire avant d’ouvrir la Beta aux visiteurs

- Respecter la décision de ne pas payer une base de recette distante. La base locale isolée et Stripe simulé couvrent le code ; avant une campagne, faire un essai interne limité sur le déploiement réel : inscription, appel utile au connecteur, accès et statut d’une organisation. Ne pas relier une prévisualisation Vercel à la base de production pour simuler une recette.
- Essayer le parcours dans Claude avec ses vrais connecteurs. Le parcours ChatGPT Work reste à vérifier de bout en bout ; l’accueil l’annonce déjà.
- Vérifier sur la base destinée à la production l’état du programme Beta, son échéance, les places déjà attribuées et la correspondance avec l’environnement Vercel. Une variable présente n’en prouve pas la valeur.
- Décider explicitement si le lancement ouvre la Beta. Tant qu’elle est fermée, `/start` crée un essai standard de 14 jours qui ne réserve aucune place. Si le visiteur ajoute une carte au septième jour, le parcours Stripe crée un abonnement avec fin d’essai ; il faut vérifier ce comportement réel avant une campagne promettant une sélection gratuite à vie.
- Vérifier le paiement en mode test et le retour des notifications Stripe, sans paiement réel. Si cela exige une base distante supplémentaire, expliciter cette limite au lieu de présumer sa création. Préparer le retour au déploiement précédent avant le passage sur `main`.

Avis : le moteur est validé localement. La mise en production avec recrutement Beta n’est pas encore validée de bout en bout. Ne pas confondre le succès des tests locaux avec l’ouverture effective du programme.
