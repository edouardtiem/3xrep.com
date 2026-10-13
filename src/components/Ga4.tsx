"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { isPrivateSurface } from "@/lib/private-surface";

const subscribe = () => () => {};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function sendPageView(gaId: string, pathname: string) {
  if (isPrivateSurface(pathname, window.location.hostname)) return;
  window.gtag?.("config", gaId, {
    page_path: pathname,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function Ga4({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const ready = useRef(false);
  // Start with analytics absent on the server; resolve the actual host on hydration.
  const privateSurface = useSyncExternalStore(subscribe, () => isPrivateSurface(pathname, window.location.hostname), () => true);

  useEffect(() => {
    if (privateSurface || !ready.current) return;
    sendPageView(gaId, pathname);
  }, [gaId, pathname, privateSurface]);

  if (privateSurface) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        onReady={() => {
          ready.current = true;
          sendPageView(gaId, pathname);
        }}
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
