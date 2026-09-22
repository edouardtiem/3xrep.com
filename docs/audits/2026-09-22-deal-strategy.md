# Audit — stratégie par affaire — 22 septembre 2026

Branche : `feat/deal-strategy`, issue de `origin/pre_main` au commit `e42bb80`. Document de cadrage lu : `prompt codex 26_09_22.rtf`. Aucune publication ni fusion en production.

## Résultat du développement

- Stratégie structurée construite après diagnostic : objectif, preuve utilisable, manque, démarche, prochain geste, formulation, questions expliquées, branches conditionnelles et progrès attendu.
- Treize primitives réutilisables. Chemins prioritaires pour accès à l’autorité et budget, puis impact, soutien interne, critères, processus, contrat, concurrence et urgence.
- Même stratégie dans l’analyse d’affaire, la prochaine question, les objections, l’agenda et la revue des affaires. Préparation d’appel et coaching utilisent ce contrat.
- Résumé stratégique avant l’agenda chronologique. Classement explicable, horizons 1/7/30, anticipation achats/juridique, exclusion des affaires closes du résumé.
- Accueil repositionné, démonstration interactive de trois réponses possibles, exemple de discussion budgétaire, identité et conditions Founding 20 conservées.
- Décision datée ajoutée au registre et aux documents concernés. Instructions de l’assistant mises en cohérence.

## Contrôles automatiques

- `npm test` : **142 tests réussis**, aucun échec, aucun test ignoré. Inclut 15 nouveaux scénarios de stratégie et un contrôle spécifique de confidentialité. Les tests existants couvrent aussi preuves, accès, transport, facturation et Founding 20.
- `npx tsc --noEmit` : réussi.
- `npm run lint` : réussi, aucune erreur ni alerte.
- `npm run build` : compilation de production réussie avec Webpack, toutes les routes produites.
- `scripts/strategy-smoke.ts` contre le serveur local de production : initialisation, catalogue, refus sans clé, cinq outils commerciaux, horizons 1/7/30 et pages `/`, `/start`, `/install`, `/docs` réussis.
- `npm run recette` contre le serveur local isolé : réussi. Stripe et Supabase désactivés ; aucun paiement ou compte client utilisé.
- `git diff --check` : réussi.

## Revue du comportement et de la confidentialité

Les scénarios passent par les vrais contrôles de source. Les preuves rejetées, réponses inventées, notes du commercial et contradictions non résolues ne deviennent pas des arguments de stratégie. Un prénom ajouté uniquement aux métadonnées ne devient pas un interlocuteur recommandé. Le français garde ses accents et espaces exacts dans les citations. Sans preuve utilisable, le manque de contexte est explicite.

Le budget sans impact commence par la mesure de cet impact. Un titre de responsable financier ne prouve pas le pouvoir de signer. Un transfert de proposition ne constitue pas un accès. L’objection prix revient au coût confirmé et aux contreparties, sans remise automatique. Le statu quo, le tableur, le travail manuel, la construction interne et un fournisseur nommé sont des alternatives possibles.

La revue des écritures confirme : aucune nouvelle table, aucun nouveau contenu dans le squelette permanent. Un test intercepte ce qui serait écrit et vérifie l’absence du nom, de la citation et de la formulation. Le journal détaillé conserve le contrat de 14 jours. Les instructions interdisent l’envoi automatique et l’invention de faits. Les mesures d’exploration de branches dans le chat sont documentées comme futures, faute d’événement observable par le serveur.

## Audit de l’accueil

Captures et contrôles sur ordinateur 1440 × 1000 et téléphone 390 × 844. Aucun débordement horizontal ni erreur JavaScript. Images chargées. Trois branches testées au clic et activation au clavier vérifiée. Les liens de démarrage et de documentation répondent. La page annonce explicitement des exemples illustratifs et des réponses possibles, sans garantie de gain.

Revue indépendante demandée par la consigne `impeccable` : identité, composition, adaptation mobile, démonstration et conditions commerciales conformes. **Aucune correction matérielle demandée.** Les captures de contrôle sont dans `/tmp/3xrep-strategy-qa/` sur la machine de travail.

## Corrections découvertes pendant les contrôles

- Deux anciennes pages d’essai modifiaient l’état React directement dans un effet. Un abonnement au thème du navigateur et au stockage remplace cet effet pour satisfaire le contrôle du code.
- La navigation des documents importait le prix depuis un module Stripe contenant `node:crypto`. Les constantes publiques sont maintenant dans `src/lib/pricing.ts`, sans import serveur côté navigateur. Les anciens imports serveur restent compatibles.
- Turbopack de Next.js 16.3.3 échouait sur la résolution interne de la police Cormorant d’une ancienne étude. La commande de production utilise désormais `next build --webpack`, option documentée de cette version. Le serveur de développement reste disponible.
- La recette attendait encore un formulaire de paiement anonyme sur `/install`. Elle vérifie désormais le parcours existant par lien signé dans le chat et le nouveau titre de l’accueil.

## Limites et décisions d’architecture

L’ancien `action` reste disponible pour compatibilité. La stratégie est prioritaire dans le contrat et les instructions ; l’ancien résumé ne doit pas la remplacer. Pas de modèle génératif ajouté au serveur. Les formulations sont des règles déterministes, que l’assistant peut mettre en forme dans la langue de l’utilisateur.

Ces essais valident le serveur et le site, pas l’obéissance de tous les assistants ni le résultat sur des ventes réelles. La vérification littérale ne certifie pas indépendamment l’identité ou la véracité du locuteur. La recette de bout en bout avec les connecteurs réels de Claude et ChatGPT Work reste distincte ; aucune connexion client n’a été prétendue testée.

Smartlead, prospection autonome, prévisions de conversion, nouveau tableau de bord et Revenue Engine restent hors périmètre, conformément au cadrage.
