# Founding 20

## Décision en vigueur — 23 septembre 2026

Pendant le recrutement des 20 équipes, la Beta est le seul parcours de nouvelle inscription. La migration `20260923120000_beta_only_signup.sql` bloque en base toute nouvelle organisation d’essai si la Beta est fermée ou si les 20 places ont été attribuées. Le formulaire et sa route appliquent la même règle. Les essais standard et abonnements déjà existants gardent leurs droits. À la sortie de la Beta, une équipe non retenue choisit librement le tarif standard ; aucune carte n’est prise pendant la Beta. Les mentions contraires ci-dessous décrivent la version initiale du programme et ne définissent plus les nouvelles inscriptions.

## Plan d’implémentation — 18 septembre 2026

Branche : `feat/founding-20`, depuis `origin/pre_main`. Aucun changement de production dans cette mission.

- Authentification : clé d’organisation, pas de comptes individuels. Ne pas inventer de nombre d’utilisateurs actifs. Administration par secret serveur dédié.
- Paiement : `/start` crée une organisation sans Stripe ; essai de 14 jours, carte demandée à J+7. Les droits Founding seront indépendants du statut Stripe.
- Migration additive : configuration du programme, droits par organisation, registre permanent des 20 places, événements sans contenu commercial, avis et historique des décisions. Aucune conversion des clients payants.
- Accès : résolution centrale côté serveur ; bêta jusqu’à une date enregistrée ; sortie avec délai annoncé, sans prélèvement automatique.
- Qualification : résultats réellement exploitables, sessions séparées par 30 minutes, plusieurs jours UTC. Les refus et les pages vues ne comptent pas. Daily / 7 Days / 30 Days existent dans `plan_horizon`.
- Attribution : réservation transactionnelle, contrôle des paiements Stripe, confirmation manuelle. Une place révoquée reste dans le registre ; pas de 21e bénéficiaire historique. Les essais utilisent une base séparée.
- Mesures : journal indépendant des appels détaillés purgés à 14 jours, conservation des seuls événements nécessaires à J+30. Source conservée à l’inscription.
- Administration : vue SQL et route serveur protégée, sans nouvelle application de gestion. Attribution, révocation, exclusion, note et configuration du programme.
- Courriels : aucun fournisseur d’envoi dans le dépôt. Préparer les messages et les segments consultables ; aucun envoi automatique ajouté.
- Acquisition : remplacer le brouillon `docs/gtm/gojiberry-sequence.md` par la séquence Founding 20, personnalisations sourcées, campagne à préparer sans envoi.
- Interface : adapter l’accueil, `/start`, `/install` et les indications renvoyées à l’agent. Conserver le style sales buddy.
- Vérification : droits, qualification, concurrence sur les places, autorisation, facturation et retours Stripe ; tests existants, analyse TypeScript, lint et compilation.

Risques à traiter : anciens liens de paiement ouverts, paiement concurrent à l’attribution, appels répétés par un agent, confusion entre organisation et utilisateur, coupure immédiate à la fin de bêta, bases de prévisualisation reliées à la production.

## Fonctionnement livré

### Accès et qualification

`organizationEntitlements` est la décision d’accès côté serveur, utilisée par le connecteur. Priorité : Founding / gratuité interne → date d’accès bêta → abonnement payé → essai standard. Un retour Stripe ne modifie jamais le droit Founding.

À l’inscription, un déclencheur de base décide de l’admission. Si le programme est ouvert et sa date de fin future : état `candidate`, date d’entrée et date limite d’accès enregistrées. Cette limite est la fin du programme plus 14 jours de transition par défaut. Sans programme ouvert, l’essai habituel reste disponible. Aucun client déjà présent ne change de régime automatiquement.

Qualification initiale : **3 résultats utiles, dans 3 sessions, sur 3 jours UTC différents**. Une nouvelle session commence après au moins 30 minutes sans résultat utile dans l’organisation. Un résultat utile vient de `audit_deal`, `pipe_review`, `next_question`, `objection_map` ou `plan_horizon` et contient une action sans refus. Un plan vide, une recherche de méthode, un accès refusé ou une erreur ne compte pas. Une organisation interne ne compte pas.

