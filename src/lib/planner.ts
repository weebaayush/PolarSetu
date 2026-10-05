import type { CargoItem, Hold } from '../types';

export type PlanMode = 'manual' | 'ai';

export interface PlanResult {
  load: Record<string, CargoItem[]>;
  used: Record<string, number>;
  unplaced: CargoItem[];
}

/**
 * Packs cargo into holds.
 * - manual: items in manifest order, first compatible hold with room.
 * - ai: priority first (heaviest first within a priority), priority-1 items prefer
 *   the first flight, everything else avoids it. Production swaps this for OR-Tools.
 */
export function planLoad(items: CargoItem[], holds: Hold[], mode: PlanMode): PlanResult {
  const load: Record<string, CargoItem[]> = {};
  const used: Record<string, number> = {};
  holds.forEach((h) => {
    load[h.key] = [];
    used[h.key] = 0;
  });
  const unplaced: CargoItem[] = [];

  const list = mode === 'ai' ? [...items].sort((a, b) => a.priority - b.priority || b.kg - a.kg) : items;

  for (const item of list) {
    let order = holds.filter((h) => h.accepts.includes(item.temp));
    if (mode === 'ai') {
      const airRank = (h: Hold) => (h.key === 'air' ? (item.priority === 1 ? -1 : 1) : 0);
      order = [...order].sort((a, b) => airRank(a) - airRank(b));
    }
    const hold = order.find((h) => used[h.key] + item.kg <= h.cap);
    if (hold) {
      load[hold.key].push(item);
      used[hold.key] += item.kg;
    } else {
      unplaced.push(item);
    }
  }
  return { load, used, unplaced };
}
