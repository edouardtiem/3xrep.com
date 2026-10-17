import { createClient } from 'npm:@supabase/supabase-js@2.114.0';
import { createSmartlead } from '../_shared/smartlead.mjs';
import { createSmartprospect } from '../_shared/smartprospect.mjs';
import { createEmailVerifier } from '../_shared/email-verifier.mjs';
import { runOutboundSourcing } from '../_shared/outbound-sourcing.mjs';
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
    const startedAt=Date.now();
    const input = await request.json();
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
    if (input.verifierProbe === true) {
      const { data: policy, error: policyError } = await db.from('outbound_sourcing_config').select('verifier_endpoint,verifier_max_cost_micro').eq('id', 1).single();
      if (policyError) throw new Error('Verification policy unavailable');
      const verifier = createEmailVerifier(Deno.env.get('TREG_TOKEN'), undefined, {endpointId: policy.verifier_endpoint, maxCostMicro: policy.verifier_max_cost_micro});
      // A fixed public provider example tests the hosted connection. No contact
      // lookup/import and no arbitrary paid input is exposed by this probe.
      const proof = await verifier.verify('erol@trykitt.ai', `3xrep-hosted-verifier-${new Date().toISOString().slice(0,10)}`);
      return Response.json({provider:proof.provider,status:proof.status,costMicro:proof.costMicro,callId:proof.callId});
    }
    const { data: sequences, error } = await db.from('outbound_sequences').select('id,provider_campaign_id,controlled,steps').not('provider_campaign_id', 'is', null);
    if (error) throw new Error('Sequence registry unavailable');
    const result = await runOutboundControl({ db, smartlead: createSmartlead(Deno.env.get('SMARTLEAD_API_KEY')),
      dryRun: input.dryRun === true || input.replenishNow === true, sequences: sequences || [] });
    let sourcing: unknown = { status: 'disabled' };
    if (input.dryRun !== true && result.attributionComplete === true) {
      const { data: config, error: configError } = await db.from('outbound_sourcing_config').select('enabled,validated_run_id,verifier_endpoint,verifier_max_cost_micro').eq('id', 1).single();
      if (configError) sourcing = { status: 'unavailable' };
      else if (config.enabled && config.validated_run_id) {
        try {
          sourcing = await runOutboundSourcing({ db,
            smartlead: createSmartlead(Deno.env.get('SMARTLEAD_API_KEY')),
            smartprospect: createSmartprospect(Deno.env.get('SMARTLEAD_API_KEY')),
            verifier: createEmailVerifier(Deno.env.get('TREG_TOKEN'), undefined, {endpointId: config.verifier_endpoint, maxCostMicro: config.verifier_max_cost_micro}),
            controlResult: result, allowWeekend:input.replenishNow === true, resumeDiscovery:true, deadlineMs:startedAt+105000 });
          if (input.replenishNow !== true && sourcing && typeof sourcing === 'object' && 'runId' in sourcing) {
            const continuation = await db.rpc('queue_outbound_reconciliation', {source_run_id:sourcing.runId});
            sourcing = {...sourcing, continuationQueued:continuation.data === true,
              ...(continuation.error ? {continuationError:'RECONCILIATION_QUEUE_UNAVAILABLE'} : {})};
          }
        } catch {
          // Delivery control has already succeeded. Sourcing has its own private log.
          sourcing = { status: 'failed', code: 'SOURCING_FAILED_REVIEW_REQUIRED' };
        }
      }
    }
    return Response.json({ ...result, sourcing });
  } catch {
    // Details remain in the private run/action tables. Never log provider text.
    return Response.json({ error: 'OUTBOUND_CONTROL_FAILED' }, { status: 500 });
  }
});
