import Link from "next/link";
import { Header } from "@/components/Header";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { Blob } from "./Blob";
import { StrategyDemo } from "./StrategyDemo";
import { Hand } from "./Hand";
import styles from "./buddy.module.css";

function Start({ children = "Try 3xrep now" }: { children?: React.ReactNode }) {
  return <Link className={styles.cta} href="/start">{children}<span aria-hidden>↗</span></Link>;
}

export default function BuddyHome({ offer = {enabled:false,available:false} }: { offer?: {enabled:boolean;available:boolean} }) {
  const cta = offer.enabled ? "Join the beta" : "Try 3xrep now";
  return (
    <div className={styles.page}>
      <Header />
      <main id="main-content" className={styles.main}>
        <section className={styles.hero} aria-labelledby="buddy-title">
          <div className={styles.intro}>

            <h1 id="buddy-title">Every deal needs<br />a strategy.</h1>
            <p className={styles.lead}>Know your next move. And how to make it.</p>
            <p className={styles.support}>3xrep builds a deal strategy from what your buyer has actually said. Get the approach, the words to use, and a way forward when the answer changes — inside your AI chat.</p>
            <p className={styles.betaInvite}><strong>Beta: 20 teams, free forever.</strong><span>{offer.enabled && !offer.available ? "All 20 places have been allocated." : "I’m looking for 20 teams using 3xrep on real deals. Teams I select after real use keep the base plan free forever."} <Link href="#price-title">See how it works ↗</Link></span></p>
            <Start>{cta}</Start>
            <p className={styles.micro}>{offer.enabled ? "Full beta access. No credit card." : "14 days free now. Beta enrollment is not open yet; this trial does not reserve a free-forever place."}</p>
            <p className={styles.micro}>Start in Claude or ChatGPT. <Link href="#setup">See what you need ↗</Link></p>
          </div>
          <StrategyDemo />
        </section>

        <section className={styles.section} aria-labelledby="thread-title">
          <div className={styles.sectionHead}>
            <h2 id="thread-title">“Who signs?” is only<br />the beginning.</h2>
            <p>The useful part is working out how to reach them. 3xrep connects the evidence in your deal to the conversation you need next.</p>
          </div>
          <div className={styles.story}>
            <article><p className={styles.step}>THE EVIDENCE</p><h3>A problem they recognize.</h3><blockquote>“Our team loses six hours a week chasing approvals.”</blockquote><p>Keep the buyer’s exact words. Check the source and their answer before using the problem as a reason to act.</p></article>
            <article><p className={styles.step}>THE STRATEGY</p><h3>A reason to involve Maya.</h3><p>The cost of those delays gives Julien a business reason to request an investment conversation. Maya’s authority still needs checking.</p><div className={styles.move}><span>THE OBJECTIVE</span><p>Get the person who can authorize spend into a useful conversation before preparing the proposal.</p></div></article>
            <article><p className={styles.step}>THE NEXT RESPONSE</p><h3>“She can join us.”</h3><p>Now prepare the decision: what the problem costs, what remains unknown, and what would justify investing.</p><div className={styles.move}><span>WHAT COUNTS AS PROGRESS</span><p>Authority confirmed. A shared purpose. A time accepted by the buyer.</p></div></article>
          </div>
          <p className={styles.caption}>Illustrative conversation. When context is missing, 3xrep says what to establish first. It never fills in a buyer quote, a name or a budget.</p>
        </section>

        <section className={`${styles.section} ${styles.judgment}`} aria-labelledby="judgment-title">
          <div><h2 id="judgment-title">Walk into the call<br />with a way forward.</h2><p className={styles.support}>An objective, questions with a reason, and possible paths through the conversation. Use the same strategy before the call and update it when new evidence arrives.</p><p className={styles.support}>Budget missing? Start with the impact the buyer confirmed. If the impact is still unknown, establish that first.</p><Link className={styles.textLink} href="/docs">Explore the sales brain ↗</Link></div>
          <div className={styles.reasonCard}>
            <div className={styles.cardLabel}><span>ILLUSTRATIVE CALL PLAN</span><span className={styles.badge}>Budget</span></div>
            <dl><div><dt>Objective</dt><dd>Find the route to funding.</dd></div><div><dt>Confirmed impact</dt><dd>“The delay costs us 30 hours a month.”</dd></div><div><dt>Suggested opener</dt><dd>“For a problem of this size, would funding come from an existing budget or would someone need to create one?”</dd></div></dl>
            <div className={styles.nextMove}><span>FOLLOW THE ANSWER</span><p>Existing budget → ask who owns it.<br />New spend → ask who arbitrates it.<br />Too early → ask what evidence is needed first.</p></div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.silence}`} aria-labelledby="silence-title">
          <div><h2 id="silence-title">Put your attention<br />where it can help.</h2><p>The morning brief puts actionable deal gaps ahead of the chronological agenda. A proposal with no confirmed approver deserves attention before it goes out.</p></div>
          <div className={styles.reply}><h3>Today, next week, next month.</h3><p>Today: make the next move. This week: prepare the people and proof you need. This month: start the approvals and contract work that may take time.</p><p>Managing a team? See recurring gaps and the questions that help a rep build a route forward on each deal.</p><Hand className={styles.annotation}>A reason for every move.</Hand></div>
        </section>

        <section id="setup" className={styles.section} aria-labelledby="setup-title">
          <div className={styles.sectionHead}><div><h2 id="setup-title">Open the chat.<br />Bring a real deal.</h2></div><p>No new dashboard to maintain. Your AI reads the tools you connect. 3xrep builds the deal strategy.</p></div>
          <ol className={styles.setup}>
            <li><span>01</span><h3>Connect your context.</h3><p>Connect your CRM to Claude, then your inbox and calendar. Notes and call transcripts help it work from what the buyer actually said.</p></li>
            <li><span>02</span><h3>Add 3xrep.</h3><p>Add 3xrep using your trial key. Your workspace may need an admin to allow the connection.</p></li>
            <li><span>03</span><h3>Ask one question.</h3><p className={styles.prompt}>“How do I move this deal forward — and what should I say?”</p><p>Come back after a call, before a proposal, or when a deal goes quiet.</p></li>
          </ol>
          <div className={styles.setupFoot}><p>Start with Claude and a connected CRM. Without inbox or calendar access, start with the deal context you have.</p><Link className={styles.textLink} href="/install">Connection guide ↗</Link></div>
          <p className={styles.caption}>ChatGPT Work: setup is documented; end-to-end validation is still in progress. Availability depends on your workspace and connectors.</p>
        </section>

        <section className={`${styles.section} ${styles.finish}`} aria-labelledby="price-title">
          <div className={styles.price}>
            <h2 id="price-title">Beta</h2>
            {offer.enabled ? <>
              <p>I’m looking for 20 teams to shape 3xrep through real sales work. Full access during beta. No credit card.</p>
              <p>{offer.available ? "Use it on real deals across several days. I’ll select 20 teams from those who do. Selected teams keep the base plan free forever. Signing up does not reserve a place." : "All 20 free-forever places have been allocated. You can still try the beta for free."}</p>
              <p className={styles.micro}>Future optional extras may be paid. Standard price after beta: ${LIST_PRICE_USD}/month per company. No automatic charge.</p>
            </> : <>
              <p>I’m looking for 20 teams to help shape 3xrep through real sales work. Teams selected after using it keep the base plan free forever.</p>
              <p>Beta enrollment is not open yet. You can start a 14-day trial now. A trial does not reserve one of the 20 places.</p>
              <p className={styles.micro}>Standard price after the trial: ${LIST_PRICE_USD}/month per company, plus tax. No per-seat charge.</p>
            </>}
            <Start>{cta}</Start><p className={styles.micro}>{offer.enabled ? "Your feedback helps decide what comes next." : "14 days free. No card today."}</p>
          </div>
          <div className={styles.trust}><h3>Your sales context stays yours.</h3><p>3xrep doesn’t join your calls or fetch your inbox. Your AI brings the context from the tools you connect.</p><p>Call text sent to 3xrep is kept for 14 days, then deleted. A compact record of deal gaps remains, without transcripts. 3xrep doesn’t write to your CRM.</p><Link className={styles.textLink} href="/docs">Read the documentation ↗</Link></div>
        </section>
        <footer className={styles.close}><div><Hand className={styles.signoff}>See you in the morning.</Hand><p>The next move, the words, and a plan for the answer.</p></div><Blob pose="cafe" className={styles.closeMascot} /></footer>
      </main>
    </div>
  );
}
