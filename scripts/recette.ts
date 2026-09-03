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

function parse(text: string): unknown {
  if (text.startsWith("event:")) {
    const line = text.split("\n").find((l) => l.startsWith("data:"));
    if (line) return JSON.parse(line.slice(5).trim());
  }
  return JSON.parse(text);
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

async function main() {
  const a = await rpc(init);
  console.log("INIT", a.status, a.text.slice(0, 400));
  const initBody = parse(a.text) as { result?: { instructions?: string } };
  const instr = initBody.result?.instructions ?? "";
  console.log(
    "INSTRUCTIONS",
    instr.includes("deal coach") && instr.includes("Never default to French"),
  );

  const b = await rpc(lookup);
  console.log("LOOKUP", b.status, b.text.slice(0, 500));

  const c = await rpc(phrase);
  console.log("PHRASE", c.status, c.text.slice(0, 500));

  const d = await rpc(dossier);
  console.log("DOSSIER", d.status, d.text.slice(0, 400));

  const e = await rpc(audit);
  console.log("AUDIT", e.status, e.text.slice(0, 800));

  const g = await fetch(`${BASE}/api/stripe/checkout`, { method: "POST", redirect: "manual" });
  const checkoutBody = await g.text();
  const location = g.headers.get("location") ?? "";
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    console.log("CHECKOUT", g.status, "sans clés → 503 attendu", checkoutBody.slice(0, 280));
    if (g.status !== 503) {
      throw new Error(`checkout sans clés doit être 503, pas ${g.status} (pas de faux vert)`);
    }
    if (!checkoutBody.includes("STRIPE_SECRET_KEY") && !checkoutBody.includes("STRIPE_PRICE_ID")) {
      throw new Error("503 checkout doit nommer les secrets manquants");
    }
  } else {
    console.log("CHECKOUT", g.status, location.slice(0, 120));
    if (g.status !== 303 || !location.includes("checkout.stripe.com")) {
      throw new Error(`checkout avec clés test : 303 vers checkout.stripe.com attendu, got ${g.status} ${location || checkoutBody.slice(0, 200)}`);
    }
    console.log("CHECKOUT_OK session créée — ne pas payer (mode test documenté dans docs/checkout.md)");
  }

  const h = await fetch(`${BASE}/`);
  const home = await h.text();
  console.log("HOME", h.status, home.includes("VP Sales"));
  console.log("HOME_NO_SPEC", !home.includes("You are the deal coach"));

  const install = await fetch(`${BASE}/install`);
  const installHtml = await install.text();
  console.log("INSTALL", install.status, installHtml.includes('action="/api/stripe/checkout"'));
  if (install.status !== 200 || !installHtml.includes('action="/api/stripe/checkout"')) {
    throw new Error("/install doit porter le form checkout 99 €");
  }

  for (const [name, body] of [
    ["lookup", lookup],
    ["phrase", phrase],
    ["dossier", dossier],
    ["audit", audit],
  ] as const) {
    try {
      const parsed = parse((await rpc(body)).text);
      console.log("PARSED", name, JSON.stringify(parsed).slice(0, 200));
    } catch (err) {
      console.log("PARSE_FAIL", name, err);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
