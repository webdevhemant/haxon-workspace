# Haxon

A modern, AI-native team workspace — docs, boards, calendar, chat, and an AI assistant unified in one blazing-fast product. Built with Next.js 16, TailwindCSS v4, and Zustand.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | TailwindCSS v4 |
| State | Zustand (slice pattern, persisted) |
| Drag & Drop | @hello-pangea/dnd |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| UI Primitives | Radix UI (Popover, DropdownMenu, Dialog, Tooltip) |
| Dates | date-fns |
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
│   ├── (auth)/          # Login, signup, reset, verify (each with its own right-side panel)
│   ├── (marketing)/     # Landing page
│   └── (product)/       # App shell — dashboard, inbox (chat), board, doc, calendar, team, settings
├── components/
│   ├── auth/            # Auth shell + form components, with per-flow hero panels under panels/
│   ├── board/           # Kanban + list + grid + table + workload views; card-detail modal split
│   │   ├── views/       # one file per view
│   │   └── card-detail/ # header, description, subtasks, comments, sidebar
│   ├── calendar/        # Month grid, event pill, event detail modal, month/year quick-jump, upcoming list
│   ├── dashboard/       # Header, AI briefing, quick actions, my tasks, recent docs, stats, board health, activity panel
│   ├── editor/          # Block-based doc editor: toolbar, slash menu, AI sidebar, comments sidebar, block renderer
│   ├── inbox/           # Chat-style inbox: sidebar, header, thread, message, composer (with mentions/attach/emoji), call/huddle, thread + info panels
│   ├── landing/         # Marketing landing — nav, hero, app mockup, features, workflow, testimonials, pricing, CTA, footer
│   ├── layout/          # Sidebar, topbar, command palette, product shell
│   ├── modals/          # Modal router (invite, rename, delete, share…)
│   ├── settings/        # Profile, members, billing, roles (RBAC matrix)
│   ├── team/            # Team product — header, stats, toolbar, member card/row, org view, detail page, open roles
│   └── ui/              # Shared primitives — avatar (with hover-card), presence dot, date picker, calendar, etc.
├── data/                # Dummy data — boards, docs, users, activity, chat, events, team profiles, presence
├── lib/                 # rbac (capability matrix), utils (cn, greet)
├── store/               # Zustand store + slices (auth, workspace, doc, board, ui, profile)
└── types/               # TypeScript types
```

## Key Features

- **Team chat (Inbox)** — channels and DMs, threaded conversations, message bubbles, reactions, presence dots, typing indicators, jump-to-latest, doc/board attachments, channel info panel (about, members, pins, files). Composer supports `@` mentions, `#` channel refs, attach popover, and a categorized emoji picker. Phone and video buttons open call and huddle modals (the huddle requests camera + mic and renders the local stream).
- **Kanban boards** — drag-and-drop cards and columns, plus list, grid (editable table), table (sortable), and workload (per-assignee) views. Card detail modal has subtasks, comments, followers, priority, labels, dates (shadcn-style date picker on Start and Due).
- **Doc editor** — block-based (H1–H3, paragraph, list, callout, AI block, divider), slash-command menu, floating text toolbar, AI sidebar with simulated streaming, threaded comments sidebar.
- **Calendar** — month grid with click-to-jump month/year popover, color-coded event pills, full event detail modal (attendees with RSVP, agenda, location/video link, recurring, linked docs/boards), collapsible Upcoming side rail.
- **Team product** — `/team` directory with grid/list/by-team views, filters by role/status/search, sortable by name/title/team/joined. Member detail page at `/team/[userId]` with bio, skills, projects, recent activity, reporting structure. Profile is editable from settings and round-trips through a persisted Zustand slice.
- **Inbox** — see "Team chat" above. The Inbox nav item opens the chat surface, not a notification feed.
- **Dashboard** — greeting, AI daily briefing, quick actions, my tasks, recent docs, stats, board health, live activity panel.
- **AI assistant** — context-aware chat panel in the doc editor (simulated streaming), AI block in docs, AI option in the chat attach popover.
- **Settings** — Profile (editable identity, skills, links, security), Members (bulk invite, pending invites, RBAC chips, audit log, role-at-a-glance), Billing (plan comparison, payment method, promo code, invoice list), Roles & permissions (full capability matrix).
- **RBAC** — four roles (Owner / Admin / Member / Guest) and 21 capabilities across Workspace, People, Docs & boards, Chat, AI. Workspace switcher shows a colored chip per workspace; `/settings/roles` renders the full matrix.
- **Hover profile** — hover any avatar to see a mini-profile (presence, location, timezone, skills) with Message and Profile actions. Suppressed for your own avatar.
- **Dark mode** — class-based via next-themes, configured for TailwindCSS v4 with `@variant dark`.
- **Command palette** — ⌘K to search docs and boards.

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
- Editable state (theme, favorites, board view choice, team profiles) persists to localStorage via Zustand `persist`.

## Componentization

Big views are split into folders of focused files rather than dumped into one. Every entrypoint (`board-view.tsx`, `dashboard-view.tsx`, `doc-editor-view.tsx`, `inbox-view.tsx`, `landing-page.tsx`, `team-view.tsx`, `calendar-view.tsx`) is a thin orchestrator. Constants and shared helpers live in `constants.ts` / `shared.ts` files alongside the components that use them.
