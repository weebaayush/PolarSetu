import { useReducedMotion } from '../lib/hooks';

const MONO = 'IBM Plex Mono, monospace';
const SANS = 'IBM Plex Sans, sans-serif';

/** [path id, start offset (s), duration (s)] for each moving crate. */
const MOVERS: [string, number, number][] = [
  ['seaR', 0, 9], ['seaR', 4.5, 9], ['seaR2', 2, 10], ['airR', 1, 5], ['airR', 3.5, 5],
];

export default function Corridor({ inTransit }: { inTransit: number }) {
  const reduced = useReducedMotion();
  return (
    <div className="corridor">
      <div className="cap">
        <span className="eyebrow">Live corridor · 46th ISEA (sample)</span>
        <span className="pill">{inTransit} crates in transit</span>
      </div>
      <svg
        viewBox="0 0 560 300"
        role="img"
        aria-label="Logistics corridor from NCPOR Goa to Cape Town, then by ship to Bharati and Maitri, or by DROMLAN flight via Novo runway to Maitri"
      >
        <defs>
          <pattern id="ice" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0 8 L8 0" stroke="var(--line)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect x="380" y="18" width="168" height="270" rx="12" fill="url(#ice)" stroke="var(--line)" />
        <text x="392" y="38" fontFamily={MONO} fontSize="10" fill="var(--muted)" letterSpacing="1.5">ANTARCTICA</text>

        <path id="seaR" d="M50 70 C120 70 130 150 190 150 C260 150 300 92 460 92" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
        <path id="seaR2" d="M190 150 C260 150 300 210 460 210" fill="none" stroke="var(--ink)" strokeWidth="2.5" />
        <path id="airR" d="M190 150 C250 250 330 262 420 250 L460 210" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="6 5" />

        <g fontFamily={SANS} fontSize="12" fill="var(--ink)">
          <circle cx="50" cy="70" r="8" fill="var(--ink)" />
          <text x="30" y="50" fontWeight="600">NCPOR HQ</text>
          <text x="30" y="98" fontSize="10" fill="var(--muted)" fontFamily={MONO}>Vasco da Gama, Goa</text>
          <circle cx="190" cy="150" r="8" fill="var(--surface)" stroke="var(--ink)" strokeWidth="2.5" />
          <text x="150" y="130" fontWeight="600">Cape Town</text>
          <text x="150" y="180" fontSize="10" fill="var(--muted)" fontFamily={MONO}>port + air gateway</text>
          <circle cx="460" cy="92" r="9" fill="var(--accent)" />
          <text x="474" y="96" fontWeight="700">Bharati</text>
          <circle cx="460" cy="210" r="9" fill="var(--accent)" />
          <text x="474" y="214" fontWeight="700">Maitri</text>
          <circle cx="420" cy="250" r="5" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
          <text x="392" y="276" fontSize="10" fill="var(--muted)" fontFamily={MONO}>Novo runway</text>
        </g>
        <g fontFamily={MONO} fontSize="10" fill="var(--muted)">
          <text x="300" y="80">ice-class vessel</text>
          <text x="250" y="270" fill="var(--accent)">DROMLAN flight</text>
        </g>

        {!reduced && (
          <g>
            {MOVERS.map(([path, offset, dur], i) => (
              <rect
                key={i}
                width="9" height="9" x="-4.5" y="-4.5" rx="1.5"
                fill={path === 'airR' ? 'var(--accent)' : 'var(--ink)'}
                stroke="var(--surface)" strokeWidth="1.5"
              >
                <animateMotion dur={`${dur}s`} begin={`-${offset}s`} repeatCount="indefinite" rotate="auto">
                  <mpath href={`#${path}`} />
                </animateMotion>
              </rect>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