Les seuils sont configurables dans `founding_program`. Les jours sont UTC, et les sessions sont celles de l’organisation, pas des conversations individuelles. Un appel réussi prouve l’usage du connecteur 3xrep ; il ne prouve pas à lui seul qu’un connecteur HubSpot a été installé. L’approbation humaine vérifie la réalité du travail et l’identité de l’entreprise.

Le droit est porté par `orgs`, pas par l’adresse de la personne qui travaille. Les états Stripe restent dans `status`. `comped` sert à l’accès interne ; `is_internal` exclut les données de test. Les deux sont administrés dans la base, sans exposer un réglage public.

### Les vingt places

`prepare_founding_grant` verrouille la ligne du programme puis celle de l’organisation. Il réserve un numéro libre dans `founding_slots`. La contrainte `1..20`, les identifiants uniques d’organisation et d’entreprise, et le verrou transactionnel empêchent la 21e place et les doublons.

L’attribution passe par `pending`. Le serveur ferme les sessions Stripe de base encore ouvertes et annule l’abonnement de base sans nouvelle facture ni prorata. S’il existe des options dans le même abonnement, seul l’article de base est retiré. Il conserve le client Stripe. Une facture de base encore ouverte ou un échéancier bloque la confirmation : les résoudre dans Stripe puis relancer la même commande. Une erreur ne donne jamais un faux succès.

Ensuite seulement, `finish_founding_grant` accorde `founding`. Les appels répétés sont sans effet supplémentaire. Une révocation conserve le numéro et l’entreprise dans le registre ; elle ne crée pas une place à redistribuer. La même organisation peut retrouver sa place. Une suppression d’organisation attribuée est bloquée par une clé étrangère.

### Facturation

- Plus de paiement anonyme : il faut le lien signé de l’organisation, donné dans le dialogue. Un ancien bouton anonyme renvoie vers `/start`.
- L’ouverture du paiement réserve une opération en base. L’attribution est bloquée tant qu’elle est en cours. Les paramètres et la clé d’idempotence Stripe sont conservés pour reprendre après une interruption.
- Une opération interrompue depuis plus de 20 heures reste bloquée. Vérifier ses sessions dans Stripe et `base_checkout_sessions`, puis résoudre l’opération en base. Ne pas effacer ce verrou sans cette vérification.
- À l’ouverture de la bêta par la route d’administration, les anciens paiements anonymes encore ouverts pour le prix de base sont expirés. Les clients peuvent repartir du lien signé de leur organisation.
- Les notifications Stripe relisent l’abonnement courant pour éviter de restaurer un état périmé. Une option payante ne décide pas des droits du produit de base.
- Si une souscription de base inattendue est reçue pour un Founding, le serveur retire sa base et inscrit `unexpected_base_subscription` dans l’historique. Vérifier les factures associées dans Stripe : les remboursements ne sont jamais inventés ni silencieux.
- Les crédits de parrainage utilisent une clé d’idempotence stable, y compris leur annulation.

