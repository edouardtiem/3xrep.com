# Suivi privé des inscriptions et de l’usage

Décision du 13 octobre 2026 : un tableau privé des inscriptions et de l’usage, accessible sur téléphone. Mise en production explicitement autorisée par Édouard. Adresse : `https://monitoring.3xrep.com/monitoring`. Le sous-domaine ouvre directement ce tableau.

## Ce que montre la page

Organisations inscrites, premier appel au connecteur, premier résultat utile et organisations ayant reçu un résultat utile dans les sept derniers jours. Les comptes `is_internal=true` sont exclus. Les totaux couvrent toutes les organisations ; la liste affiche les cent inscriptions les plus récentes.

Chaque ligne montre l’adresse d’inscription, la source, la campagne éventuelle, les résultats utiles, les sessions, les jours d’usage et les premières et dernières dates. Ce sont les mesures existantes de `founding_dashboard`. Une session décrit des résultats utiles séparés d’au moins trente minutes. Une clé partagée ne permet pas de compter des personnes distinctes. Un résultat ne prouve pas que le conseil a été appliqué.

La page lit aussi la date du dernier appel conservé dans `mcp_calls`. Ce journal inclut les essais et les appels sans clé, et ne conserve que quatorze jours. Aucune entrée n’est une preuve de panne. La page ne lit ni les demandes détaillées, ni les réponses détaillées, ni les clés. Une lecture en erreur affiche « Les données sont indisponibles », pas des compteurs à zéro.

## Accès

Configurer `MONITORING_PASSWORD`, serveur seulement, avec un code aléatoire d’au moins 24 caractères conservé dans le gestionnaire de mots de passe d’Édouard. Ne pas réutiliser la clé d’un client, une clé Supabase ou `FOUNDING_ADMIN_TOKEN`. Aucun accès n’est possible tant que ce code manque.

Le formulaire transmet le code dans le corps d’une demande HTTPS. Il n’est jamais mis dans l’adresse, le stockage du navigateur ou la session. Le serveur émet une session signée de sept jours dans un cookie `HttpOnly`, `Secure` en production, `SameSite=Strict`, limité à `/monitoring` et au domaine visité. Changer le code invalide toutes les sessions. « Se déconnecter » efface le cookie sur l’appareil. Les formulaires venant d’une autre origine sont refusés. Une limite de tentatives en mémoire complète le code aléatoire ; elle est propre à chaque instance serveur, pas partagée entre les instances Vercel.

La page vérifie la session avant toute lecture Supabase. Elle n’ouvre aucun droit d’administration ou de modification des comptes. Toute personne possédant le code peut entrer : le conserver uniquement pour Édouard, sans le partager.

## Visites privées

Google Analytics et le suivi d’acquisition ne se chargent pas sur `/monitoring`, ses sous-routes ou le domaine `monitoring.3xrep.com`. Les réponses privées bloquent les connexions, images et scripts externes. Elles demandent de ne pas mettre en cache et de ne pas indexer la page. Le sous-domaine n’expose pas les autres routes du produit. Le suivi des pages publiques reste inchangé.

## Mise en ligne

Après autorisation explicite de publication en production :

1. Configurer `MONITORING_PASSWORD` dans Vercel Production, en valeur sensible.
2. Ajouter `monitoring.3xrep.com` au projet Vercel `3xrep-com` et appliquer l’entrée de domaine indiquée par Vercel.
3. Publier cette branche via `pre_main`, puis `main` selon les règles du dépôt.
4. Vérifier, dans une session sans connexion, que les adresses et compteurs ne sont pas servis. Se connecter, vérifier les vrais compteurs et se déconnecter. Confirmer l’absence de requête Analytics sur le sous-domaine.

Aucune migration ni nouvelle collecte n’est requise. Les essais locaux utilisent une base fictive distincte. Les prévisualisations ne doivent pas utiliser la base de production pour simuler la recette.
