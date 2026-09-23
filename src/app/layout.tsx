import { AcquisitionTracker } from "@/components/AcquisitionTracker";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Ga4 } from "@/components/Ga4";
import { getGaMeasurementId } from "@/lib/ga";
import { lpSans } from "@/lib/lp-font";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "3xrep - Your AI believes your CRM. We don't.",
  description: "Build a deal strategy in your AI chat. Join the Beta to try 3xrep on real deals, with no card. We select up to 20 teams for a free-forever base plan after real use.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const gaId = getGaMeasurementId();

  return (
    <html
      lang="en"
      className={`${lpSans.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AcquisitionTracker />
        {children}
        {gaId ? <Ga4 gaId={gaId} /> : null}
      </body>
    </html>
  );
}
