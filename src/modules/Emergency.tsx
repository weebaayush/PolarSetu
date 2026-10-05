import { useState } from 'react';
import { useDispatch } from '../state/store';
import { SOS_PLAYBOOK } from '../data';
import { useReducedMotion, useTimers } from '../lib/hooks';

export default function Emergency() {
  const dispatch = useDispatch();
  const reduced = useReducedMotion();
  const timers = useTimers();
  const [stepsOn, setStepsOn] = useState(0);
  const [running, setRunning] = useState(false);

  function run() {
    if (running) return;
    setRunning(true);
    setStepsOn(0);
    SOS_PLAYBOOK.forEach((_, i) =>
      timers.later(() => {
        setStepsOn(i + 1);
        if (i === SOS_PLAYBOOK.length - 1) {
          setRunning(false);
          dispatch({ type: 'sosComplete' });
        }
      }, reduced ? 0 : i * 700),
    );
  }

  function reset() {
    timers.clear();
    setRunning(false);
    setStepsOn(0);
  }

  return (
    <>
      <div className="tp-head">
        <div>
          <h3>One tap. Everyone who matters knows.</h3>
          <p>
            The SOS travels over Iridium short-burst data, separate from the station's main link, and starts an
            automated response playbook.
          </p>
        </div>
        <button className="btn ghost" onClick={reset}>Reset drill</button>
      </div>

      <div className="sos-wrap">
        <div>
          <button className={`sos-btn${running ? ' live' : ''}`} onClick={run} aria-label="Raise SOS drill">
            <span>SOS<small>Tap to run drill</small></span>
          </button>
        </div>
        <ol className="steps">
          {SOS_PLAYBOOK.map(([title, detail], i) => (
            <li key={title} className={i < stepsOn ? 'on' : ''}>
              <span className="k">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{title}</div>
                <div className="muted" style={{ fontSize: 13.5 }}>{detail}</div>
              </div>
              <span className="t">{i < stepsOn ? `+${i * 7 + 2} s` : ''}</span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
