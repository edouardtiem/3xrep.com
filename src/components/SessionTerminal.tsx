"use client";

import { useEffect, useState } from "react";
import { DEBRIEF } from "@/lib/landing";

const LOOP_MS = 8000;
const PROMPT_AT = 200;
const TOOL_AT = 900;
const BLOCK_AT = [1800, 3000, 4300, 5400, 6400] as const;

export function SessionTerminal() {
  const [now, setNow] = useState(LOOP_MS);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduce) {
      setNow(LOOP_MS);
      return;
    }
    const origin = Date.now();
    setNow(0);
    const id = window.setInterval(() => {
      setNow((Date.now() - origin) % LOOP_MS);
    }, 80);
    return () => window.clearInterval(id);
  }, [reduce]);

  const showPrompt = now >= PROMPT_AT;
  const showTool = now >= TOOL_AT;
  const visibleBlocks = DEBRIEF.blocks.filter((_, i) => now >= BLOCK_AT[i]);

  return (
    <section
      aria-label="Session 3xrep"
      className="overflow-hidden rounded-[4px] border border-line bg-background"
    >
      <div className="text-dim flex items-center justify-between border-b border-line px-3 py-2 text-[11px]">
        <span>claude code</span>
        <span>
          MCP <span className="text-copper">3xrep</span>
        </span>
      </div>
      <div className="min-h-[22rem] space-y-3 px-3 py-3 text-[13px] leading-relaxed sm:min-h-[24rem] sm:text-[13.5px]">
        {showPrompt ? (
          <p className="text-mute">{DEBRIEF.prompt}</p>
        ) : (
          <p className="text-dim">&nbsp;</p>
        )}
        {showTool ? (
          <p>
            <span className="text-copper">● {DEBRIEF.tool}</span>
          </p>
        ) : null}
        {visibleBlocks.map((block) => (
          <p key={block} className="text-foreground whitespace-pre-wrap">
            {block}
          </p>
        ))}
      </div>
    </section>
  );
}
