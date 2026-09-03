import { CheckoutButton } from "@/components/CheckoutButton";
import { CopyButton } from "@/components/CopyButton";
import { Header } from "@/components/Header";
import { mcpUrl } from "@/lib/site";

export default function Install() {
  const url = mcpUrl();
  const mcpJson = JSON.stringify(
    {
      mcpServers: {
        "3xrep": { url },
      },
    },
    null,
    2,
  );

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-12 px-6 py-16">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-medium tracking-tight">Brancher, puis payer</h1>
          <p className="text-mute">
            Deux gestes. L’admin branche 3xrep une fois (Claude, ChatGPT Business ou Notion). Puis
            99 € / org. Pas de CRM 3xrep. Pas de démo.
          </p>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg">1. URL du connector</h2>
          <div className="flex items-center justify-between gap-4 rounded-[10px] border border-line bg-raise px-4 py-3 font-mono text-sm">
            <span className="truncate">{url}</span>
            <CopyButton text={url} label="Copier" />
          </div>
          <pre className="overflow-x-auto rounded-[10px] border border-line bg-raise p-4 font-mono text-xs">
            {mcpJson}
          </pre>
        </section>

        <section className="flex flex-col gap-6 text-sm leading-relaxed">
          <div>
            <h2 className="mb-2 text-lg">Claude Team / Cowork</h2>
            <p className="text-mute">
              Owner : Settings → Connectors → Add custom connector. Coller l’URL. Activer le
              connector CRM. Chaque user : Connect (OAuth à son nom). Coller le{" "}
              <a className="text-fg underline-offset-2 hover:underline" href="/spec">
                spec
              </a>{" "}
              dans le Project partagé.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg">ChatGPT Business</h2>
            <p className="text-mute">
              Admin publie l’app MCP 3xrep sur le workspace, plus le CRM. Auth individuelle. Même
              spec collé sur le GPT partagé.
            </p>
          </div>
          <div>
            <h2 className="mb-2 text-lg">Notion Custom Agents</h2>
            <p className="text-mute">
              Admin autorise le MCP 3xrep, colle le spec sur l’agent partagé. Auth si le serveur
              la demande.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg">Trois prompts</h2>
          <ol className="list-decimal space-y-3 pl-5 text-sm text-mute">
            <li>Rattache cette phrase : « de toute façon c’est moi qui fais tourner l’outil. »</li>
            <li>C’est quoi MEDDIC Economic Buyer, et quelle autre grille nomme la même case ?</li>
            <li>Débriefe le call avec Julien — notes, transcript, next step sont sur la fiche.</li>
          </ol>
        </section>

        <section className="flex flex-col gap-4 border-t border-line pt-10">
          <h2 className="text-lg">2. Payer 99 € / org</h2>
          <p className="text-sm text-mute">
            Abo Stripe, une organisation. Après paiement : page <span className="font-mono">/merci</span>{" "}
            + clé Bearer pour les tools payants (<span className="font-mono">audit_deal</span>).
          </p>
          <CheckoutButton />
        </section>
      </main>
    </>
  );
}
