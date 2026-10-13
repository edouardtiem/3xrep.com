import type { Metadata } from "next";
import { cookies } from "next/headers";
import { MONITORING_COOKIE, monitoringConfigured, validMonitoringSession } from "@/lib/monitoring-auth";
import { loadMonitoring, type MonitoringSnapshot, type MonitoredWorkspace } from "@/lib/monitoring";
import styles from "./monitoring.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Suivi privé | 3xrep", description: "Suivi privé des inscriptions et de l’usage de 3xrep.", robots: { index: false, follow: false } };
const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Paris" });
function DateLabel({ value }: { value: string }) {
  return <time dateTime={value}>{dateFormat.format(new Date(value))}</time>;
}
function workspaceState(workspace: MonitoredWorkspace) {
  if (workspace.active_days_last_7 > 0) return "Résultat reçu ces 7 derniers jours";
  if (workspace.first_value_at) return "Premier résultat reçu";
  if (workspace.connector_used_at) return "Connecteur essayé";
  return "Aucun usage enregistré";
}
function Snapshot({ data }: { data: MonitoringSnapshot }) {
  const stages = [
    { label: "Inscrits", value: data.signups, detail: "Organisations, hors comptes internes" },
    { label: "Connecteur essayé", value: data.connectorUsed, detail: "Au moins un appel avec leur clé" },
    { label: "Premier résultat utile", value: data.firstValue, detail: "Une aide contenant une action proposée" },
    { label: "Actifs sur 7 jours", value: data.activeSevenDays, detail: "Au moins un résultat utile sur la période" },
  ];
  return <>
    <div className={styles.readAt}>Données lues le <DateLabel value={data.fetchedAt} /> · heure de Paris</div>
    <section aria-labelledby="journey-title" className={styles.journey}>
      <h2 id="journey-title">De l’inscription à l’usage</h2>
      <dl className={styles.stages}>{stages.map(stage => <div key={stage.label}>
        <dt>{stage.label}</dt><dd>{stage.value}</dd><p>{stage.detail}</p>
      </div>)}</dl>
    </section>
    <section aria-labelledby="workspaces-title" className={styles.workspaces}>
      <div className={styles.sectionHeading}><h2 id="workspaces-title">Les organisations</h2><span>{data.signups} inscrite{data.signups !== 1 ? "s" : ""}</span></div>
      {data.signups > data.workspaces.length && <p className={styles.note}>Les {data.workspaces.length} inscriptions les plus récentes sont affichées. Les compteurs couvrent toutes les organisations.</p>}
      {data.workspaces.length ? <ul className={styles.workspaceList}>{data.workspaces.map(workspace => <li key={workspace.id}>
        <div className={styles.workspaceHead}>
          <div><h3>{workspace.email ?? "Adresse non renseignée"}</h3><p>Inscrit le <DateLabel value={workspace.created_at} /></p></div>
          <span className={workspace.first_value_at ? styles.used : styles.unused}>{workspaceState(workspace)}</span>
        </div>
        <dl className={styles.workspaceStats}>
          <div><dt>Résultats utiles</dt><dd>{workspace.outputs}</dd></div>
          <div><dt>Sessions utiles</dt><dd>{workspace.sessions}</dd></div>
          <div><dt>Jours d’usage</dt><dd>{workspace.active_days}</dd></div>
          <div className={styles.lastActivity}><dt>Dernier résultat</dt><dd>{workspace.last_active_at ? <DateLabel value={workspace.last_active_at} /> : "Aucun"}</dd></div>
        </dl>
        <details className={styles.details}><summary>Origine et premier usage</summary>
          <dl className={styles.facts}>
            <div><dt>Source</dt><dd>{workspace.acquisition_source ?? "Non renseignée"}</dd></div>
            <div><dt>Campagne</dt><dd>{workspace.acquisition_campaign ?? "Non renseignée"}</dd></div>
            <div><dt>Premier appel</dt><dd>{workspace.connector_used_at ? <DateLabel value={workspace.connector_used_at} /> : "Aucun enregistré"}</dd></div>
            <div><dt>Premier résultat utile</dt><dd>{workspace.first_value_at ? <DateLabel value={workspace.first_value_at} /> : "Aucun enregistré"}</dd></div>
          </dl>
        </details>
      </li>)}</ul> : <div className={styles.empty}><h3>Aucune organisation inscrite</h3><p>Les premières inscriptions et leur usage apparaîtront ici.</p></div>}
    </section>
    <aside className={styles.tracking} aria-labelledby="tracking-title"><h2 id="tracking-title">Repère pour le suivi</h2>
      <p>{data.lastCall ? <>Dernier appel reçu le <DateLabel value={data.lastCall.created_at} />.</> : "Aucun appel conservé dans le journal des 14 derniers jours."}</p>
      <p className={styles.note}>Ce journal inclut les essais et les appels sans clé. Une absence d’usage ne suffit pas à conclure à une panne du suivi.</p>
    </aside>
    <footer className={styles.footer}>Une clé peut servir à plusieurs personnes. Les chiffres comptent des organisations. Les résultats utiles et les sessions décrivent l’aide reçue, pas les actions réalisées.</footer>
  </>;
}
export default async function MonitoringPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const authenticated = validMonitoringSession((await cookies()).get(MONITORING_COOKIE)?.value);
  const { error } = await searchParams;
  const configured = monitoringConfigured();
  const errors: Record<string, string> = { invalid: "Ce code ne permet pas de se connecter. Réessaie.", limited: "Trop de tentatives. Réessaie dans quinze minutes.", unavailable: "La connexion privée n’est pas encore configurée." };
  let data: MonitoringSnapshot | null = null;
  if (authenticated) {
    try { data = await loadMonitoring(); }
    catch { console.error("monitoring: database read unavailable"); }
  }
  return <main className={styles.shell} lang="fr">
    <header className={styles.header}><span className={styles.brand}>3xrep<span> / suivi privé</span></span>
      {authenticated && <div className={styles.actions}>
        <form method="get" action="/monitoring"><button className={styles.refresh}>Actualiser</button></form>
        <form method="post" action="/monitoring/session"><input type="hidden" name="action" value="logout" /><button className={styles.logout}>Se déconnecter</button></form>
      </div>}
    </header>
    <div className={styles.title}><h1>Qui s’inscrit.<br />Qui utilise 3xrep.</h1><p>Les inscriptions et l’usage réel du connecteur, au même endroit.</p></div>
    {!authenticated ? <section className={styles.login} aria-labelledby="login-title"><h2 id="login-title">Connexion privée</h2>
      <p>Entre ton code pour consulter le suivi. La session reste ouverte sept jours sur cet appareil.</p>
      {(!configured || error && errors[error]) && <p role="alert" className={styles.error}>{!configured ? "La connexion privée n’est pas encore configurée." : errors[error!]}</p>}
      <form method="post" action="/monitoring/session"><label htmlFor="password">Code privé</label><input id="password" name="password" type="password" autoComplete="current-password" required maxLength={256} disabled={!configured} /><button className={styles.primary} disabled={!configured}>Ouvrir le suivi</button></form>
      <p className={styles.note}>Cette page ne transmet aucune visite à Google Analytics.</p>
    </section> : data ? <Snapshot data={data} /> : <section className={styles.empty} role="alert"><h2>Les données sont indisponibles</h2><p>La lecture a échoué. Actualise pour réessayer. Les compteurs ne sont pas remplacés par des zéros.</p></section>}
  </main>;
}
