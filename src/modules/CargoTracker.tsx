import { useState } from 'react';
import { useAppState, useDispatch } from '../state/store';
import { STAGES, stageLabel, stationOf } from '../data';
import { inr } from '../lib/format';
import QrTag from '../components/QrTag';
import type { Crate } from '../types';

function StatusPill({ c }: { c: Crate }) {
  return c.stage === 3
    ? <span className="pill ok">Delivered</span>
    : <span className="pill ice">{STAGES[c.route][c.stage]}</span>;
}

export default function CargoTracker() {
  const { crates } = useAppState();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(crates[0].id);
  const c = crates.find((x) => x.id === selected)!;
  const delivered = c.stage >= 3;
  const nextStop = c.stage === 2 ? stationOf(c) : STAGES[c.route][c.stage + 1];

  return (
    <>
      <div className="tp-head">
        <div>
          <h3>Every crate, every handoff</h3>
          <p>
            Each crate carries a QR / RFID tag. A scan at every handoff builds the chain of custody, even when the
            scanner is offline. Select a crate to see its trail.
          </p>
        </div>
      </div>
      <div className="cols">
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr><th>Tag</th><th>Contents</th><th className="num">kg</th><th>Now at</th></tr>
            </thead>
            <tbody>
              {crates.map((x) => (
                <tr
                  key={x.id}
                  className={`clickable${x.id === selected ? ' sel' : ''}`}
                  tabIndex={0}
                  onClick={() => setSelected(x.id)}
                  onKeyDown={(e) => e.key === 'Enter' && setSelected(x.id)}
                >
                  <td className="mono" style={{ fontSize: 12 }}>{x.id}</td>
                  <td>{x.name}</td>
                  <td className="num">{inr(x.kg)}</td>
                  <td><StatusPill c={x} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="qr-row">
            <QrTag value={c.id} />
            <div style={{ minWidth: 0 }}>
              <div className="mono" style={{ fontSize: 12.5 }}>{c.id}</div>
              <div style={{ fontWeight: 600, marginTop: 2 }}>{c.name}</div>
              <div className="row" style={{ marginTop: 6 }}>
                <span className="pill">{c.temp}</span>
                <span className="pill">{c.route === 'air' ? 'Air · DROMLAN' : 'Sea · vessel'}</span>
              </div>
            </div>
          </div>

          <ol className="custody">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className={i < c.stage ? 'done' : i === c.stage ? 'now' : ''}>
                <span className="node">{i <= c.stage ? '✓' : ''}</span>
                <div>
                  <div style={{ fontWeight: i === c.stage ? 600 : 400 }}>{stageLabel(c, i)}</div>
                  <div className="when">{c.log[i] ? `Scanned ${c.log[i]}` : 'Awaiting scan'}</div>
                </div>
              </li>
            ))}
          </ol>

          <button className="btn accent" disabled={delivered} onClick={() => dispatch({ type: 'scanCrate', id: c.id })}>
            {delivered ? 'Delivered' : `Scan at ${nextStop}`}
          </button>
        </div>
      </div>
    </>
  );
}
