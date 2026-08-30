import { Barlow_Condensed, Newsreader } from "next/font/google";

const label = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-comp-label",
});

const body = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-comp-body",
});

export default function CompensationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${label.variable} ${body.variable} flex min-h-full flex-1 flex-col`}>
      {children}
    </div>
  );
}
