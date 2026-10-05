import { useState } from 'react';
import { useAppState, useDispatch, type Action } from '../state/store';
import { COMPRESSION, FULL_DB_BYTES, fmtBytes, fmtDuration, transferSeconds } from '../lib/format';
import { useReducedMotion, useTimers } from '../lib/hooks';

type LogLine = { text: string; tone?: 'ok' | 'warn' | 'muted' };

const STATION_ACTIONS: { label: string; sub: string; action: Action }[] = [
  { label: 'Log diesel draw', sub: 'Inventory · −0.42 kL', action: { type: 'drawFuel' } },
  { label: 'Scan arriving crate', sub: 'Cargo · custody +1', action: { type: 'scanCrate' } },
  { label: 'Check out field party', sub: 'Personnel · 3 people', action: { type: 'checkOutParty' } },
  { label: 'Tag waste drum', sub: 'Waste return · +180 kg', action: { type: 'tagWaste' } },
];

const FULL_SYNC_TIME = fmtDuration(transferSeconds(FULL_DB_BYTES));

export default function SyncSimulator() {
  const { online, outbox, lastComp } = useAppState();
  const dispatch = useDispatch();
  const reduced = useReducedMotion();
  const timers = useTimers();
  const [log, setLog] = useState<LogLine[]>([{ text: 'Waiting for link…', tone: 'muted' }]);

  const raw = outbox.reduce((a, r) => a + r.bytes, 0);
  const comp = Math.round(raw * COMPRESSION) || lastComp;
  const savePct = comp ? `${Math.min(99.9999, 100 - (comp / FULL_DB_BYTES) * 100).toFixed(4)}%` : '—';
  const syncTime = comp ? fmtDuration(transferSeconds(comp)) : '—';

  function toggleLink() {
    const on = !online;
    timers.clear();
    dispatch({ type: 'setOnline', on });

    if (!on) {
      setLog([{ text: 'Link down. Changes queue locally on the edge node.', tone: 'muted' }]);
      return;
    }
    if (!outbox.length) {
      setLog([{ text: '✓ Link up · nothing pending. New changes sync instantly.', tone: 'ok' }]);
      return;
    }

    const sent = outbox.length;
    const sentRaw = raw;
    const sentComp = Math.round(sentRaw * COMPRESSION);
    const lines: LogLine[] = [
      { text: '› Handshake with HQ · last checkpoint seq #48211' },
      { text: `› Diff: ${sent} changed records (${fmtBytes(sentRaw)}) → gzip ${fmtBytes(sentComp)}` },
      outbox.some((r) => r.module === 'Inventory')
        ? { text: "› Conflict: diesel stock edited at HQ and station. Station's physical count wins; HQ's reorder note kept.", tone: 'warn' }
        : { text: '› No conflicts' },
      { text: `✓ Synced in ${fmtDuration(transferSeconds(sentComp))} · full sync would take ~${FULL_SYNC_TIME}`, tone: 'ok' },
    ];
    setLog([]);
    lines.forEach((line, i) =>
      timers.later(() => {
        setLog((prev) => [...prev, line]);
        if (i === lines.length - 1) dispatch({ type: 'syncComplete', count: sent, comp: sentComp });
      }, reduced ? 0 : i * 650),
    );
  }

  return (
    <section className="block usp" id="sync">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <div className="eyebrow">The knockout feature</div>
            <h2 style={{ marginTop: 10 }}>Zero internet.<br /><em>Zero downtime.</em></h2>
          </div>
          <p>
            Below is Maitri's edge server. The satellite link starts <b>down</b>. Log real station work, then bring
            the link up and watch PolarSetu send only the changed records, compressed, instead of the whole database.
          </p>
        </div>

        <div className="sync-grid">
          <div className="panel-d">
            <div className="link-toggle">
              <button className="switch" role="switch" aria-checked={online} aria-label="Satellite link" onClick={toggleLink} />
              <div>
                <div style={{ fontWeight: 600 }}>{online ? 'Satellite link up' : 'Satellite link down'}</div>
                <div className="mono muted" style={{ fontSize: 12 }}>
                  {online ? 'Iridium window open · 2.4 kbps' : 'Edge node serving 34 users locally'}
                </div>
              </div>
            </div>

            <div className="eyebrow" style={{ marginTop: 20 }}>Do station work while offline</div>
            <div className="station-actions">
              {STATION_ACTIONS.map((a) => (
                <button key={a.label} onClick={() => dispatch(a.action)}>
                  {a.label}
                  <small>{a.sub}</small>
                </button>
              ))}
            </div>

            <div className="outbox" aria-live="polite">
              {outbox.length ? (
                <>
                  <div style={{ opacity: 0.6 }}>
                    <span>OUTBOX · {outbox.length} records queued locally</span>
                    <span>{fmtBytes(raw)}</span>
                  </div>
                  {[...outbox].reverse().map((r, i) => (
                    <div key={`${r.time}-${r.desc}-${i}`}>
                      <span>{r.time} · {r.module} · {r.desc}</span>
                      <span>{r.bytes} B</span>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ opacity: 0.6 }}><span>Outbox empty · all changes at HQ</span></div>
              )}
            </div>
          </div>

          <div className="panel-d">
            <div className="eyebrow">What goes over the satellite</div>
            <div className="row" style={{ justifyContent: 'space-between', margin: '12px 0 18px' }}>
              <div>
                <div className="big-stat">{savePct}</div>
                <div className="muted" style={{ fontSize: 13 }}>less data than a full sync</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="big-stat" style={{ color: 'inherit' }}>{syncTime}</div>
                <div className="muted" style={{ fontSize: 13 }}>to sync at 2.4 kbps</div>
              </div>
            </div>
            <div className="compare">
              <div className="cmp-row">
                <div className="top"><span>Full database sync</span><span className="mono">46.8 MB · ~{FULL_SYNC_TIME}</span></div>
                <div className="bar dim"><i style={{ width: '100%' }} /></div>
              </div>
              <div className="cmp-row">
                <div className="top">
                  <span>PolarSetu delta sync (changed rows, compressed)</span>
                  <span className="mono">{fmtBytes(comp)} · {fmtDuration(transferSeconds(comp))}</span>
                </div>
                <div className="bar">
                  <i style={{ width: comp ? `${Math.max(0.6, (comp / FULL_DB_BYTES) * 100)}%` : 0 }} />
                </div>
              </div>
            </div>
            <div className="sync-log">
              {log.map((l, i) => (
                <div key={i} className={l.tone}>{l.text}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
