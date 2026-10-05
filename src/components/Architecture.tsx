const MONO = 'IBM Plex Mono, monospace';
const onInk = { fill: 'var(--bg)' } as const;

const STACK: [string, string][] = [
  ['Web', 'React + TypeScript PWA'],
  ['Field app', 'React Native, QR'],
  ['Backend', 'FastAPI (Python)'],
  ['Database', 'PostgreSQL + PostGIS'],
  ['Offline sync', 'PouchDB ↔ CouchDB replication'],
  ['Comms', 'Iridium SBD, MQTT'],
  ['AI / ML', 'Prophet, XGBoost, OR-Tools'],
  ['Security', 'Keycloak RBAC, Docker'],
];

function EdgeNode({ y, name }: { y: number; name: string }) {
  return (
    <>
      <rect x="640" y={y} width="150" height="80" rx="10" fill="var(--ink)" />
      <text x="656" y={y + 28} fontWeight="700" fontSize="14" style={onInk}>{name}</text>
      <text x="656" y={y + 48} fontFamily={MONO} fontSize="10.5" style={onInk} opacity=".7">SQLite / PouchDB</text>
      <text x="656" y={y + 64} fontFamily={MONO} fontSize="10.5" style={onInk} opacity=".7">works fully offline</text>
    </>
  );
}

function Device({ y, label, sub }: { y: number; label: string; sub?: string }) {
  return (
    <g>
      <line x1="830" y1={y} x2="846" y2={y} stroke="var(--muted)" />
      <text x="852" y={y + 4}>{label}</text>
      {sub && <text x="852" y={y + 19} className="sm">{sub}</text>}
    </g>
  );
}

export default function Architecture() {
  return (
    <section className="block wrap" id="arch">
      <div className="sec-head">
        <div>
          <div className="eyebrow">Technical approach</div>
          <h2 style={{ marginTop: 10 }}>Built to run<br />without the cloud.</h2>
        </div>
        <p>
          HQ runs the central server. Each station runs a full copy on a small edge server. Phones, RFID readers,
          sensors and SOS beacons talk to the station node over local Wi-Fi, never directly to the internet.
        </p>
      </div>

      <div className="arch">
        <svg viewBox="0 0 980 300" role="img" aria-label="Architecture: HQ server connects via satellite link to station edge servers, which serve field devices">
          <defs>
            <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill="var(--muted)" />
            </marker>
          </defs>

          <rect x="10" y="40" width="220" height="220" rx="12" fill="var(--bg)" stroke="var(--line)" />
          <text x="28" y="72" fontWeight="700" fontSize="16">HQ server · NCPOR Goa</text>
          <text x="28" y="98" className="sm">FastAPI · PostgreSQL + PostGIS</text>
          <text x="28" y="118" className="sm">Planner · forecasting · OR-Tools</text>
          <text x="28" y="138" className="sm">Keycloak RBAC · Docker</text>
          <text x="28" y="168" className="sm">Web dashboard (React PWA)</text>
          <text x="28" y="188" className="sm">Open-Meteo / ECMWF weather</text>
          <rect x="28" y="212" width="184" height="30" rx="6" fill="var(--ice)" />
          <text x="40" y="232" fontSize="12" style={{ fill: 'var(--ice-ink)' }}>Single source of truth</text>

          <line x1="236" y1="150" x2="356" y2="150" stroke="var(--muted)" strokeWidth="1.5" markerStart="url(#ah)" markerEnd="url(#ah)" />
          <rect x="360" y="100" width="170" height="100" rx="50" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
          <text x="445" y="140" textAnchor="middle" fontWeight="700" fontSize="15">Satellite link</text>
          <text x="445" y="160" textAnchor="middle" className="sm">delta sync · compressed</text>
          <text x="445" y="176" textAnchor="middle" className="sm">Iridium SBD for SOS</text>
          <line x1="536" y1="150" x2="636" y2="96" stroke="var(--muted)" strokeWidth="1.5" markerStart="url(#ah)" markerEnd="url(#ah)" />
          <line x1="536" y1="150" x2="636" y2="206" stroke="var(--muted)" strokeWidth="1.5" markerStart="url(#ah)" markerEnd="url(#ah)" />

          <EdgeNode y={56} name="Maitri edge node" />
          <EdgeNode y={166} name="Bharati edge node" />

          <g fontSize="12.5">
            <line x1="794" y1="96" x2="830" y2="96" stroke="var(--muted)" strokeWidth="1.5" />
            <line x1="794" y1="206" x2="830" y2="206" stroke="var(--muted)" strokeWidth="1.5" />
            <line x1="830" y1="40" x2="830" y2="262" stroke="var(--muted)" strokeWidth="1.5" />
            <Device y={48} label="Field app (QR scan)" />
            <Device y={96} label="RFID readers" />
            <Device y={148} label="Fuel + cold-store" sub="IoT sensors · MQTT" />
            <Device y={206} label="SOS beacons" />
            <Device y={254} label="Offline maps" sub="OpenLayers tiles" />
          </g>
          <text x="10" y="22" className="sm">HQ (INDIA)</text>
          <text x="640" y="22" className="sm">STATIONS (ANTARCTICA)</text>
          <text x="830" y="22" className="sm">FIELD DEVICES</text>
        </svg>
      </div>

      <div className="stack">
        {STACK.map(([k, v]) => (
          <div key={k}><b>{k}</b>{v}</div>
        ))}
      </div>
    </section>
  );
}
