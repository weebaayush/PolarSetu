import { dieselSeries } from '../lib/forecast';

const W = 640, H = 220, L = 36, R = 10, T = 12, B = 28;
const MIN = 2, MAX = 4;

export default function ForecastChart() {
  const { history, forecast } = dieselSeries();
  const n = history.length + forecast.length;
  const x = (i: number) => L + (i / (n - 1)) * (W - L - R);
  const y = (v: number) => T + (1 - (v - MIN) / (MAX - MIN)) * (H - T - B);
  const today = history.length - 1;

  const band = [
    ...forecast.map((v, i) => `${x(history.length + i)},${y(v + 0.12 + i * 0.012)}`),
    ...forecast.map((v, i) => `${x(history.length + i)},${y(v - 0.12 - i * 0.012)}`).reverse(),
  ].join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Weekly diesel consumption at Maitri, 30 weeks of history and 16 weeks forecast">
      {[2, 2.5, 3, 3.5, 4].map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--line)" />
          <text x={L - 6} y={y(v) + 3} textAnchor="end">{v.toFixed(1)}</text>
        </g>
      ))}
      {[0, 10, 20, 30, 40].map((i) => (
        <text key={i} x={x(i)} y={H - 8} textAnchor="middle">wk {i + 1}</text>
      ))}
      <polygon points={band} fill="var(--accent)" opacity=".14" />
      <polyline points={history.map((v, i) => `${x(i)},${y(v)}`).join(' ')} fill="none" stroke="var(--ink)" strokeWidth="2" />
      <polyline
        points={[history[today], ...forecast].map((v, i) => `${x(today + i)},${y(v)}`).join(' ')}
        fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="5 4"
      />
      <line x1={x(today)} x2={x(today)} y1={T} y2={H - B} stroke="var(--muted)" strokeDasharray="2 3" />
      <text x={x(today) + 4} y={T + 10}>today</text>
      <circle cx={x(today)} cy={y(history[today])} r="4" fill="var(--ink)" />
    </svg>
  );
}
