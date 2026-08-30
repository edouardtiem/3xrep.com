"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./console.module.css";

type Etat = "vide" | "suppose" | "su";

type Cell = {
  id: string;
  key: string;
  locked?: boolean;
  su?: string;
  suppose?: string;
};

const CELLS: Cell[] = [
  { id: "face", key: "en_face", su: "Julien Morel, directeur ops, Lyon" },
  { id: "tranche", key: "qui_tranche", locked: true },
  { id: "metrique", key: "metrique", suppose: "2j / sem — dit l’ops" },
  { id: "douleur", key: "douleur" },
  { id: "process", key: "decision", suppose: "pilote d’abord" },
  { id: "champion", key: "champion", suppose: "Julien se propose" },
];

const NEXT: Record<Etat, Etat> = {
  vide: "suppose",
  suppose: "su",
  su: "vide",
};

function start(c: Cell): Etat {
  if (c.locked) return "vide";
  if (c.su) return "su";
  if (c.suppose) return "suppose";
  return "vide";
}

export function Board() {
  const [etats, setEtats] = useState<Record<string, Etat>>(() =>
    Object.fromEntries(CELLS.map((c) => [c.id, start(c)])),
  );
  const [convie, setConvie] = useState(false);

  function val(c: Cell, e: Etat) {
    if (c.locked) return convie ? "dans la pièce" : "—";
    if (e === "su") return c.su ?? c.suppose ?? "posé";
    if (e === "suppose") return c.suppose ?? "supposé, pas de preuve";
    return "—";
  }

  return (
    <main className={`${styles.shell} mx-auto flex min-h-dvh max-w-3xl flex-col px-5 py-6`}>
      <header className="mb-8 flex items-baseline justify-between gap-4">
        <p>3xrep · daf_dit_non</p>
        <nav className={`${styles.nav} flex gap-4 text-[12px]`}>
          <Link href="/da/console" className={styles.here}>
            console
          </Link>
          <Link href="/da/surface">surface</Link>
          <Link href="/da/notaire">notaire</Link>
          <Link href="/da/compensation">compensation</Link>
        </nav>
      </header>

      <p className="mb-6 max-w-xl text-[var(--mute)]">
        call découverte. un ops. le DAF n’est pas dans la pièce. les cases vides restent vides.
      </p>

      <div>
        {CELLS.map((c) => {
          const e = etats[c.id] ?? "vide";
          return (
            <button
              key={c.id}
              type="button"
              className={`${styles.row} ${c.locked ? styles.locked : ""}`}
              onClick={() => {
                if (c.locked) return;
                setEtats((p) => ({ ...p, [c.id]: NEXT[p[c.id] ?? "vide"] }));
              }}
            >
              <span className={styles.key}>{c.key}</span>
              <span className={`${styles.val} ${c.locked ? (convie ? styles.su : styles.vide) : styles[e]}`}>
                {val(c, e)}
              </span>
              <span className={styles.tag}>
                {c.locked ? (convie ? "su" : "trou") : e === "vide" ? "trou" : e}
              </span>
            </button>
          );
        })}
      </div>

      <button type="button" className={`${styles.cmd} mt-8`} onClick={() => setConvie((v) => !v)}>
        {convie ? "annuler convier" : "convier le DAF"}
      </button>

      <p className={`${styles.scale} mt-auto pt-10 text-[12px]`}>
        <span className={convie ? styles.on : undefined}>voir le DAF</span>
        {"  ·  "}
        <span>inclure sans voir</span>
        {"  ·  "}
        <span className={!convie ? styles.on : undefined}>pas inclus — il dit non</span>
      </p>
    </main>
  );
}
