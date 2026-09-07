#!/usr/bin/env bash
# Push production secrets from .env.local to Vercel (project 3xrep-com).
# Prérequis : vercel login && vercel link --project 3xrep-com
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v vercel >/dev/null; then
  echo "vercel CLI manquant" >&2
  exit 1
fi

ENV_FILE=".env.local"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "$ENV_FILE introuvable" >&2
  exit 1
fi

get_var() {
  grep "^$1=" "$ENV_FILE" | cut -d= -f2- | tail -1
}

push() {
  local name="$1"
  local value="$2"
  if [[ -z "$value" ]]; then
    echo "SKIP $name (vide dans $ENV_FILE)" >&2
    return
  fi
  echo "→ $name"
  printf '%s' "$value" | vercel env add "$name" production --force --sensitive 2>/dev/null \
    || printf '%s' "$value" | vercel env add "$name" production --force
}

push STRIPE_SECRET_KEY "$(get_var STRIPE_SECRET_KEY)"
push STRIPE_PRICE_ID "$(get_var STRIPE_PRICE_ID)"
push STRIPE_WEBHOOK_SECRET "$(get_var STRIPE_WEBHOOK_SECRET)"
push SUPABASE_URL "$(get_var SUPABASE_URL)"
push SUPABASE_SERVICE_ROLE_KEY "$(get_var SUPABASE_SERVICE_ROLE_KEY)"
push NEXT_PUBLIC_SITE_URL "https://3xrep.com"

echo "Done. Redeploy : vercel --prod"
