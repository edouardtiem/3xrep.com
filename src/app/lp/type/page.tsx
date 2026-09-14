import {
  IBM_Plex_Sans,
  Instrument_Sans,
  Newsreader,
  Outfit,
  Plus_Jakarta_Sans,
  Source_Sans_3,
} from "next/font/google";

const source = Source_Sans_3({ subsets: ["latin"], display: "swap" });
const instrument = Instrument_Sans({ subsets: ["latin"], display: "swap" });
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });
const outfit = Outfit({ subsets: ["latin"], display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], display: "swap" });

const FACES = [
  {
    name: "IBM Plex Sans",
    note: "On /lp now",
    className: plex.className,
  },
  {
    name: "Source Sans 3",
    note: "Clear, a bit more editorial",
    className: source.className,
  },
  {
    name: "Instrument Sans",
    note: "Clear, a bit more character",
    className: instrument.className,
  },
  {
    name: "Plus Jakarta Sans",
    note: "Rounder, more marketing",
    className: jakarta.className,
  },
  {
    name: "Outfit",
    note: "Geometric, closer to a logo",
    className: outfit.className,
  },
  {
    name: "Newsreader",
    note: "Serif, if you want contrast",
    className: newsreader.className,
  },
] as const;

function Specimen({
  name,
  note,
  className,
}: {
  name: string;
  note: string;
  className: string;
}) {
  return (
    <section className={`${className} border-t border-line py-16 sm:py-24`}>
      <p className="text-[0.8125rem] leading-[1.4] text-[#5c6168]">
        {name}
        {note ? ` — ${note}` : ""}
      </p>
      <h1 className="mt-6 text-[2rem] leading-[1.1] font-medium tracking-[-0.03em] sm:text-[2.5rem]">
        Your AI believes your CRM.
        <br />
        We don&apos;t.
      </h1>
      <p className="mt-4 max-w-[40ch] text-[1.125rem] leading-[1.5] text-[#5c6168]">
        14 days free. Then $129 a month for the whole company.
      </p>
      <p className="mt-8">
        <span className="inline-block rounded-lg bg-[#16171a] px-5 py-3 text-[0.9375rem] font-medium text-[#eef0f2]">
          Start 14 days free
        </span>
      </p>
      <p className="mt-10 max-w-[40rem] text-[1.125rem] leading-[1.5]">
        Acme — “Negotiation.” Nobody who signs. Julien runs the tool day to day.
        This stage is illegal.
      </p>
    </section>
  );
}

export default function TypePage() {
  return (
    <main className="mx-auto w-full max-w-[40rem] px-5 sm:px-10">
      <p className="py-10 text-[0.8125rem] leading-[1.4] text-[#5c6168]">
        Same words. Six faces. IBM Plex Sans is on the preview page today.
      </p>
      {FACES.map((face) => (
        <Specimen key={face.name} {...face} />
      ))}
    </main>
  );
}
