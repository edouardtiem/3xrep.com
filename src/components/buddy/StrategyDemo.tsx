"use client";

import { HOME_REPLIES as replies, useHomeDemo } from "./HomeDemoContext";
import { Blob } from "./Blob";
import { Hand } from "./Hand";
import styles from "./buddy.module.css";



export function StrategyDemo() {
  const { active, select: setActive } = useHomeDemo();
  return <div className={styles.strategyDemo}>
    <div className={styles.demoContext}><span>ACME · ILLUSTRATIVE DEAL</span><p>Julien confirmed the problem and named Maya as the budget owner. Her buying authority and a meeting are still unconfirmed.</p></div>
    <blockquote>“We lose 6 hours per week chasing approvals; the time records confirm those 6 hours.”</blockquote>
    <div className={styles.demoMove}><Blob pose="reflechit" className={styles.demoMascot} /><div><h2>Use the problem to open the door.</h2><p>Ask Julien to bring Maya into a conversation about whether fixing those delays merits an investment, before sending a proposal.</p></div></div>
    <div className={styles.demoWording}><span>HOW YOU COULD ASK</span><p>“Would it make sense to look at those six hours with Maya before we build a proposal?”</p></div>
    <fieldset id="home-replies" className={styles.replyChoices}><legend>If Julien replies…</legend>{replies.map((reply, index) => <button type="button" key={reply.label} aria-pressed={index === active} aria-controls="strategy-response" onClick={() => setActive(index)}>{reply.label}</button>)}</fieldset>
    <div id="strategy-response" className={styles.demoResponse} aria-live="polite" aria-atomic="true"><Hand className={styles.annotation}>{replies[active].move}</Hand><p>{replies[active].text}</p><blockquote>“{replies[active].say}”</blockquote></div>
    <p className={styles.caption}>Fictional replies, not predictions or new evidence. Your choice also updates the circuit below. You decide what to send.</p>
  </div>;
}
