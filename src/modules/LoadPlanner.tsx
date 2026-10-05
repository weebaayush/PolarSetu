import { useMemo, useState } from 'react';
import { HOLDS, MANIFEST } from '../data';
import { planLoad, type PlanMode } from '../lib/planner';
import { inr } from '../lib/format';

export default function LoadPlanner() {
  const [mode, setMode] = useState<PlanMode>('ai');
  const plan = useMemo(() => planLoad(MANIFEST, HOLDS, mode), [mode]);

  const p1 = MANIFEST.filter((i) => i.priority === 1).length;
  const p1OnFlight = plan.load.air.filter((i) => i.priority === 1).length;
  const placed = MANIFEST.length - plan.unplaced.length;
  const util = Math.round(
    (HOLDS.reduce((a, h) => a + plan.used[h.key], 0) / HOLDS.reduce((a, h) => a + h.cap, 0)) * 100,
  );

  return (
    <>
      <div className="tp-head">
        <div>
          <h3>AI cargo load planning</h3>
          <p>
            Packs cargo by weight, priority and temperature class. Critical medical and comms items go on the first
            flight; frozen goods only go where the cold chain holds. Production uses Google OR-Tools; this demo runs
            a priority-first heuristic.
          </p>
        </div>
        <div className="seg" role="group" aria-label="Plan mode">
          <button aria-pressed={mode === 'manual'} onClick={() => setMode('manual')}>Manual (first-come)</button>
          <button aria-pressed={mode === 'ai'} onClick={() => setMode('ai')}>PolarSetu AI</button>
        </div>
      </div>

      <div className="score">
        <div>
          <b style={{ color: p1OnFlight === p1 ? 'var(--ok)' : 'var(--crit)' }}>{p1OnFlight}/{p1}</b>
          <span>priority-1 items on first flight</span>
        </div>
        <div><b>{placed}/{MANIFEST.length}</b><span>items placed</span></div>
        <div><b>{util}%</b><span>capacity used overall</span></div>
      </div>

      <div className="holds">
        {HOLDS.map((h) => {
          const pct = Math.round((plan.used[h.key] / h.cap) * 100);
          const items = plan.load[h.key];
          return (
            <div className="hold" key={h.key}>
              <div className="hd">
                <h3 style={{ fontSize: 16 }}>{h.name}</h3>
                <span className="mono muted" style={{ fontSize: 12 }}>{inr(plan.used[h.key])} / {inr(h.cap)} kg</span>
              </div>
              <div className="mono muted" style={{ fontSize: 11.5 }}>{h.accepts.join(' · ')} · {h.note}</div>
              <div className="meter"><i className={pct > 85 ? 'hi' : ''} style={{ width: `${pct}%` }} /></div>
              <div className="chips">
                {items.length
                  ? items.map((i) => (
                      <span key={i.name} className={`chip${i.priority === 1 ? ' p1' : ''}`}>{i.name} · {i.kg}</span>
                    ))
                  : <span className="muted" style={{ fontSize: 12 }}>Empty</span>}
              </div>
            </div>
          );
        })}
      </div>

      {plan.unplaced.length > 0 && (
        <div className="card" style={{ marginTop: 12, borderColor: 'var(--crit)' }}>
          <b style={{ color: 'var(--crit)' }}>Not loaded ({plan.unplaced.length}):</b>{' '}
          {plan.unplaced.map((i) => i.name).join(', ')}. Waits for the next voyage.
        </div>
      )}
      <p className="sample-note">Chips marked orange are priority 1. Weights in kg, sample manifest.</p>
    </>
  );
}
