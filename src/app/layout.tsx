import type { Metadata } from "next";
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
  title: "3xrep.com",
  description: "3xrep.com",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const gaId = getGaMeasurementId();

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {gaId ? <Ga4 gaId={gaId} /> : null}
      </body>
    </html>
  );
}
