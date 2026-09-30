import { createClient } from 'npm:@supabase/supabase-js@2.114.0';
import { createSmartlead } from '../_shared/smartlead.mjs';
import { runOutboundControl } from '../_shared/outbound-control.mjs';

async function authorized(value: string | null, expected: string | undefined) {
  if (!value || !expected) return false;
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([value, expected].map(s => crypto.subtle.digest('SHA-256', encoder.encode(s))));
  const aa = new Uint8Array(a), bb = new Uint8Array(b);
  let different = 0;
  for (let i = 0; i < aa.length; i++) different |= aa[i] ^ bb[i];
  return different === 0;
}

Deno.serve(async (request: Request) => {
  if (request.method !== 'POST') return new Response(null, { status: 405 });
  if (!await authorized(request.headers.get('x-outbound-secret'), Deno.env.get('OUTBOUND_CRON_SECRET'))) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }
  try {
    const input = await request.json();
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
    const result = await runOutboundControl({ db, smartlead: createSmartlead(Deno.env.get('SMARTLEAD_API_KEY')),
      dryRun: input.dryRun === true });
    return Response.json(result);
  } catch {
    // Details remain in the private run/action tables. Never log provider text.
    return Response.json({ error: 'OUTBOUND_CONTROL_FAILED' }, { status: 500 });
  }
});
