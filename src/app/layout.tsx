import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Ga4 } from "@/components/Ga4";
import { getGaMeasurementId } from "@/lib/ga";
import { lpSans } from "@/lib/lp-font";
import { siteUrl } from "@/lib/site";
import { LIST_PRICE_USD } from "@/lib/stripe-checkout-session";
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
  title: "3xrep — Your AI believes your CRM. We don't.",
  description: `He lives in Claude or ChatGPT, next to HubSpot. 14 days free, then $${LIST_PRICE_USD} a month for the whole company. We don't join your calls.`,
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
        {children}
        {gaId ? <Ga4 gaId={gaId} /> : null}
      </body>
    </html>
  );
}
