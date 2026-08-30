import { Cormorant_Garamond, IBM_Plex_Sans } from "next/font/google";

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-notaire-display",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-notaire-sans",
});

export default function NotaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${display.variable} ${sans.variable} flex min-h-full flex-1 flex-col`}>
      {children}
    </div>
  );
}
