# PolarSetu: Port to Pole, one platform

Interactive MVP for **Smart India Hackathon 2026, PS 26062**: *Integrated Polar Expedition Logistics and Asset Management System* (MoES / NCPOR, Software, Smart Automation).

Built with **React 18 + TypeScript + Vite**. No backend is needed: all data is sample data held in a React reducer.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the build
```

Deploy `dist/` to Vercel, Netlify or GitHub Pages (Vercel/Netlify detect Vite automatically).

## What the demo shows

| Section | What to click |
|---|---|
| **Offline-first edge sync (USP)** | Log station work while the satellite link is down, then flip the switch. Only changed records are sent, compressed, with conflict resolution. |
| **Cargo & assets** | QR/RFID chain of custody: HQ Goa → Cape Town → vessel / DROMLAN flight → station. |
| **Load planner** | Toggle *Manual* vs *PolarSetu AI* to compare priority-1 items on the first flight. |
| **Inventory & forecast** | Days of cover, diesel forecast chart, auto-generated next-season requisition. |
| **Personnel** | Who is where, field-party check-in/out, medical clearance. |
| **Emergency SOS** | One-tap drill that runs the automated response playbook. |
| **Waste return** | Retrograde waste tracking (Madrid Protocol Annex III, Indian Antarctic Act 2022). |

Every action goes through one shared store, so a crate scan, fuel draw or SOS appears in the station's sync queue.

## Project structure

```
src/
  main.tsx, App.tsx, styles.css
  types.ts                 domain types
  data.ts                  sample data (crates, stock, people, manifest, holds, SOS playbook)
  state/store.tsx          reducer + context (shared app state, offline outbox)
  lib/format.ts            bytes/time formatting, link constants
  lib/planner.ts           cargo load-planning heuristic (manual vs AI)
  lib/forecast.ts          consumption series, days of cover, requisition maths
  lib/hooks.ts             media-query, reduced-motion, auto-cleared timers
  components/              Header, Hero, Corridor, SyncSimulator, ModuleConsole, Architecture, QrTag, Toast, Footer
  modules/                 CargoTracker, LoadPlanner, Inventory (+ ForecastChart), Personnel, Emergency, WasteReturn
```

## Notes

- All names, crates and figures are **sample data**. The planner is a priority-first heuristic standing in for Google OR-Tools.
- Change sample data in `src/data.ts`; colours and fonts are tokens at the top of `src/styles.css`.
