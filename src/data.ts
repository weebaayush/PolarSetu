import type { CargoItem, Change, Crate, Hold, InventoryItem, Person, Route, WasteLine } from './types';

/** All records below are sample data for the demo. */

const SEED_DATES = ['22 Sep 09:10', '04 Oct 14:25', '09 Oct 06:40', '21 Oct 11:05'];

const crate = (id: string, name: string, kg: number, temp: string, route: Route, stage: number): Crate => ({
  id, name, kg, temp, route, stage, log: SEED_DATES.slice(0, stage + 1),
});

export const INITIAL_CRATES: Crate[] = [
  crate('ISEA46-MTR-0142', 'Medical consumables', 85, 'Chilled +4°C', 'air', 2),
  crate('ISEA46-BHR-0217', 'Diesel (SAB) drums ×20', 3800, 'Fuel / hazmat', 'sea', 1),
  crate('ISEA46-MTR-0088', 'Frozen rations, 60 person-days', 1200, 'Frozen −18°C', 'sea', 3),
  crate('ISEA46-BHR-0301', 'Seismometer spares', 140, 'Ambient', 'sea', 2),
  crate('ISEA46-MTR-0390', 'Generator overhaul kit', 640, 'Ambient', 'sea', 0),
  crate('ISEA46-MTR-0412', 'Ice-core sample boxes (empty)', 220, 'Frozen −18°C', 'air', 1),
];

export const STAGES: Record<Route, string[]> = {
  sea: ['NCPOR HQ, Goa', 'Cape Town port', 'Ice-class vessel', 'Station'],
  air: ['NCPOR HQ, Goa', 'Cape Town', 'DROMLAN flight', 'Station'],
};

export const stationOf = (c: Crate): 'Bharati' | 'Maitri' => (c.id.includes('BHR') ? 'Bharati' : 'Maitri');

export const stageLabel = (c: Crate, stage: number): string =>
  stage >= 3 ? `${stationOf(c)} station` : STAGES[c.route][stage];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { key: 'diesel', name: 'Diesel (SAB)', unit: 'kL', stock: 212, rate: 0.42, min: 60 },
  { key: 'food', name: 'Rations', unit: 'person-days', stock: 9800, rate: 26, min: 3000 },
  { key: 'med', name: 'Medical consumables', unit: 'units', stock: 410, rate: 1.9, min: 150 },
  { key: 'gas', name: 'Propane', unit: 'cylinders', stock: 46, rate: 0.21, min: 20 },
  { key: 'gen', name: 'Generator filters', unit: 'sets', stock: 9, rate: 0.06, min: 6 },
  { key: 'lub', name: 'Lubricant oil', unit: 'L', stock: 620, rate: 2.4, min: 250 },
];

export const INITIAL_PEOPLE: Person[] = [
  { name: 'Dr. R. Menon', role: 'Station leader', location: 'Maitri', status: 'In station', medical: 'Cleared' },
  { name: 'A. Kulkarni', role: 'Medical officer', location: 'Maitri', status: 'In station', medical: 'Cleared' },
  { name: 'S. Bhattacharya', role: 'Glaciologist', location: 'Field camp · Schirmacher', status: 'In field', medical: 'Cleared', due: '17:30' },
  { name: 'P. Nair', role: 'Geologist', location: 'Field camp · Schirmacher', status: 'In field', medical: 'Cleared', due: '17:30' },
  { name: 'Lt. K. Singh', role: 'Logistics (Navy)', location: 'Ice-class vessel', status: 'In transit', medical: 'Cleared' },
  { name: 'M. Iyer', role: 'Communications', location: 'Bharati', status: 'In station', medical: 'Review due' },
  { name: 'T. Dorje', role: 'Mechanic', location: 'Bharati', status: 'In station', medical: 'Cleared' },
  { name: 'N. Rao', role: 'Atmospheric scientist', location: 'DROMLAN flight', status: 'In transit', medical: 'Cleared' },
];

export const INITIAL_WASTE: WasteLine[] = [
  { category: 'Plastics & packaging', generated: 4200, returned: 2650 },
  { category: 'Batteries', generated: 610, returned: 610 },
  { category: 'Empty fuel drums', generated: 7400, returned: 3100 },
  { category: 'Scrap metal', generated: 2300, returned: 900 },
  { category: 'Sewage sludge (treated)', generated: 3100, returned: 1400 },
  { category: 'Lab chemicals', generated: 180, returned: 180 },
];

export const INITIAL_OUTBOX: Change[] = [
  { module: 'Inventory', desc: 'Cold-store temp log, 24 readings', bytes: 302, time: '06:12' },
  { module: 'Cargo', desc: 'ISEA46-MTR-0088 scanned at Maitri', bytes: 248, time: '07:40' },
];

/** Manifest in the order it arrives at the port (matters for the manual plan). */
export const MANIFEST: CargoItem[] = [
  { name: 'Generator kit', kg: 640, priority: 2, temp: 'ambient' },
  { name: 'Lab glassware', kg: 180, priority: 3, temp: 'ambient' },
  { name: 'Spare tyres', kg: 300, priority: 3, temp: 'ambient' },
  { name: 'Insulin + vaccines', kg: 60, priority: 1, temp: 'chilled' },
  { name: 'Surgical kit', kg: 140, priority: 1, temp: 'ambient' },
  { name: 'Satcom spares', kg: 90, priority: 1, temp: 'ambient' },
  { name: 'Fresh produce', kg: 900, priority: 1, temp: 'chilled' },
  { name: 'Frozen meat', kg: 2600, priority: 2, temp: 'frozen' },
  { name: 'Diesel SAB drums', kg: 14000, priority: 2, temp: 'fuel' },
  { name: 'Dry rations', kg: 5200, priority: 2, temp: 'ambient' },
  { name: 'Ice-core boxes', kg: 220, priority: 3, temp: 'frozen' },
  { name: 'Construction steel', kg: 4800, priority: 3, temp: 'ambient' },
  { name: 'Propane cylinders', kg: 2100, priority: 2, temp: 'fuel' },
];

export const HOLDS: Hold[] = [
  { key: 'air', name: 'DROMLAN flight', cap: 1200, accepts: ['ambient', 'chilled'], note: 'arrives day 3' },
  { key: 'reef', name: 'Reefer container', cap: 4000, accepts: ['chilled', 'frozen'], note: '−18 / +4 °C zones' },
  { key: 'hold', name: 'Ship hold A', cap: 12000, accepts: ['ambient'], note: 'arrives day 24' },
  { key: 'fuel', name: 'Hazmat / fuel deck', cap: 18000, accepts: ['fuel'], note: 'segregated' },
];

export const SOS_PLAYBOOK: [string, string][] = [
  ['SOS received', 'S. Bhattacharya · beacon B-07 · 70°45.2′S 11°41.8′E · via Iridium SBD (works with main link down)'],
  ['Alert station', 'Station leader Dr. R. Menon and medical officer A. Kulkarni paged'],
  ['Nearest help', 'Novolazarevskaya (Russia) ~5 km · Maitri rescue team · Hägglunds vehicle ready'],
  ['Weather check', 'Wind 38 km/h, visibility 2 km · ground rescue GO, helicopter HOLD'],
  ['Evacuation options', 'DROMLAN medevac from Novo runway → Cape Town · ETA 9 h'],
  ['HQ notified', 'NCPOR Goa operations desk + COMNAP SAR contacts informed'],
];
