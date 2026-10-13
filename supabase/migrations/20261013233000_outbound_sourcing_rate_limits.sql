alter table public.outbound_sourcing_config
 add column verifier_endpoint text not null default 'contactout.people.email.verify'
   check(verifier_endpoint in ('contactout.people.email.verify','trykitt.people.email.verify')),
 add column verifier_max_cost_micro integer not null default 0 check(verifier_max_cost_micro between 0 and 1500),
 add column last_attempted_date date,
 add constraint outbound_sourcing_provider_rate check(
   verifier_endpoint='trykitt.people.email.verify' or verifier_max_cost_micro=0);
