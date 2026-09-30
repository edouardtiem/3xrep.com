export type EvidenceView = { id: string; label: string; state: string; quote: string | null; claim: string | null; reason: string | null; methods: { methode: string; partie: string }[] };
export type CalculatedState = {
  id: string; label: string; change: string; dealName: string; stage: string;
  pieces: EvidenceView[]; gap: string; gapHeld: boolean; why: string;
  action: string; timing: string; wording: string; success: string;
  leverage: { quote: string; piece: string }[];
  branches: { condition: string; action: string; why: string }[];
  methods: string[]; missing: string[]; doNot: string[];
  sourcePassages: { id: string; text: string }[];
  provenance: { engine: string; scenario: string; output: string; presentation: string; rule: string };
};
