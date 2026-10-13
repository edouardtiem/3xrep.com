import { NextResponse, type NextRequest } from "next/server";
import { isMonitoringPath, MONITORING_HOST } from "@/lib/private-surface";

export function proxy(req: NextRequest) {
  const publicHost = req.headers.get("host") ?? req.nextUrl.host;
  const monitoringHost = publicHost.toLowerCase().split(":")[0] === MONITORING_HOST;
  const privatePath = isMonitoringPath(req.nextUrl.pathname);
  if (!monitoringHost && !privatePath) return NextResponse.next();
  let response: NextResponse;
  if (monitoringHost && req.nextUrl.pathname === "/") {
    const target = req.nextUrl.clone();
    target.host = publicHost;
    target.port = publicHost.split(":")[1] ?? "";
    target.pathname = "/monitoring";
    response = NextResponse.redirect(target, 307);
  } else if (monitoringHost && !privatePath) {
    response = new NextResponse("Not found", { status: 404 });
  } else {
    response = NextResponse.next();
  }
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  // Preserve Origin on same-site POST forms; send no referrer off-site.
  response.headers.set("Referrer-Policy", "same-origin");
  response.headers.set("X-Frame-Options", "DENY");
  const developmentScripts = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
  response.headers.set("Content-Security-Policy", "frame-ancestors 'none'; form-action 'self'; connect-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'" + developmentScripts);
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|woff2)$).*)"] };