Références vérifiées : [expiration d’une session](https://docs.stripe.com/api/checkout/sessions/expire), [annulation d’abonnement](https://docs.stripe.com/api/subscriptions/cancel). Les essais de code utilisent des réponses Stripe simulées ; aucun prélèvement réel n’a été effectué.

## Mise en service

1. Appliquer `supabase/migrations/20260918120000_founding_20.sql` **après les migrations existantes**, d’abord sur la base de recette. Le programme démarre fermé. Ne pas déployer le code avant la migration.
2. Utiliser des bases Supabase différentes en recette et en production. Dans la base de production seulement : `update public.founding_program set environment='production' where id;`. Ne pas faire cela sur une base de test.
3. Configurer `FOUNDING_ADMIN_TOKEN` avec un secret aléatoire d’au moins 32 caractères, serveur seulement. Configurer `FOUNDING_ENVIRONMENT=test` ou `production`. En production, la route exige aussi `VERCEL_ENV=production` ; une prévisualisation ne peut donc pas attribuer de places sur cette base.
4. Les variables Stripe et Supabase existantes restent utilisées. La clé Stripe de test doit être utilisée avec l’environnement test. Une clé restreinte doit permettre la lecture des clients, abonnements, lignes de facture et sessions, l’expiration des sessions et la modification/annulation des abonnements. Les opérations de parrainage gardent leurs droits existants.
5. Déployer sur l’environnement choisi, vérifier une inscription et un appel réel du connecteur en recette, puis ouvrir le programme par `configure`. Aucun abonnement ou compte payant existant n’est converti.
6. Choisir une date de fin à 30–45 jours du lancement. Vérifier `/`, `/start`, `/install` et `/docs/pricing`. Préparer puis activer séparément la campagne Gojiberry.

Le nom `PUBLIC_BETA_ENABLED` n’a pas été ajouté : la configuration en base est partagée par l’admission et le site, sans dépendre d’une reconstruction du site.

## Administration

`GET /api/admin/founding` renvoie la configuration, les organisations, leurs mesures, les avis, la rétention et l’historique. Authentification obligatoire par en-tête `Authorization: Bearer …`. Aucune clé en URL ou dans le navigateur. Réponses non mises en cache. La liste est bornée à 1 000 organisations ; les vues SQL permettent les analyses complètes.

Pour agir : `POST /api/admin/founding`, mêmes en-têtes, `Content-Type: application/json`. Exemples de corps ; remplacer les valeurs d’exemple. L’identifiant est celui de l’organisation affichée par le GET.

```json
{"action":"configure","enabled":true,"endsAt":"2026-11-01T00:00:00Z","transitionDays":14,"minSessions":3,"minActiveDays":3,"minOutputs":3}
```

La date ci-dessus est illustrative. Changer la configuration concerne les **nouvelles** inscriptions. Les dates promises aux organisations existantes sont conservées. `configure` n’est pas une commande de renouvellement des droits existants.

```json
{"action":"grant","orgId":"UUID","company":"verified-company.com","note":"Three active days on real deals; company identity checked."}
{"action":"revoke","orgId":"UUID","note":"Reason for revoking the base entitlement."}
{"action":"exclude","orgId":"UUID","note":"Internal test or duplicate company."}
{"action":"note","orgId":"UUID","note":"Feedback received: weekly review was useful."}
{"action":"end_beta"}
```

`company` est l’identité stable vérifiée de l’entreprise, par exemple son domaine principal en minuscules. Ne pas utiliser le domaine d’un fournisseur de messagerie. Le serveur refuse une organisation non qualifiée, une entreprise déjà attribuée, une organisation interne, un paiement en cours et une 21e place. Un `pending` après erreur se reprend avec **la même** commande d’attribution.

La révocation supprime uniquement le droit permanent. Si une période bêta est encore valable, elle reste valable jusqu’à sa date. Aucun abonnement n’est repris sans passage volontaire par Stripe.

### Fin de bêta

`end_beta` ferme les inscriptions bêta et ramène la date d’accès des participants à la plus proche entre leur date déjà promise et la date actuelle plus le délai de transition. Le répéter ne prolonge pas les droits. Les Founding restent gratuits.

Une fin naturelle à `ends_at` arrête aussi l’admission. À la date individuelle `beta_access_until`, une organisation non Founding et non payante reçoit le lien de paiement. Pas de carte conservée pendant la bêta, donc pas de prélèvement automatique. Le tarif standard reste 129 dollars ; `earlyPromotionCode` peut pointer vers un vrai code de réduction Stripe créé séparément. Aucun prix ou pourcentage futur n’a été inventé.

## Mesures et avis

Événements persistants : `organization_created`, `founding_candidate`, `connector_used`, `meaningful_output`, `activation_achieved`, `founding_qualified`, `founding_granted`. Les événements utiles portent outil, horizon, session et date, sans copie des dossiers ou des résultats. Les premières expériences sont les premières dates correspondantes dans `founding_dashboard`.

`beta_retention` mesure le retour exact à J+1, J+7 et J+30 depuis le premier résultat utile, par date UTC. `NULL` signifie que la cohorte n’a pas encore cet âge. Ne pas le compter comme un abandon. Les événements ne sont pas soumis à la purge de 14 jours des demandes et verdicts ; ils restent disponibles pour les cohortes. Définir leur archivage après l’expérience avant de prolonger cette collecte indéfiniment.

Sources : `utm_source`, `utm_medium`, `utm_campaign`, conservés à l’inscription ; la navigation depuis l’accueil garde l’attribution dans l’onglet. Sans balisage : Google / X / autre référent quand identifiable, sinon direct. Les métadonnées de campagne sont déclaratives, jamais une preuve d’éligibilité.

`workspace_status` affiche les droits et le numéro Founding dans le dialogue. `beta_feedback` enregistre un avis volontaire, positif ou négatif, avec texte optionnel et identifiant du résultat. Le serveur vérifie que ce résultat appartient à l’organisation. Une seconde réponse modifie l’avis, sans le multiplier. Il n’existe pas d’identité individuelle fiable avec une clé partagée : `activeUsers` vaut donc `null` et les avis sont rattachés à l’organisation.

### Tableau à suivre pendant 30 jours

- Inscrits → connecteur utilisé → premier résultat → deuxième session → qualification, par source.
- Délai jusqu’au premier résultat utile ; organisations actives chaque semaine ; jours actifs sur les 7 derniers jours.
- Retour à J+1, J+7, J+30, en excluant les cohortes trop jeunes du dénominateur.
- Usage des horizons 1 / 7 / 30 jours et des outils par organisation.
- Candidats qualifiés, places attribuées, avis positifs/négatifs et raisons des abandons.
- Historique de facturation : aucune opération `pending` oubliée, aucune souscription de base inattendue non vérifiée.

Vues : `founding_dashboard`, `beta_retention`, `beta_lifecycle`. Exemple :

```sql
select day, count(*) filter (where retained is not null) as mature_organizations,
       count(*) filter (where retained) as returned_organizations
from public.beta_retention group by day order by day;

select acquisition_source, count(*) as signups,
       count(first_value_at) as first_value,
       count(*) filter (where sessions >= 2) as returned,
       count(activated_at) as activated
from public.founding_dashboard where not is_internal
group by acquisition_source;

select org_id, tool, horizon, count(*) as outputs
from public.beta_events where kind='meaningful_output'
group by org_id,tool,horizon;
```

Courriels comportementaux : [segments et textes](lifecycle.md). Prospection : [séquence Gojiberry](../gtm/gojiberry-sequence.md). Aucun message envoyé par le code livré.

## Vérification

Tests de droits, autorisation, résultats utiles, migration PostgreSQL réelle embarquée, sessions/jours, attribution répétée, plafond, révocation, blocage des suppressions, permissions et transition. Tests Stripe simulés pour fermer les sessions, préserver les options et bloquer une attribution dont la facturation n’est pas résolue.

La compilation et TypeScript passent. La suite complète passe : 126 tests, dont les scénarios Founding, PostgreSQL et facturation. L’analyse des fichiers modifiés passe ; l’analyse globale trouve deux erreurs préexistantes dans `src/app/da/surface/board.tsx` et `src/app/da/surface-1.1/board.tsx` (mise à jour d’état dans un effet). Les pages bêta ont été vérifiées dans un navigateur à 1 280 pixels et 390 pixels, sur une base simulée locale, y compris le cas des vingt places attribuées.

Le PostgreSQL embarqué exécute les appels concurrents sur une seule connexion ; il valide les contraintes et le plafond, pas une charge multi-connexion sur Supabase. Avant publication : appliquer la migration en recette et vérifier le parcours avec le compte Stripe de test. Aucune migration distante, publication en production ou campagne d’envoi n’est incluse dans les vérifications locales.

La date d’activation conserve aussi les seuils et compteurs au moment de la qualification (`activation_rules`), pour expliquer une sélection même si la configuration change ensuite. Le droit Founding ne se termine pas pour inactivité ; seule une révocation explicite d’administration le retire.
