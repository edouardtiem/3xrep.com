# Smartlead autonome — 30 septembre 2026

Édouard demande de déplacer dans le cloud les contrôles locaux et de les exécuter à 1 h, heure de Paris. La montée en charge autorisée reste propre à chaque boîte : sept jours sans prospection, sept jours à 2 par jour ouvré, puis 5, 15 et 25 avec marge de 20 %, sous conditions. Les relances sont comprises ; le préchauffage continue.

Fonction `outbound-control` déployée dans le Supabase 3xrep, sans changement de `main` ni du site. Programme `3xrep-outbound-cloud-01h` actif, avec condition Europe/Paris pour conserver l'heure été/hiver. La synchronisation historique Smartlead et le contrôle des volumes partagent cette exécution. État, admission, verrou et journal sont en tables privées. Les nouvelles adresses sont découvertes sans activation automatique avant admission. Les alertes sont enregistrées dans Supabase ; aucune notification Codex lorsque l'application est fermée.

Validation : 170 tests passent, vérification du code et compilation passent. Un appel sans secret est refusé avec 401. Une simulation hébergée puis un contrôle réel réussissent, avec attribution complète des envois aux boîtes. Le contrôle réel synchronise 40 contacts et huit envois, dont un rebond. Les quatre plafonds restent à 2 ; les trois nouvelles boîtes restent hors campagne. Le rebond historique de la première boîte bloque sa hausse jusqu'à résolution documentée.

Les deux tâches locales sont mises en pause après validation, pour éviter les doublons. La migration du suivi est appliquée seule et enregistrée, sans réparation de l'historique distant différent du dépôt. Limite connue : le traitement historique devra être fractionné avant des volumes beaucoup plus élevés. Une erreur ou un dépassement ne valide jamais une hausse.

Exécution réelle vérifiée : `aff74dfb-953d-4e45-8f84-a7d4000a8de3`, terminée le 30 septembre à 16:12:15 UTC. Plan et exploitation : [smartlead-cloud-control.md](../gtm/smartlead-cloud-control.md).
