"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { CalculatedState } from "@/lib/playbooks/types";
import styles from "./circuit.module.css";
import { HOME_REPLIES, useHomeDemo } from "../buddy/HomeDemoContext";

function Arrow({ delay }: { delay: number }) {
  return <div className={styles.arrow} aria-hidden="true"><span className={styles.packet} style={{ animationDelay: `${delay}s` }} /></div>;
}

/** Only visual playback. Evidence and strategy are the unchanged server-calculated product output. */
export function DealCircuit({ state, autoPlay = false, home = false, showCta = true, response }: { state: CalculatedState; autoPlay?: boolean; home?: boolean; showCta?: boolean; response?: { label: string; action: string; wording: string } }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [playback, setPlayback] = useState({ key: 0, running: false });
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!autoPlay || !ref.current) return;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlayback(p => ({ key: p.key + 1, running: true }));
    }, { threshold: 0.3 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [autoPlay]);
  useEffect(() => {
    if (!playback.running) return;
    const timer = window.setTimeout(() => setPlayback(p => ({ ...p, running: false })), 7600);
    return () => window.clearTimeout(timer);
  }, [playback.key, playback.running]);
  const quote = state.leverage[0]?.quote;
  const priority = state.pieces.find(piece => piece.label === state.gap);
  const pieces = [priority, ...state.pieces.filter(piece => piece !== priority && piece.state === "Supported")].filter(piece => piece != null).slice(0, 3);
  const diagnosis = <><span className={styles.label}>What the evidence supports</span><dl>{pieces.map(piece => <div key={piece.id}><dt>{piece.label}</dt><dd data-supported={piece.state === "Supported"}>{piece.state}</dd></div>)}</dl><p className={styles.gap}>{state.gapHeld ? "Revisit" : "Priority gap"}: {state.gap}</p></>;
  return <div ref={ref} className={styles.circuit} aria-labelledby={`${id}-title`}>
    <div className={styles.head}><h3 id={`${id}-title`}>From your deal to your next move.</h3><p>Fictional {state.dealName} deal. Your assistant brings the context; 3xrep builds the strategy.</p></div>
    <div key={playback.key} className={styles.flow} data-running={playback.running && !reduced}>
      <div className={styles.inputs}>
        {([['Meeting notes', 'M5 3h9l5 5v13H5z M14 3v6h5 M8 13h8 M8 17h6'], ['Connected CRM', 'M20 5c0 2-16 2-16 0s16-2 16 0v14c0 3-16 3-16 0V5 M4 12c0 3 16 3 16 0'], ['Buyer email', 'M3 5h18v14H3z M3 5l9 7 9-7']] as const).map(([label, path], index) => <div className={styles.inputLane} key={label}><div className={styles.source}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d={path} /></svg><span>{label}</span></div><Arrow delay={index * 0.15} /></div>)}
      </div>
      <div className={styles.assistant}><span>Your AI assistant</span><p>Uses the notes or connected sources you make available.</p><details className={styles.context}><summary>View this fictional deal’s context</summary><p>{state.dealName} · {state.stage} · seller-declared stage</p><blockquote>{quote ? `“${quote}”` : "No supported quote available."}</blockquote></details></div>
      <Arrow delay={1.2} />
      <div className={styles.brain}><strong>3xrep</strong><p>Checks the evidence. Finds the gap.<br />Builds a strategy for this deal.</p>
      {home ? <details className={styles.proofs}><summary>View the evidence behind this strategy</summary>{diagnosis}</details> : <div className={styles.proofs}>{diagnosis}</div>}</div>
      <Arrow delay={2.4} />
      <div className={styles.move}><span className={styles.label}>{response ? "If Julien replies " + response.label : "Next move"}</span><p>{response?.action ?? state.action}</p></div>
      <Arrow delay={3.6} />
      <div className={styles.return}><span className={styles.label}>Back in your assistant</span><blockquote>{response?.wording ?? state.wording}</blockquote><p>{response ? "Illustrative wording for this hypothetical reply. " : ""}You review the wording and decide what to send.</p></div>
    </div>
    <div className={styles.controls}><button type="button" disabled={reduced} onClick={() => setPlayback(p => ({ key: p.key + 1, running: true }))}>{playback.running && !reduced ? "Replay the flow" : "Play the flow"}<span aria-hidden="true"> ↻</span></button><p role="status">{reduced ? "Reduced motion: the complete flow stays visible." : playback.running ? "Following the context through 3xrep…" : "All arrows stay visible. No prospect is contacted."}</p></div>
    {showCta && <div className={styles.footer}>{home ? <Link href="/playbooks/economic-buyer-access">Explore this deal strategy ↗</Link> : <><Link href="/start">Apply this to your deal ↗</Link><p>Check Beta enrollment. Signup does not reserve a selected place.</p></>}</div>}
  </div>;
}

export function HomeCircuit({ states }: { states: CalculatedState[] }) {
  const { active } = useHomeDemo();
  const state = states[0];
  const reply = HOME_REPLIES[active];
  const conditions = ["The person to involve is too busy", "The contact says they can decide alone", "The contact accepts the introduction"];
  const branch = state.branches.find(branch => branch.condition === conditions[active]);
  if (!branch) throw new Error("Missing reviewed homepage response branch");
  return <div className={styles.homeDemo}>
    <p className={styles.note} role="status">Exploring Julien’s fictional reply: {reply.label} The evidence file stays unchanged.</p>
    <DealCircuit key={active} state={state} autoPlay home response={{ label: reply.label, action: branch.action, wording: `“${reply.say}”` }} />
    <p className={styles.note}><Link href="#home-replies">Choose another reply above ↗</Link></p>
  </div>;
}
