# Voyage — Hotel Booking System

A three-step hotel booking wizard built for the Frontend Technical Assessment: choose a
destination and board type, configure hotel + meals for every day of the stay, then review a
priced, printable summary.

**Live demo:** _add your deployed URL here after publishing (see "Deploying" below)_

---

## Tech stack & why

| Concern | Choice | Why |
|---|---|---|
| Framework | React 19 + TypeScript | Type safety around the board-type/meal business rules catches mistakes at compile time, and matches the assessment's preferred stack. |
| State management | Redux Toolkit (`createSlice`, `createSelector`) | The booking config, the per-day selections, and the current wizard step are all shared across sibling components (Stepper, three step screens, save/load panel) — a single source of truth avoids prop-drilling. `createSelector` memoizes the price breakdown so re-renders stay cheap. |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) | Fast iteration, and the v4 `@theme` block lets the custom "travel document" palette/fonts live as real design tokens (`bg-coral`, `text-ink-soft`, etc.) instead of one-off hex codes. |
| Dates | `date-fns` | Small, tree-shakeable, and avoids hand-rolled date arithmetic bugs (month rollovers, etc.) when generating the day-by-day itinerary. |
| Testing | Vitest + React Testing Library | Same Vite pipeline as the app (no separate config), Jest-compatible API, fast. |
| Build tool | Vite | Already scaffolded; kept as-is. |

## Getting started

\`\`\`bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # type-check + production build to dist/
npm run preview   # preview the production build
npm run test      # run the unit/integration test suite once
npm run test:watch  # watch mode
npm run lint      # ESLint
\`\`\`

Node 20+ is recommended.

## Architecture

\`\`\`
src/
├── app/store.ts            # Redux store
├── data/                    # Static domain data (countries, hotels, meals, boards)
├── types/                   # Shared TS types (booking + data models)
├── utils/
│   ├── dates.ts             # Pure date-range helpers (date-fns wrappers)
│   ├── mealRules.ts         # Pure functions encoding the FB/HB/NB business rules
│   ├── pricing.ts           # Pure price-breakdown calculation
│   ├── validation.ts        # Step 1 form validation
│   └── storage.ts           # localStorage save/load for bookings
├── features/
│   ├── bookingSlice.ts      # Redux slice: config, per-day selections, wizard step
│   └── selectors.ts         # Memoized selectors (hotels/meals for destination, totals, validity)
└── components/
    ├── ui/                  # Generic, reusable primitives (Button, Card, Input, Select, RadioGroup, Table)
    ├── Stepper.tsx           # Wizard progress indicator
    ├── SaveLoadPanel.tsx     # Load a previously saved booking
    ├── LoadingSkeleton.tsx   # Loading state while the itinerary "generates"
    └── steps/
        ├── Step1Config.tsx    # Citizenship, destination, dates, board type
        ├── Step2DailyPlan.tsx # One row per day: hotel + lunch + dinner selects
        └── Step3Summary.tsx   # Config summary, daily list, price breakdown, print/save
\`\`\`

### Key decisions

- **Business logic lives outside components.** \`mealRules.ts\` and \`pricing.ts\` are pure,
  framework-free functions. This is what the unit tests exercise directly, and it means the
  meal mutual-exclusivity rule (Half Board) or the price formula can't drift out of sync
  between the UI and the tests.
- **Hotel/meal selections are per day**, matching the data model (each country has several
  hotels) and the price formula (\`Σ(Hotel Price + Selected Meal Prices)\` for all days) — the
  grand total is a pure fold over per-day breakdowns, computed once via a memoized selector.
- **Board-type rule enforcement happens in two places on purpose**: \`applyMealSelection\`
  enforces the rule at the moment a user picks a meal (clearing the mutually-exclusive
  option for Half Board), and \`sanitizeDayForBoardType\` re-validates existing selections
  whenever the board type itself changes (e.g. switching from Full Board to No Board clears
  any meals already chosen).
- **Wizard step is part of Redux state**, not local \`useState\`, so the Stepper can jump
  between unlocked steps and a saved/loaded booking can restore the exact step the user was on.
- **The daily itinerary is only generated when the user continues past Step 1** (or first
  visits Step 2), not on every keystroke, to avoid regenerating rows while typing a date.

## Functional requirements coverage

- ✅ Step 1 form: citizenship, destination, date range (start date + days), board type radios.
- ✅ Step 2 daily table: one row per day, hotel select + lunch/dinner selects.
- ✅ Meal rules: Full Board allows both, Half Board is mutually exclusive, No Board disables both.
- ✅ Step 3: configuration summary, daily selections list, price breakdown per day + grand total.

## Bonus items implemented

- **TypeScript** throughout, strict compiler options (\`noUnusedLocals\`, \`noFallthroughCasesInSwitch\`, etc.).
- **Unit tests** (Vitest): pure business-logic tests for date generation, meal rules, and
  pricing; a Redux slice test; a component test for the Stepper; and one integration test
  that drives the whole wizard end-to-end and asserts the final price. Run with \`npm test\`.
- **Responsive design**: the Step 1 form collapses to a single column on mobile, the daily
  table scrolls horizontally on narrow screens, and the ticket stub reflows to a single column.
- **Loading states & animation**: a short, deliberate loading skeleton appears while the daily
  itinerary is generated; step transitions use a subtle fade/slide-up (\`prefers-reduced-motion\`
  respected).
- **Save/load booking configurations**: the summary step can save the current booking (name +
  full state) to \`localStorage\`; Step 1 offers a "Load a saved booking" panel to restore, or
  delete, any saved trip.
- **Export / print**: the summary step has a "Print / Export PDF" button that calls
  \`window.print()\`; a print stylesheet hides navigation/buttons and keeps only the printable
  summary, so "Save as PDF" from the browser's print dialog produces a clean document.

## Known limitations & possible future improvements

- Hotel/meal/country data is static (per the assessment brief) rather than fetched from an
  API; swapping in a real backend would mean replacing \`src/data/*\` with API calls and adding
  loading/error states around them.
- \`localStorage\` save/load is per-browser only — there's no account system or server-side
  persistence, and saved bookings aren't validated against today's data (e.g. a hotel that's
  since been removed from \`data/hotels.ts\` would just show as "no hotel selected").
- The "Export as PDF" bonus uses the browser's native print-to-PDF rather than a generated
  PDF file, to avoid pulling in a heavy client-side PDF library for a single button.
- No end-to-end/browser tests (Playwright/Cypress) — coverage is unit + component +
  Testing-Library integration tests only.
- No i18n; all copy is English-only.

## Deploying

This is a standard Vite app, so any static host works:

\`\`\`bash
npm run build     # outputs to dist/
\`\`\`

- **Vercel**: \`vercel --prod\` (framework preset: Vite) or connect the GitHub repo.
- **Netlify**: build command \`npm run build\`, publish directory \`dist\`.

After deploying, update the "Live demo" link at the top of this file and share both the
repository and live URL per the submission guidelines.
