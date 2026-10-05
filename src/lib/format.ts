/** Satellite link speed used in the demo (Iridium-class modem), bits per second. */
export const LINK_BPS = 2400;
/** Size of a full station database snapshot. */
export const FULL_DB_BYTES = 46.8 * 1048576;
/** Typical gzip ratio for JSON change records. */
export const COMPRESSION = 0.38;

export const fmtBytes = (b: number): string =>
  b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

export const fmtDuration = (s: number): string =>
  s < 60 ? `${s.toFixed(1)} s` : s < 3600 ? `${(s / 60).toFixed(1)} min` : `${(s / 3600).toFixed(0)} h`;

export const transferSeconds = (bytes: number): number => (bytes * 8) / LINK_BPS;

export const clock = (): string => new Date().toTimeString().slice(0, 5);

export const stamp = (): string =>
  `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} ${clock()}`;

export const inr = (n: number): string => n.toLocaleString('en-IN');
