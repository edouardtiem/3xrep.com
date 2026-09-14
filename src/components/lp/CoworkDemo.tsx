"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  LP_THREADS,
  type DemoMode,
  type DemoThread,
} from "@/lib/lp-demo";

export type { DemoMode };

const TYPE_MS = 18;
const AFTER_TYPE = 280;
const HUB_FILL = 620;
const NEXT_GAP = 340;
const BRAIN_FILL = 480;

function useReduce() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduce;
}

function useClock(done: number, reduce: boolean) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const origin = Date.now();
    const id = window.setInterval(() => {
      const t = Date.now() - origin;
      if (t >= done) {
        setTick(done);
        window.clearInterval(id);
        return;
      }
      setTick(t);
    }, 32);
    return () => window.clearInterval(id);
  }, [done, reduce]);
  return reduce ? done : tick;
}

function sceneTiming(question: string) {
  const typedAt = question.length * TYPE_MS;
  const sentAt = typedAt + AFTER_TYPE;
  const hubAt = sentAt + 240;
  const hubDone = hubAt + HUB_FILL;
  const nextAt = hubDone + NEXT_GAP;
  return { typedAt, sentAt, hubAt, hubDone, nextAt };
}

function HubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5 shrink-0 fill-current">
      <path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z" />
    </svg>
  );
}

