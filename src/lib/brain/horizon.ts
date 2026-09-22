import type { Strategy } from "./strategy";
import { artefacts } from "./corpus";
import { extraireFaits } from "./faits";
import { actionPourDeal } from "./action";
import { scoreDeal } from "./audit";
import { REFUS } from "./moteur";
import { nextQuestion } from "./next-question";
import type { PipeDeal } from "./pipe";
import type { Action, CorrectionCrm, DealInput, Trou } from "./types";
import type { Etat } from "./etat";

export type Fenetre = 1 | 7 | 30;

export type HorizonKind = "rdv" | "tache" | "mail" | "affaire";

export type HorizonMail = {
  sens: "entrant" | "sortant";
  extrait?: string;
  destinataire?: string;
};

export type HorizonItem = {
  kind: HorizonKind;
  quand?: string;
  titre?: string;
  deal: PipeDeal;
  mail?: HorizonMail;
};

export type HorizonDraft = {
  ecrire: boolean;
  contrainte: string;
};

export type HorizonSlot = {
  kind: HorizonKind;
  quand: string | null;
  heure: string | null;
  nom: string;
  crm_id: string | null;
  etape: string | null;
  montant?: number;
  titre: string | null;
  action: Action | null;
  strategy: Strategy | null;
  trou: Trou | null;
  rattachements: Action["rattachements"];
  draft: HorizonDraft;
  corrections_crm: CorrectionCrm[];
  refus: string | null;
  demande: string | null;
  etats: { id: string; etat: Etat }[];
  methode: import("./method-selection").MethodSelection;
  denouement?: DealInput["denouement"];
  mail?: { sens: HorizonMail["sens"]; destinataire?: string };
};

export type HorizonHors = {
  kind: HorizonKind;
  quand: string | null;
  nom: string;
  titre: string | null;
  raison: string;
};

export type HorizonPlan = {
  fenetre: Fenetre;
  maintenant: string;
  brief?: { headline: string; priorities: { deal: string; crm_id: string | null; why_today: string[]; move: string; strategy: Strategy }[] };
  agenda: HorizonSlot[];
  hors_fenetre: HorizonHors[];
  refus: string | null;
  demande: string | null;
};

const PROPALE = /\b(propale|proposition|proposal|devis|quote)\b/i;
const PLAQUETTE = /\b(plaquette|deck|brochure|s[ée]quence)\b/i;

export type SourcesLues = Partial<Record<"crm" | "gmail" | "calendar", "disponible" | "absent" | "interdit" | "erreur">>;
function demandeSources(sources?: SourcesLues): string | null {
  if (!sources) return "Vérifier l’accès à Gmail et Calendar dans votre assistant. Une liste vide ne prouve pas qu’un connecteur manque.";
  const missing = ["gmail", "calendar", "crm"].filter(k => sources[k as keyof SourcesLues] !== "disponible");
  return missing.length ? missing.map(k => `${k}: ${sources[k as keyof SourcesLues] ?? "accès non vérifié"}`).join(" ; ") + ". Utiliser les sources accessibles ; demander le branchement ou les droits manquants." : null;
}

function offsetMsOf(iso: string): number {
  const t = iso.trim();
  if (/Z$/i.test(t)) return 0;
  const m = t.match(/([+-])(\d{2}):?(\d{2})$/);
  if (!m) return 0;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3])) * 60_000;
}

function startOfLocalDay(now: Date, offsetMs: number): Date {
  const shifted = new Date(now.getTime() + offsetMs);
  return new Date(
    Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - offsetMs,
  );
}

