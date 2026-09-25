# Search families for @Edd08x reply waves

This file lives next to [`SKILL.md`](SKILL.md).

Machine copy for live waves: `/workspace/x-wave-config/search.json` (runtime, not in this git). This file is the human mirror in the repo. Live waves must load `search.json`.

**Families find candidates. They never justify a reply.**

The constitution in [`SKILL.md`](SKILL.md) still wins on tone, skip, refuse, and product. A family match is not a reason to send.

Volume targets are **aspiration ceilings, not floors**. Do not invent replies to fill a quota. Zero replies is a good day if nothing passes [`SKILL.md`](SKILL.md).

Do not load [`brand-3xrep-x`](../brand-3xrep-x/SKILL.md) on `@Edd08x`.

## Primary families (required)

### A_crm_vs_field — CRM data vs field reality

Intent: CRM does not match the real deal: stale or missing data, forecast vs conversations, bad stages, info scattered across CRM / email / meetings.

Sample queries:

- `("CRM") ("doesn't match" OR "does not match" OR outdated OR stale) (deal OR opp OR pipeline) -is:retweet lang:en`
- `("Salesforce" OR HubSpot) ("not updated" OR "forgot to update" OR "stage is wrong") -is:retweet lang:en`
- `("forecast") ("doesn't reflect" OR fiction OR "pipeline hygiene") -is:retweet lang:en`
- `("notes in") (email OR Gong OR "Google Doc") (CRM OR Salesforce) -is:retweet lang:en`
- `("close date") (wrong OR lying OR "still says") -is:retweet lang:en`
- `("CRM") ("truth" OR "source of truth" OR "not the truth") (deal OR pipeline) -is:retweet lang:en`

### B_human_decision_ai — Human decision and AI

Intent: Where the human sits when AI recommends an action or drafts a message: approve before send, edit or reject, rules that break when context shifts, who owns the mistake.

Sample queries:

- `("AI wrote" OR "AI drafted") (email OR outreach OR message) (edit OR rewrite OR approve) -is:retweet lang:en`
- `("before it sends" OR "before sending") (AI OR agent OR autopilot) -is:retweet lang:en`
- `("human in the loop" OR "HITL") (outbound OR SDR OR AE) -is:retweet lang:en`
- `("AI agent") ("I still" OR override OR reject OR approve) (send OR email OR call) -is:retweet lang:en`
- `("who is accountable" OR "who owns") (AI OR agent) (wrong OR mistake OR bad) (email OR deal) -is:retweet lang:en`
- `("Claude" OR ChatGPT) (outbound OR "sales email") (review OR "don't send" OR edited) -is:retweet lang:en`

### C_deal_strategy — Deal-level commercial strategy

Intent: Decision on a specific deal: stuck opp, next step, objection, who to involve, missing proof, continue vs wait vs walk away.

Sample queries:

- `("deal is stuck" OR "opp is stuck" OR "deal stalled") -is:retweet lang:en`
- `("next step") (deal OR opp OR prospect) ("not sure" OR unclear OR "what should") -is:retweet lang:en`
- `("objection") (pricing OR security OR "no budget" OR champion) (deal OR close) -is:retweet lang:en`
- `("should I walk" OR "walk away" OR "kill the deal") (deal OR opp) -is:retweet lang:en`
- `("missing") (case study OR proof OR ROI OR "economic buyer") (deal OR close) -is:retweet lang:en`
- `("multi-thread" OR multithread OR "bring in") (champion OR CFO OR legal) (deal) -is:retweet lang:en`

Do not run a bare token `sales` as a query. Phrase it (`"sales email"`, pipeline, deal, opp).

## Author signal (need at least one)

- Real question
- Lived situation or precise problem
- Compares two choices or explains an outcome
- Replies to someone and leaves the door open

No author signal: skip, even if a family query hit.

## Hard skips

- Keyword-only hits (Claude / ChatGPT / AI / CRM / tool name)
- Product ads with no discussion, slogans, generic advice, off-topic, nothing useful to add
- Handles or `parent_id`s in `/workspace/x-negative-feedback/log.jsonl` (runtime refuse log, not in this git). See [`SKILL.md`](SKILL.md).

## Triage

Triage ranks **candidates** only. It does not green-light a send. After a keep, [`SKILL.md`](SKILL.md) still decides.

- **REPLY** — keep as a candidate. One sentence: the precise detail that makes it worth a look. Then the constitution. Family match is not a reason to send.
- **SKIP** — drop. Brief why.
- **CHECK** — only if a missing accessible fact blocks that judgment.
