# AI Usage Disclosure

> Honest, transparent documentation of how AI tools were used during development.

---

## 1. Which AI tools did you use?

- **Claude** (Anthropic) — used as a coding assistant for pair-programming throughout the development process.

---

## 2. What did you ask AI to help with?

| Area                          | Details                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| **Boilerplate generation**    | Scaffolding the Next.js project, initial file structure, and TypeScript interface definitions  |
| **State management design**   | Structuring the `useTaskManager` hook with memoised filtering, form state, and CRUD callbacks  |
| **Tailwind UI styling**       | Composing responsive layout classes, glassmorphism card styles, and micro-animation utilities  |
| **Hydration safety patterns** | Designing the `useLocalStorage` hook to avoid SSR/client mismatches in Next.js App Router      |

---

## 3. Which parts of the code were AI-assisted?

- **Core layout & page structure** — The overall component hierarchy (`page.tsx` → `ControlBar`, `TaskList`, `TaskCard`, `TaskFormModal`) was generated with AI assistance.
- **Tailwind CSS composition** — Complex utility class strings for glassmorphism, animations, and responsive breakpoints.
- **`useLocalStorage` hook** — The hydration-safe pattern using `useEffect` with a `useRef` guard and the `hydrated` return flag.
- **`useTaskManager` hook** — The centralised state management with `useMemo` for reactive filtering and `useCallback` for stable CRUD functions.
- **Type definitions** — The `Task` interface and associated helper types (`CreateTaskInput`, `UpdateTaskInput`).

---

## 4. What did you manually change or verify?

- **Hydration error avoidance** — Verified that the `useLocalStorage` hook always returns `initialValue` on the server render and only reads `localStorage` in a post-mount `useEffect`. Tested by checking the browser console for hydration mismatch warnings during development.
- **Form validation logic** — Manually tested edge cases: empty strings, whitespace-only input, single-character titles, and excessively long titles to ensure validation catches all invalid states.
- **UX responsiveness** — Manually resized the browser from 320px to 1920px to verify the layout adapts correctly at every breakpoint (mobile, tablet, desktop).
- **Edge-case testing for empty inputs** — Confirmed that submitting the form with just spaces in the title field shows the correct validation error and does not create a task.
- **Cross-tab localStorage sync** — Opened two tabs and verified that creating a task in one tab reflects in the other.
- **Overdue date logic** — Set due dates in the past and confirmed the overdue badge and red styling appear correctly.

---

## 5. How did you test the solution?

**Manual testing** was performed across the following scenarios:

| Test Case                          | Method                                                                                   |
| ---------------------------------- | ---------------------------------------------------------------------------------------- |
| **Create task**                    | Filled form with various combinations of fields; verified task appears in the list        |
| **Edit task**                      | Clicked edit, modified fields, saved; verified changes persist                             |
| **Delete task**                    | Deleted tasks; verified removal from list and localStorage                                 |
| **Toggle complete**                | Toggled tasks; verified strikethrough, faded opacity, green checkmark, and status change   |
| **Search filtering**               | Typed partial titles; verified case-insensitive matching and real-time filtering           |
| **Status filter tabs**             | Switched between All / Open / Completed; verified correct subsets and badge counts          |
| **Combined search + filter**       | Applied both simultaneously; verified they compose correctly                               |
| **Empty state**                    | Cleared all tasks; verified the "Your workspace is empty" illustration appears             |
| **No results state**              | Searched for nonexistent text; verified "No tasks match" state with clear-filters button    |
| **Validation errors**              | Submitted empty / whitespace-only titles; verified inline error messages appear             |
| **Page reload persistence**        | Created tasks, refreshed the page; verified all data survives via localStorage             |
| **Hydration check**                | Watched browser console during initial load; confirmed zero hydration mismatch warnings     |
| **Responsive layout**              | Tested at 320px, 768px, 1024px, and 1440px widths                                          |
| **TypeScript compilation**         | Ran `npx tsc --noEmit` — zero type errors                                                  |
| **Production build**               | Ran `npm run build` — compiled and generated static pages successfully                      |

---

## 6. Did AI produce anything incorrect or risky?

Yes — one notable issue was identified and corrected:

> **Hydration mismatch risk**: The initial implementation of the `useLocalStorage` hook read from `localStorage` directly in `useState`'s initialiser. This would cause a **Next.js hydration mismatch** because the server renders with no `localStorage` (returning `undefined`), while the client would immediately read the stored value, producing different HTML.
>
> **Correction**: The hook was redesigned to always initialise with the provided `initialValue` (matching the server output), and then reconcile with `localStorage` in a post-mount `useEffect`. A `useRef` guard (`isHydrated`) ensures the reconciliation runs exactly once. A `hydrated` boolean is returned so the UI can show a skeleton loader until the client state is ready.

This pattern is critical for any Next.js App Router application using client-side storage and was manually verified against the React and Next.js documentation.

---

## 7. What would you improve if you had more time?

- **Authentication** — Add user accounts (via NextAuth.js) so tasks are scoped per user rather than per browser.
- **Server-side persistence** — Replace `localStorage` with a **PostgreSQL** database (via **Supabase** or **Prisma**) for durable, multi-device storage.
- **Server-side filtering & pagination** — Move search and filter logic to the database layer to handle thousands of tasks efficiently.
- **Automated testing** — Add **Jest** + **React Testing Library** for unit tests on hooks and components, and **Playwright** for end-to-end browser tests.
- **Real-time sync** — Use **Supabase Realtime** or WebSockets for live updates across devices.
- **Accessibility** — Conduct a full WCAG 2.1 AA audit with screen reader and keyboard-only navigation testing.

---

*This document reflects an honest account of AI usage during development. AI was used as a productivity tool; all output was reviewed, tested, and validated manually.*