function parseQuand(iso: string | undefined, fallback: Date): Date {
  if (!iso?.trim()) return fallback;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? fallback : new Date(t);
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function heureOf(quand: Date, offsetMs: number): string {
  const local = new Date(quand.getTime() + offsetMs);
  return `${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}`;
}

function dansFenetre(quand: Date, start: Date, end: Date, kind: HorizonKind): boolean {
  const t = quand.getTime();
  if (t < start.getTime()) return kind === "tache" || kind === "mail" || kind === "affaire";
  return t < end.getTime();
}

function sansArtefact(deal: DealInput): boolean {
  return !artefacts(deal).trim();
}

function draftPour(item: HorizonItem, action: Action | null, refus: string | null): HorizonDraft {
  const quoi = action?.quoi ?? "";
  const question = action?.question;
  const angle = question ? `Angle : « ${question} ».` : quoi;
  const titre = item.titre ?? "";

  if (item.kind === "mail") {
    const chasse = item.mail?.sens === "entrant" && PLAQUETTE.test(`${titre} ${item.mail.extrait ?? ""}`);
    if (refus || chasse || /n[’']écris|ne pas envoyer|call manque/i.test(quoi)) {
      return {
        ecrire: false,
        contrainte: chasse
          ? `N’écris pas. Pas une plaquette. ${angle} Pas le corps du mail.`
          : `N’écris pas. ${angle} Pas le corps du mail.`,
      };
    }
    return {
      ecrire: extraireFaits(item.deal).some(f => f.verifie && f.kind === "fait"),
      contrainte: `Brouillon par l’assistant, jamais envoi automatique. ${angle} Qui : ${item.mail?.destinataire ?? "la personne en face"}. Le moteur donne l’angle ; l’assistant peut rédiger le brouillon.`,
    };
  }

  if (item.kind === "rdv" && PROPALE.test(titre) && (refus || /call manque/i.test(quoi))) {
    return {
      ecrire: false,
      contrainte: "Ne pas préparer la propale. Le call manque.",
    };
  }

  if (item.kind === "rdv") {
    return {
      ecrire: false,
      contrainte: question ? `Dans le rendez-vous : « ${question} ». Pas un script.` : quoi,
    };
  }

  if (item.kind === "tache" && /relanc|follow/i.test(titre)) {
    return {
      ecrire: false,
      contrainte: `Ne pas relancer pour relancer. ${angle}`,
    };
  }

  return { ecrire: false, contrainte: quoi || "Juger d’abord." };
}

function slotOf(item: HorizonItem, quand: Date, offsetMs: number, fuseau?: string): HorizonSlot {
  const audit = scoreDeal(item.deal);
  const nq = item.kind === "rdv" ? nextQuestion(item.deal) : null;
  const vide = sansArtefact(item.deal);
  const refus = audit.refus ?? (vide ? REFUS : null);
  const action = vide
    ? actionPourDeal({
        deal: item.deal,
        pieces: audit.pieces,
        etape: item.deal.etape,
        refus,
      })
    : (audit.action ?? nq?.action ?? null);
  const trou = nq?.trou ?? audit.trous[0] ?? null;
  return {
    kind: item.kind,
    quand: item.quand?.trim() || null,
    heure: item.quand ? (fuseau ? new Intl.DateTimeFormat("en-GB", { timeZone: fuseau, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(quand) : heureOf(quand, offsetMs)) : null,
    nom: item.deal.nom?.trim() || "sans nom",
    crm_id: item.deal.crm_id?.trim() || null,
    etape: item.deal.etape?.trim() || null,
    montant: item.deal.montant,
    titre: item.titre?.trim() || null,
    action,
    strategy: audit.strategy ?? null,
    trou,
    rattachements: action?.rattachements ?? [],
    draft: audit.strategy && !refus && !(item.kind === "mail" && item.mail?.sens === "entrant" && PLAQUETTE.test(`${item.titre ?? ""} ${item.mail.extrait ?? ""}`)) ? { ecrire: true, contrainte: `Formulation proposée pour exécuter la stratégie. Reprendre ses preuves exactes et ses limites. Brouillon seulement, jamais envoi automatique. ${audit.strategy.do_not.join(" ")}` } : draftPour(item, action, refus),
    corrections_crm: audit.corrections_crm ?? [],
    refus,
    demande: audit.demande,
    methode: audit.methode,
    denouement: item.deal.denouement,
    etats: audit.pieces.map((p) => ({ id: p.id, etat: p.etat })),
    mail: item.mail ? { sens: item.mail.sens, destinataire: item.mail.destinataire } : undefined,
  };
}

export function planHorizon(input: {
  fenetre: Fenetre;
  maintenant: string;
  items: HorizonItem[];
  sources_lues?: SourcesLues;
  fuseau?: string;
}): HorizonPlan {
  const offsetMs = offsetMsOf(input.maintenant);
  const invalid = !/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(input.maintenant) || !Number.isFinite(Date.parse(input.maintenant));
  if (invalid) return { fenetre: input.fenetre, maintenant: input.maintenant, agenda: [], hors_fenetre: [], refus: "maintenant doit être une date ISO valide avec fuseau.", demande: null };
  if (input.fuseau) {
    try { new Intl.DateTimeFormat("en", { timeZone: input.fuseau }).format(); }
    catch { return { fenetre: input.fenetre, maintenant: input.maintenant, agenda: [], hors_fenetre: [], refus: "Fuseau horaire inconnu.", demande: null }; }
  }
  const now = new Date(input.maintenant);
  const start = input.fuseau ? zonedMidnight(now, input.fuseau, 0) : startOfLocalDay(now, offsetMs);
  const end = input.fuseau ? zonedMidnight(now, input.fuseau, input.fenetre) : new Date(start.getTime() + input.fenetre * 86_400_000);

  const agenda: HorizonSlot[] = [];
  const hors_fenetre: HorizonHors[] = [];

  for (const item of input.items) {
    if (item.quand && (!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(item.quand) || !Number.isFinite(Date.parse(item.quand)))) {
      hors_fenetre.push({ kind: item.kind, quand: item.quand, nom: item.deal.nom ?? "sans nom", titre: item.titre ?? null, raison: "Date invalide ou sans fuseau : demander une date, ne pas inventer un créneau." });
      continue;
    }
    const quand = parseQuand(item.quand, now);
    if (dansFenetre(quand, start, end, item.kind)) {
      agenda.push(slotOf(item, quand, offsetMs, input.fuseau));
    } else {
      hors_fenetre.push({
        kind: item.kind,
        quand: item.quand?.trim() || null,
        nom: item.deal.nom?.trim() || "sans nom",
        titre: item.titre?.trim() || null,
        raison: `À reporter - hors fenêtre ${input.fenetre} jour${input.fenetre > 1 ? "s" : ""}.`,
      });
    }
  }

  agenda.sort((a, b) => (a.quand ? Date.parse(a.quand) : Infinity) - (b.quand ? Date.parse(b.quand) : Infinity));
  hors_fenetre.sort((a, b) => (a.quand ? Date.parse(a.quand) : Infinity) - (b.quand ? Date.parse(b.quand) : Infinity));

  const demande = demandeSources(input.sources_lues);

  return {
    fenetre: input.fenetre,
    maintenant: input.maintenant,
    agenda,
    brief: strategicBrief(agenda, input.items, now, input.fenetre),
    hors_fenetre,
    refus: null,
    demande,
  };
}

/** Calendar-day windows follow the IANA zone across DST, not a fixed number of hours. */
function zonedMidnight(now: Date, zone: string, addDays: number): Date {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  const parts = (d: Date) => Object.fromEntries(fmt.formatToParts(d).map(p => [p.type, p.value]));
  const p = parts(now);
  const target = Date.UTC(+p.year, +p.month - 1, +p.day + addDays);
  let guess = target;
  for (let i = 0; i < 3; i++) {
    const q = parts(new Date(guess));
    const wall = Date.UTC(+q.year, +q.month - 1, +q.day, +q.hour, +q.minute, +q.second);
    guess += target - wall;
  }
  return new Date(guess);
}

/** Rule order is explicit; no probability and no revenue weighting. Agenda stays chronological. */
function strategicBrief(agenda: HorizonSlot[], items: HorizonItem[], now: Date, window: Fenetre): NonNullable<HorizonPlan["brief"]> {
  const ranked = agenda.flatMap((slot, index) => {
    if (!slot.strategy || slot.refus || (slot.denouement && slot.denouement !== "ouvert")) return [];
    const item = items.find(i => slot.crm_id ? i.deal.crm_id === slot.crm_id : i.deal.nom === slot.nom);
    const reasons: string[] = [];
    let rank = 0;
    if (slot.kind === "mail" && slot.mail?.sens === "entrant") { reasons.push("Une réponse au message entrant est à vérifier."); rank += 4; }
    if (/propos|contract|contrat|n[ée]go|signature|legal/i.test(slot.etape ?? "") && slot.etats.some(p => ["qui-tranche", "budget", "enjeu-chiffre"].includes(p.id) && p.etat !== "su")) { reasons.push("Une preuve fondamentale manque avant la proposition ou la signature."); rank += 6; }
    if (slot.kind === "rdv") { reasons.push(window === 1 ? "Rendez-vous dans la journée : préparer la validation utile." : "Rendez-vous à préparer dans cette période."); rank += 3; }
    if (slot.action?.next_step_cote === "nous") { reasons.push("La prochaine action est de notre côté."); rank += 2; }
    if (slot.kind === "tache" && slot.quand && Date.parse(slot.quand) < now.getTime()) { reasons.push("La tâche prévue est en retard."); rank += 3; }
    if (item?.deal.derniereModif && now.getTime() - Date.parse(item.deal.derniereModif) > 30 * 86400000) { reasons.push("Le dossier n’a pas été actualisé depuis plus de trente jours."); rank += 2; }
    const close = Date.parse(item?.deal.closeDate ?? "");
    if (Number.isFinite(close) && close <= now.getTime() + window * 86400000) {
      reasons.push("La date annoncée dans le fichier approche ou est dépassée ; elle reste à confirmer."); rank += 3;
      if (slot.etats.some(p => p.id === "process-papier" && p.etat !== "su")) { reasons.push("Faire confirmer les achats et le juridique dès maintenant : leurs délais ne sont pas établis."); rank += 3; }
    }
    if (!reasons.length) reasons.push(window === 30 ? "Établir les validations et délais qui nécessitent de l’anticipation." : "Préparer la prochaine preuve à obtenir.");
    return [{ deal: slot.nom, crm_id: slot.crm_id, why_today: reasons, move: slot.strategy.next_move.action, strategy: slot.strategy, rank, index }];
  }).sort((a, b) => b.rank - a.rank || a.index - b.index);
  const seen = new Set<string>();
  const priorities = ranked.filter(p => { const key = p.crm_id ?? (p.deal === "sans nom" ? `row:${p.index}` : p.deal); if (seen.has(key)) return false; seen.add(key); return true; }).slice(0, 5).map(({ rank: _rank, index: _index, ...p }) => { void _rank; void _index; return p; });
  return { headline: window === 1 ? "Les actions qui peuvent faire avancer les affaires aujourd’hui" : window === 7 ? "Préparer les prochaines validations cette semaine" : "Anticiper les décisions et les délais du mois", priorities };
}
