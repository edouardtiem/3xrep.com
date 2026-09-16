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
  trou: Trou | null;
  rattachements: Action["rattachements"];
  draft: HorizonDraft;
  corrections_crm: CorrectionCrm[];
  refus: string | null;
  demande: string | null;
  etats: { id: string; etat: Etat }[];
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
  agenda: HorizonSlot[];
  hors_fenetre: HorizonHors[];
  refus: string | null;
  demande: string | null;
};

const PROPALE = /\b(propale|proposition|proposal|devis|quote)\b/i;
const PLAQUETTE = /\b(plaquette|deck|brochure|s[ée]quence)\b/i;

const DEMANDE_CONNECTEURS =
  "Connecte Gmail et Calendar dans Claude (connecteurs Google). On juge le CRM quand même.";

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
  if ([deal.notes, deal.mails, deal.meetings, deal.transcript].some((s) => s?.trim())) {
    return false;
  }
  return !(deal.exhibits ?? []).some((e) => e.citation?.trim());
}

function draftPour(item: HorizonItem, action: Action | null, refus: string | null): HorizonDraft {
  const quoi = action?.quoi ?? "";
  const question = action?.question;
  const angle = question ? `Angle : « ${question} ».` : quoi;
  const titre = item.titre ?? "";

  if (item.kind === "mail") {
    const chasse = item.mail?.sens === "entrant" && PLAQUETTE.test(`${titre} ${item.mail.extrait ?? ""}`);
    if (refus || chasse || /n'écris|ne pas envoyer|call manque/i.test(quoi)) {
      return {
        ecrire: false,
        contrainte: chasse
          ? `N’écris pas. Pas une plaquette. ${angle} Pas le corps du mail.`
          : `N’écris pas. ${angle} Pas le corps du mail.`,
      };
    }
    return {
      ecrire: false,
      contrainte: `${angle} Qui : ${item.mail?.destinataire ?? "la personne en face"}. Pas le corps du mail.`,
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

function slotOf(item: HorizonItem, quand: Date, offsetMs: number): HorizonSlot {
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
    quand: item.quand?.trim() || quand.toISOString(),
    heure: heureOf(quand, offsetMs),
    nom: item.deal.nom?.trim() || "sans nom",
    crm_id: item.deal.crm_id?.trim() || null,
    etape: item.deal.etape?.trim() || null,
    montant: item.deal.montant,
    titre: item.titre?.trim() || null,
    action,
    trou,
    rattachements: action?.rattachements ?? [],
    draft: draftPour(item, action, refus),
    corrections_crm: audit.corrections_crm ?? [],
    refus,
    demande: audit.demande,
    etats: audit.pieces.map((p) => ({ id: p.id, etat: p.etat })),
    mail: item.mail ? { sens: item.mail.sens, destinataire: item.mail.destinataire } : undefined,
  };
}

export function planHorizon(input: {
  fenetre: Fenetre;
  maintenant: string;
  items: HorizonItem[];
}): HorizonPlan {
  const offsetMs = offsetMsOf(input.maintenant);
  const now = parseQuand(input.maintenant, new Date());
  const start = startOfLocalDay(now, offsetMs);
  const end = new Date(start.getTime() + input.fenetre * 86_400_000);

  const agenda: HorizonSlot[] = [];
  const hors_fenetre: HorizonHors[] = [];

  for (const item of input.items) {
    const quand = parseQuand(item.quand, now);
    if (dansFenetre(quand, start, end, item.kind)) {
      agenda.push(slotOf(item, quand, offsetMs));
    } else {
      hors_fenetre.push({
        kind: item.kind,
        quand: item.quand?.trim() || null,
        nom: item.deal.nom?.trim() || "sans nom",
        titre: item.titre?.trim() || null,
        raison: `À reporter — hors fenêtre ${input.fenetre} jour${input.fenetre > 1 ? "s" : ""}.`,
      });
    }
  }

  agenda.sort((a, b) => (a.quand ?? "").localeCompare(b.quand ?? ""));
  hors_fenetre.sort((a, b) => (a.quand ?? "").localeCompare(b.quand ?? ""));

  const kinds = new Set(input.items.map((i) => i.kind));
  const demande =
    kinds.has("rdv") && kinds.has("mail") ? null : DEMANDE_CONNECTEURS;

  return {
    fenetre: input.fenetre,
    maintenant: input.maintenant,
    agenda,
    hors_fenetre,
    refus: null,
    demande,
  };
}
