"use client";

import { useState } from "react";
import { useSurfaceTheme } from "../use-surface-theme";
import { CELLS, CAS, PARCOURS_JOUEUR, NEXT, cellValue, initialEtats, type Etat } from "../_content";
import { EtudesNav } from "../_etudes";
import styles from "./surface.module.css";


export function Board() {
  const [theme, persist] = useSurfaceTheme("dark");
  const [etats, setEtats] = useState<Record<string, Etat>>(initialEtats);



  return (
    <main className={`${styles.shell} min-h-dvh`} data-theme={theme}>
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 py-6">
        <header className="mb-8 flex items-baseline justify-between gap-4">
          <p className={styles.crumb}>{PARCOURS_JOUEUR}</p>
          <div className={`${styles.nav} flex gap-3`}>
            <button type="button" onClick={() => persist(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? "dark" : "light"}
            </button>
            <EtudesNav current="surface" className="flex gap-3" hereClass={styles.here} />
          </div>
        </header>

        <h1 className="text-2xl tracking-tight">{CAS.titre_joueur}</h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--mute)]">
          Call de découverte. Julien, manager ops. Tableau vide.
        </p>

        <div className="mt-10">
          {CELLS.map((c) => {
            const e = etats[c.id] ?? "vide";
            return (
              <button
                key={c.id}
                type="button"
                className={styles.prop}
                onClick={() => setEtats((p) => ({ ...p, [c.id]: NEXT[p[c.id] ?? "vide"] }))}
              >
                <span className={styles.label}>{c.label}</span>
                <span className={`${styles.mono} ${styles[e]}`}>{cellValue(c, e)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
