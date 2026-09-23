const BASE = process.env.MCP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const MCP = `${BASE}/api/mcp`;

const headers = {
  "content-type": "application/json",
  accept: "application/json, text/event-stream",
};

async function rpc(body: unknown, extra: HeadersInit = {}) {
  const res = await fetch(MCP, {
    method: "POST",
    headers: { ...headers, ...extra },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { status: res.status, text, headers: Object.fromEntries(res.headers) };
}

function authHeaders(): HeadersInit {
  const key = process.env.DEV_ORG_KEY?.trim();
  if (!key) return {};
  return { authorization: `Bearer ${key}` };
}

function parse(text: string): unknown {
  if (text.startsWith("event:")) {
    const line = text.split("\n").find((l) => l.startsWith("data:"));
    if (line) return JSON.parse(line.slice(5).trim());
  }
  return JSON.parse(text);
}

function toolPayload(text: string): unknown {
  const outer = parse(text) as { result?: { content?: { text?: string }[] } };
  const raw = outer.result?.content?.[0]?.text;
  return raw ? JSON.parse(raw) : outer;
}

const init = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: "recette", version: "0.1.0" },
  },
};

const lookup = {
  jsonrpc: "2.0",
  id: 2,
  method: "tools/call",
  params: { name: "methode_lookup", arguments: { q: "MEDDIC" } },
};

const phrase = {
  jsonrpc: "2.0",
  id: 3,
  method: "tools/call",
  params: {
    name: "rattacher",
    arguments: { phrase: "Le DAF n’est pas dans l’appel." },
  },
};

const dossier = {
  jsonrpc: "2.0",
  id: 4,
  method: "tools/call",
  params: {
    name: "rattacher",
    arguments: {
      phrase:
        "étape découverte\nmontant 120000\nnotes Economic Buyer ok\ntranscript Julien ops",
    },
  },
};

const audit = {
  jsonrpc: "2.0",
  id: 6,
  method: "tools/call",
  params: {
    name: "audit_deal",
    arguments: {
      etape: "découverte",
      montant: 120000,
      notes: "Economic Buyer: ok",
      transcript:
        "Il a dit : « de toute façon c’est moi qui fais tourner l’outil au quotidien ». Deux jours perdus par mois. On a l’habitude de signer en décembre.",
    },
  },
};

const exhibits = {
  jsonrpc: "2.0",
  id: 8,
  method: "tools/call",
  params: {
    name: "audit_deal",
    arguments: {
      etape: "découverte",
      notes: "Economic Buyer: ok",
      exhibits: [
        {
          source: "note",
          auteur: "rep",
          citation: "le DAF signe, on est bons",
          piece: "qui-tranche",
          sens: "affirme",
        },
      ],
    },
  },
};

const pipe = {
  jsonrpc: "2.0",
  id: 7,
  method: "tools/call",
  params: {
    name: "pipe_review",
    arguments: {
      deals: [
        {
          nom: "Acme",
          etape: "Négociation",
          closeDate: "2026-09-30",
          montant: 120000,
          notes: "Economic Buyer: ok",
          transcript:
            "Il a dit : « de toute façon c’est moi qui fais tourner l’outil au quotidien ». Deux jours perdus par mois.",
        },
        { nom: "Dune", etape: "Négociation", closeDate: "2026-09-10" },
      ],
    },
  },
};

