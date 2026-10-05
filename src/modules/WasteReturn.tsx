import { useAppState, useDispatch } from '../state/store';
import { inr } from '../lib/format';

export default function WasteReturn() {
  const { waste } = useAppState();
  const dispatch = useDispatch();
  const generated = waste.reduce((a, w) => a + w.generated, 0);
  const returned = waste.reduce((a, w) => a + w.returned, 0);

  return (
    <>
      <div className="tp-head">
        <div>
          <h3>Waste goes back out</h3>
          <p>
            Annex III of the Madrid Protocol and India's Antarctic Act, 2022 require most waste to be removed from
            Antarctica. Every waste drum is tagged like cargo and tracked on the retrograde voyage back to India.
          </p>
        </div>
        <button className="btn accent" onClick={() => dispatch({ type: 'tagWaste' })}>Tag waste drum (180 kg)</button>
      </div>

      <div className="score">
        <div><b>{(generated / 1000).toFixed(1)} t</b><span>generated this season</span></div>
        <div><b>{(returned / 1000).toFixed(1)} t</b><span>packed for return</span></div>
        <div><b style={{ color: 'var(--accent)' }}>{Math.round((returned / generated) * 100)}%</b><span>retrograde progress</span></div>
      </div>

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr><th>Category</th><th className="num">Generated kg</th><th className="num">Packed kg</th><th style={{ width: '38%' }}>Progress</th></tr>
          </thead>
          <tbody>
            {waste.map((w) => {
              const pct = Math.round((w.returned / w.generated) * 100);
              return (
                <tr key={w.category}>
                  <td>{w.category}</td>
                  <td className="num">{inr(w.generated)}</td>
                  <td className="num">{inr(w.returned)}</td>
                  <td>
                    <div className="row" style={{ flexWrap: 'nowrap' }}>
                      <div className="hold" style={{ padding: 0, border: 0, flex: 1 }}>
                        <div className="meter" style={{ margin: 0 }}>
                          <i className={pct >= 100 ? '' : 'hi'} style={{ width: `${Math.min(100, pct)}%` }} />
                        </div>
                      </div>
                      <span className="mono" style={{ fontSize: 12, width: 38, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
