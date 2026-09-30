import type { DealInput, Exhibit, PieceId, SourceDocument } from "../brain/types";

export type Passage = { piece: PieceId; person: string; question: string; answer: string };
export type ScenarioState = { id: string; label: string; change: string; deal: DealInput };
export type Playbook = {
  industry?: string; buyingContext?: string;
  topic: "discovery" | "follow-up" | "objections" | "decision";
  examples?: { title: string; text: string }[];
  slug: string; title: string; description: string; answer: string; context: string;
  steps: { title: string; text: string }[];
  actors: { name: string; role: string; limit: string }[];
  limits: string; sources: { label: string; href: string }[]; prompt: string;
  states: ScenarioState[];
};

const passages: Record<string, Passage> = {
  pain: { piece: "besoin", person: "Julien", question: "What problem does your team face?", answer: "Our approval delays are a problem: the team misses customer deadlines." },
  impact: { piece: "enjeu-chiffre", person: "Julien", question: "How have you measured the impact?", answer: "We lose 6 hours per week chasing approvals; the time records confirm those 6 hours." },
  friendly: { piece: "champion-vs-coach", person: "Julien", question: "What will you do internally?", answer: "I like the demo. Send me the proposal and I will see what people think." },
  support: { piece: "champion-vs-coach", person: "Julien", question: "What will you do internally?", answer: "I advocate for this internally and will introduce you to the CFO for the budget decision." },
  authority: { piece: "qui-tranche", person: "Maya", question: "Who can approve or reject this purchase?", answer: "I approve the final purchase budget and nobody else can reject the spending decision." },
};
function deal(keys: string[], objection?: string): DealInput {
  const sources: SourceDocument[] = keys.map(key => ({ id: key, type: "transcript", texte: `Rep: ${passages[key].question}\n${passages[key].person}: ${passages[key].answer}` }));
  const exhibits: Exhibit[] = keys.map(key => ({ source: "transcript", source_id: key, auteur: "prospect", nom: passages[key].person, piece: passages[key].piece, citation: passages[key].answer, question: passages[key].question, reponse: passages[key].answer, test_pose: true, sens: "affirme" }));
  return { nom: "Acme", etape: "proposal", geste: "passe-trous", sources, exhibits, objection,
    contexte: { cycle: "moyen", interlocuteurs: 3, probleme_reconnu: true, moment: objection ? "objection" : "qualification" } };
}
const securityPassages: Passage[] = [
  { piece: "besoin", person: "Aisha", question: "What problem needs addressing?", answer: "Our alert triage is a problem: analysts repeat manual checks and delay investigations." },
  { piece: "enjeu-chiffre", person: "Aisha", question: "What impact have you measured?", answer: "We lose 12 hours per week repeating alert checks; the analyst time records confirm those 12 hours." },
  { piece: "qui-tranche", person: "Rafael", question: "Who approves or rejects the investment?", answer: "I approve the final purchase budget and nobody else can reject the spending decision." },
  { piece: "criteres-achat", person: "Aisha", question: "Which criteria decide the choice and who validates them?", answer: "Our decision criteria compare alert triage time and audit traceability; audit traceability comes first, and I validate both criteria using our agreed test cases." },
];
function securityDeal(criteria: boolean, pilot = false): DealInput {
  const evidence = securityPassages.slice(0, criteria ? 4 : 3);
  const sources: SourceDocument[] = evidence.map((passage, index) => ({ id: `security-${index}`, type: "transcript", texte: `Rep: ${passage.question}\n${passage.person}: ${passage.answer}` }));
  if (pilot) sources.push({ id: "pilot", type: "transcript", texte: "Rep: What did the pilot establish?\nAisha: The pilot looked good on the sample alerts. We have not agreed the decision criteria or completed the supplier review." });
  return { nom: "Northstar", etape: "pilot", geste: "passe-trous", sources,
    exhibits: evidence.map((passage, index) => ({ source: "transcript", source_id: `security-${index}`, auteur: "prospect", nom: passage.person, piece: passage.piece, citation: passage.answer, question: passage.question, reponse: passage.answer, test_pose: true, sens: "affirme" })),
    contexte: { cycle: "long", interlocuteurs: 5, comite: true, papier: true, probleme_reconnu: true, moment: "qualification" } };
}
const actors = [
  { name: "Julien", role: "Operations lead", limit: "Owns the daily problem. His role does not prove buying authority or internal influence." },
  { name: "Maya", role: "Finance lead", limit: "A fictional participant. Her title alone does not prove that she can approve this purchase." },
  { name: "You", role: "Software seller", limit: "Preparing a proposal. You choose what to ask and send." },
];
const meddic = { label: "MEDDICC: the MEDDPICC framework", href: "https://meddicc.com/meddpicc-sales-methodology-and-process" };
export const PLAYBOOKS: Playbook[] = [
  {
    topic: "decision", slug: "economic-buyer-access", title: "How to get access to the economic buyer", description: "Use a confirmed buyer problem to prepare an introduction, test buying authority and give the meeting a decision to make.",
    answer: "Make the introduction useful to the buyer. Start with a problem the customer has confirmed, ask your contact to help prepare the investment discussion, and test who can approve or reject the purchase. A senior title or a forwarded proposal does not establish authority.",
    context: "Acme is evaluating software to reduce approval delays. Julien has confirmed the problem and measured lost time. You are preparing a proposal, but nobody has confirmed who can authorize the purchase.", actors,
    steps: [
      { title: "Give the meeting a purpose", text: "Use the confirmed problem to explain which investment decision needs discussing. Ask your contact what would make that conversation worth the buyer’s time." },
      { title: "Prepare the introduction together", text: "Keep your contact involved. Agree the problem, the open questions and who should join. A promise to introduce you is useful evidence of support; it is not a booked meeting." },
      { title: "Test authority on this purchase", text: "Ask about approval scope and who could still reject the spending decision. When authority is established, move to the buyer’s criteria instead of repeating the access question." },
    ],
    limits: "Buying authority depends on this purchase. Some organizations split budget approval, technical acceptance and signature. The example does not establish a universal buying process or guarantee access.", sources: [meddic],
    prompt: "Help me prepare access to the person who can authorize this purchase. Separate the evidence, assumptions and unknowns. Suggest the next move and what to do if my contact declines the introduction.",
    states: [
      { id: "baseline", label: "No introduction yet", change: "The problem and its impact are documented. Buying authority and internal support remain unconfirmed.", deal: deal(["pain", "impact"]) },
      { id: "introduction", label: "Julien offers an introduction", change: "A new fictional answer documents an observable commitment to advocate and arrange an introduction. A meeting has not happened yet.", deal: deal(["pain", "impact", "support"]) },
      { id: "authority", label: "Maya confirms her authority", change: "In a later fictional conversation, Maya answers the approval-scope question. The engine can now turn to the missing buying criteria.", deal: deal(["pain", "impact", "support", "authority"]) },
    ],
  },
  {
    topic: "decision", slug: "test-sales-champion", title: "How to test your sales champion", description: "Distinguish a friendly contact from internal support with a concrete action, evidence of influence and a clear limit on what you know.",
    answer: "Test support through an action the contact is willing to take inside the company. Ask them to prepare an introduction or bring the problem into a real internal decision. Enthusiasm alone does not prove support, influence or buying authority.",
    context: "Julien likes your approval software demo. Acme has documented six hours a week lost chasing approvals. Julien offers to share the proposal internally, but you have not seen him advocate for the purchase or open a validation.", actors,
    steps: [
      { title: "Separate interest from support", text: "A good conversation tells you the contact is interested. Ask what they are willing to do internally and what the decision changes for them." },
      { title: "Ask for a visible action", text: "Prepare one useful step together: an introduction, an internal discussion or the next validation. Ask what they can organize and when, without supplying an invented date." },
      { title: "Check the limits of that evidence", text: "An accepted action supports the next move. It does not independently verify political influence or prove the action happened. Revisit the evidence after the internal conversation." },
    ],
    limits: "The engine recognizes evidence of advocacy and an observable commitment. That is narrower than independently proving every MEDDIC Champion requirement. A contact can support you without controlling the final decision.", sources: [meddic, { label: "MEDDICC: mistaking a champion for an economic buyer", href: "https://meddicc.com/meddicc-media/medmen-s2-ep1-misidentifying-champions" }],
    prompt: "Help me test my internal support on this deal. What action would establish support, what is only assumed, and how should the strategy change if the contact refuses or accepts?",
    states: [
      { id: "baseline", label: "A friendly contact", change: "The quoted response shows interest and an offer to circulate a document. The internal decision remains blocked on untested support.", deal: deal(["pain", "impact", "friendly"], "I need to discuss this internally.") },
      { id: "supports", label: "Julien commits to advocate", change: "Replace the earlier response with a fictional commitment to advocate and make an introduction. Buying authority is still unconfirmed.", deal: deal(["pain", "impact", "support"]) },
    ],
  },
  {
    topic: "objections", slug: "too-expensive-objection", title: "How to respond to “it’s too expensive” in B2B sales", description: "Clarify a price objection, verify the cost of the problem and distinguish value from a missing budget before discussing a concession.",
    answer: "Ask what the buyer is comparing the price with. Check the impact using their evidence, then separate disagreement about value from a funding constraint. A discount should follow a clear discussion of scope and a verifiable exchange; it should not substitute for understanding the objection.",
    context: "Acme is considering your approval software. Julien confirms missed customer deadlines, then says the price is too expensive. At first, the deal has no customer-confirmed measure of the problem’s impact.", actors,
    steps: [
      { title: "Clarify the comparison", text: "Ask whether the concern is the cost of the problem, another option or the available funding. Treat the response as something to investigate." },
      { title: "Verify the impact", text: "Ask how the buyer measured the time, cost or risk, and who can confirm it. Six hours of lost time does not automatically become cash savings or a return on investment." },
      { title: "Separate value and funding", text: "When the impact is confirmed, ask whether an existing budget can fund the change or a new investment must be approved. Discuss concessions only with an explicit scope and counterpart." },
    ],
    limits: "The scenario measures lost time, not revenue, guaranteed savings or willingness to pay. A budget constraint may remain even when the buyer recognizes value. The next move is a question to test, not a guaranteed way to overcome the objection.",
    sources: [{ label: "Salesforce: common sales objections", href: "https://www.salesforce.com/blog/sales/overcoming-sales-objections-5-tips-to-try/" }],
    prompt: "The buyer said it is too expensive. Use the exact objection and the evidence I provide to distinguish impact, alternatives and funding. Suggest the next question and conditional follow-ups without inventing savings or offering an automatic discount.",
    states: [
      { id: "baseline", label: "Impact not measured", change: "The problem is documented, but no measured impact supports the price conversation.", deal: deal(["pain"], "It is too expensive.") },
      { id: "impact", label: "Julien confirms the time lost", change: "A fictional follow-up supplies a measure and its source. The strategy now returns to the confirmed impact to clarify the comparison.", deal: deal(["pain", "impact"], "It is too expensive.") },
      { id: "funding", label: "The concern is missing funding", change: "Keep the impact evidence and explore a clarified funding objection. A measured problem does not prove that a budget exists.", deal: deal(["pain", "impact"], "We cannot afford it; there is no budget.") },
    ],
  },
  {
    topic: "decision", slug: "cybersecurity-pilot-decision", industry: "Cybersecurity", buyingContext: "Cybersecurity software purchase · Technical evaluation, supplier review and investment approval",
    title: "How to turn a cybersecurity pilot into a buying decision",
    description: "Agree the evidence a security evaluation must produce, identify who accepts it and separate technical success from supplier review and investment approval.",
    answer: "Before expanding a pilot, agree what the buyer needs to verify, how they will test it and who accepts the result. A positive technical reaction is useful feedback; it does not establish decision criteria, supplier approval or a funded purchase. Keep those validations separate and prepare the next unresolved one.",
    context: "Northstar is evaluating alert-triage software. Aisha has documented repeated analyst checks and twelve hours lost per week. Rafael confirms investment authority. A technical pilot is underway, but the team has not agreed which evidence will decide the choice. Supplier review and contracting remain separate, unconfirmed steps.",
    actors: [
      { name: "Aisha", role: "Security operations lead", limit: "Owns the technical evaluation. Her positive feedback does not prove supplier approval or budget authority." },
      { name: "Rafael", role: "Investment owner", limit: "Answers the investment-authority question in the synthetic source. This does not complete technical, supplier or contract review." },
      { name: "You", role: "Cybersecurity software seller", limit: "Prepare agreed tests and the next buyer validation. Do not certify compliance or promise procurement clearance." },
    ],
    steps: [
      { title: "Agree what the pilot must establish", text: "Ask which requirements will separate the options, their order and who accepts the result. For this fictional deal, audit traceability and triage time are candidate criteria until the buyer confirms them. Agree test cases and acceptance evidence before expanding the evaluation." },
      { title: "Separate technical acceptance from supplier review", text: "Ask which data, access and supplier-assessment questions apply to this purchase, who owns each review and what they need from you. Use the buyer’s requirements; a generic security checklist does not establish their approval." },
      { title: "Prepare the buying decision", text: "After criteria are agreed, confirm the remaining validations and their order. A successful test does not fund the investment or finalize the contract. Keep the buyer’s review owners involved before sending a proposal." },
    ],
    limits: "This is a sales example, not a security assessment or compliance determination. The engine checks evidence for its existing sales pieces; it does not validate the product’s security, score a pilot or certify supplier approval. NIST describes supplier-risk assessment practices, not a universal buying sequence or a requirement applying to every buyer.",
    sources: [meddic, { label: "NIST: cybersecurity supply-chain due diligence assessment", href: "https://csrc.nist.gov/pubs/sp/1326/final" }],
    prompt: "Help me prepare the buying decision after this cybersecurity pilot. Separate technical feedback, accepted decision criteria, investment authority, supplier review and contracting. Use only the buyer evidence I provide. Suggest the next validation and the question to ask without treating a successful pilot as approval to buy.",
    states: [
      { id: "baseline", label: "Pilot criteria not agreed", change: "The problem, measured impact and investment authority have source evidence. Decision criteria and the remaining validations are still unknown.", deal: securityDeal(false) },
      { id: "positive-pilot", label: "The pilot looks good", change: "A positive technical reaction is added to the source. It does not establish accepted criteria or supplier approval, so the next move still asks for criteria.", deal: securityDeal(false, true) },
      { id: "criteria", label: "Aisha confirms the criteria", change: "Aisha names the criteria, their order, the tests and who validates them. The engine can move beyond the criteria gap; supplier review and contracting remain unconfirmed.", deal: securityDeal(true, true) },
    ],
  },
  {
    topic: "follow-up", slug: "sales-follow-up-email", title: "Sales follow-up email after no response: what to say next",
    description: "Write a useful B2B follow-up after a meeting, demo or proposal. Use buyer evidence, ask one clear question and prepare for a reply or continued silence.",
    answer: "Start from the buyer’s last confirmed priority, then ask for one useful next step. After no response, check the agreed timing before sending another email. Silence does not tell you whether the buyer is busy, unconvinced or unable to move the decision forward. A follow-up should help you learn which situation applies.",
    context: "After discussing approval delays, Julien received a proposal and has not replied. Acme has confirmed the problem and its measured impact, but the seller has no evidence of buying authority. In the second fictional state, Julien replies with a commitment to advocate and arrange an introduction. The engine uses that evidence; it does not infer a reason for the earlier silence.", actors,
    steps: [
      { title: "Check the last agreement", text: "Read the conversation before writing. If the buyer gave a review date or asked you to wait, use that agreement. If there is no agreed date, decide on a reasonable follow-up for this relationship rather than treating a fixed cadence as a buying signal." },
      { title: "Connect the email to a decision", text: "Mention a problem the buyer actually confirmed. After a meeting, check the next validation. After a demo, ask which requirement still needs testing. After a proposal, clarify the investment discussion or review owner. Use one question instead of several competing requests." },
      { title: "Prepare for the answer and the silence", text: "If the buyer gives a blocker, work on that blocker. If they accept an introduction, prepare it together. If they continue not to respond, review whether another contact or a respectful pause is appropriate. Do not record silence as rejection, support or purchasing authority." },
    ],
    examples: [
      { title: "After a proposal with no response", text: "Subject: Acme’s approval delays\n\nHi Julien, you confirmed that the team loses six hours a week chasing approvals. To make the proposal useful for the investment discussion, would you help prepare a conversation with the person who can approve this purchase?" },
      { title: "After a meeting", text: "Subject: The next step on [confirmed problem]\n\nHi [name], we discussed [buyer’s exact priority]. You mentioned [agreed review or next step]. Is that still the right next step, or has something changed?" },
      { title: "After a demo", text: "Subject: Checking [buyer’s requirement]\n\nHi [name], during the demo you asked about [specific requirement]. Which evidence would your team need to validate it before deciding on the next step?" },
    ],
    limits: "These are editable examples, not messages sent by 3xrep. Replace brackets with verified facts before using them. The engine checks the supplied sales evidence; it does not detect non-response, choose an email cadence or send follow-ups. No template guarantees a reply.",
    sources: [{ label: "HubSpot: follow-up emails after no response", href: "https://blog.hubspot.com/sales/how-to-send-a-follow-up-email-after-no-response" }, meddic],
    prompt: "Help me prepare a follow-up after this buyer stopped responding. Use the last exchange, agreed timing and exact buyer evidence. Separate silence from known blockers. Suggest one useful question and how to proceed if they accept, decline or do not reply. Do not send the email.",
    states: [
      { id: "baseline", label: "No reply to the proposal", change: "Silence adds no buying evidence. The problem and impact are documented; authority and internal support are still unconfirmed.", deal: deal(["pain", "impact"]) },
      { id: "reply", label: "Julien offers an introduction", change: "A fictional reply supplies an observable commitment to advocate and arrange an introduction. The action is now prepared with that support; authority is not yet established.", deal: deal(["pain", "impact", "support"]) },
    ],
  },
  {
    topic: "discovery", slug: "sales-discovery-questions", title: "Sales discovery questions: from a buyer problem to a next step",
    description: "Choose B2B discovery call questions for the evidence you are missing: the problem, measurable impact, buying authority and decision criteria.",
    answer: "Choose the next question from what the buyer has already established. Start with the problem, ask how they measure its impact, then clarify who decides and what they need to validate. A discovery call is a conversation with follow-up questions, not a checklist of answers to collect at any cost.",
    context: "You are discussing approval software with Julien. He confirms missed customer deadlines, but has not measured the impact. In a later fictional answer, he provides six hours lost per week and the time records behind that measure. The priority changes from understanding the impact to testing the buyer’s deadline and the consequences of postponing a change.", actors,
    steps: [
      { title: "Understand the problem in the buyer’s words", text: "Ask what happens today, who is affected and what made the team investigate a change. Follow the answer with a concrete example. A seller’s diagnosis does not establish that the buyer recognizes the problem." },
      { title: "Test the impact and its source", text: "Ask how the buyer measures the effect and who can verify it. Keep the unit and period. Lost hours are not automatically savings, revenue or a purchase budget. If no reliable measure exists yet, agree how to investigate rather than inventing a number." },
      { title: "Prepare the next buyer validation", text: "Once the impact is established, ask who can approve or reject this purchase and what evidence they need. Agree a useful next conversation. A contact’s title, enthusiasm or attendance at a demo does not answer those questions." },
    ],
    examples: [
      { title: "Problem", text: "What happens in the current process, and can you walk me through a recent example?" },
      { title: "Impact", text: "How have you measured the effect, over what period, and who can confirm that measure?" },
      { title: "Buying authority", text: "Who can approve this purchase, and who could still reject it?" },
      { title: "Decision criteria", text: "Which criteria will decide the choice, in what order, and who validates them?" },
    ],
    limits: "These questions are starting points. Adapt them to the buyer’s answers and avoid repeating information already established. Discovery can continue throughout the deal. This example does not establish budget, urgency or a universal order for every purchase.",
    sources: [{ label: "Close: B2B sales discovery questions", href: "https://close.com/blog/discovery-questions" }, meddic],
    prompt: "Help me prepare this discovery conversation. Separate what the buyer has confirmed from assumptions. Choose the most useful missing evidence, the question to ask and possible follow-ups. Do not turn lost time into invented financial savings.",
    states: [
      { id: "baseline", label: "Problem confirmed, impact unknown", change: "Julien has confirmed the problem. There is no source-backed measure of its impact yet.", deal: { ...deal(["pain"]), etape: "discovery" } },
      { id: "impact", label: "Julien provides a measured impact", change: "A fictional answer gives the measure and its source. The buyer’s deadline is still unknown, so the strategy now asks how long the current situation can continue.", deal: { ...deal(["pain", "impact"]), etape: "discovery" } },
    ],
  },

];
export function findPlaybook(slug: string) { return PLAYBOOKS.find(page => page.slug === slug); }
