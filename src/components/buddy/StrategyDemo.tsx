"use client";

import { useState } from "react";
import { Blob } from "./Blob";
import { Hand } from "./Hand";
import styles from "./buddy.module.css";

const replies = [
  { label: "“She’s too busy.”", move: "Make the meeting worth her time.", text: "Ask Julien which decision would warrant a short conversation. Agree the problem and the investment question with him before requesting an introduction.", say: "What would Maya need to decide for a short conversation about those six hours to be useful?" },
  { label: "“I can approve it.”", move: "Test the authority, together.", text: "Check the spending scope and whether anyone else can reject the purchase. Keep Julien involved; a job title alone does not settle it.", say: "For a purchase like this, is the final budget approval yours? Who could still say no?" },
  { label: "“I’ll introduce you.”", move: "Give the meeting a decision.", text: "Bring the confirmed problem, the open investment question and a proposed agenda. Ask Julien and Maya to agree a time before treating it as booked.", say: "Let’s use that conversation to check whether fixing the approval delays justifies an investment. What time works for you both?" },
];

export function StrategyDemo() {
  const [active, setActive] = useState(0);
  return <div className={styles.strategyDemo}>
    <div className={styles.demoContext}><span>ACME · ILLUSTRATIVE DEAL</span><p>Julien confirmed the problem and named Maya as the budget owner. Her buying authority and a meeting are still unconfirmed.</p></div>
    <blockquote>“Our team loses six hours a week chasing approvals.”</blockquote>
    <div className={styles.demoMove}><Blob pose="reflechit" className={styles.demoMascot} /><div><h2>Use the problem to open the door.</h2><p>Ask Julien to bring Maya into a conversation about whether fixing those delays merits an investment, before sending a proposal.</p></div></div>
    <div className={styles.demoWording}><span>HOW YOU COULD ASK</span><p>“Would it make sense to look at those six hours with Maya before we build a proposal?”</p></div>
    <fieldset className={styles.replyChoices}><legend>If Julien replies…</legend>{replies.map((reply, index) => <button type="button" key={reply.label} aria-pressed={index === active} aria-controls="strategy-response" onClick={() => setActive(index)}>{reply.label}</button>)}</fieldset>
    <div id="strategy-response" className={styles.demoResponse} aria-live="polite" aria-atomic="true"><Hand className={styles.annotation}>{replies[active].move}</Hand><p>{replies[active].text}</p><blockquote>“{replies[active].say}”</blockquote></div>
    <p className={styles.caption}>Possible replies, not predictions. You review the wording and decide what to send.</p>
  </div>;
}
