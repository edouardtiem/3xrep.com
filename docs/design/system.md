# Système 3xrep — figé (31 août 2026)

HTML : [system.html](system.html). Mockup : [cas.html](cas.html). Tokens : [tokens.css](tokens.css).

Terrain = **fiche record Attio**. On vole le layout (rail, activité, attributs à droite, composer). On ne vole pas le produit (pas de charts, pas de Home / Tasks, pas de kanban).

## Thèse

Un deal qui a l’air sûr. Vert = étape du CRM. Cuivre = chrono. Prise sans le mot AI.

## Décisions

- Layout Attio, sombre **et** clair (`data-theme`, toggle, même HTML).
- Type : **Inter**. Mono uniquement sur le chrono.
- Radius 10px, pills 99px.
- Chrono **imposant**, 15:00. **Départ manuel** à chaque cas (`Démarrer`). Pas de compte à l’ouverture. Pas de pause.
- Micro + texte.

## Écran

```
[ rail 3× ] [ titre + étape + chrono imposant ]
            [ Activité (timeline avatars) | attributs Compte / Opp / Contact ]
            [ composer ]
```

## Tokens

Sombre : `--bg #0e0e10`, `--raise #161618`. Clair : `--bg #f3f3f4`, `--raise #ffffff`. `--sure` = étape. `--copper` = chrono.

## Interdit

Charts, kanban, Add report, chatbot, Ask AI, spoiler, score, chrono qui part tout seul.
