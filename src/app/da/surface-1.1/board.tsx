"use client";

import { useEffect, useState } from "react";
import {
  AUTRES_CAS,
  CAS,
  CELLS,
  DECIDE_DECOUVERT,
  NEXT,
  PARCOURS_JOUEUR,
  cellValue,
  initialEtats,
  sortieCopy,
  type Etat,
} from "../_content";
import { EtudesNav } from "../_etudes";
import styles from "./surface.module.css";

type View = "liste" | "terrain" | "sortie";
type Theme = "light" | "dark";
type Cran = "voir" | "inclure" | "absent";

export function Board() {
  const [theme, setTheme] = useState<Theme>("light");
  const [view, setView] = useState<View>("liste");
  const [etats, setEtats] = useState<Record<string, Etat>>(initialEtats);
  const [questions, setQuestions] = useState(2);
  const [discovered, setDiscovered] = useState(false);
  const [cran, setCran] = useState<Cran>("absent");

  useEffect(() => {
    const saved = window.localStorage.getItem("da-surface-theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      return;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
  }, []);

  function persist(next: Theme) {
    setTheme(next);
    window.localStorage.setItem("da-surface-theme", next);
  }

  function openTerrain() {
    setEtats(initialEtats());
    setQuestions(2);
    setDiscovered(false);
    setCran("absent");
    setView("terrain");
  }

  function ask() {
    if (questions < 1 || discovered) return;
    setQuestions((n) => n - 1);
    setDiscovered(true);
    setEtats((p) => ({ ...p, decide: "su" }));
  }

  function val(c: (typeof CELLS)[number], e: Etat) {
    if (c.id === "decide" && discovered) return DECIDE_DECOUVERT;
    return cellValue(c, e);
  }

  return (
    <main className={`${styles.shell} min-h-dvh`} data-theme={theme}>
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 py-6">
        <header className="mb-8 flex items-baseline justify-between gap-4">
          {view === "liste" ? (
            <span />
          ) : (
            <p className={styles.crumb}>{PARCOURS_JOUEUR}</p>
          )}
          <div className={`${styles.nav} flex gap-3`}>
            <button type="button" onClick={() => persist(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? "dark" : "light"}
            </button>
            <EtudesNav current="1.1" className="flex gap-3" hereClass={styles.here} />
          </div>
        </header>

        {view === "liste" ? (
          <Liste onPlay={openTerrain} />
        ) : view === "terrain" ? (
          <Terrain
            etats={etats}
            questions={questions}
            discovered={discovered}
            cran={cran}
            val={val}
            onCycle={(id) => setEtats((p) => ({ ...p, [id]: NEXT[p[id] ?? "vide"] }))}
            onAsk={ask}
            onCran={setCran}
            onExit={() => setView("sortie")}
            onBack={() => setView("liste")}
          />
        ) : (
          <Sortie cran={cran} onListe={() => setView("liste")} onReplay={openTerrain} />
        )}
      </div>
    </main>
  );
}

function Liste({ onPlay }: { onPlay: () => void }) {
  return (
    <>
      <h1 className="text-2xl tracking-tight">{PARCOURS_JOUEUR}</h1>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[var(--mute)]">
        Trois deals. Même situation. On ne termine pas le parcours.
      </p>
      <div className="mt-8">
        {AUTRES_CAS.map((cas) => (
          <button
            key={cas.id}
            type="button"
            className={styles.row}
            disabled={!cas.playable}
            onClick={() => cas.playable && onPlay()}
          >
            <span>{cas.titre_joueur}</span>
            <span className={`${styles.mono} ${styles.vide}`}>{cas.playable ? "" : "—"}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function Terrain({
  etats,
  questions,
  discovered,
  cran,
  val,
  onCycle,
  onAsk,
  onCran,
  onExit,
  onBack,
}: {
  etats: Record<string, Etat>;
  questions: number;
  discovered: boolean;
  cran: Cran;
  val: (c: (typeof CELLS)[number], e: Etat) => string;
  onCycle: (id: string) => void;
  onAsk: () => void;
  onCran: (c: Cran) => void;
  onExit: () => void;
  onBack: () => void;
}) {
  return (
    <>
      <button
        type="button"
        className={`${styles.crumb} mb-6 cursor-pointer bg-transparent p-0`}
        onClick={onBack}
        aria-label={`Retour à ${PARCOURS_JOUEUR}`}
      >
        ←
      </button>

      <h1 className="text-2xl tracking-tight">{CAS.titre_joueur}</h1>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--mute)]">
        Call de découverte. Julien, manager ops. Tableau vide.
      </p>

      <div className="mt-8">
        {CELLS.map((c) => {
          const e = etats[c.id] ?? "vide";
          const shown = c.id === "decide" && discovered ? "su" : e;
          return (
            <button
              key={c.id}
              type="button"
              className={styles.prop}
              onClick={() => {
                if (c.id === "decide" && discovered) return;
                onCycle(c.id);
              }}
            >
              <span className={styles.label}>{c.label}</span>
              <span className={`${styles.mono} ${styles[shown]}`}>{val(c, e)}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-[13px] text-[var(--dim)]">
        {questions} question{questions === 1 ? "" : "s"} restante{questions === 1 ? "" : "s"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {!discovered && (
          <button type="button" className={styles.action} onClick={onAsk} disabled={questions < 1}>
            Poser une question
          </button>
        )}
        {discovered && (
          <>
            <button
              type="button"
              className={`${styles.action} ${cran === "voir" ? styles.on : ""}`}
              onClick={() => onCran(cran === "voir" ? "absent" : "voir")}
            >
              Convier
            </button>
            <button
              type="button"
              className={`${styles.action} ${cran === "inclure" ? styles.on : ""}`}
              onClick={() => onCran(cran === "inclure" ? "absent" : "inclure")}
            >
              Inclure sans voir
            </button>
          </>
        )}
        <button type="button" className={styles.action} onClick={onExit}>
          Terminer l’appel
        </button>
      </div>
    </>
  );
}

function Sortie({
  cran,
  onListe,
  onReplay,
}: {
  cran: Cran;
  onListe: () => void;
  onReplay: () => void;
}) {
  const copy = sortieCopy(cran);

  return (
    <div className="flex flex-1 flex-col">
      <h1 className="text-2xl tracking-tight">{copy.titre}</h1>
      <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--mute)]">{copy.trou}</p>

      <p className={`${styles.scale} mt-10`}>
        <span className={cran === "voir" ? styles.on : undefined}>Voir le DAF</span>
        <span className={cran === "inclure" ? styles.on : undefined}>Inclure sans voir</span>
        <span className={cran === "absent" ? styles.on : undefined}>Pas inclus — il dit non</span>
      </p>

      <div className="mt-auto flex flex-wrap gap-2 pt-12">
        <button type="button" className={styles.action} onClick={onReplay}>
          Rejouer celui-ci
        </button>
        <button type="button" className={styles.action} onClick={onListe}>
          Un autre cas
        </button>
      </div>
    </div>
  );
}
