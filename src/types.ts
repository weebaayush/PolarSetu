export type Route = 'sea' | 'air';
export type TempClass = 'ambient' | 'chilled' | 'frozen' | 'fuel';
export type ModuleName = 'Inventory' | 'Cargo' | 'Personnel' | 'Waste' | 'Emergency';

export interface Crate {
  id: string;
  name: string;
  kg: number;
  temp: string;
  route: Route;
  /** 0 = HQ, 1 = port, 2 = vessel / flight, 3 = delivered at station */
  stage: number;
  log: string[];
}

export interface InventoryItem {
  key: string;
  name: string;
  unit: string;
  stock: number;
  /** consumption per day */
  rate: number;
  /** minimum safe stock */
  min: number;
}

export type PersonStatus = 'In station' | 'In field' | 'In transit';

export interface Person {
  name: string;
  role: string;
  location: string;
  status: PersonStatus;
  medical: 'Cleared' | 'Review due';
  due?: string;
}

export interface WasteLine {
  category: string;
  generated: number;
  returned: number;
}

export interface Change {
  module: ModuleName;
  desc: string;
  bytes: number;
  time: string;
}

export interface CargoItem {
  name: string;
  kg: number;
  priority: 1 | 2 | 3;
  temp: TempClass;
}

export interface Hold {
  key: string;
  name: string;
  cap: number;
  accepts: TempClass[];
  note: string;
}

export interface Toast {
  msg: string;
  id: number;
}

export interface AppState {
  online: boolean;
  outbox: Change[];
  /** compressed bytes of the last sync, for the savings panel */
  lastComp: number;
  crates: Crate[];
  inventory: InventoryItem[];
  people: Person[];
  waste: WasteLine[];
  toast: Toast | null;
}
