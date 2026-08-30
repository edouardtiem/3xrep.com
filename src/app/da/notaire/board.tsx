"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./notaire.module.css";

type Etat = "vide" | "suppose" | "su";

type Article = {
  id: string;
  n: string;
  rubric: string;
  locked?: boolean;
  su?: string;
  suppose?: string;
};

const ARTICLES: Article[] = [
  {
    id: "face",
    n: "I",
    rubric: "Qui est en face",
    su: "Julien Morel, directeur ops — usine Lyon.",
  },
  {
    id: "tranche",
    n: "II",
    rubric: "Qui tranche",
    locked: true,
  },
  {
    id: "metrique",
    n: "III",
    rubric: "Métrique",
    suppose: "« On perd deux jours par semaine. » — l’ops.",
  },
  {
    id: "douleur",
    n: "IV",
    rubric: "Douleur",
  },
  {
    id: "process",
    n: "V",
    rubric: "Comment ça se décide",
    suppose: "« On avance si le pilote passe. »",
  },
  {
    id: "champion",
    n: "VI",
    rubric: "Champion",
    suppose: "Julien se propose. Pas encore vu.",
  },
];

const NEXT: Record<Etat, Etat> = {
  vide: "suppose",
  suppose: "su",
  su: "vide",
};

function initialEtat(article: Article): Etat {
  if (article.locked) return "vide";
  if (article.su) return "su";
  if (article.suppose) return "suppose";
  return "vide";
}

export function Board() {
  const [etats, setEtats] = useState<Record<string, Etat>>(() =>
    Object.fromEntries(ARTICLES.map((a) => [a.id, initialEtat(a)])),
  );
  const [convie, setConvie] = useState(false);

  function cycle(article: Article) {
    if (article.locked) return;
    setEtats((prev) => ({ ...prev, [article.id]: NEXT[prev[article.id] ?? "vide"] }));
  }

  function body(article: Article, etat: Etat) {
    if (etat === "su") return article.su ?? article.suppose ?? "Posé.";
    if (etat === "suppose") return article.suppose ?? "Supposé — pas de preuve.";
    return null;
  }

  return (
    <main className={`${styles.desk} flex min-h-dvh flex-1 flex-col px-4 py-5 sm:px-8 sm:py-7`}>
      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className={`${styles.cas} text-sm`}>Le DAF n’est pas dans la pièce</p>
          <p className="mt-1 max-w-md text-[13px] leading-snug text-[rgb(243_235_224/0.62)]">
            Call de découverte. Un ops. Tableau vide. Le non n’est pas encore arrivé.
          </p>
        </div>
        <nav className="flex gap-3 text-[11px] tracking-[0.14em] uppercase text-[rgb(243_235_224/0.55)]">
          <span className="text-[rgb(243_235_224/0.9)]">Notaire</span>
          <Link href="/da/compensation" className="underline-offset-4 hover:underline">
            Compensation
          </Link>
        </nav>
      </header>

      <div className="relative mx-auto w-full max-w-3xl">
        <div className={`${styles.liasse} absolute -top-3 -left-1 z-10 sm:-left-8`} aria-hidden>
          <div className={`${styles.sheet} translate-x-2 translate-y-2 bg-[var(--carbon-pink)]`}>
            <p className={styles.sheetLabel}>III Facture</p>
          </div>
          <div className={`${styles.sheet} translate-x-1 translate-y-1 bg-[var(--carbon-yellow)]`}>
            <p className={styles.sheetLabel}>II Trous</p>
          </div>
          <div className={`${styles.sheet} bg-[var(--deed)]`}>
            <p className={styles.sheetLabel}>I Découverte</p>
          </div>
        </div>

        <section className={`${styles.deed} px-5 pb-6 pt-14 sm:px-10 sm:pt-16`}>
          <p className={`${styles.rubric} mb-8 text-center text-xs text-[rgb(28_25_23/0.55)]`}>
            Acte — cas « DAF dit non »
          </p>

          <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {ARTICLES.map((article) => {
              const etat = etats[article.id] ?? "vide";
              const text = body(article, etat);
              return (
                <button
                  key={article.id}
                  type="button"
                  className={`${styles.cell} ${article.locked ? styles.locked : ""}`}
                  onClick={() => cycle(article)}
                  aria-label={`${article.rubric}, ${etat}`}
                >
                  <p className={`${styles.rubric} text-[11px] text-[rgb(28_25_23/0.55)]`}>
                    Art. {article.n} — {article.rubric}
                  </p>
                  <div className={`${styles.line} mt-2 flex items-end justify-between gap-3`}>
                    <p
                      className={`pb-1 text-[15px] leading-snug ${etat === "suppose" ? styles.guess : ""}`}
                    >
                      {text}
                    </p>
                    <span
                      className={etat === "vide" ? styles.parafeEmpty : styles.parafe}
                      aria-hidden
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section className={`${styles.witness} mx-auto mt-6 grid w-full max-w-3xl grid-cols-2 gap-px`}>
        <div className="px-5 py-4 sm:px-8">
          <p className={`${styles.rubric} text-[11px] text-[rgb(243_235_224/0.45)]`}>Témoin — ops</p>
          <p className="mt-2 text-[15px] text-[rgb(243_235_224/0.92)]">Julien Morel</p>
          <span className={`${styles.parafe} mt-3 block border-b-[rgb(243_235_224/0.85)]`} />
        </div>
        <button
          type="button"
          className={`${styles.cell} px-5 py-4 text-left sm:px-8`}
          onClick={() => setConvie((v) => !v)}
          aria-label={convie ? "DAF convoqué" : "Convier le DAF"}
        >
          <p className={`${styles.rubric} text-[11px] text-[rgb(243_235_224/0.45)]`}>Témoin — DAF</p>
          {convie ? (
            <>
              <p className="mt-2 text-[15px] text-[rgb(243_235_224/0.92)]">Dans la pièce</p>
              <span className={`${styles.parafe} mt-3 block border-b-[rgb(243_235_224/0.85)]`} />
            </>
          ) : (
            <>
              <p className="mt-2 text-[15px] text-[rgb(243_235_224/0.38)]">Pas dans l’appel</p>
              <span className={`${styles.blankRule} mt-3 block`} />
            </>
          )}
        </button>
      </section>

      <footer className="mx-auto mt-8 flex w-full max-w-3xl flex-col gap-2 px-1 sm:flex-row sm:items-baseline sm:justify-between">
        <p className={`${styles.scaleMark} text-sm`}>
          {convie
            ? "Voir le DAF. Il est dans la pièce."
            : "Pas inclus — s’il tranche sans toi, il dit non."}
        </p>
        <p className="text-[11px] tracking-[0.12em] uppercase text-[rgb(243_235_224/0.38)]">
          Parafe ou trou. Pas de chance.
        </p>
      </footer>
    </main>
  );
}
