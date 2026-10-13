import { admin } from "@/lib/supabase-admin";

export type MonitoredWorkspace = {
  id: string; email: string | null; created_at: string; company_url: string | null;
  acquisition_source: string | null; acquisition_campaign: string | null;
  outputs: number; sessions: number; active_days: number; active_days_last_7: number;
  connector_used_at: string | null; first_value_at: string | null; last_active_at: string | null;
};
export type MonitoringSnapshot = {
  fetchedAt: string; signups: number; connectorUsed: number; firstValue: number; activeSevenDays: number;
  workspaces: MonitoredWorkspace[]; lastCall: { created_at: string; tool: string; ok: boolean } | null;
};
export async function loadMonitoring(): Promise<MonitoringSnapshot> {
  const db = admin();
  if (!db) throw new Error("Monitoring database unavailable");
  const since = new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString();
  const view = () => db.from("founding_dashboard").select("id", { count: "exact", head: true }).eq("is_internal", false);
  const results = await Promise.all([
    view(), view().not("connector_used_at", "is", null), view().not("first_value_at", "is", null), view().gte("last_active_at", since),
    db.from("founding_dashboard").select("id,email,created_at,company_url,acquisition_source,acquisition_campaign,outputs,sessions,active_days,active_days_last_7,connector_used_at,first_value_at,last_active_at").eq("is_internal", false).order("created_at", { ascending: false }).limit(100),
    db.from("mcp_calls").select("created_at,tool,ok").order("created_at", { ascending: false }).limit(1),
  ]);
  for (const result of results) if (result.error) throw new Error("Monitoring read failed: " + result.error.message);
  const counts = results.slice(0, 4).map(result => result.count);
  if (counts.some(count => count === null || count === undefined)) throw new Error("Monitoring counts unavailable");
  return { fetchedAt: new Date().toISOString(), signups: counts[0]!, connectorUsed: counts[1]!, firstValue: counts[2]!, activeSevenDays: counts[3]!, workspaces: results[4].data as unknown as MonitoredWorkspace[], lastCall: (results[5].data?.[0] ?? null) as MonitoringSnapshot["lastCall"] };
}
