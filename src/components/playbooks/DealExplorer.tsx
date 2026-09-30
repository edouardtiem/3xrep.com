"use client";

import { DealCircuit } from "@/components/circuit/DealCircuit";
import Link from "next/link";
import { useState } from "react";
import type { CalculatedState } from "@/lib/playbooks/types";
import styles from "./library.module.css";

export function DealExplorer({ states, prompt }: { states: CalculatedState[]; prompt: string }) {
  const [active, setActive] = useState(0);
  const [reply, setReply] = useState(0);
  const state = states[active];
  const branch = state.branches[reply];
  return <section className={styles.explorer} aria-labelledby="explore-title">
    <h2 id="explore-title">See what changes the strategy.</h2>
    <p className={styles.note}>Fictional deal. These states are calculated with the same evidence checks and strategy rules as 3xrep. A source match does not independently verify the speaker or the truth of a claim.</p>
    <fieldset className={styles.choices}>
      <legend>Change the evidence</legend>
      {states.map((item, index) => <button key={item.id} type="button" aria-pressed={active === index} aria-controls="deal-result" onClick={() => { setActive(index); setReply(0); }}>{item.label}</button>)}
    </fieldset>
    <noscript><p>The starting deal is shown below. Enable JavaScript to explore the other evidence states.</p></noscript>
    <div id="deal-result">
      <p role="status" className={styles.change}>{state.change}</p>
      <p className={styles.note}>Declared stage: <strong>{state.stage}</strong>. This is the seller’s stage, not proof that the buyer is ready.</p>
      <ol className={styles.progress} aria-label="Evidence across the deal">
        {state.pieces.map(piece => <li key={piece.id}><span>{piece.label}</span><strong data-state={piece.state}>{piece.state}</strong></li>)}
      </ol>
      <section className={styles.productDemo} aria-labelledby="product-flow-title"><h3 id="product-flow-title">Put this strategy to work in your AI chat.</h3><DealCircuit key={state.id} state={state} autoPlay={active > 0} showCta={false} /></section>
      <section className={styles.articleSection} aria-labelledby="apply-title"><h3 id="apply-title">Apply this strategy to your own deal.</h3><p>Bring your notes or the buyer’s exact words into your assistant. Ask 3xrep to check the evidence, choose a next move and prepare for possible replies. Add the new evidence after your next conversation to review the strategy.</p><details className={styles.details}><summary>Show the request to copy into your assistant</summary><p className={styles.prompt}>{prompt}</p></details><Link href="/start" className={styles.start}>See Beta status ↗</Link><p className={styles.note}>Enrollment does not guarantee a selected free-forever place.</p></section>
      <div className={styles.dealColumns}>
        <div>
          <h3>The evidence file</h3>
          <dl className={styles.evidence}>
            {state.pieces.map(piece => <div key={piece.id}>
              <dt>{piece.label} <span data-state={piece.state}>{piece.state}</span></dt>
              <dd>{piece.quote ? <blockquote>“{piece.quote}”</blockquote> : piece.claim ? <><blockquote>“{piece.claim}”</blockquote><p className={styles.note}>Quoted statement, not accepted proof.</p></> : "No accepted proof for this point."}</dd>
              {piece.reason && <dd className={styles.note}>{piece.reason}</dd>}
            </div>)}
          </dl>
          <details className={styles.details}><summary>Read the fictional source passages</summary>{state.sourcePassages.map(source => <div key={source.id}><h4>{source.id}</h4><p className={styles.source}>{source.text}</p></div>)}</details>
        </div>
        <div className={styles.strategy}>
          <h3>Your next move</h3>
          <p className={styles.move}>{state.action}</p>
          <p className={styles.note}>{state.timing}</p>
          <h4>{state.gapHeld ? "Point to revisit" : "Priority gap"}: {state.gap}</h4>
          <p>{state.why}</p>
          {state.gapHeld && <p className={styles.note}>The measure remains supported. The live objection calls for checking how it relates to price.</p>}
          <h4>Evidence you can use</h4>
          {state.leverage.map((e, index) => <blockquote key={`${e.piece}-${index}`}>“{e.quote}”<cite>{e.piece}</cite></blockquote>)}
          <h4>How you could ask</h4>
          <blockquote className={styles.wording}>{state.wording}</blockquote>
          <h4>What would count as progress</h4>
          <p>{state.success}</p>
          {state.missing.length > 0 && <><h4>Still missing</h4><ul>{state.missing.map(item => <li key={item}>{item}</li>)}</ul></>}
        </div>
      </div>
      <section className={styles.branch} aria-labelledby="reply-title">
        <h3 id="reply-title">If the buyer replies…</h3>
        <p className={styles.note}>Hypothetical replies, not predictions or new evidence. Exploring a reply leaves the evidence file unchanged.</p>
        <fieldset className={styles.choices}><legend>Explore a possible response</legend>{state.branches.map((item, index) => <button key={item.condition} type="button" aria-pressed={reply === index} aria-controls="reply-result" onClick={() => setReply(index)}>{item.condition}</button>)}</fieldset>
        <div id="reply-result" aria-live="polite" aria-atomic="true"><p className={styles.move}>{branch.action}</p><p>{branch.why}</p></div>
      </section>
      <section className={styles.method}>
        <h3>Why these methods appear here</h3>
        <p>The engine selected <strong>{state.methods.join(" + ")}</strong> from the declared buying context and the current objection. Selection and priority are 3xrep rules, not a universal prescription.</p>
        <p>The links below show how each open or supported point relates to a method. A method name does not establish a proof.</p>
        <dl>{state.pieces.map(piece => <div key={piece.id}><dt>{piece.label}</dt><dd>{piece.methods.map(m => `${m.methode}: ${m.partie}`).join(" · ")}</dd></div>)}</dl>
        <details className={styles.details}><summary>Limits of this next move</summary><ul>{state.doNot.map(item => <li key={item}>{item}</li>)}</ul></details>
      </section>
      <details className={styles.details}><summary>Scenario and calculation provenance</summary>
        <p className={styles.note}>Scenario sources are invented for this public example. The diagnostic, evidence states, gaps and actions are calculated by the product engine. Surrounding explanations and reviewed English translations are editorial.</p>
        <dl className={styles.provenance}>{Object.entries(state.provenance).map(([key, value]) => <div key={key}><dt>{key}</dt><dd><code>{value}</code></dd></div>)}</dl>
      </details>
    </div>
  </section>;
}
