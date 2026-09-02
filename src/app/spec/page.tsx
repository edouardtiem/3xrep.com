import { CopyButton } from "@/components/CopyButton";
import { Header } from "@/components/Header";
import { AGENT_SPEC } from "@/lib/copy";

export default function SpecPage() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-3xl font-medium tracking-tight">Spec d’agent</h1>
          <CopyButton text={AGENT_SPEC} label="Copier le spec" />
        </div>
        <p className="text-sm text-mute">
          Un texte, à eux. Ils le collent dans un Claude Project, un GPT, un agent Notion. Il
          contient notre URL. Il voyage quand ils changent de boîte.
        </p>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-[10px] border border-line bg-raise p-6 font-mono text-xs leading-relaxed">
          {AGENT_SPEC}
        </pre>
      </main>
    </>
  );
}
