import Link from "next/link";
import { Header } from "@/components/Header";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
import { Blob } from "./Blob";
import { Hand } from "./Hand";
import styles from "./buddy.module.css";

function Start({ children = "Start 14 days free" }: { children?: React.ReactNode }) {
  return <Link className={styles.cta} href="/start">{children}<span aria-hidden>↗</span></Link>;
}

const day = [
  { time: "09:00", deal: "Acme", task: "Prep discovery", note: "Find out what the delay costs.", pose: false },
  { time: "11:30", deal: "Nordik", task: "Follow up Lisa", note: "She asked for numbers. Start there.", pose: false },
  { time: "14:00", deal: "Dune", task: "Send proposal", note: "First, find out who can approve it.", pose: true },
];

export default function BuddyHome() {
  return (
    <div className={styles.page}>
      <Header />
      <main id="main-content" className={styles.main}>
        <section className={styles.hero} aria-labelledby="buddy-title">
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Your sales buddy</p>
            <h1 id="buddy-title">Your sales day,<br />figured out.</h1>
            <p className={styles.lead}>The call ends. The buyer goes quiet. You still have a number to hit.</p>
            <p className={styles.support}>Your CRM, inbox and calendar tell your AI what happened. 3xrep helps you work out what to do next — on the deal in front of you.</p>
            <Start />
            <p className={styles.micro}>No card today. Then ${LIST_PRICE_USD}/month for the whole company.</p>
            <p className={styles.micro}>Start in Claude. <Link href="#setup">See what you need ↗</Link></p>
          </div>
          <div className={styles.agenda}>
            <div className={styles.agendaHead}><strong>Morning, Ed.</strong><span>YOUR DAY / 09:00</span></div>
            <ol>
              {day.map((row) => <li key={row.time}>
                <time>{row.time}</time>
                <div><p><strong>{row.deal}</strong><span> — </span>{row.pose ? <s>{row.task}</s> : row.task}</p>
                  <Hand className={styles.annotation}>{row.note}</Hand>
                </div>
              </li>)}
            </ol>
            <div className={styles.agendaFoot}><p>One priority at a time.<br /><span>You make the call.</span></p><Blob pose="note" className={styles.mascot} /></div>
            <p className={styles.example}>Illustrative day · sample deals</p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="thread-title">
          <div className={styles.sectionHead}>
            <div><p className={styles.eyebrow}>One deal. A next move that changes.</p><h2 id="thread-title">The call is over.<br />You’re not on your own.</h2></div>
            <p>Your notes shouldn’t become another thing to sort out tonight. Bring the call back to the same chat. Pick up where the deal left off.</p>
          </div>
          <div className={styles.story}>
            <article><p className={styles.step}>01 / BEFORE THE CALL</p><h3>Acme wants a demo.</h3><p>You know what they want to see. You don’t yet know what they need to change.</p><div className={styles.move}><span>YOUR NEXT MOVE</span><p>Ask where the delay hurts, and what it costs them today.</p></div><Hand className={styles.annotation}>Give the demo a reason.</Hand></article>
            <article><p className={styles.step}>02 / AFTER THE CALL</p><h3>Now there’s something real.</h3><blockquote>“Our team loses six hours a week chasing approvals.”</blockquote><p>The problem is clearer. Who can approve a purchase is still unknown.</p><div className={styles.move}><span>YOUR NEXT MOVE</span><p>Ask how they would decide whether fixing this is worth paying for.</p></div></article>
            <article><p className={styles.step}>03 / THE NEXT REPLY</p><h3>The next conversation changes.</h3><blockquote>“Maya owns the budget. She can join Friday.”</blockquote><p>You have a name and an opening. Confirm the meeting before treating it as booked.</p><div className={styles.move}><span>YOUR NEXT MOVE</span><p>Invite Maya. Agree how you’ll test the approval workflow together.</p></div><Hand className={styles.annotation}>That’s a useful demo.</Hand></article>
          </div>
          <p className={styles.caption}>Illustrative conversation. New evidence changes the advice. A name alone is not proof of buying authority.</p>
        </section>

        <section className={`${styles.section} ${styles.judgment}`} aria-labelledby="judgment-title">
          <div><p className={styles.eyebrow}>On your side. Honest about the deal.</p><h2 id="judgment-title">Your CRM says “proposal”.<br />The buyer hasn’t said yes.</h2><p className={styles.support}>Another document won’t answer a question nobody has asked. 3xrep points to what’s missing, explains why it matters, and gives you a way forward.</p><p className={styles.support}>Sales methods guide the advice. The deal decides the next move. A short buying cycle and a six-person committee don’t need the same conversation.</p><Link className={styles.textLink} href="/docs">Explore the sales brain ↗</Link></div>
          <div className={styles.reasonCard}>
            <div className={styles.cardLabel}><span>DUNE / DEAL CHECK</span><span className={styles.badge}>Proposal stage</span></div>
            <dl><div><dt>What you have</dt><dd>“Send me something and I’ll pass it on.”</dd></div><div><dt>What’s missing</dt><dd>Who approves it, and how they’ll decide.</dd></div><div><dt>Why it matters</dt><dd>A proposal can circulate without a buying conversation ever happening.</dd></div></dl>
            <div className={styles.nextMove}><span>TRY THIS NEXT</span><p>Ask your contact to bring the approver into a short conversation about the decision.</p><Hand className={styles.annotation}>A way in. Not another attachment.</Hand></div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.silence}`} aria-labelledby="silence-title">
          <div><p className={styles.eyebrow}>When they go quiet</p><h2 id="silence-title">More than<br />“just checking in”.</h2><p>Lisa asked for numbers last Thursday. The thread has gone quiet. Before chasing her, check what you still owe her.</p></div>
          <div className={styles.reply}><p className={styles.step}>NORDIK / YOUR NEXT MOVE</p><h3>Send the numbers she asked for.</h3><p>Then ask whether they answer her question. If you already sent them, work from her last response — don’t invent a reason for the silence.</p><Hand className={styles.annotation}>Useful beats persistent.</Hand><p className={styles.caption}>Your AI can help draft the reply. You review it and decide what to send.</p></div>
        </section>

        <section id="setup" className={styles.section} aria-labelledby="setup-title">
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>No new sales app</p><h2 id="setup-title">Open the chat.<br />Bring your day.</h2></div><p>No new dashboard to maintain. Your AI reads the tools you connect. 3xrep adds the sales judgment.</p></div>
          <ol className={styles.setup}>
            <li><span>01</span><h3>Connect your context.</h3><p>Connect your CRM to Claude, then your inbox and calendar. Notes and call transcripts help it work from what the buyer actually said.</p></li>
            <li><span>02</span><h3>Add your sales buddy.</h3><p>Add 3xrep using your trial key. Your workspace may need an admin to allow the connection.</p></li>
            <li><span>03</span><h3>Ask one question.</h3><p className={styles.prompt}>“Morning. What’s today?”</p><p>Come back after a call, before a proposal, or when a deal goes quiet.</p></li>
          </ol>
          <div className={styles.setupFoot}><p>Start with Claude and a connected CRM. Without inbox or calendar access, start with the deal context you have.</p><Link className={styles.textLink} href="/install">Connection guide ↗</Link></div>
          <p className={styles.caption}>ChatGPT Work: setup is documented; end-to-end validation is still in progress. Availability depends on your workspace and connectors.</p>
        </section>

        <section className={`${styles.section} ${styles.finish}`} aria-labelledby="price-title">
          <div className={styles.price}><p className={styles.eyebrow}>One price. The whole company.</p><h2 id="price-title">${LIST_PRICE_USD}<span> / month</span></h2><p>Three people or thirty. No per-seat charge.<br />USD, plus applicable tax.</p><Start /><p className={styles.micro}>14 days free. No card today.</p></div>
          <div className={styles.trust}><h3>Your sales context stays yours.</h3><p>3xrep doesn’t join your calls or fetch your inbox. Your AI brings the context from the tools you connect.</p><p>Call text sent to 3xrep is kept for 14 days, then deleted. A compact record of deal gaps remains, without transcripts. 3xrep doesn’t write to your CRM.</p><Link className={styles.textLink} href="/docs">Read the documentation ↗</Link></div>
        </section>
        <footer className={styles.close}><div><Hand className={styles.signoff}>See you in the morning.</Hand><p>A next move. A reason for it. A little less on your own.</p></div><Blob pose="cafe" className={styles.closeMascot} /></footer>
      </main>
    </div>
  );
}
