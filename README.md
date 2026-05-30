# Haxon

A modern, AI-native team workspace — docs, boards, calendar, chat, goals, automations, integrations, files, and an AI assistant unified in one blazing-fast product. Built with Next.js 16, TailwindCSS v4, and Zustand.

**Live:** [haxonworkspace.vercel.app](https://haxonworkspace.vercel.app)

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | TailwindCSS v4 |
| State | Zustand (slice pattern, persisted) |
| Drag & Drop | @hello-pangea/dnd |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| UI Primitives | Radix UI (Popover, DropdownMenu, Dialog, Tooltip, HoverCard) |
| Dates | date-fns |
| Theme | next-themes (class-based) |

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The app auto-logs you in as Maya Chen — no auth setup needed in dev.

## Top-level Pages

| Route | What |
|---|---|
| `/dashboard` | Greeting, AI daily briefing, my tasks, focus timer, goals, board health, live activity. |
| `/inbox` | Team chat — channels, DMs, threads, calls & huddles, saved messages, scheduled messages, channel search and settings. |
| `/calendar` | Month grid with quick-jump, full event detail modal, collapsible upcoming pane. |
| `/goals` | OKR tracker — goals with key results, status (on-track / at-risk / off-track / complete), expansion. |
| `/automations` | When-this-then-that rules across boards, docs, chat, calendar. Templates gallery + per-rule expand. |
| `/integrations` | Marketplace for Slack, GitHub, Google Drive, Calendar, Linear, Figma, etc. Connect/disconnect, filter by category. |
| `/files` | Asset library — grid/list views, kind filters, star, source attribution. |
| `/team` | Directory with grid/list/by-team views, filters, member detail at `/team/[id]`. |
| `/settings` | Profile, Members (with bulk invite + RBAC chips + audit), Billing (plan compare + invoices), Roles (capability matrix). |
| `/workspace/[id]/board/[id]` | Kanban + List + Grid + Table + Workload views, card detail with subtasks/comments/labels/watchers. |
| `/workspace/[id]/doc/[id]` | Block-based doc editor with slash menu, AI sidebar, comments. |

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, signup, reset, verify — each with its own right-side panel
│   ├── (marketing)/     # Landing page (forced dark theme)
│   └── (product)/       # App routes: dashboard, inbox, calendar, goals, automations,
│                        # integrations, files, team, team/[id], settings, settings/roles,
│                        # workspace/[id]/(board|doc|grid)
├── components/
│   ├── auth/            # Auth shell + form components, distinct hero panels per flow
│   ├── automations/     # NEW — view, rule row (expand/edit), templates gallery
│   ├── board/           # Kanban + list + grid + table + workload views; card-detail modal split
│   ├── calendar/        # Month grid, event pill, event detail modal, month/year quick-jump
│   ├── dashboard/       # Header, AI briefing, focus timer, goals, my tasks, quick actions, activity
│   ├── editor/          # Block-based doc editor — toolbar, slash menu, AI sidebar, comments
│   ├── files/           # NEW — file library (grid + list)
│   ├── goals/           # NEW — goal card with key results, OKR view
│   ├── inbox/           # Chat: sidebar, header, thread, message, composer (mentions/attach/emoji),
│   │                    # call/huddle, saved list, scheduled strip, channel search & settings
│   ├── integrations/    # NEW — marketplace, integration card
│   ├── landing/         # Marketing — nav, hero, app mockup, features, workflow, testimonials, pricing, CTA, footer
│   ├── layout/          # Sidebar, topbar, command palette, product shell
│   ├── modals/          # Modal router
│   ├── settings/        # Profile, members, billing, roles + security/ + billing/ subfolders
│   ├── team/            # Team product
│   └── ui/              # Shared primitives (avatar with hover-card, presence, date picker, calendar…)
├── data/                # Dummy data — boards, docs, users, activity, chat, events, team, presence,
│                        # automations, integrations, goals, files
├── lib/                 # rbac (capability matrix), use-can (hook), utils
├── store/               # Zustand slices: auth, workspace, doc, board, ui, profile, inbox, dashboard
└── types/               # TypeScript types
```

## Key Features

### Communication
- **Team chat (Inbox)** — channels and DMs, threaded conversations, message bubbles, reactions, presence dots, typing indicators, jump-to-latest, doc/board attachments. Composer supports `@` mentions, `#` channel refs, attach popover, categorized emoji picker, and AI compose.
- **Saved messages** — bookmark any message; the Saved tab shows a cross-channel flat list.
- **Scheduled messages** — pick "Tomorrow 9am" / "Monday morning" / custom time; a strip above the composer lists pending sends.
- **Channel search + settings** — search messages within a channel via popover; rename, change topic, and toggle privacy from a dedicated dialog.
- **Calls & huddles** — phone opens a voice-only call modal; video opens a huddle that requests camera + mic permissions, renders local video, with mute/cam/share controls. Falls back to audio-only on permission denial.

### Work
- **Kanban boards** — drag-and-drop cards and columns plus list, grid, table, workload views. Card detail modal has subtasks, comments, followers, priority, labels, dates with a shadcn-style date picker.
- **Doc editor** — block-based (H1–H3, paragraph, list, callout, AI block, divider), slash-command menu, floating text toolbar, AI sidebar with simulated streaming, threaded comments sidebar.
- **Calendar** — color-coded event pills, full event detail modal (attendees with RSVP, agenda, location/video link, recurring, linked docs/boards), collapsible Upcoming side rail, month/year quick-jump popover.

### Direction
- **Goals & OKRs** — goals with key results, status (on-track / at-risk / off-track / complete), per-status filters, expand to view KR progress.
- **Automations** — when-this-then-that rules across boards, docs, chat, calendar. Pause/resume, expand to see trigger + actions, delete. Templates gallery to start from.
- **Integrations** — marketplace for Slack, GitHub, Google Drive, Google Calendar, Linear, Figma, Notion, Zendesk, Datadog, Loom, Stripe, Intercom. Connect/disconnect, filter by category, search.

### Files
- **Files** — asset library with grid + list views, filter by kind (images, videos, docs, design, data, audio), star/unstar, source attribution (Haxon, Drive, Figma, Loom, GitHub), download + copy link actions.

### People
- **Team product** — `/team` directory with grid/list/by-team views, filters by role/status, sortable by name/title/team/joined. Member detail page at `/team/[userId]` with bio, skills, projects, recent activity, reporting structure.
- **Hover profile** — hover any avatar to see a mini-profile (presence, location, timezone, skills) with Message and Profile actions. Suppressed for your own avatar.
- **Settings** — Profile (editable identity, skills, links, security with real change-password / 2FA / sessions dialogs), Members (bulk invite, pending invites, RBAC chips, audit log), Billing (plan comparison, payment method, promo code, invoice list), Roles & permissions (full capability matrix).

### Governance
- **RBAC** — four roles (Owner / Admin / Member / Guest) and 21 capabilities across Workspace, People, Docs & boards, Chat, AI. Workspace switcher shows a colored chip per workspace; `/settings/roles` renders the full matrix. `useCan()` hook enforces capabilities — Guest can't invite, can't create docs/boards.
- **4 distinct workspaces** ship in dummy data so each role can be exercised by switching the active workspace.

### Theming & polish
- **Dark mode** — class-based via next-themes, configured for TailwindCSS v4 with `@variant dark`.
- **Landing forced dark** — marketing page is dark regardless of in-app theme.
- **Command palette** — ⌘K to search docs and boards.

## Componentization

Big views are split into folders of focused files rather than dumped into one. Every entrypoint (`board-view.tsx`, `dashboard-view.tsx`, `doc-editor-view.tsx`, `inbox-view.tsx`, `landing-page.tsx`, `team-view.tsx`, `calendar-view.tsx`, `automations-view.tsx`, `integrations-view.tsx`, `goals-view.tsx`, `files-view.tsx`) is a thin orchestrator. Constants and shared helpers live in `constants.ts` / `shared.ts` files alongside the components that use them.

## Persistence

Editable state persists to localStorage via Zustand `persist`:
- theme, favorites, board view choice
- team profiles (edits round-trip with `/team`)
- saved messages, scheduled messages, focus-timer history, goals (the dashboard ones)

## Development Notes

- All data is in-memory dummy data — no backend or database.
- The app auto-authenticates as `maya@haxon.app` in the product shell.
