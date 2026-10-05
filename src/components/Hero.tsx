import { useAppState } from '../state/store';
import { daysOfCover } from '../lib/forecast';
import Corridor from './Corridor';

export default function Hero() {
  const { crates, people, inventory, online, outbox } = useAppState();
  const inTransit = crates.filter((c) => c.stage < 3).length;
  const diesel = inventory.find((i) => i.key === 'diesel')!;

  const kpis: [string, string][] = [
    [`${crates.length} crates`, `tracked with chain of custody, ${inTransit} in transit`],
    [`${people.length}/${people.length}`, 'people accounted for right now'],
    [`${daysOfCover(diesel)} days`, 'of diesel cover at Maitri'],
    [online ? 'Online' : 'Offline', `station status · ${outbox.length} changes queued`],
  ];

  return (
    <section className="hero wrap">
      <div className="hero-grid">
        <div>
          <div className="eyebrow">SIH 2026 · PS 26062 · MoES / NCPOR · Smart Automation</div>
          <h1 style={{ marginTop: 14 }}>
            Port<br />to <em>Pole.</em><br />One platform.
          </h1>
          <p className="lede">
            PolarSetu tracks <b>every crate, every litre and every person</b> in the Indian Antarctic Programme,
            from NCPOR Goa to Maitri and Bharati. Each station runs its own edge server, so{' '}
            <b>everything keeps working with zero internet</b> and syncs only what changed when the satellite
            link returns.
          </p>
          <div className="cta">
            <a className="btn accent" href="#sync">Try the offline sync</a>
            <a className="btn ghost" href="#console">Open the live demo</a>
          </div>
          <div className="ps-meta">
            <span className="pill ice">Maitri · 70°46′S 11°44′E</span>
            <span className="pill ice">Bharati · 69°24′S 76°11′E</span>
            <span className="pill ice">Himadri · 78°55′N</span>
          </div>
        </div>
        <Corridor inTransit={inTransit} />
      </div>
      <div className="kpis">
        {kpis.map(([v, l]) => (
          <div className="kpi" key={l}>
            <div className="v">{v}</div>
            <div className="l">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
