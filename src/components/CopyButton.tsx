"use client";

import { useState } from "react";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
}

const TONE = {
  quiet:
    "text-dim hover:text-foreground shrink-0 cursor-pointer text-xs tracking-wide uppercase",
  loud:
    "w-full cursor-pointer border border-line bg-fg px-4 py-2.5 text-bg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
} as const;

export function CopyButton({
  text,
  label = "Copy",
  tone = "quiet",
}: {
  text: string;
  label?: string;
  tone?: keyof typeof TONE;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className={TONE[tone]}
      onClick={async () => {
        await copyText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
    >
      {copied ? "Copied" : label}
    </button>
  );
}
