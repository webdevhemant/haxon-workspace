# Haxon

A modern, AI-native team workspace — docs, boards, grids, and an AI assistant unified in one blazing-fast product. Built with Next.js 16, TailwindCSS v4, and Zustand.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | TailwindCSS v4 |
| State | Zustand (slice pattern) |
| Drag & Drop | @hello-pangea/dnd |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| UI Primitives | Radix UI |
| Theme | next-themes (class-based) |

## Getting Started

```bash
# Requires Node 20+
nvm use 20
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The app auto-logs you in as Maya Chen — no auth setup needed in dev.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, signup, reset, verify
│   ├── (marketing)/     # Landing page
│   └── (product)/       # App shell — dashboard, board, doc, calendar, inbox
├── components/
│   ├── auth/            # Auth shell + all auth forms
│   ├── board/           # Kanban + list + workload views, card detail modal
│   ├── calendar/        # Monthly calendar with upcoming sidebar
│   ├── dashboard/       # Home with quick actions, recent docs, activity
│   ├── editor/          # Doc editor — block-based with AI + comments panels
│   ├── inbox/           # Team inbox with threaded replies
│   ├── landing/         # Marketing landing page
│   ├── layout/          # Sidebar, topbar, command palette, product shell
│   ├── modals/          # Modal router (invite, rename, delete, share…)
│   ├── settings/        # Profile, members, billing settings
│   └── ui/              # Shared primitives (avatar, badge, priority badge…)
├── data/                # Dummy data (boards, docs, users, activity)
├── store/               # Zustand store + slices (board, doc, workspace, UI)
└── types/               # TypeScript types
```

## Key Features

- **Kanban boards** — drag-and-drop cards and columns, card detail modal with subtasks, comments, followers, priority, labels, and due dates
- **Doc editor** — block-based (H1–H3, paragraph, list, callout, AI block, divider), slash-command menu, floating text toolbar, AI sidebar, comments panel
- **Calendar** — monthly view with event cards color-coded by priority, upcoming sidebar
- **Inbox** — team inbox with threaded replies, notification grouping, mark-as-read
- **Dashboard** — greeting, AI daily briefing, quick actions, recent docs, stats, live activity feed
- **AI assistant** — context-aware chat panel in the doc editor (simulated streaming)
- **Dark mode** — class-based via next-themes, configured for TailwindCSS v4 with `@variant dark`
- **Command palette** — ⌘K to search docs and boards

## Dark Mode

TailwindCSS v4 defaults to `prefers-color-scheme` (media query). This project overrides that with a class-based variant in `globals.css`:

```css
@variant dark (&:where(.dark, .dark *));
```

`next-themes` sets `.dark` on `<html>` — the toggle works immediately.

## Development Notes

- Node 14 (macOS system default) is too old for this project. Use `nvm use 20`.
- All data is in-memory dummy data — no backend or database.
- The app auto-authenticates as `maya@haxon.app` in the product shell.
