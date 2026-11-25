# Atrium — Personal Digital Sanctuary & Workspace

Atrium is a personal digital sanctuary, daily journal, and curated media workspace uniting an editorial overview, a cinema-grade movies and series archive, structured task and shopping lists, a spatial calendar, flexible personal collections, and urgency-aware reminders. Rather than presenting a stark white SaaS dashboard of uniform rounded cards, Atrium layers warm stone, dusty blue, and muted earthy tones with expressive serif typography and distinct spatial rhythms tailored to each section.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following product, visual, and persistence choices were confirmed during Phase 1 clarification and anchor the implementation:

- **Workspace Identity**: **Atrium** — positioned as a calm, crafted personal workspace and media collection.
- **Confirmed Light Palette Direction**: **Dusty blue and warm stone** as the default light theme, supported by muted sage, soft clay, and warm greige surface layers to eliminate washed-out white backgrounds.
- **Confirmed Typography Pairing**: **Cormorant Garamond** (editorial display serif for expressive headings, dates, and cinema titles) paired with **DM Sans** (clean geometric sans-serif for interface controls, lists, and dense metadata), with `tabular-nums` applied to all numeric counters, dates, and episode indices.
- **Confirmed Data Persistence**: **Browser local storage (`localStorage`)** pre-populated with rich, curated starter items across all sections, with full interactive editing, creation, deletion, and a workspace reset option.

---

### 1. Overview & Core Concept

- **What It Does**: Atrium serves as a single-pane personal home base covering seven interconnected workflows:
  1. **Overview Dashboard**: Editorial daily welcome with expressive date typography, atmospheric dusty-blue/stone header, today's focused agenda, active watching spotlight, shopping snapshot, curated list highlights, and upcoming reminders.
  2. **Movies & Series Library**: Cinematic collection featuring a spotlighted currently-watching backdrop hero, distinct status filtering (`Watching`, `Completed`, `Planned`, `Dropped`), custom poster artwork, and personal progress tracking.
  3. **Entertainment Detail View**: Full-bleed backdrop showcase with measured gradient scrims, editorial title lockup, interactive star/score rating, season and episode checklist tracker, status switcher, and personal viewing notes.
  4. **Tasks**: Minimal, border-separated daily ledger organized by priority and timeframe (`Today`, `Upcoming`, `Later`, `Completed`) with inline creation and completion toggles.
  5. **Shopping**: Tactile, category-grouped checklist (`Produce & Pantry`, `Home & Studio`, `Errands`) with item quantities, estimated totals, and one-click clearing of checked items.
  6. **Calendar**: Spatial monthly grid paired with an adjacent selected-day agenda panel for viewing, adding, and managing scheduled events.
  7. **Lists**: Expressive personal collections (e.g., reading shelves, weekend packing, architectural notes) rendered as editorial index blocks with inline item editing.
  8. **Reminders**: Compact, urgency-aware timeline separating overdue, due-today, and upcoming alerts with snooze and resolve actions.
- **Target Audience & Context**: Everyday personal planning, media journaling, and quiet morning/evening check-ins on desktop and mobile viewports.
- **Key Value**: Combines the visual warmth of an independent editorial publication with immediate, zero-friction personal productivity and persistent local state.

---

### 2. User Experience & Visual Design

#### Visual Identity & Dual-Theme Surface Architecture

Atrium replaces flat white canvases with five distinct surface tiers in both light and dark modes so adjacent sections maintain clear visual depth without heavy drop shadows or repetitive card borders:

