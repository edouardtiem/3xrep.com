-- Record the paid verification of the explicitly approved pilot separately from
-- the free-only scheduled worker. Costs here are evidence, never spending rights.
alter table public.outbound_sourcing_candidates
 drop constraint outbound_sourcing_candidates_verification_cost_micro_check,
 add constraint outbound_sourcing_verification_cost check(verification_cost_micro between 0 and 10000),
 add column verification_provider text check(verification_provider in ('contactout.people.email.verify','trykitt.people.email.verify','millionverifier.people.email.verify')),
 add column verification_attempts jsonb not null default '[]'::jsonb check(jsonb_typeof(verification_attempts)='array');
