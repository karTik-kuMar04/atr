import React, { useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Film,
  MapPin,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { EditorialDateDisplay } from './EditorialDateDisplay';
import { MediaArtwork } from './MediaArtwork';

const WEEK_STRIP = [
  { label: 'Wed', day: '18', dateStr: '2026-11-18' },
  { label: 'Thu', day: '19', dateStr: '2026-11-19' },
  { label: 'Fri', day: '20', dateStr: '2026-11-20' },
  { label: 'Sat', day: '21', dateStr: '2026-11-21', isToday: true },
  { label: 'Sun', day: '22', dateStr: '2026-11-22' },
  { label: 'Mon', day: '23', dateStr: '2026-11-23' },
  { label: 'Tue', day: '24', dateStr: '2026-11-24' },
];

export const OverviewView: React.FC = () => {
  const {
    data,
    setActiveView,
    openMediaDetail,
    toggleTask,
    addTask,
    markNextEpisodeWatched,
    toggleShoppingItem,
    toggleListItem,
    toggleReminder,
    snoozeReminder,
  } = useWorkspace();

  const [quickTask, setQuickTask] = useState('');
  const [selectedStripDate, setSelectedStripDate] = useState('2026-11-21');

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const todayTasks = data.tasks.filter((t) => t.bucket === 'today');
  const upcomingTasksPreview = data.tasks
    .filter((t) => t.bucket === 'upcoming' && !t.completed)
    .slice(0, 2);
  const openTodayCount = todayTasks.filter((t) => !t.completed).length;

  const watchingMedia = data.media.filter((m) => m.status === 'watching');
  const spotlightMedia =
    watchingMedia.find((m) => m.featured) ?? watchingMedia[0] ?? data.media[0];

  const watchlistQueue = data.media
    .filter(
      (m) =>
        m.id !== spotlightMedia?.id &&
        (m.status === 'watching' || m.status === 'planned')
    )
    .slice(0, 3);

  const selectedDayEvents = data.events.filter((e) => e.date === selectedStripDate);
  const todayEventsCount = data.events.filter((e) => e.date === '2026-11-21').length;
  const upcomingEvents = data.events
    .filter((e) => e.date > '2026-11-21')
    .slice(0, 2);

  const activeReminders = data.reminders.filter((r) => !r.completed).slice(0, 3);

  const openShopping = data.shopping.filter((s) => !s.checked);
  const shoppingPreview = data.shopping.slice(0, 4);
  const shoppingEstimate = openShopping.reduce((acc, s) => acc + s.estimatedPrice, 0);

  const pinnedList = data.lists.find((l) => l.pinned) ?? data.lists[0];

  const handleQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTask.trim()) return;
    addTask({
      title: quickTask,
      bucket: 'today',
      priority: 'medium',
      category: 'Personal',
    });
    setQuickTask('');
  };

  const getProgressStats = (media: typeof spotlightMedia) => {
    if (!media) return { watched: 0, total: 0, pct: 0 };
    if (media.type === 'movie') {
      return {
        watched: media.watchedMovie ? 1 : 0,
        total: 1,
        pct: media.watchedMovie ? 100 : 45,
      };
    }
    const eps = media.seasons?.flatMap((s) => s.episodes) ?? [];
    const watched = eps.filter((e) => e.watched).length;
    const total = eps.length;
    return {
      watched,
      total,
      pct: total > 0 ? Math.round((watched / total) * 100) : 0,
    };
  };

  const spotlightStats = getProgressStats(spotlightMedia);

  return (
    <div className="space-y-9 pb-12">
      {/* 1. Editorial Atmospheric Greeting & Sculptural Date Header */}
      <section
        className="relative overflow-hidden border border-[var(--border-hairline)] bg-gradient-to-br from-[var(--bg-blue-wash)] via-[var(--bg-surface)] to-[var(--bg-recessed)] px-6 py-7 sm:px-9 sm:py-9"
        style={{ borderRadius: '18px' }}
      >
        <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div className="max-w-xl space-y-3">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-[var(--accent-primary)]">
              Daily Sanctuary · Atrium
            </p>
            <h1 className="font-serif text-4xl font-medium tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.05]">
              {greeting}, <span className="italic">{data.userName}.</span>
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
              You have{' '}
              <span className="font-medium text-[var(--text-primary)] tabular-nums">
                {openTodayCount} open {openTodayCount === 1 ? 'task' : 'tasks'}
              </span>
              ,{' '}
              <span className="font-medium text-[var(--text-primary)] tabular-nums">
                {todayEventsCount} scheduled {todayEventsCount === 1 ? 'event' : 'events'}
              </span>{' '}
              today, and{' '}
              <span className="font-medium text-[var(--text-primary)] tabular-nums">
                {openShopping.length} items
              </span>{' '}
              on your market list.
            </p>
          </div>

          <EditorialDateDisplay onOpenCalendar={() => setActiveView('calendar')} />
        </div>
      </section>

      {/* 2. Asymmetric Primary Spread (8 / 4): Cinema Watchlist Focal Section + Spatial Calendar Rail */}
      <div className="grid grid-cols-1 items-stretch gap-7 lg:grid-cols-12">
        {/* Left 8 Cols: Cinema Watchlist Spread (Hero Still + Queue Rail) */}
        <section
          className="dashboard-card-hover overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-ink-panel)] text-[var(--bg-ink-panel-text)] shadow-[var(--shadow-ambient)] lg:col-span-8"
          style={{ borderRadius: '18px' }}
        >
          <div className="grid h-full grid-cols-1 md:grid-cols-12">
            {/* Hero Spotlight Still (7 of 12 cols) */}
            {spotlightMedia && (
              <div className="relative flex flex-col justify-between md:col-span-7">
                <div
                  className="group relative min-h-[240px] flex-1 cursor-pointer overflow-hidden sm:min-h-[280px]"
                  onClick={() => openMediaDetail(spotlightMedia.id)}
                >
                  <MediaArtwork
                    src={spotlightMedia.backdropUrl}
                    alt={`${spotlightMedia.title} cinema still`}
                    title={spotlightMedia.title}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161C20] via-[#161C20]/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[#B0C3D0]">
                      Cinema Watchlist · {spotlightMedia.type === 'series' ? 'Series' : 'Film'}
                    </p>
                    <h2 className="mt-1 font-serif text-3xl font-medium leading-tight text-[#F6F2EA] sm:text-4xl">
                      {spotlightMedia.title}
                    </h2>
                    <p className="mt-1.5 text-xs text-[#CFCAC0] tabular-nums">
                      {spotlightMedia.creator} · {spotlightMedia.year}
                      {spotlightMedia.type === 'series' &&
                        ` · Ep ${spotlightStats.watched} of ${spotlightStats.total}`}
                    </p>
                  </div>
                </div>

                {/* Progress & Action Bar */}
                <div className="space-y-3 border-t border-white/10 bg-[#1B252C]/90 px-6 py-4">
                  <div className="flex items-center justify-between text-xs text-[#C4D1DA] tabular-nums">
                    <span>Viewing progress</span>
                    <span>{spotlightStats.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-[#9BB6C7] transition-all duration-300"
                      style={{ width: `${spotlightStats.pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => openMediaDetail(spotlightMedia.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#EAE4D9] hover:underline whitespace-nowrap shrink-0"
                    >
                      Open journal <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    {spotlightMedia.type === 'series' &&
                      spotlightStats.watched < spotlightStats.total && (
                        <button
                          type="button"
                          onClick={() => markNextEpisodeWatched(spotlightMedia.id)}
                          className="rounded-lg bg-white/12 px-3 py-1.5 text-xs font-medium text-[#F5F2EB] transition-colors hover:bg-white/20 whitespace-nowrap shrink-0"
                        >
                          +1 Episode
                        </button>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* Integrated Watchlist Queue Rail (5 of 12 cols) */}
            <div className="flex flex-col justify-between border-t border-white/10 bg-black/20 p-6 md:col-span-5 md:border-t-0 md:border-l">
              <div>
                <div className="mb-4 flex items-baseline justify-between gap-2 border-b border-white/10 pb-3">
                  <span className="inline-flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-[#B5C6D2]">
                    <Film className="h-3.5 w-3.5" />
                    Up Next
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveView('cinema')}
                    className="text-xs font-medium text-[#DDE6EC] hover:underline whitespace-nowrap shrink-0"
                  >
                    Full library
                  </button>
                </div>

                <div className="space-y-4">
                  {watchlistQueue.map((item) => {
                    const stats = getProgressStats(item);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => openMediaDetail(item.id)}
                        className="group flex w-full items-center gap-3.5 rounded-lg p-1.5 text-left transition-colors hover:bg-white/8"
                      >
                        <MediaArtwork
                          src={item.posterUrl}
                          alt={item.title}
                          title={item.title}
                          className="h-18 w-13 shrink-0 rounded-md border border-white/10"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-serif text-lg font-medium leading-snug text-[#F2EEE6] group-hover:text-[#A9C2D3]">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-xs text-[#BEB9AF] tabular-nums">
                            {item.type === 'series' ? 'Series' : 'Film'} · {item.year}
                          </p>
                          <p className="mt-0.5 text-[11px] capitalize text-[#9BB0BE] tabular-nums">
                            {item.status}
                            {item.type === 'series' && item.status === 'watching'
                              ? ` · Ep ${stats.watched}/${stats.total}`
                              : ''}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 border-t border-white/10 pt-3.5 text-xs text-[#AEBAC2] tabular-nums">
                {watchingMedia.length} currently watching · {data.media.length} archived
              </div>
            </div>
          </div>
        </section>

        {/* Right 4 Cols: Spatial Calendar & Timeline Rail */}
        <section
          className="dashboard-card-hover flex flex-col justify-between border border-[var(--border-hairline)] bg-[var(--bg-recessed)] p-6 lg:col-span-4"
          style={{ borderRadius: '14px' }}
        >
          <div>
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[var(--accent-primary)]" />
                <h2 className="font-serif text-2xl font-medium text-[var(--text-primary)]">
                  Calendar
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('calendar')}
                className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-primary)] hover:underline whitespace-nowrap shrink-0"
              >
                Month view <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Compact Spatial 7-Day Week Strip */}
            <div className="mb-5 grid grid-cols-7 gap-1 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-1.5">
              {WEEK_STRIP.map((d) => {
                const active = selectedStripDate === d.dateStr;
                const hasEvents = data.events.some((e) => e.date === d.dateStr);
                return (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => setSelectedStripDate(d.dateStr)}
                    className={`flex flex-col items-center rounded-lg py-1.5 transition-colors ${
                      active
                        ? 'bg-[var(--accent-primary)] text-[#F5F2EB]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-recessed)]'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider opacity-80">
                      {d.label}
                    </span>
                    <span className="mt-0.5 text-xs font-medium tabular-nums">
                      {d.day}
                    </span>
                    <span
                      className={`mt-1 h-1 w-1 rounded-full ${
                        hasEvents
                          ? active
                            ? 'bg-[#F5F2EB]'
                            : 'bg-[var(--accent-primary)]'
                          : 'bg-transparent'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Selected Day Time Blocks */}
            <div className="divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)]">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((evt) => (
                  <div key={evt.id} className="py-3 first:pt-3 last:pb-0">
                    <div className="flex items-center justify-between gap-2 text-xs text-[var(--accent-primary)] tabular-nums">
                      <span className="font-medium">
                        {evt.startTime} – {evt.endTime}
                      </span>
                      <span className="text-[var(--text-muted)]">{evt.category}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                      {evt.title}
                    </p>
                    {evt.location && (
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
                        <MapPin className="h-3 w-3" />
                        {evt.location}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="py-6 text-sm italic text-[var(--text-secondary)]">
                  Unscheduled day on {selectedStripDate.slice(5).replace('-', '/')}.
                </p>
              )}
            </div>
          </div>

          {upcomingEvents.length > 0 && (
            <div className="mt-5 border-t border-[var(--border-hairline)] pt-3.5">
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                On the Horizon
              </p>
              <div className="space-y-1 text-xs text-[var(--text-secondary)] tabular-nums">
                {upcomingEvents.map((evt) => (
                  <p key={evt.id} className="truncate">
                    {evt.date.slice(5).replace('-', '/')} · {evt.title}
                  </p>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* 3. Asymmetric Secondary Composition (7 / 5): Structured Tasks Ledger + Stacked Utilities */}
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
        {/* Left 7 Cols: Structured Tasks Ledger */}
        <section
          className="dashboard-card-hover flex flex-col justify-between border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 sm:p-8 lg:col-span-7"
          style={{ borderRadius: '12px' }}
        >
          <div>
            <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[var(--accent-primary)]">
                  Daily Ledger
                </p>
                <h2 className="mt-0.5 font-serif text-3xl font-medium text-[var(--text-primary)]">
                  Focus Tasks
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-[var(--text-muted)] tabular-nums">
                  {todayTasks.filter((t) => t.completed).length}/{todayTasks.length} done
                </span>
                <button
                  type="button"
                  onClick={() => setActiveView('tasks')}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent-primary)] hover:underline whitespace-nowrap shrink-0"
                >
                  All tasks <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleQuickTask} className="mb-5 flex items-center gap-2">
              <input
                type="text"
                value={quickTask}
                onChange={(e) => setQuickTask(e.target.value)}
                placeholder="Add a focus item for today..."
                className="flex-1 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-xs font-medium text-[#F5F2EB] transition-colors hover:bg-[var(--accent-primary-hover)] whitespace-nowrap shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </form>

            <ul className="divide-y divide-[var(--border-subtle)]">
              {todayTasks.map((task) => (
                <li
                  key={task.id}
                  className="group flex items-start justify-between gap-4 py-3.5 first:pt-1 last:pb-1"
                >
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="flex flex-1 items-start gap-3.5 text-left"
                  >
                    <span
                      className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors ${
                        task.completed
                          ? 'border-[var(--accent-sage)] bg-[var(--accent-sage)] text-[#F5F2EB]'
                          : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] group-hover:border-[var(--accent-primary)]'
                      }`}
                    >
                      {task.completed && <Check className="h-3 w-3" strokeWidth={2.5} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium transition-colors ${
                          task.completed
                            ? 'text-[var(--text-muted)] line-through'
                            : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                        {task.category} · Priority: {task.priority}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
              {todayTasks.length === 0 && (
                <li className="py-6 text-center text-sm text-[var(--text-muted)]">
                  No tasks scheduled for today.
                </li>
              )}
            </ul>
          </div>

          {upcomingTasksPreview.length > 0 && (
            <div className="mt-6 border-t border-[var(--border-subtle)] pt-4">
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                Queued Next
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--text-secondary)]">
                {upcomingTasksPreview.map((t) => (
                  <span key={t.id}>· {t.title}</span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right 5 Cols: Stacked Reminders (Clay) & Market Checklist (Sage) */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Urgent Reminders */}
          <section
            className="dashboard-card-hover border border-[var(--border-hairline)] bg-[var(--bg-clay-wash)] p-6"
            style={{ borderRadius: '14px' }}
          >
            <div className="mb-3.5 flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-2xl font-medium text-[var(--text-primary)]">
                Reminders
              </h2>
              <button
                type="button"
                onClick={() => setActiveView('reminders')}
                className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-clay)] hover:underline whitespace-nowrap shrink-0"
              >
                Manage <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <ul className="divide-y divide-[var(--border-subtle)]">
              {activeReminders.map((rem) => (
                <li
                  key={rem.id}
                  className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <button
                    type="button"
                    onClick={() => toggleReminder(rem.id)}
                    className="flex flex-1 items-start gap-2.5 text-left"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-[var(--border-hairline)] bg-[var(--bg-surface)]" />
                    <div className="min-w-0">
                      <p className="text-sm text-[var(--text-primary)]">{rem.title}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--text-secondary)] tabular-nums">
                        <Clock className="h-3 w-3" />
                        {rem.urgency === 'overdue'
                          ? 'Overdue'
                          : rem.dueDate === '2026-11-21'
                          ? 'Today'
                          : rem.dueDate}{' '}
                        · {rem.dueTime}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => snoozeReminder(rem.id)}
                    className="rounded px-2 py-1 text-xs text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)] whitespace-nowrap shrink-0"
                    title="Snooze by 1 day"
                  >
                    +1d
                  </button>
                </li>
              ))}
              {activeReminders.length === 0 && (
                <li className="py-3 text-sm text-[var(--text-secondary)]">
                  All reminders cleared.
                </li>
              )}
            </ul>
          </section>

          {/* Market & Supplies Snapshot */}
          <section
            className="dashboard-card-hover flex-1 border border-[var(--border-hairline)] bg-[var(--bg-sage-wash)] p-6"
            style={{ borderRadius: '14px' }}
          >
            <div className="mb-3.5 flex items-baseline justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-[var(--accent-sage)]" />
                <h2 className="font-serif text-2xl font-medium text-[var(--text-primary)]">
                  Market & Supplies
                </h2>
              </div>
              <span className="text-xs font-medium text-[var(--accent-sage)] tabular-nums">
                ~${shoppingEstimate.toFixed(0)} est.
              </span>
            </div>

            <ul className="space-y-2.5">
              {shoppingPreview.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => toggleShoppingItem(item.id)}
                    className="flex w-full items-center justify-between gap-3 text-left text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-xs border ${
                          item.checked
                            ? 'border-[var(--accent-sage)] bg-[var(--accent-sage)] text-[#F5F2EB]'
                            : 'border-[var(--border-hairline)] bg-[var(--bg-surface)]'
                        }`}
                      >
                        {item.checked && <Check className="h-2.5 w-2.5" strokeWidth={2.5} />}
                      </span>
                      <span
                        className={`truncate ${
                          item.checked
                            ? 'text-[var(--text-muted)] line-through'
                            : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {item.name}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-[var(--text-secondary)] tabular-nums">
                      {item.quantity}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-[var(--border-subtle)] pt-3">
              <button
                type="button"
                onClick={() => setActiveView('shopping')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent-sage)] hover:underline whitespace-nowrap shrink-0"
              >
                Open shopping list ({openShopping.length} left){' '}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* 4. Unboxed Editorial Shelf (4 / 8 split): Pinned Personal Collection */}
      {pinnedList && (
        <section className="grid grid-cols-1 gap-6 border-y border-[var(--border-hairline)] py-7 md:grid-cols-12">
          <div className="flex flex-col justify-between gap-3 md:col-span-4">
            <div>
              <p className="text-[11px] font-medium tracking-[0.16em] uppercase text-[var(--text-muted)]">
                Pinned Collection
              </p>
              <h2 className="mt-1 font-serif text-3xl font-medium text-[var(--text-primary)]">
                {pinnedList.title}
              </h2>
              <p className="mt-1 text-xs italic text-[var(--text-secondary)]">
                {pinnedList.subtitle}
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setActiveView('lists')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent-primary)] hover:underline whitespace-nowrap shrink-0"
              >
                All personal lists <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 md:col-span-8">
            {pinnedList.items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggleListItem(pinnedList.id, item.id)}
                  className="flex w-full items-start gap-3 border-b border-[var(--border-subtle)] pb-2.5 text-left text-sm"
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      item.done
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[#F5F2EB]'
                        : 'border-[var(--border-hairline)]'
                    }`}
                  >
                    {item.done && <Check className="h-2.5 w-2.5" strokeWidth={2.5} />}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={
                        item.done
                          ? 'text-[var(--text-muted)] line-through'
                          : 'text-[var(--text-primary)]'
                      }
                    >
                      {item.text}
                    </p>
                    {item.note && (
                      <p className="text-xs italic text-[var(--text-muted)]">
                        {item.note}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
