-- Authorize recovery of the known delivery-policy stop, without clearing history.
update public.outbound_mailboxes
set state=jsonb_set(state,'{auto_delivery_recovery}','true'::jsonb),updated_at=now()
where id=23568551 and approved and state->>'stopped'='true'
  and state->'pending_bounce_ids' ? '10d3d2f4-05ab-48e6-adbc-4feb03ca132d';