function ToolCard({
  mark,
  name,
  action,
  tone,
  open,
  children,
}: {
  mark: ReactNode;
  name: string;
  action: string;
  tone: "hub" | "rep";
  open: boolean;
  children?: ReactNode;
}) {
  const color = tone === "hub" ? "text-[var(--cw-hub)]" : "text-copper";
  return (
    <div className="rounded-xl border border-[var(--cw-line)] bg-[var(--cw-raise)]">
      <div className={`flex flex-wrap items-center gap-2 px-3 py-2 text-[0.75rem] ${color}`}>
        {mark}
        <span className="text-[var(--cw-fg)]">{name}</span>
        <span className="text-[var(--cw-dim)]">{action}</span>
        {!open ? (
          <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
        ) : null}
      </div>
      {open && children ? (
        <div className="border-t border-[var(--cw-line)] px-3 py-2.5 text-[0.8125rem] leading-relaxed text-[var(--cw-fg)]">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function DealList({ thread }: { thread: DemoThread }) {
  return (
    <>
      <p className="text-[var(--cw-dim)]">{thread.hubSummary}</p>
      <ul className="mt-2 space-y-2">
        {thread.deals.map(([name, stage, note]) => (
          <li key={`${name}-${note}`} className="leading-snug">
            <span>{name}</span>
            <span className="text-[var(--cw-dim)]"> · {stage}</span>
            <span className="mt-0.5 block text-[var(--cw-dim)]">{note}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

function Verdict({ thread, mode }: { thread: DemoThread; mode: DemoMode }) {
  const lines = mode === "with" ? thread.with : thread.alone;
  const punch = mode === "with" ? thread.withPunch : thread.alonePunch;
  return (
    <div className="space-y-2 text-[0.875rem] leading-relaxed">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <p className="text-[var(--cw-dim)]">{punch}</p>
    </div>
  );
}

function QuestionList({
  activeId,
  onPick,
  variant,
}: {
  activeId: string;
  onPick: (id: string) => void;
  variant: "rail" | "chips";
}) {
  if (variant === "chips") {
    return (
      <div className="flex flex-wrap gap-1.5 px-3 py-2">
        {LP_THREADS.map((thread) => {
          const on = thread.id === activeId;
          return (
            <button
              key={thread.id}
              type="button"
              aria-current={on ? "true" : undefined}
              className={`cursor-pointer rounded-full px-3 py-1.5 text-left text-[0.75rem] leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cw-fg)] ${
                on
                  ? "bg-[var(--cw-raise)] text-[var(--cw-fg)]"
                  : "text-[var(--cw-dim)] hover:bg-[var(--cw-raise)] hover:text-[var(--cw-fg)]"
              }`}
              onClick={() => onPick(thread.id)}
            >
              {thread.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <aside className="flex w-[15.5rem] shrink-0 flex-col border-r border-[var(--cw-line)] bg-[var(--cw-side)] p-2.5">
      <ul className="flex flex-col gap-0.5">
        {LP_THREADS.map((thread) => {
          const on = thread.id === activeId;
          return (
            <li key={thread.id}>
              <button
                type="button"
                aria-current={on ? "true" : undefined}
              className={`w-full cursor-pointer rounded-lg px-2.5 py-2 text-left text-[0.75rem] leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cw-fg)] ${
                on
                  ? "bg-[var(--cw-raise)] text-[var(--cw-fg)]"
                  : "text-[var(--cw-dim)] hover:bg-[var(--cw-raise)] hover:text-[var(--cw-fg)]"
              }`}
                onClick={() => onPick(thread.id)}
              >
                {thread.question}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function ReplyBody({
  mode,
  reduce,
  thread,
}: {
  mode: DemoMode;
  reduce: boolean;
  thread: DemoThread;
}) {
  const replyDone = mode === "with" ? BRAIN_FILL : 180;
  const reply = useClock(replyDone, reduce);
  const brainOpen = mode === "with" && reply >= BRAIN_FILL * 0.55;
  const finished = reply >= replyDone;

  return (
    <>
      {mode === "with" ? (
        <ToolCard
          mark={
            <span className="text-copper text-[0.65rem] font-medium">3x</span>
          }
          name="3xrep"
          action={thread.brainAction}
          tone="rep"
          open={brainOpen}
        >
          <p>{thread.brainSummary}</p>
        </ToolCard>
      ) : null}
      {finished ? <Verdict thread={thread} mode={mode} /> : null}
    </>
  );
}

function ThreadBody({
  thread,
  mode,
  reduce,
}: {
  thread: DemoThread;
  mode: DemoMode;
  reduce: boolean;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const { typedAt, sentAt, hubAt, hubDone, nextAt } = sceneTiming(thread.question);
  const scene = useClock(nextAt, reduce);
  const hubOpen = scene >= hubDone;
  const showHub = scene >= hubAt;
  const sent = scene >= sentAt;
  const showNext = hubOpen && scene >= nextAt;
  const typed = sent
    ? thread.question
    : thread.question.slice(
        0,
        Math.min(thread.question.length, Math.floor(scene / TYPE_MS)),
      );
  const caret = !sent && scene < typedAt;

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [scene, sent, showHub, hubOpen, showNext, mode]);

  return (
    <div
      ref={bodyRef}
      className="min-h-0 flex-1 overflow-auto px-4 py-5 sm:px-6"
      aria-live="polite"
    >
      <div className="flex flex-col gap-4">
        <p className="rounded-2xl bg-[var(--cw-raise)] px-3.5 py-2 text-[0.9rem] leading-snug">
          {typed}
          {caret ? (
            <span className="bg-[var(--cw-fg)] ml-px inline-block h-[0.9em] w-[0.45ch] translate-y-px align-baseline motion-safe:animate-term-caret" />
          ) : null}
        </p>
        {showHub ? (
          <ToolCard
            mark={<HubMark />}
            name="HubSpot"
            action={thread.hubAction}
            tone="hub"
            open={hubOpen}
          >
            <DealList thread={thread} />
          </ToolCard>
        ) : null}
        {showNext ? (
          <ReplyBody key={mode} mode={mode} reduce={reduce} thread={thread} />
        ) : null}
      </div>
    </div>
  );
}

function ModeTabs({
  mode,
  onMode,
}: {
  mode: DemoMode;
  onMode: (mode: DemoMode) => void;
}) {
  return (
    <div
      className="flex shrink-0 flex-wrap gap-1 px-3 py-1.5"
      role="tablist"
      aria-label="With or without 3xrep"
    >
      <button
        type="button"
        role="tab"
        aria-selected={mode === "alone"}
        className={`cursor-pointer rounded-full px-2.5 py-1 text-[0.75rem] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cw-fg)] ${
          mode === "alone"
            ? "bg-[var(--cw-raise)] text-[var(--cw-fg)]"
            : "text-[var(--cw-dim)]"
        }`}
        onClick={() => onMode("alone")}
      >
        Claude
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "with"}
        className={`cursor-pointer rounded-full px-2.5 py-1 text-[0.75rem] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cw-fg)] ${
          mode === "with"
            ? "bg-[var(--cw-raise)] text-[var(--cw-fg)]"
            : "text-[var(--cw-dim)]"
        }`}
        onClick={() => onMode("with")}
      >
        Claude + 3xrep
      </button>
    </div>
  );
}

function BackChevron() {
  return (
    <span
      aria-hidden
      className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cw-raise)] text-[var(--cw-fg)]"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[2.2]">
        <path d="M15 6 9 12l6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function CoworkDemo() {
  const reduce = useReduce();
  const [threadId, setThreadId] = useState(LP_THREADS[0].id);
  const [mode, setMode] = useState<DemoMode>("with");
  const [play, setPlay] = useState(0);
  const thread = LP_THREADS.find((item) => item.id === threadId) ?? LP_THREADS[0];

  const threadKey = `${thread.id}-${play}`;

  return (
    <>
      <div className="cw hidden h-[min(42rem,calc(100svh-5.5rem))] flex-col overflow-hidden rounded-[18px] border border-black/40 shadow-[0_24px_60px_rgba(0,0,0,0.28)] lg:flex">
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-[var(--cw-line)] px-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="ml-2 text-[0.7rem] text-[var(--cw-dim)]">Claude · Cowork</span>
        </div>
        <ModeTabs mode={mode} onMode={setMode} />
        <div className="flex min-h-0 flex-1">
          <QuestionList
            activeId={thread.id}
            onPick={setThreadId}
            variant="rail"
          />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <ThreadBody
              key={threadKey}
              thread={thread}
              mode={mode}
              reduce={reduce}
            />
          </div>
        </div>
      </div>

      <div className="cw flex h-[min(36rem,calc(100svh-9rem))] flex-col overflow-hidden rounded-[28px] border border-black/30 shadow-[0_24px_60px_rgba(0,0,0,0.28)] lg:hidden">
        <div className="flex shrink-0 items-center gap-3 px-3 pt-3 pb-1">
          <BackChevron />
          <p className="text-[0.9rem] text-[var(--cw-fg)]">Claude</p>
        </div>
        <ModeTabs mode={mode} onMode={setMode} />
        <QuestionList
          activeId={thread.id}
          onPick={setThreadId}
          variant="chips"
        />
        <ThreadBody
          key={`m-${threadKey}`}
          thread={thread}
          mode={mode}
          reduce={reduce}
        />
        <button
          type="button"
          className="mx-3 mb-3 flex min-w-0 shrink-0 cursor-pointer items-center gap-2 rounded-2xl bg-[var(--cw-raise)] px-3 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cw-fg)]"
          onClick={() => setPlay((n) => n + 1)}
        >
          <span className="text-[var(--cw-dim)] min-w-0 text-[0.85rem] leading-snug">
            {thread.question}
          </span>
        </button>
      </div>
    </>
  );
}
