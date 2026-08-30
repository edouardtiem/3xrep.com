"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./surface.module.css";

type Etat = "vide" | "suppose" | "su";

type Cell = {
  id: string;
  label: string;
  locked?: boolean;
  su?: string;
  suppose?: string;
};

const CELLS: Cell[] = [
  { id: "face", label: "En face", su: "Julien Morel · ops · Lyon" },
  { id: "tranche", label: "Qui tranche", locked: true },
  { id: "metrique", label: "Métrique", suppose: "2 j / sem — l’ops" },
  { id: "douleur", label: "Douleur" },
  { id: "process", label: "Décision", suppose: "Pilote d’abord" },
  { id: "champion", label: "Champion", suppose: "Julien se propose" },
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
    if (c.locked) return convie ? "Dans la pièce" : "Non assigné";
    if (e === "su") return c.su ?? c.suppose ?? "Posé";
    if (e === "suppose") return c.suppose ?? "Supposé — pas de preuve";
    return "—";
  }

  function cls(c: Cell, e: Etat) {
    if (c.locked) return convie ? styles.su : styles.vide;
    if (e === "su") return styles.su;
    if (e === "suppose") return styles.suppose;
    return styles.vide;
  }

  return (
    <main className={`${styles.shell} min-h-dvh`}>
      <div className="mx-auto grid min-h-dvh max-w-5xl lg:grid-cols-[1fr_18rem]">
        <section className="flex flex-col border-[var(--line)] px-6 py-6 lg:border-r">
          <header className="mb-8 flex items-center justify-between gap-4">
            <p className={`${styles.beat} ${styles.on}`}>Découverte</p>
            <nav className={`${styles.nav} flex gap-3`}>
              <Link href="/da/console">console</Link>
              <Link href="/da/surface" className={styles.here}>
                surface
              </Link>
              <Link href="/da/notaire">notaire</Link>
              <Link href="/da/compensation">compensation</Link>
            </nav>
          </header>

          <p className="text-[13px] text-[var(--dim)]">Le DAF n’est pas dans la pièce</p>
          <h1 className="mt-1 text-2xl tracking-tight">DAF dit non</h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--mute)]">
            Call avec un manager ops. Tableau vide. Le non n’est pas encore arrivé — c’est une
            sortie, pas le beat 1.
          </p>

          <div className="mt-10">
            <p className={`${styles.beat} mb-3`}>Dossier</p>
            {CELLS.map((c) => {
              const e = etats[c.id] ?? "vide";
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.prop} ${c.locked ? styles.locked : ""}`}
                  onClick={() => {
                    if (c.locked) return;
                    setEtats((p) => ({ ...p, [c.id]: NEXT[p[c.id] ?? "vide"] }));
                  }}
                >
                  <span className={styles.label}>{c.label}</span>
                  <span className={`${styles.mono} ${cls(c, e)}`}>{val(c, e)}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-10">
            <button type="button" className={styles.action} onClick={() => setConvie((v) => !v)}>
              {convie ? "Retirer le DAF" : "Convier le DAF"}
            </button>
            <p className="mt-4 text-[13px] text-[var(--dim)]">
              {convie
                ? "Voir le DAF. Il est dans la pièce."
                : "Pas inclus — s’il tranche sans toi, il dit non."}
            </p>
          </div>
        </section>

        <aside className="hidden flex-col gap-6 px-5 py-6 lg:flex">
          <div>
            <p className={styles.beat}>Beats</p>
            <ul className="mt-3 space-y-2 text-[13px]">
              <li className={styles.beat + " " + styles.on}>1 Découverte</li>
              <li className={styles.beat}>2 Trous</li>
              <li className={styles.beat}>3 Facture</li>
            </ul>
          </div>
          <div>
            <p className={styles.beat}>Questions</p>
            <p className={`${styles.mono} mt-2 text-[var(--mute)]`}>2 restantes</p>
          </div>
          <div>
            <p className={styles.beat}>Sortie</p>
            <p className="mt-2 text-[13px] text-[var(--mute)]">
              Voir · Inclure sans voir · Pas inclus
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
