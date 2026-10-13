# 13 octobre 2026 — suivi privé des inscriptions et de l’usage

Édouard demande un tableau rapide sur une nouvelle branche, limité aux inscriptions et à l’usage. Accès par code privé réservé à lui. Les visites de ce tableau ne doivent pas remonter dans Google Analytics. Il autorise ensuite explicitement la production avec `/end`.

Adresse retenue : `monitoring.3xrep.com`. Lecture des mesures existantes de Supabase, hors comptes internes ; aucune nouvelle collecte, aucun droit de modification des organisations. Le tableau ne transforme pas une absence de traces en diagnostic de panne du suivi.

La connexion et la déconnexion, les sessions signées, les erreurs de base, la lecture sur téléphone et l’absence de requêtes Analytics ont été vérifiées avec une base fictive locale. Les 177 tests passent, ainsi que la compilation et la vérification des fichiers modifiés. Le suivi des pages publiques reste présent. Déploiement via `pre_main`, puis `main`. Procédure et limites : [monitoring.md](../monitoring.md).