| Surface Role | Light Theme (Default — Dusty Blue & Warm Stone) | Dark Theme (Deep Charcoal, Forest & Slate) |
| :--- | :--- | :--- |
| **Primary Canvas** | Warm Stone (`#D8D2C6`) with subtle grain | Deep Basalt (`#161918`) with subtle grain |
| **Recessed / Secondary Section** | Muted Greige (`#CEC7B9`) | Dark Slate Moss (`#1D2221`) |
| **Elevated Surface / Panels** | Soft Limestone (`#E5E0D5`) | Elevated Charcoal (`#252B29`) |
| **Contrasting Accent Panel** | Dusty Blue Wash (`#C3CDD4`) & Slate (`#435A6B`) | Deep Slate Blue (`#22303A`) & Mist (`#7A99AE`) |
| **Primary Text & Hairlines** | Charcoal Ink (`#232524`) & Stone Hairline (`#B9B1A2`) | Warm Parchment (`#EAE5DC`) & Muted Hairline (`#343C3A`) |
| **Supporting Earthy Accents** | Deep Sage (`#465C4E`), Soft Clay (`#9B6D5A`), Ochre (`#9A7B45`) | Muted Sage (`#7EA08A`), Warm Clay (`#C6937E`), Amber (`#C8A667`) |

#### Typography & Hierarchy

- **Display & Editorial Headings**: `Cormorant Garamond` (weights 500, 600, italic) reserved selectively for the workspace greeting, oversized editorial date lockup, section titles, pull-style notes, and cinema titles.
- **UI Controls, Body & Metadata**: `DM Sans` (weights 400, 500, 700) for navigation, task rows, shopping checklists, episode listings, and crisp unboxed metadata separated by typographic middots (`·`).
- **Numeric Alignment**: `tabular-nums` enforced across calendar dates, task counters, shopping totals, episode progress (`Ep 4 / 10`), and reminder timestamps.

#### Feature-Specific Visual Distinction & Anti-Clutter Discipline

Instead of wrapping every block in identical rounded rectangles, each section uses a tailored structural treatment:
- **Overview**: Asymmetric 12-column editorial composition — a dominant atmospheric daily header and agenda ledger alongside a recessed dusty-blue cinema spotlight strip, border-separated shopping/list columns, and a compact reminder rail.
- **Movies & Series & Details**: High-resolution custom-generated cinema posters (`3:4`) and widescreen backdrops (`16:9`) stored locally as static assets, framed with subtle ambient elevation and zero pill-badge clutter on posters. Status is communicated clearly with explicit text labels and subtle progress bars.
- **Tasks & Reminders**: Flat, hairline-divided editorial rows rather than stacked boxes, maximizing legibility and fast scanning.
- **Shopping & Lists**: Tactile checklist rows and freeform editorial columns with subtle dashed or hairline separators and generous outer margins.
- **Navigation Shell**: Responsive left navigation rail on desktop (`240px`) paired with a clean top utility bar (`Atrium` date/context + quick-capture trigger + theme toggle), collapsing cleanly into a compact mobile top bar and accessible navigation drawer without exceeding viewport sticky limits.

#### Interactive Feedback & Motion

- Smooth compositor-only transitions (`150ms–200ms`) on view switches, modal/drawer reveals, poster hover zoom, and checklist completion states, honoring `prefers-reduced-motion`.
- Instant optimistic updates persisted directly to `localStorage` with subtle confirmation feedback on item creation, editing, or workspace reset.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Static Local Asset Generation for Cinema Imagery**
  - *Chosen Approach*: Generate bespoke, atmospheric film/series posters and widescreen backdrops locally using `generate_image` during implementation rather than relying on external image URLs.
  - *Why*: Eliminates broken hotlinks and network failures while giving the entertainment library a cohesive, film-editorial aesthetic tailored to the dusty-blue and warm-stone palette.
  - *Alternatives Considered*: External stock URLs or SVG-only placeholders, both of which risk broken images or feel flat compared to real cinematic art.

- **Decision 2: LocalStorage State Architecture with Seeded Curated Dataset**
  - *Chosen Approach*: Centralize all domain entities (media items, tasks, shopping items, calendar events, custom lists, reminders, and theme preference) in a typed React state store synchronized with `localStorage`, initialized with thoughtful starter entries and a one-click reset action.
  - *Why*: Matches the confirmed persistence requirement, delivers instant zero-latency interactions offline or online, and lets the user immediately explore a richly populated workspace on first load.
  - *Alternatives Considered*: Server-side database or cloud auth, which adds setup friction unnecessary for a personal browser-stored sanctuary.

