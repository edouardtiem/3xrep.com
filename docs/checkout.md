# Checkout 99 € / org

Figé 3 septembre 2026. Palier septembre : **1 org payante à 99 € avant le 30 sept.** Pas le parcours gratis-d’abord. V0 = cerveau MCP (Claude / ChatGPT Business / Notion). Pas d’UI CRM.

Chemin commercial (2 min) : page [`/install`](/install) — brancher l’agent, **puis** payer. Home : bouton secondaire *Already in?*. Success : `/merci`. Webhook : org `active` + clé.

## Ce que le code lit — noms exacts

Aucun secret n’est dans le git. Ne pas inventer de clés. Ne pas coller une clé d’un autre produit (Mon Parent Agé, jesaisfaire).

| Variable Vercel (Production + Preview) | Où la prendre | Forme |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | Stripe 3xrep → [API keys](https://dashboard.stripe.com/apikeys). Préférer une **restricted key** (`rk_live_…` / `rk_test_…`) : Checkout Sessions write, Customers read, Subscriptions read. Sinon `sk_live_…` / `sk_test_…`. | `rk_…` ou `sk_…` |
| `STRIPE_PRICE_ID` | Price d’**abonnement** créé à la main (ci-dessous). | `price_…` |
| `STRIPE_WEBHOOK_SECRET` | Endpoint webhook (ci-dessous) → Signing secret. | `whsec_…` |
| `SUPABASE_URL` | Projet **3xrep** (pas jesaisfaire) → Project URL. | `https://<ref>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Même projet → service_role (secret). Jamais `NEXT_PUBLIC_`. | `eyJ…` ou `sb_secret_…` |
| `NEXT_PUBLIC_SITE_URL` | URL publique du site. Tant que `3xrep.com` n’est pas accroché au projet Vercel : l’URL `*.vercel.app` de prod. | `https://…` sans slash final |

Optionnel : `DEV_ORG_KEY` (local seulement, déjà dans [`.env.example`](../.env.example)). `NEXT_PUBLIC_MCP_URL` n’est plus le default de la home — l’URL connector = `{NEXT_PUBLIC_SITE_URL}/api/mcp`.

Le code **ne** lit **pas** `STRIPE_SECRET_KEY_LIVE` ni `SUPABASE_SECRET_KEY`. Si le secret est sous un autre nom : 503. Ce n’est pas un faux vert.

## Action humaine Stripe (compte 3xrep)

Le catalogue live du compte injecté dans cet environnement n’a **aucun** Product / Price 3xrep. Créer sur **le Stripe 3xrep** (pas un autre compte) :

1. [Products](https://dashboard.stripe.com/products) → Add product.
2. Nom : `3xrep` (un produit = un plan ; pas deux paliers sur le même product).
3. Price : **Recurring**, **99,00 EUR**, interval **Monthly**. Billing period monthly.
4. Copier l’id `price_…` → `STRIPE_PRICE_ID` sur Vercel.
5. [Webhooks](https://dashboard.stripe.com/webhooks) → Add endpoint :
   - URL : `https://<NEXT_PUBLIC_SITE_URL>/api/stripe/webhook`
   - Events : `checkout.session.completed`, `customer.subscription.deleted`
   - Copier `whsec_…` → `STRIPE_WEBHOOK_SECRET`.
6. Restricted key (recommandé) ou secret key → `STRIPE_SECRET_KEY`. Marquer **Sensitive** dans Vercel.

Mode test : mêmes gestes dans [test mode](https://dashboard.stripe.com/test/products) (`rk_test_` / `sk_test_`, `price_` test, `whsec_` test). Carte `ACCT-000015`. Ne pas encaisser en live pour une recette.

TVA / Stripe Tax : compte FR, clients EU — activer Tax + une registration **avant** `automatic_tax`. Le code ne l’allume pas.

## Action humaine Supabase (projet 3xrep)

Table déjà dans le git : [`supabase/migrations/20260902170000_orgs.sql`](../supabase/migrations/20260902170000_orgs.sql). L’appliquer sur un projet **3xrep**. Ne pas réutiliser jesaisfaire (parké).

RLS on, pas de policy anon — seul le service role écrit. `key_plain` vit le temps d’un `/merci`, puis null.

## Vercel

Dashboard du projet `3xrep-com` → Settings → Environment Variables. Les six noms du tableau, **Production** (et Preview si on recette une PR). Redeploy après.

Prod du 2 sept 18:34 UTC (`cbea67e`, `dpl_HcSZW1tBieRBgVBdyoAyqUnt5RHu`) : **FAIL build TypeScript** (`CopyButton` sans prop `label` sur `/merci` et `/spec`). Pas un secret manquant. Corrigé dans la PR qui porte ce fichier.

`3xrep.com` custom domain : toujours 404 si le domaine n’est pas accroché au projet Vercel. **On ne touche pas au DNS ici.** Pas de miroir GitHub Pages. Tant que le domaine n’est pas lié, poser `NEXT_PUBLIC_SITE_URL` sur l’URL Vercel de prod — sinon `success_url` / URL MCP pointent vers un 404.

## Recette / smoke (sans encaisser)

```bash
# sans clés — attendu : 503, noms des secrets, pas un 200
npm run recette

# avec clés test (jamais live) dans .env.local
# STRIPE_SECRET_KEY=sk_test_… ou rk_test_…
# STRIPE_PRICE_ID=price_…
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
npm run recette
# CHECKOUT 303 + Location checkout.stripe.com — s’arrêter avant de payer
```

Webhook local : `stripe listen --forward-to localhost:3000/api/stripe/webhook` puis coller le `whsec_…` CLI dans `STRIPE_WEBHOOK_SECRET`.

Un test unitaire (`src/lib/stripe-env.test.ts`, `src/app/api/stripe/webhook/webhook.test.ts`) couvre le 503 sans clés et la vérif de signature. Pas de faux vert si les secrets manquent.
