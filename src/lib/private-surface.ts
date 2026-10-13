/** Used by analytics and hostname routing. No customer identifiers here. */
export const MONITORING_HOST = "monitoring.3xrep.com";
export function isMonitoringPath(path: string): boolean {
  return path === "/monitoring" || path.startsWith("/monitoring/");
}
export function isPrivateSurface(path: string, hostname: string): boolean {
  return isMonitoringPath(path) || hostname === MONITORING_HOST;
}
