import { useAppState } from '../state/store';
import Logo from './Logo';

export default function Header() {
  const { online, outbox } = useAppState();
  return (
    <header className="top">
      <div className="wrap">
        <div className="logo">
          <Logo />
          PolarSetu
        </div>
        <nav className="links" aria-label="Sections">
          <a href="#sync">Offline sync</a>
          <a href="#console">Live demo</a>
          <a href="#arch">Architecture</a>
        </nav>
        <div className="edge-status">
          {online ? (
            <span className="pill ok"><span className="dot" />Link up · in sync</span>
          ) : (
            <span className="pill warn"><span className="dot" />Offline · {outbox.length} queued</span>
          )}
        </div>
      </div>
    </header>
  );
}
