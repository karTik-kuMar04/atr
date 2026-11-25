import React, { useState } from 'react';
import { AlertCircle, Check, Clock, Plus, Trash2 } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';

export const RemindersView: React.FC = () => {
  const { data, addReminder, toggleReminder, snoozeReminder, deleteReminder } =
    useWorkspace();

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-21');
  const [dueTime, setDueTime] = useState('16:00');

  const overdue = data.reminders.filter((r) => !r.completed && r.urgency === 'overdue');
  const today = data.reminders.filter((r) => !r.completed && r.urgency === 'today');
  const upcoming = data.reminders.filter((r) => !r.completed && r.urgency === 'upcoming');
  const completed = data.reminders.filter((r) => r.completed);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addReminder({ title, dueDate, dueTime });
    setTitle('');
  };

  const renderGroup = (
    heading: string,
    items: typeof data.reminders,
    surfaceClass: string,
    accentClass: string,
    isUrgent = false
  ) => {
    if (items.length === 0) return null;
    return (
      <section
        className={`border border-[var(--border-hairline)] p-5 sm:p-6 ${surfaceClass}`}
        style={{ borderRadius: '12px' }}
      >
        <div className="mb-3 flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
          <h2
            className={`inline-flex items-center gap-2 font-serif text-2xl font-medium ${accentClass}`}
          >
            {isUrgent && <AlertCircle className="h-4 w-4" />}
            {heading}
          </h2>
          <span className="text-xs text-[var(--text-muted)] tabular-nums">
            {items.length}
          </span>
        </div>

        <ul className="divide-y divide-[var(--border-subtle)]">
          {items.map((rem) => (
            <li
              key={rem.id}
              className="flex flex-col justify-between gap-3 py-3 first:pt-1 last:pb-1 sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => toggleReminder(rem.id)}
                className="flex flex-1 items-start gap-3 text-left"
              >
                <span
                  className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border ${
                    rem.completed
                      ? 'border-[var(--accent-sage)] bg-[var(--accent-sage)] text-[#F5F2EB]'
                      : 'border-[var(--border-hairline)] bg-[var(--bg-surface)]'
                  }`}
                >
                  {rem.completed && <Check className="h-3 w-3" strokeWidth={2.5} />}
                </span>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      rem.completed
                        ? 'text-[var(--text-muted)] line-through'
                        : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {rem.title}
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] tabular-nums">
                    <Clock className="h-3 w-3" />
                    {rem.dueDate} · {rem.dueTime}
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {!rem.completed && (
                  <button
                    type="button"
                    onClick={() => snoozeReminder(rem.id)}
                    className="rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-2.5 py-1 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] whitespace-nowrap shrink-0"
                  >
                    Snooze +1d
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteReminder(rem.id)}
                  className="rounded-md p-1.5 text-[var(--text-muted)] transition-colors hover:text-[var(--accent-clay)]"
                  aria-label={`Delete ${rem.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-hairline)] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent-clay)]">
            Urgency-Aware Rail
          </p>
          <h1 className="mt-1 font-serif text-4xl font-medium tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Reminders
          </h1>
        </div>
        <p className="text-xs text-[var(--text-secondary)] tabular-nums">
          {overdue.length + today.length + upcoming.length} active alerts
        </p>
      </div>

      {/* Quick Add Reminder */}
      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 gap-3 border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 sm:grid-cols-12"
        style={{ borderRadius: '10px' }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Remind me to..."
          className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm sm:col-span-6"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-xs tabular-nums sm:col-span-3"
        />
        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-xs tabular-nums sm:col-span-2"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1 rounded-lg bg-[var(--accent-primary)] px-3.5 py-2 text-xs font-medium text-[#F5F2EB] hover:bg-[var(--accent-primary-hover)] whitespace-nowrap shrink-0 sm:col-span-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Set
        </button>
      </form>

      <div className="space-y-6">
        {renderGroup(
          'Needs Attention (Overdue)',
          overdue,
          'bg-[var(--bg-clay-wash)]',
          'text-[var(--accent-clay)]',
          true
        )}
        {renderGroup(
          'Due Today',
          today,
          'bg-[var(--bg-blue-wash)]',
          'text-[var(--text-primary)]'
        )}
        {renderGroup(
          'Upcoming',
          upcoming,
          'bg-[var(--bg-surface)]',
          'text-[var(--text-primary)]'
        )}
        {renderGroup(
          'Resolved',
          completed,
          'bg-[var(--bg-recessed)] opacity-80',
          'text-[var(--text-secondary)]'
        )}
      </div>
    </div>
  );
};
