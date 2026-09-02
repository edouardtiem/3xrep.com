import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Ga4 } from "@/components/Ga4";
import { getGaMeasurementId } from "@/lib/ga";
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
  metadataBase: new URL("https://3xrep.com"),
  title: "3xrep — Hire the best VP Sales agent",
  description:
    "This agent is the méthode that makes you close. 99 €/month for the entire organization.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-mono">
        {children}
        {gaId ? <Ga4 gaId={gaId} /> : null}
      </body>
    </html>
  );
}
