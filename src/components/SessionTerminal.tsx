"use client";

import { useEffect, useRef, useState } from "react";
import { SESSION, sessionBlocks } from "@/lib/landing";

const PROMPT = SESSION.prompt;

const PROMPT_CHAR_MS = 52;
const OUT_CHAR_MS = 16;
const START_MS = 320;
const AFTER_PROMPT_MS = 520;
const AFTER_TOOL_MS = 380;

function timing(blocks: readonly string[]) {
  const outLen = blocks.reduce((n, b) => n + b.length, 0);
  const promptMs = PROMPT.length * PROMPT_CHAR_MS;
  const toolAt = START_MS + promptMs + AFTER_PROMPT_MS;
  const streamAt = toolAt + AFTER_TOOL_MS;
  return {
    outLen,
    toolAt,
    streamAt,
    doneMs: streamAt + outLen * OUT_CHAR_MS,
  };
}

function visibleBlocks(blocks: readonly string[], n: number) {
  const rows: string[] = [];
  let left = n;
  for (const block of blocks) {
    if (left <= 0) break;
    const k = Math.min(left, block.length);
    rows.push(block.slice(0, k));
    left -= k;
  }
  return rows;
}

export function SessionTerminal() {
  const [compact, setCompact] = useState<boolean | null>(null);
  const [now, setNow] = useState(0);
  const [reduce, setReduce] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const blocks = sessionBlocks(compact === true);
  const { outLen, toolAt, streamAt, doneMs } = timing(blocks);

  useEffect(() => {
    if (compact === null) return;
    if (reduce) {
      setNow(doneMs);
      return;
    }
    const origin = Date.now();
    setNow(0);
    const id = window.setInterval(() => {
      const t = Date.now() - origin;
      if (t >= doneMs) {
        setNow(doneMs);
        window.clearInterval(id);
        return;
      }
      setNow(t);
    }, 32);
    return () => window.clearInterval(id);
  }, [compact, reduce, doneMs]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [now]);

  const done = compact !== null && now >= doneMs;
  const typed =
    compact === null || now < START_MS
      ? 0
      : Math.min(PROMPT.length, Math.floor((now - START_MS) / PROMPT_CHAR_MS));
  const showTool = compact !== null && now >= toolAt;
  const outChars =
    compact === null || now < streamAt
      ? 0
      : Math.min(outLen, Math.floor((now - streamAt) / OUT_CHAR_MS));
  const rows = visibleBlocks(blocks, outChars);
  const caret = done
    ? null
    : !showTool
      ? "prompt"
      : rows.length === 0
        ? "tool"
        : "out";

  return (
    <section
      aria-label="Session 3xrep"
      className="flex h-[20rem] flex-col overflow-hidden rounded-[4px] border border-line bg-black lg:h-[28rem]"
    >
      <div className="text-dim flex items-center justify-between border-b border-line px-3 py-1.5 text-xs">
        <span>claude code</span>
        <span>
          MCP <span className="text-copper">3xrep</span>
        </span>
      </div>
      <div
        ref={bodyRef}
        className="min-h-0 flex-1 overflow-auto px-3 py-2.5 font-mono text-[0.8125rem] leading-[1.45]"
      >
        <p>
          <span className="text-dim select-none">&gt; </span>
          {PROMPT.slice(0, typed)}
          {caret === "prompt" ? <Caret /> : null}
        </p>

        {showTool ? (
          <p className="mt-2">
            <span className="text-copper">⏺ {SESSION.tool}</span>
            {caret === "tool" ? <Caret /> : null}
          </p>
        ) : null}

        {rows.map((text, i) => (
          <p key={blocks[i]} className="mt-1.5 whitespace-pre-wrap">
            <span className="text-dim">  ⎿  </span>
            {text}
            {caret === "out" && i === rows.length - 1 ? <Caret /> : null}
          </p>
        ))}
      </div>
    </section>
  );
}

function Caret() {
  return (
    <span
      aria-hidden
      className="bg-foreground ml-px inline-block h-[0.9em] w-[0.55ch] translate-y-px align-baseline motion-reduce:opacity-100 motion-safe:animate-term-caret"
    />
  );
}
