# TaskFlow — Mini Task Tracker

A lightweight, polished task management application built as a technical assessment. TaskFlow lets you create, edit, complete, search, and filter tasks — all persisted client-side in your browser's `localStorage`.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **Full CRUD** — Create, read, update, and delete tasks
- **Status toggling** — Toggle tasks between `open` and `completed` with a single click
- **Priority levels** — Assign `low`, `medium`, or `high` priority with colour-coded badges
- **Due dates** — Optional due dates with automatic overdue detection and highlighting
- **Search** — Real-time case-insensitive search by task title
- **Filter tabs** — Filter by `All`, `Open`, or `Completed` with live count badges
- **Persistent storage** — All data survives page reloads via `localStorage`
- **Hydration-safe** — Custom `useLocalStorage` hook avoids Next.js SSR/client hydration mismatches
- **Responsive design** — Fully responsive from mobile to desktop
- **Polished UI** — Glassmorphism cards, staggered animations, modal forms, and micro-interactions

---

## 🛠 Tech Stack

| Layer           | Technology                    |
| --------------- | ----------------------------- |
| Framework       | **Next.js 16** (App Router)   |
| Language        | **TypeScript 5**              |
| Styling         | **Tailwind CSS 4**            |
| Icons           | **Lucide React**              |
| Persistence     | **localStorage** (client-side)|
| State Management| Custom React hooks            |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or yarn / pnpm)

### Installation & Running

```bash
# 1. Clone the repository
git clone <repository-url>
cd assigment

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Design system (glass-card, animations, utilities)
│   ├── layout.tsx           # Root layout with metadata & fonts
│   └── page.tsx             # Main page orchestrator
├── components/
│   ├── ControlBar.tsx       # Search input + status filter pills with badges
│   ├── TaskCard.tsx         # Individual task card with priority bar & actions
│   ├── TaskFormModal.tsx    # Modal form for creating / editing tasks
│   └── TaskList.tsx         # List orchestrator with empty & no-results states
├── hooks/
│   ├── useLocalStorage.ts   # Hydration-safe localStorage hook
│   └── useTaskManager.ts    # Central state management (CRUD, filters, form)
└── types/
    └── task.ts              # Task interface & helper types
```

---

## ⚠️ Known Limitations

1. **Client-side only persistence** — Data is stored in `localStorage`, meaning it is:
   - Tied to a single browser / device
   - Limited to ~5 MB of storage
   - Not shareable across users or devices
   - Lost if the user clears browser data

2. **No authentication** — Anyone with access to the browser can view and modify tasks.

3. **No server-side operations** — Search and filtering happen entirely on the client. With thousands of tasks, performance could degrade.

4. **No automated tests** — The current version relies on manual testing; unit and integration tests are not yet implemented.

5. **No drag-and-drop** — Tasks are sorted automatically (open first, newest first) but cannot be manually reordered.

---

## 🔮 What I Would Improve With More Time

| Area                     | Improvement                                                                                           |
| ------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Backend**              | Migrate to **PostgreSQL** + **Supabase** for durable, multi-device persistence                        |
| **Authentication**       | Add **NextAuth.js** with OAuth providers (Google, GitHub) for user-scoped task lists                   |
| **Real-time sync**       | Use **Supabase Realtime** or WebSockets for live collaboration and cross-tab sync                      |
| **Testing**              | Add **Jest** + **React Testing Library** unit tests for hooks, and **Playwright** E2E tests            |
| **Server-side filtering**| Move search and filter logic to the database layer for scalability with large datasets                 |
| **Drag & drop**          | Implement manual task reordering with **@dnd-kit** or **react-beautiful-dnd**                          |
| **Categories / Tags**    | Allow organising tasks into projects or tagging for better organisation                                |
| **Dark / Light toggle**  | Add a theme switcher (currently dark-only)                                                             |
| **Notifications**        | Browser push notifications for upcoming or overdue tasks                                               |
| **Accessibility audit**  | Full WCAG 2.1 AA compliance review with screen reader testing                                          |

---

## ⏱ Time Spent

**Approximate total: 1 Hour**

---

## 📄 License

This project was built as a technical assessment submission. MIT License.
