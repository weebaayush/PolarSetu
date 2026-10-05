import { useState } from 'react';
import { useAppState, useDispatch } from '../state/store';
import { daysOfCover, requisitionQty, SEASON_DAYS, stockStatus } from '../lib/forecast';
import { inr } from '../lib/format';
import ForecastChart from './ForecastChart';

const STATUS_LABEL = { ok: 'Healthy', warn: 'Reorder', crit: 'Below minimum' } as const;

export default function Inventory() {
  const { inventory } = useAppState();
  const dispatch = useDispatch();
  const [showReq, setShowReq] = useState(false);
  const diesel = inventory.find((i) => i.key === 'diesel')!;

  function toggleReq() {
    if (!showReq) dispatch({ type: 'requisition' });
    setShowReq(!showReq);
  }

  return (
    <>
      <div className="tp-head">
        <div>
          <h3>Maitri station stock</h3>
          <p>
            Live counts from scans and IoT fuel-level sensors. The forecast (Prophet / XGBoost in production) projects
            consumption and writes next season's requisition: 365 days of forecast use plus 15% safety stock, minus
            what's on hand.
          </p>
        </div>
        <button className="btn" onClick={toggleReq}>
          {showReq ? 'Hide requisition' : 'Generate next-season requisition'}
        </button>
      </div>

      <div className="cols">
        <div>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr><th>Item</th><th className="num">Stock</th><th className="num">Use/day</th><th className="num">Days cover</th><th>Status</th></tr>
              </thead>
              <tbody>
                {inventory.map((i) => {
                  const s = stockStatus(i);
                  return (
                    <tr key={i.key}>
                      <td>{i.name}</td>
                      <td className="num">{inr(i.stock)} <span className="muted">{i.unit}</span></td>
                      <td className="num">{i.rate}</td>
                      <td className="num">{daysOfCover(i)}</td>
                      <td><span className={`pill ${s}`}><span className="dot" />{STATUS_LABEL[s]}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {showReq && (
            <div className="card" style={{ marginTop: 14 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <h3>Requisition · 47th ISEA (draft)</h3>
                <span className="pill ice">auto-generated</span>
              </div>
              <div className="tbl-wrap" style={{ marginTop: 10 }}>
                <table>
                  <thead><tr><th>Item</th><th className="num">Forecast use / yr</th><th className="num">Order</th></tr></thead>
                  <tbody>
                    {inventory.map((i) => (
                      <tr key={i.key}>
                        <td>{i.name}</td>
                        <td className="num">{(i.rate * SEASON_DAYS).toFixed(0)}</td>
                        <td className="num">{inr(requisitionQty(i))} <span className="muted">{i.unit}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="card chart">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <h3>Diesel use, kL / week</h3>
            <span className="pill">Maitri</span>
          </div>
          <div style={{ marginTop: 10 }}><ForecastChart /></div>
          <div className="legend">
            <span><i style={{ background: 'var(--ink)' }} />Actual</span>
            <span><i style={{ background: 'var(--accent)' }} />Forecast</span>
            <span><i style={{ background: 'var(--accent)', opacity: 0.25, height: 8 }} />Uncertainty</span>
          </div>
          <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>
            Winter heating pushes use up from week 32. Current stock covers{' '}
            <b className="mono" style={{ color: 'var(--ink)' }}>{daysOfCover(diesel)} days</b>.
          </p>
        </div>
      </div>
    </>
  );
}
