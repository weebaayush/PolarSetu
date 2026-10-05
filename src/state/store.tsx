import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import type { AppState, Change } from '../types';
import {
  INITIAL_CRATES, INITIAL_INVENTORY, INITIAL_OUTBOX, INITIAL_PEOPLE, INITIAL_WASTE, STAGES, stationOf,
} from '../data';
import { COMPRESSION, clock, fmtBytes, stamp } from '../lib/format';

export type Action =
  | { type: 'setOnline'; on: boolean }
  | { type: 'syncComplete'; count: number; comp: number }
  | { type: 'drawFuel' }
  | { type: 'scanCrate'; id?: string }
  | { type: 'checkIn'; index: number }
  | { type: 'checkOut'; index: number }
  | { type: 'checkOutParty' }
  | { type: 'tagWaste' }
  | { type: 'requisition' }
  | { type: 'sosComplete' }
  | { type: 'toast'; msg: string };

const initialState: AppState = {
  online: false,
  outbox: INITIAL_OUTBOX,
  lastComp: 0,
  crates: INITIAL_CRATES,
  inventory: INITIAL_INVENTORY,
  people: INITIAL_PEOPLE,
  waste: INITIAL_WASTE,
  toast: null,
};

const withToast = (s: AppState, msg: string): AppState => ({ ...s, toast: { msg, id: Date.now() + Math.random() } });

/**
 * Every station action goes through here. Offline, it's queued in the edge
 * node's outbox. Online, it syncs immediately.
 */
function record(s: AppState, c: Omit<Change, 'time'>, offlineToast?: string): AppState {
  if (s.online) {
    const comp = Math.round(c.bytes * COMPRESSION);
    return withToast({ ...s, lastComp: comp }, `Synced to HQ instantly · ${fmtBytes(comp)}`);
  }
  const next = { ...s, outbox: [...s.outbox, { ...c, time: clock() }] };
  return offlineToast ? withToast(next, offlineToast) : next;
}

function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case 'setOnline':
      return { ...s, online: a.on };

    case 'syncComplete':
      // Only drop the records that were sent; anything queued meanwhile stays.
      return { ...s, outbox: s.outbox.slice(a.count), lastComp: a.comp };

    case 'drawFuel': {
      const inventory = s.inventory.map((i) => (i.key === 'diesel' ? { ...i, stock: +(i.stock - 0.42).toFixed(2) } : i));
      return record({ ...s, inventory }, { module: 'Inventory', desc: 'Diesel draw −0.42 kL (gen. set 2)', bytes: 214 });
    }

    case 'scanCrate': {
      const target = a.id ? s.crates.find((c) => c.id === a.id) : s.crates.find((c) => c.stage < 3);
      if (!target || target.stage >= 3) return withToast(s, 'All crates delivered');
      const stage = target.stage + 1;
      const where = stage === 3 ? stationOf(target) : STAGES[target.route][stage];
      const crates = s.crates.map((c) => (c.id === target.id ? { ...c, stage, log: [...c.log, stamp()] } : c));
      return record(
        { ...s, crates },
        { module: 'Cargo', desc: `${target.id} scanned at ${where}`, bytes: 248 },
        `${target.id} scanned at ${where}`,
      );
    }

    case 'checkIn': {
      const p = s.people[a.index];
      const station = p.location.includes('Larsemann') ? 'Bharati' : 'Maitri';
      const people = s.people.map((x, i) =>
        i === a.index ? { ...x, location: station, status: 'In station' as const, due: undefined } : x,
      );
      return record({ ...s, people }, { module: 'Personnel', desc: `${p.name} checked in at ${station}`, bytes: 180 }, `${p.name} checked in`);
    }

    case 'checkOut': {
      const p = s.people[a.index];
      const camp = p.location === 'Bharati' ? 'Larsemann Hills' : 'Schirmacher';
      const people = s.people.map((x, i) =>
        i === a.index ? { ...x, location: `Field camp · ${camp}`, status: 'In field' as const, due: '18:00' } : x,
      );
      return record({ ...s, people }, { module: 'Personnel', desc: `${p.name} checked out to field`, bytes: 180 }, `${p.name} checked out, due 18:00`);
    }

    case 'checkOutParty':
      return record(s, { module: 'Personnel', desc: 'Field party "Lake survey" checked out · 3 pax', bytes: 356 }, 'Field party checked out, due back 18:00');

    case 'tagWaste': {
      const waste = s.waste.map((w) => (w.category === 'Empty fuel drums' ? { ...w, returned: w.returned + 180 } : w));
      const tag = `ISEA46-WST-${100 + s.outbox.length}`;
      return record({ ...s, waste }, { module: 'Waste', desc: `Drum tagged ${tag} · 180 kg`, bytes: 188 }, `Waste drum ${tag} tagged`);
    }

    case 'requisition':
      return record(s, { module: 'Inventory', desc: 'Requisition draft generated (6 lines)', bytes: 412 });

    case 'sosComplete':
      return record(s, { module: 'Emergency', desc: 'SOS drill B-07 · playbook complete', bytes: 296 });

    case 'toast':
      return withToast(s, a.msg);
  }
}

const StateCtx = createContext<AppState | null>(null);
const DispatchCtx = createContext<Dispatch<Action> | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  );
}

export function useAppState(): AppState {
  const s = useContext(StateCtx);
  if (!s) throw new Error('useAppState must be used inside <StoreProvider>');
  return s;
}

export function useDispatch(): Dispatch<Action> {
  const d = useContext(DispatchCtx);
  if (!d) throw new Error('useDispatch must be used inside <StoreProvider>');
  return d;
}
