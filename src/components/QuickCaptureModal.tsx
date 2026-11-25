import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ShoppingCategory, TaskBucket, TaskPriority } from '../types/workspace';

type CaptureTab = 'task' | 'shopping' | 'reminder' | 'event';

export const QuickCaptureModal: React.FC = () => {
  const {
    isQuickCaptureOpen,
    setQuickCaptureOpen,
    addTask,
    addShoppingItem,
    addReminder,
    addEvent,
  } = useWorkspace();

  const [tab, setTab] = useState<CaptureTab>('task');

  // Task state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskBucket, setTaskBucket] = useState<TaskBucket>('today');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskCategory, setTaskCategory] = useState('Personal');

  // Shopping state
  const [shopName, setShopName] = useState('');
  const [shopQty, setShopQty] = useState('1');
  const [shopCat, setShopCat] = useState<ShoppingCategory>('Produce & Pantry');
  const [shopPrice, setShopPrice] = useState('');

  // Reminder state
  const [remTitle, setRemTitle] = useState('');
  const [remDate, setRemDate] = useState('2026-11-21');
  const [remTime, setRemTime] = useState('15:00');

  // Event state
  const [evtTitle, setEvtTitle] = useState('');
  const [evtDate, setEvtDate] = useState('2026-11-21');
  const [evtStart, setEvtStart] = useState('14:00');
  const [evtEnd, setEvtEnd] = useState('15:00');
  const [evtLocation, setEvtLocation] = useState('');

  if (!isQuickCaptureOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'task' && taskTitle.trim()) {
      addTask({
        title: taskTitle,
        bucket: taskBucket,
        priority: taskPriority,
        category: taskCategory,
      });
      setTaskTitle('');
      setQuickCaptureOpen(false);
    } else if (tab === 'shopping' && shopName.trim()) {
      addShoppingItem({
        name: shopName,
        quantity: shopQty,
        category: shopCat,
        estimatedPrice: parseFloat(shopPrice) || 0,
      });
      setShopName('');
      setShopPrice('');
      setQuickCaptureOpen(false);
    } else if (tab === 'reminder' && remTitle.trim()) {
      addReminder({
        title: remTitle,
        dueDate: remDate,
        dueTime: remTime,
      });
      setRemTitle('');
      setQuickCaptureOpen(false);
    } else if (tab === 'event' && evtTitle.trim()) {
      addEvent({
        title: evtTitle,
        date: evtDate,
        startTime: evtStart,
        endTime: evtEnd,
        location: evtLocation.trim() || undefined,
        category: 'Personal',
      });
      setEvtTitle('');
      setEvtLocation('');
      setQuickCaptureOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-capture-title"
      onClick={() => setQuickCaptureOpen(false)}
    >
      <div
        className="w-full max-w-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 text-[var(--text-primary)] shadow-[var(--shadow-ambient)]"
        style={{ borderRadius: '14px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div>
            <p className="text-xs tracking-wider text-[var(--text-muted)]">Quick Entry</p>
            <h2 id="quick-capture-title" className="font-serif text-2xl font-medium">
              Add to Atrium
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setQuickCaptureOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-recessed)]"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Segmented tab bar */}
        <div className="mb-5 grid grid-cols-4 gap-1 rounded-lg bg-[var(--bg-recessed)] p-1">
          {(['task', 'shopping', 'reminder', 'event'] as CaptureTab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors whitespace-nowrap shrink-0 ${
                tab === t
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'task' && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                  Task description
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g., Draft reading notes on architecture"
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                    Schedule
                  </label>
                  <select
                    value={taskBucket}
                    onChange={(e) => setTaskBucket(e.target.value as TaskBucket)}
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm"
                  >
                    <option value="today">Today</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="later">Later</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                    Category
                  </label>
                  <input
                    type="text"
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {tab === 'shopping' && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                  Item name
                </label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g., Fresh sourdough loaf"
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                    Quantity
                  </label>
                  <input
                    type="text"
                    value={shopQty}
                    onChange={(e) => setShopQty(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                    Section
                  </label>
                  <select
                    value={shopCat}
                    onChange={(e) => setShopCat(e.target.value as ShoppingCategory)}
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm"
                  >
                    <option value="Produce & Pantry">Produce & Pantry</option>
                    <option value="Home & Studio">Home & Studio</option>
                    <option value="Errands">Errands</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                    Est. Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={shopPrice}
                    onChange={(e) => setShopPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm tabular-nums"
                  />
                </div>
              </div>
            </>
          )}

          {tab === 'reminder' && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                  Reminder note
                </label>
                <input
                  type="text"
                  required
                  value={remTitle}
                  onChange={(e) => setRemTitle(e.target.value)}
                  placeholder="e.g., Confirm dinner reservation"
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                    Date
                  </label>
                  <input
                    type="date"
                    value={remDate}
                    onChange={(e) => setRemDate(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                    Time
                  </label>
                  <input
                    type="time"
                    value={remTime}
                    onChange={(e) => setRemTime(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm tabular-nums"
                  />
                </div>
              </div>
            </>
          )}

          {tab === 'event' && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                  Event title
                </label>
                <input
                  type="text"
                  required
                  value={evtTitle}
                  onChange={(e) => setEvtTitle(e.target.value)}
                  placeholder="e.g., Gallery exhibition preview"
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                    Date
                  </label>
                  <input
                    type="date"
                    value={evtDate}
                    onChange={(e) => setEvtDate(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                    Start
                  </label>
                  <input
                    type="time"
                    value={evtStart}
                    onChange={(e) => setEvtStart(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                    End
                  </label>
                  <input
                    type="time"
                    value={evtEnd}
                    onChange={(e) => setEvtEnd(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={evtLocation}
                  onChange={(e) => setEvtLocation(e.target.value)}
                  placeholder="e.g., Civic Reading Room"
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-[var(--border-subtle)] pt-4">
            <button
              type="button"
              onClick={() => setQuickCaptureOpen(false)}
              className="rounded-lg px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-recessed)] whitespace-nowrap shrink-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[var(--accent-primary)] px-5 py-2 text-sm font-medium text-[#F5F2EB] transition-colors hover:bg-[var(--accent-primary-hover)] whitespace-nowrap shrink-0"
            >
              Save to Atrium
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
