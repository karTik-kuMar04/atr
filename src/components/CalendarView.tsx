import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Plus, Trash2 } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { CalendarEvent } from '../types/workspace';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const CalendarView: React.FC = () => {
  const { data, addEvent, deleteEvent } = useWorkspace();

  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(10); // 0-indexed: 10 = November
  const [selectedDate, setSelectedDate] = useState('2026-11-21');

  const [newTitle, setNewTitle] = useState('');
  const [newStart, setNewStart] = useState('14:00');
  const [newEnd, setNewEnd] = useState('15:00');
  const [newLocation, setNewLocation] = useState('');
  const [newCategory, setNewCategory] = useState<CalendarEvent['category']>('Personal');

  const calendarCells = useMemo(() => {
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: ({ day: number; dateStr: string } | null)[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(viewMonth + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      cells.push({ day: d, dateStr: `${viewYear}-${mm}-${dd}` });
    }
    return cells;
  }, [viewYear, viewMonth]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    data.events.forEach((evt) => {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    });
    return map;
  }, [data.events]);

  const selectedEvents = eventsByDate[selectedDate] ?? [];

  const stepMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addEvent({
      title: newTitle,
      date: selectedDate,
      startTime: newStart,
      endTime: newEnd,
      location: newLocation.trim() || undefined,
      category: newCategory,
    });
    setNewTitle('');
    setNewLocation('');
  };

  const formatSelectedHeading = (dateStr: string) => {
    const d = new Date(`${dateStr}T12:00:00`);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-hairline)] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent-primary)]">
            Spatial Schedule
          </p>
          <h1 className="mt-1 font-serif text-4xl font-medium tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Calendar
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setViewYear(2026);
              setViewMonth(10);
              setSelectedDate('2026-11-21');
            }}
            className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-recessed)]"
          >
            Today (Nov 21)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
        {/* Monthly Grid (7 Cols) */}
        <section
          className="border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-5 sm:p-6 lg:col-span-7"
          style={{ borderRadius: '14px' }}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-medium text-[var(--text-primary)] tabular-nums">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => stepMonth(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-primary)] hover:bg-[var(--bg-recessed)]"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => stepMonth(1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-primary)] hover:bg-[var(--bg-recessed)]"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 border-b border-[var(--border-subtle)] pb-2 text-center text-xs font-medium text-[var(--text-muted)]">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1.5">
            {calendarCells.map((cell, idx) => {
              if (!cell) {
                return <div key={`empty-${idx}`} className="h-14 sm:h-16" />;
              }
              const dayEvents = eventsByDate[cell.dateStr] ?? [];
              const isSelected = cell.dateStr === selectedDate;
              const isToday = cell.dateStr === '2026-11-21';

              return (
                <button
                  key={cell.dateStr}
                  type="button"
                  onClick={() => setSelectedDate(cell.dateStr)}
                  className={`flex h-14 flex-col items-start justify-between rounded-lg border p-2 text-left transition-colors sm:h-16 ${
                    isSelected
                      ? 'border-[var(--accent-primary)] bg-[var(--bg-blue-wash)] text-[var(--text-primary)]'
                      : isToday
                      ? 'border-[var(--accent-ochre)] bg-[var(--bg-canvas)]'
                      : 'border-transparent bg-[var(--bg-canvas)]/60 hover:border-[var(--border-hairline)] hover:bg-[var(--bg-recessed)]'
                  }`}
                >
                  <span
                    className={`text-xs font-medium tabular-nums ${
                      isToday ? 'text-[var(--accent-primary)] font-semibold' : ''
                    }`}
                  >
                    {cell.day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[11px] font-medium text-[var(--accent-primary)] tabular-nums">
                      {dayEvents.length} {dayEvents.length === 1 ? 'evt' : 'evts'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected Day Agenda Inspector (5 Cols) */}
        <section
          className="flex flex-col justify-between border border-[var(--border-hairline)] bg-[var(--bg-recessed)] p-6 lg:col-span-5"
          style={{ borderRadius: '14px' }}
        >
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] tabular-nums">
              Selected Date · {selectedDate}
            </p>
            <h2 className="mt-1 font-serif text-3xl font-medium text-[var(--text-primary)]">
              {formatSelectedHeading(selectedDate)}
            </h2>

            <div className="mt-5 divide-y divide-[var(--border-hairline)] border-t border-[var(--border-hairline)]">
              {selectedEvents.length > 0 ? (
                selectedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="group flex items-start justify-between gap-3 py-4"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-[var(--accent-primary)] tabular-nums">
                        {evt.startTime} – {evt.endTime} · {evt.category}
                      </p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {evt.title}
                      </p>
                      {evt.location && (
                        <p className="inline-flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                          <MapPin className="h-3 w-3" />
                          {evt.location}
                        </p>
                      )}
                      {evt.notes && (
                        <p className="text-xs text-[var(--text-muted)]">{evt.notes}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteEvent(evt.id)}
                      className="rounded p-1.5 text-[var(--text-muted)] opacity-60 transition-colors hover:text-[var(--accent-clay)] hover:opacity-100"
                      aria-label={`Delete ${evt.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="py-8 text-sm italic text-[var(--text-secondary)]">
                  Open day—no scheduled events for {formatSelectedHeading(selectedDate)}.
                </p>
              )}
            </div>
          </div>

          {/* Add Event Form for Selected Date */}
          <form
            onSubmit={handleAddEvent}
            className="mt-6 space-y-3 border-t border-[var(--border-hairline)] pt-5"
          >
            <p className="text-xs font-medium text-[var(--text-secondary)]">
              Schedule event on {selectedDate}
            </p>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Event title..."
              className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="time"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-2.5 py-2 text-xs tabular-nums"
              />
              <input
                type="time"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-2.5 py-2 text-xs tabular-nums"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as CalendarEvent['category'])}
                className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-2.5 py-2 text-xs"
              >
                <option value="Personal">Personal</option>
                <option value="Focus">Focus</option>
                <option value="Gathering">Gathering</option>
                <option value="Errand">Errand</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Location (optional)"
                className="flex-1 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-2 text-xs"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-medium text-[#F5F2EB] hover:bg-[var(--accent-primary-hover)] whitespace-nowrap shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
