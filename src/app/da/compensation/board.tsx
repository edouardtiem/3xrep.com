"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./compensation.module.css";

type Etat = "vide" | "crayon" | "paire";

type Slip = {
  id: string;
  label: string;
  guichet: "ops" | "daf";
  crayon?: string;
  paire?: string;
};

const SLIPS: Slip[] = [
  {
    id: "face",
    label: "En face",
    guichet: "ops",
    paire: "Julien Morel, directeur ops",
  },
  {
    id: "tranche",
    label: "Contrepartie",
    guichet: "daf",
  },
  {
    id: "metrique",
    label: "Métrique",
    guichet: "ops",
    crayon: "2 j / sem. — dit l’ops",
  },
  {
    id: "douleur",
    label: "Douleur",
    guichet: "ops",
  },
  {
    id: "process",
    label: "Décision",
    guichet: "ops",
    crayon: "Pilote d’abord",
  },
  {
    id: "champion",
    label: "Champion",
    guichet: "ops",
    crayon: "Julien se propose",
  },
];

const NEXT: Record<Etat, Etat> = {
  vide: "crayon",
  crayon: "paire",
  paire: "vide",
};

function initialEtat(slip: Slip): Etat {
  if (slip.guichet === "daf") return "vide";
  if (slip.paire) return "paire";
  if (slip.crayon) return "crayon";
  return "vide";
}

export function Board() {
  const [etats, setEtats] = useState<Record<string, Etat>>(() =>
    Object.fromEntries(SLIPS.map((s) => [s.id, initialEtat(s)])),
  );

  const dafUnmatched = etats.tranche !== "paire";

  function cycle(slip: Slip) {
    if (slip.guichet === "daf") return;
    setEtats((prev) => ({ ...prev, [slip.id]: NEXT[prev[slip.id] ?? "vide"] }));
  }

  function soucheText(slip: Slip, etat: Etat) {
    if (etat === "vide") return null;
    if (etat === "crayon") return slip.crayon ?? "Au crayon. Pas de coupon.";
    return slip.paire ?? slip.crayon ?? "Apparié.";
  }

  function couponText(slip: Slip, etat: Etat) {
    if (slip.guichet === "daf") return null;
    if (etat === "paire") return slip.paire ?? "Coupon imprimé.";
    return null;
  }

  return (
    <main className={`${styles.desk} flex min-h-dvh flex-1 flex-col px-4 py-5 sm:px-8 sm:py-7`}>
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className={`${styles.label} text-xs text-[rgb(42_33_24/0.55)]`}>
            Chambre de compensation
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-comp-body)] text-2xl tracking-tight">
            DAF dit non
          </h1>
          <p className="mt-1 max-w-md text-[15px] leading-snug text-[rgb(42_33_24/0.7)]">
            L’ops est au guichet. La contrepartie n’a pas de coupon. Rien n’est compensé tant que ça.
          </p>
        </div>
        <nav className={`${styles.label} flex gap-3 text-[11px] text-[rgb(42_33_24/0.5)]`}>
          <Link href="/da/notaire" className="underline-offset-4 hover:underline">
            Notaire
          </Link>
          <span className="text-[var(--ink)]">Compensation</span>
        </nav>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className={`${styles.stamp} ${styles.stampIdle}`}>Ouverture</span>
        <span className={`${styles.stamp} ${styles.stampLive}`}>Compensation</span>
        <span className={`${styles.stamp} ${styles.stampIdle}`}>Livraison</span>
        <p className={`${styles.label} ml-auto text-[11px] text-[rgb(42_33_24/0.45)]`}>
          14:22 — call en cours
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SLIPS.map((slip) => {
          const etat = etats[slip.id] ?? "vide";
          const souche = soucheText(slip, etat);
          const coupon = couponText(slip, etat);
          return (
            <button
              key={slip.id}
              type="button"
              className={`${styles.slip} ${slip.guichet === "daf" ? styles.locked : ""}`}
              onClick={() => cycle(slip)}
              aria-label={`${slip.label}, ${etat}`}
            >
              <div className={`${styles.half} ${styles.yellow}`}>
                <p className={`${styles.label} text-[10px] text-[rgb(42_33_24/0.5)]`}>
                  Souche — {slip.label}
                </p>
                <p
                  className={`mt-3 text-[15px] leading-snug ${etat === "crayon" ? styles.pencil : styles.cleared}`}
                >
                  {souche}
                </p>
              </div>
              <span className={styles.perf} aria-hidden />
              <div className={`${styles.half} ${styles.pink}`}>
                <p className={`${styles.label} text-[10px] text-[rgb(42_33_24/0.5)]`}>Coupon</p>
                <p className="mt-3 text-[14px] leading-snug">
                  {coupon ?? <span className="opacity-30">Non émis</span>}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <section className={`${styles.outTray} mt-8 px-4 py-5 sm:px-6`}>
        <p className={`${styles.label} text-[11px] text-[rgb(239_230_210/0.7)]`}>
          Bac de sortie — non apparié
        </p>
        {dafUnmatched ? (
          <div className="relative mx-auto mt-4 max-w-sm">
            <div className="grid grid-cols-2 bg-[var(--pink)] shadow-lg">
              <div className="border-r border-dashed border-[rgb(42_33_24/0.2)] px-4 py-5">
                <p className={`${styles.label} text-[10px]`}>Contrepartie</p>
                <p className="mt-2 text-[15px]">Personne au guichet DAF.</p>
              </div>
              <div className="relative px-4 py-5">
                <span className={`${styles.namedHole} absolute top-3 right-3 px-2 py-1 text-[10px]`}>
                  Trou nommé
                </span>
                <p className="mt-8 text-[15px] leading-snug">
                  Le DAF n’était pas dans la pièce.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-[rgb(239_230_210/0.85)]">Bac vide. Livraison possible.</p>
        )}
      </section>
    </main>
  );
}
