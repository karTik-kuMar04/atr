import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface EditorialDateDisplayProps {
  date?: Date;
  onOpenCalendar?: () => void;
}

function getSeasonLabel(monthIndex: number): string {
  if (monthIndex >= 2 && monthIndex <= 4) return 'Spring';
  if (monthIndex >= 5 && monthIndex <= 7) return 'Summer';
  if (monthIndex >= 8 && monthIndex <= 10) return 'Autumn';
  return 'Winter';
}

function getIsoWeekNumber(d: Date): number {
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getDayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff =
    d.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / 86400000);
}

export const EditorialDateDisplay: React.FC<EditorialDateDisplayProps> = ({
  date = new Date(),
  onOpenCalendar,
}) => {
  const dayNumber = String(date.getDate()).padStart(2, '0');
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();

  const season = getSeasonLabel(date.getMonth());
  const weekNumber = getIsoWeekNumber(date);
  const dayOfYear = getDayOfYear(date);
  const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();
  const monthProgressPct = Math.round((date.getDate() / daysInMonth) * 100);

  return (
    <div
      className="dashboard-card-hover relative flex w-full flex-col justify-between border border-[var(--border-hairline)] bg-[var(--bg-surface)]/85 px-6 py-5 shadow-[var(--shadow-ambient)] backdrop-blur-xs lg:w-auto lg:min-w-[330px]"
      style={{ borderRadius: '14px' }}
    >
      {/* Top Archival Metadata Bar */}
      <div className="flex items-center justify-between gap-6 border-b border-[var(--border-subtle)] pb-2.5 text-[11px] font-medium tracking-[0.14em] uppercase text-[var(--text-muted)] tabular-nums">
        <span>
          {season} · Week {weekNumber}
        </span>
        <span>Day {dayOfYear} / 365</span>
      </div>

      {/* Central Sculptural Cormorant Garamond Lockup */}
      <div className="my-4 flex items-center gap-5">
        <span
          className="font-serif text-7xl font-normal leading-[0.82] tracking-tight text-[var(--text-primary)] tabular-nums sm:text-[5.25rem]"
          aria-label={`Day ${dayNumber}`}
        >
          {dayNumber}
        </span>

        <div className="h-12 w-px bg-[var(--border-hairline)]" aria-hidden="true" />

        <div className="space-y-1">
          <p className="font-serif text-2xl font-medium italic leading-none text-[var(--accent-primary)] sm:text-3xl">
            {weekday}
          </p>
          <p className="text-xs font-medium tracking-[0.18em] uppercase text-[var(--text-secondary)] tabular-nums">
            {monthName} {year}
          </p>
        </div>
      </div>

      {/* Bottom Month Cadence & Calendar Affordance */}
      <div className="space-y-2 border-t border-[var(--border-subtle)] pt-3">
        <div className="h-px w-full overflow-hidden bg-[var(--border-subtle)]">
          <div
            className="h-full bg-[var(--accent-primary)] transition-all duration-300"
            style={{ width: `${monthProgressPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between gap-4 text-[11px] text-[var(--text-muted)] tabular-nums">
          <span>
            {monthName} · {monthProgressPct}% elapsed
          </span>
          {onOpenCalendar && (
            <button
              type="button"
              onClick={onOpenCalendar}
              className="inline-flex items-center gap-1 font-medium text-[var(--accent-primary)] transition-colors hover:underline whitespace-nowrap shrink-0"
            >
              Calendar
              <ArrowUpRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
