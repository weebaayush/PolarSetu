import type { InventoryItem } from '../types';

const seasonal = (week: number) => Math.sin(((week + 4) / 52) * 2 * Math.PI) * 0.55;

/** Weekly diesel use at Maitri (kL): 30 weeks of history + 16 weeks of forecast. Sample data. */
export function dieselSeries(): { history: number[]; forecast: number[] } {
  const history: number[] = [];
  const forecast: number[] = [];
  for (let w = 0; w < 30; w++) {
    history.push(+(2.95 + seasonal(w) + Math.sin(w * 1.7) * 0.18 + Math.cos(w * 0.9) * 0.12).toFixed(2));
  }
  for (let w = 30; w < 46; w++) forecast.push(+(2.95 + seasonal(w)).toFixed(2));
  return { history, forecast };
}

export const SEASON_DAYS = 365;
export const SAFETY = 1.15;

export const daysOfCover = (i: InventoryItem): number => Math.round(i.stock / i.rate);

/** Next-season order: forecast use + 15% safety stock − stock on hand. */
export const requisitionQty = (i: InventoryItem): number =>
  Math.max(0, Math.ceil(i.rate * SEASON_DAYS * SAFETY - i.stock));

export type StockStatus = 'ok' | 'warn' | 'crit';
export const stockStatus = (i: InventoryItem): StockStatus =>
  i.stock < i.min ? 'crit' : daysOfCover(i) < 200 ? 'warn' : 'ok';
