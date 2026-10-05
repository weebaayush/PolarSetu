import { useRef, useState, type KeyboardEvent } from 'react';
import CargoTracker from '../modules/CargoTracker';
import LoadPlanner from '../modules/LoadPlanner';
import Inventory from '../modules/Inventory';
import Personnel from '../modules/Personnel';
import Emergency from '../modules/Emergency';
import WasteReturn from '../modules/WasteReturn';

const TABS = [
  { key: 'cargo', label: 'Cargo & assets', Panel: CargoTracker },
  { key: 'plan', label: 'Load planner', Panel: LoadPlanner },
  { key: 'inv', label: 'Inventory & forecast', Panel: Inventory },
  { key: 'ppl', label: 'Personnel', Panel: Personnel },
  { key: 'sos', label: 'Emergency SOS', Panel: Emergency },
  { key: 'waste', label: 'Waste return', Panel: WasteReturn },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function savedTab(): TabKey {
  try {
    const k = localStorage.getItem('ps-tab');
    if (TABS.some((t) => t.key === k)) return k as TabKey;
  } catch { /* storage unavailable */ }
  return 'cargo';
}

export default function ModuleConsole() {
  const [active, setActive] = useState<TabKey>(savedTab);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function open(k: TabKey) {
    setActive(k);
    try { localStorage.setItem('ps-tab', k); } catch { /* ignore */ }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = TABS.findIndex((t) => t.key === active);
    const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length].key;
    open(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className="block wrap" id="console">
      <div className="sec-head">
        <div>
          <div className="eyebrow">Working MVP · sample data</div>
          <h2 style={{ marginTop: 10 }}>Five modules.<br />One source of truth.</h2>
        </div>
        <p>
          Every action below updates the same shared state. Scan a crate, draw fuel or raise an SOS and it shows up
          in the station's sync queue at the top of the page.
        </p>
      </div>
      <div className="console">
        <div className="tabs" role="tablist" onKeyDown={onKey}>
          {TABS.map((t, i) => (
            <button
              key={t.key}
              ref={(el) => { tabRefs.current[t.key] = el; }}
              className="tab"
              role="tab"
              id={`t-${t.key}`}
              aria-controls={`p-${t.key}`}
              aria-selected={active === t.key}
              tabIndex={active === t.key ? 0 : -1}
              onClick={() => open(t.key)}
            >
              <span className="n">0{i + 1}</span>
              {t.label}
            </button>
          ))}
        </div>
        {/* Panels stay mounted so running drills and selections survive tab switches. */}
        {TABS.map(({ key, Panel }) => (
          <div key={key} className="tabpanel" role="tabpanel" id={`p-${key}`} aria-labelledby={`t-${key}`} hidden={active !== key}>
            <Panel />
          </div>
        ))}
      </div>
    </section>
  );
}
