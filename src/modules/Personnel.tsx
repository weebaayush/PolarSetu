import { useAppState, useDispatch } from '../state/store';
import type { Person } from '../types';

const small = { padding: '5px 12px', fontSize: 12.5 } as const;

function StatusPill({ p }: { p: Person }) {
  if (p.status === 'In field') return <span className="pill warn"><span className="dot" />In field · due {p.due}</span>;
  if (p.status === 'In transit') return <span className="pill ice">In transit</span>;
  return <span className="pill ok"><span className="dot" />In station</span>;
}

export default function Personnel() {
  const { people } = useAppState();
  const dispatch = useDispatch();

  const byLocation = people.reduce<Record<string, number>>((acc, p) => {
    const k = p.location.split(' ·')[0];
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <div className="tp-head">
        <div>
          <h3>Who is where, right now</h3>
          <p>
            Station, field camp, ship or flight. Field parties check out with a return time; if they're late, the
            station leader is alerted automatically.
          </p>
        </div>
        <span className="pill ok"><span className="dot" />{people.length}/{people.length} accounted for</span>
      </div>

      <div className="row" style={{ marginBottom: 14 }}>
        {Object.entries(byLocation).map(([k, v]) => <span key={k} className="pill">{k} · {v}</span>)}
      </div>

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Role</th><th>Location</th><th>Status</th><th>Medical</th><th /></tr>
          </thead>
          <tbody>
            {people.map((p, i) => (
              <tr key={p.name}>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td className="muted">{p.role}</td>
                <td>{p.location}</td>
                <td><StatusPill p={p} /></td>
                <td>
                  {p.medical === 'Cleared'
                    ? <span className="pill ok">Cleared</span>
                    : <span className="pill crit">Review due</span>}
                </td>
                <td>
                  {p.status === 'In field' && (
                    <button className="btn ghost" style={small} onClick={() => dispatch({ type: 'checkIn', index: i })}>Check in</button>
                  )}
                  {p.status === 'In station' && (
                    <button className="btn ghost" style={small} onClick={() => dispatch({ type: 'checkOut', index: i })}>Check out</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="sample-note">Names are fictional sample data.</p>
    </>
  );
}
