"use client";

import { useState } from "react";
import { CELLS, CAS, PARCOURS_JOUEUR, NEXT, cellValue, initialEtats, type Etat } from "../_content";
import { EtudesNav } from "../_etudes";
import styles from "./console.module.css";

export function Board() {
  const [etats, setEtats] = useState<Record<string, Etat>>(initialEtats);

  return (
    <main className={`${styles.shell} mx-auto flex min-h-dvh max-w-3xl flex-col px-5 py-6`}>
      <header className="mb-8 flex items-baseline justify-between gap-4">
        <p className="text-[var(--dim)]">{PARCOURS_JOUEUR}</p>
        <EtudesNav current="console" className={`${styles.nav} flex gap-4`} hereClass={styles.here} />
      </header>

      <h1 className="text-[15px]">{CAS.titre_joueur}</h1>
      <p className="mt-2 max-w-xl text-[var(--mute)]">
        Call de découverte. Un ops. Le tableau est vide.
      </p>

      <div className="mt-8">
        {CELLS.map((c) => {
          const e = etats[c.id] ?? "vide";
          return (
            <button
              key={c.id}
              type="button"
              className={styles.row}
              onClick={() => setEtats((p) => ({ ...p, [c.id]: NEXT[p[c.id] ?? "vide"] }))}
            >
              <span className={styles.key}>{c.label}</span>
              <span className={`${styles.val} ${styles[e]}`}>{cellValue(c, e)}</span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