- **Decision 3: Multi-Surface Color Layering Without Heavy Elevation**
  - *Chosen Approach*: Use 5 calibrated stone/dusty-blue surface tones separated by 1px hairline borders and selective subtle shadows rather than pure white cards floating on beige.
  - *Why*: Directly resolves the washed-out look requested in the brief while keeping WCAG AA text contrast intact across both light and dark modes.

---

### 4. Technical Architecture & Data Strategy

```
┌──────────────────────────────────────────────────────────────────────┐
│                       LocalStorage Persistence                       │
│   atrium_workspace_v1 (media, tasks, shopping, events, lists, etc.)  │
│   atrium_theme_v1     ('light' | 'dark')                             │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ hydrate / sync
┌───────────────────────────────▼──────────────────────────────────────┐
│                     Atrium Workspace Context                         │
│  • Active View & Selected Media ID                                   │
│  • CRUD Actions (add/toggle/update/delete/reorder/reset)             │
│  • Theme Toggle (.dark class on documentElement)                     │
└──────┬────────────────────────┬────────────────────────┬─────────────┘
       │                        │                        │
┌──────▼──────┐          ┌──────▼──────┐          ┌──────▼──────┐
│  App Shell  │          │ Active View │          │Quick Capture│
│ • Sidebar   │          │ • Overview  │          │  Modal/Bar  │
│ • Top Bar   │          │ • Cinema &  │          │ (Task, Note │
│ • Mobile Nav│          │   Details   │          │  Media, etc)│
└─────────────┘          │ • Tasks     │          └─────────────┘
                         │ • Shopping  │
                         │ • Calendar  │
                         │ • Lists     │
                         │ • Reminders │
                         └─────────────┘
```

#### Core Data Entities

- **MediaItem**: `id`, `title`, `type` (`'movie' | 'series'`), `status` (`'watching' | 'completed' | 'planned' | 'dropped'`), `year`, `directorOrCreator`, `genres`, `runtime`, `rating` (`1–5` or `null`), `posterUrl`, `backdropUrl`, `synopsis`, `personalNotes`, `seasons` (array of seasons containing episode titles, durations, and `watched` booleans).
- **TaskItem**: `id`, `title`, `notes`, `dueBucket` (`'today' | 'upcoming' | 'later'`), `priority` (`'high' | 'medium' | 'low'`), `category`, `completed`, `createdAt`.
- **ShoppingItem**: `id`, `name`, `quantity`, `category` (`'Produce & Pantry' | 'Home & Studio' | 'Errands'`), `estimatedPrice`, `checked`.
- **CalendarEvent**: `id`, `title`, `date` (`YYYY-MM-DD`), `startTime`, `endTime`, `location`, `category`, `notes`.
- **PersonalList**: `id`, `title`, `subtitle`, `accentTone` (`'dusty-blue' | 'sage' | 'clay' | 'stone'`), `items` (`{ id, text, note?, done }[]`).
- **ReminderItem**: `id`, `title`, `dueDateTime`, `urgency` (`'overdue' | 'today' | 'upcoming'`), `completed`.

#### Interactive Component & State Mapping

- **Overview Dashboard**: Reads today's tasks, active `watching` media, unchecked shopping count, pinned lists, and urgent reminders; supports inline task completion, quick episode increment (`+1 Ep`), and one-click navigation into any detailed section or cinema detail page.
- **Movies & Series + Detail View**: Supports status tabs, live title/genre search, adding new titles via a structured modal, clicking any poster or featured hero to enter its dedicated Detail View, toggling individual episodes (auto-updating overall progress and status), adjusting star ratings, and saving personal journal notes.
- **Tasks, Shopping, Calendar, Lists, Reminders**: Each section provides complete add, edit, toggle/complete, filter, and delete handlers backed by immediate `localStorage` persistence and empty-state prompts whenever filtered or cleared.
