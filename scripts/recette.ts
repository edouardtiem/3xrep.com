const BASE = process.env.MCP_URL ?? "http://localhost:3002";
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

const unpaid = {
  jsonrpc: "2.0",
  id: 5,
  method: "tools/call",
  params: {
    name: "audit_deal",
    arguments: { notes: "Julien ops", montant: 8000 },
  },
};

const paid = {
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

  const b = await rpc(lookup);
  console.log("LOOKUP", b.status, b.text.slice(0, 500));

  const c = await rpc(phrase);
  console.log("PHRASE", c.status, c.text.slice(0, 500));

  const d = await rpc(dossier);
  console.log("DOSSIER", d.status, d.text.slice(0, 400));

  const e = await rpc(unpaid);
  console.log("UNPAID", e.status, e.text.slice(0, 400));

  const f = await rpc(paid, { authorization: "Bearer 3xr_dev_local" });
  console.log("PAID", f.status, f.text.slice(0, 800));

  const g = await fetch(`${BASE}/api/stripe/checkout`, { method: "POST" });
  console.log("CHECKOUT", g.status, (await g.text()).slice(0, 300));

  const h = await fetch(`${BASE}/`);
  console.log("HOME", h.status, (await h.text()).includes("deal d’ops"));

  for (const [name, body, extra] of [
    ["lookup", lookup, {}],
    ["phrase", phrase, {}],
    ["dossier", dossier, {}],
    ["unpaid", unpaid, {}],
    ["paid", paid, { authorization: "Bearer 3xr_dev_local" }],
  ] as const) {
    try {
      const parsed = parse((await rpc(body, extra)).text);
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