async function main() {
  const open = process.env.MCP_OPEN_TOOLS === "1";
  const beta = process.env.RECETTE_BETA === "1";
  const a = await rpc(init);
  console.log("INIT", a.status, a.text.slice(0, 400));
  const initBody = parse(a.text) as { result?: { instructions?: string } };
  const instr = initBody.result?.instructions ?? "";
  console.log(
    "INSTRUCTIONS",
    instr.includes("doesn't believe the CRM") &&
      instr.includes("pipe_review") &&
      instr.includes("Extract before you call") &&
      instr.includes("Never default to French"),
  );

  const locked = await rpc(lookup);
  const lockedPayload = JSON.stringify(toolPayload(locked.text));
  if (!open) {
    const cutoff = lockedPayload.includes("not answering") || lockedPayload.includes("no key");
    console.log("CUTOFF", locked.status, cutoff);
    if (!cutoff) {
      throw new Error(`sans clé le connecteur doit couper, got ${lockedPayload.slice(0, 300)}`);
    }
  }

  const auth = authHeaders();
  const canJudge = open || Object.keys(auth).length > 0;
  if (canJudge) {
    const b = await rpc(lookup, auth);
    console.log("LOOKUP", b.status, b.text.slice(0, 500));

    const c = await rpc(phrase, auth);
    console.log("PHRASE", c.status, c.text.slice(0, 500));

    const d = await rpc(dossier, auth);
    console.log("DOSSIER", d.status, d.text.slice(0, 400));

    const e = await rpc(audit, auth);
    console.log("AUDIT", e.status, e.text.slice(0, 800));

    const x = await rpc(exhibits, auth);
    const xv = toolPayload(x.text) as {
      grade?: string;
      demande?: string | null;
      pieces?: { id: string; etat: string; gap?: { claim: string | null; fait: string | null } }[];
    };
    const eb = xv.pieces?.find((p) => p.id === "qui-tranche");
    const exhibitsOk =
      x.status === 200 &&
      xv.grade === "B" &&
      Boolean(xv.demande) &&
      eb?.etat !== "su" &&
      eb?.gap != null;
    console.log("EXHIBITS", x.status, exhibitsOk);
    if (!exhibitsOk) {
      throw new Error(
        `audit_deal exhibits: grade B + demande + gap, jamais su — got ${JSON.stringify({ grade: xv.grade, etat: eb?.etat, gap: eb?.gap, demande: xv.demande })}`,
      );
    }

    const p = await rpc(pipe, auth);
    console.log(
      "PIPE",
      p.status,
      p.text.includes("etape_illegale") && p.text.includes("Insuffisant pour se prononcer"),
    );
  } else {
    console.log("JUDGE_SKIP", "pas de DEV_ORG_KEY — cutoff vérifié, cerveau en tests unitaires");
  }

  const g = await fetch(`${BASE}/api/stripe/checkout`, { method: "POST", redirect: "manual" });
  const checkoutBody = await g.text();
  const location = g.headers.get("location") ?? "";
  if (g.status === 503) {
    console.log("CHECKOUT", g.status, "sans clés → 503", checkoutBody.slice(0, 280));
    if (!checkoutBody.includes("STRIPE_SECRET_KEY") && !checkoutBody.includes("STRIPE_PRICE_ID")) {
      throw new Error("503 checkout doit nommer les secrets manquants");
    }
  } else if (g.status === 303 && location.includes("checkout.stripe.com")) {
    console.log("CHECKOUT", g.status, location.slice(0, 120));
    console.log("CHECKOUT_OK session créée — ne pas payer (mode test documenté dans docs/checkout.md)");
  } else {
    throw new Error(
      `checkout : 503 (pas configuré) ou 303 stripe attendu, got ${g.status} ${location || checkoutBody.slice(0, 200)}`,
    );
  }

  const h = await fetch(`${BASE}/`);
  const home = await h.text();
  console.log("HOME", h.status, home.includes("Every deal needs"));
  if (!home.includes("Every deal needs")) throw new Error("home doit présenter la stratégie par affaire");
  console.log("HOME_OFFER", beta ? home.includes("Join the beta") : home.includes("Beta enrollment is closed for now"));
  console.log("HOME_NO_SPEC", !home.includes("You are the deal coach"));
  const offer = beta ? "Join the beta" : "Beta enrollment is closed for now";
  if (h.status !== 200 || !home.includes(offer)) {
    throw new Error(`home doit dire ${offer}`);
  }

  const start = await fetch(`${BASE}/start`);
  const startHtml = await start.text();
  console.log("START", start.status, beta ? startHtml.includes("Work email") : startHtml.includes("Beta enrollment is closed"));
  if (start.status !== 200) throw new Error("/start 200");
  if (beta && (!startHtml.includes("Work email") || !startHtml.includes("Get my beta key") || !startHtml.includes('action="/api/orgs/start"'))) {
    throw new Error("/start doit proposer une inscription Beta avec une clé");
  }
  if (!beta && (!startHtml.includes("Beta enrollment is closed") || startHtml.includes('action="/api/orgs/start"'))) {
    throw new Error("/start fermé ne doit pas proposer l'essai standard");
  }
  if (!beta) {
    const closedSignup = await fetch(`${BASE}/api/orgs/start`, { method: "POST", body: new URLSearchParams({ email: "closed@example.invalid" }) });
    if (closedSignup.status !== 409 || !(await closedSignup.text()).includes("No workspace or standard trial was created")) {
      throw new Error("inscription fermée doit refuser toute création d'organisation");
    }
  }

  const card = await fetch(`${BASE}/api/stripe/checkout?mode=card&org=00000000-0000-0000-0000-000000000000&sig=dead`, {
    redirect: "manual",
  });
  const cardBody = await card.text();
  if (card.status === 503) {
    console.log("CHECKOUT_CARD", card.status, "sans clés");
  } else if (card.status === 400) {
    console.log("CHECKOUT_CARD", card.status, "lien invalide");
  } else {
    throw new Error(`checkout carte lien pourri : 400 ou 503 attendu, got ${card.status} ${cardBody.slice(0, 120)}`);
  }

  const install = await fetch(`${BASE}/install`);
  const installHtml = await install.text();
  const installOk = installHtml.includes('href="/start"') && !installHtml.includes('action="/api/stripe/checkout"') && (beta ? installHtml.includes("Get my beta key") : installHtml.includes("Beta enrollment is closed for now"));
  console.log("INSTALL", install.status, installOk);
  if (install.status !== 200 || !installOk) {
    throw new Error("/install doit suivre l'état des inscriptions Beta sans checkout");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
