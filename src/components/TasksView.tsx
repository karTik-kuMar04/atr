import React, { useMemo, useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { TaskBucket, TaskPriority } from '../types/workspace';

type BucketFilter = 'all' | TaskBucket | 'completed';

export const TasksView: React.FC = () => {
  const { data, addTask, toggleTask, deleteTask } = useWorkspace();

  const [bucketFilter, setBucketFilter] = useState<BucketFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');

  const [title, setTitle] = useState('');
  const [bucket, setBucket] = useState<TaskBucket>('today');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState('Personal');

  const filteredTasks = useMemo(() => {
    return data.tasks.filter((t) => {
      if (bucketFilter === 'completed' && !t.completed) return false;
      if (
        bucketFilter !== 'all' &&
        bucketFilter !== 'completed' &&
        (t.bucket !== bucketFilter || t.completed)
      ) {
        return false;
      }
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      return true;
    });
  }, [data.tasks, bucketFilter, priorityFilter]);

  const openCount = data.tasks.filter((t) => !t.completed).length;
  const completedCount = data.tasks.filter((t) => t.completed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title, bucket, priority, category });
    setTitle('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Structured Editorial Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-hairline)] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent-primary)]">
            Daily Ledger
          </p>
          <h1 className="mt-1 font-serif text-4xl font-medium tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Tasks
          </h1>
        </div>
        <p className="text-xs text-[var(--text-secondary)] tabular-nums">
          {openCount} active · {completedCount} completed
        </p>
      </div>

      {/* Inline Task Entry Bar */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 sm:grid-cols-12"
        style={{ borderRadius: '10px' }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a clear, actionable task..."
          className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] sm:col-span-5"
        />
        <select
          value={bucket}
          onChange={(e) => setBucket(e.target.value as TaskBucket)}
          className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-xs font-medium sm:col-span-2"
          aria-label="Task schedule"
        >
          <option value="today">Today</option>
          <option value="upcoming">Upcoming</option>
          <option value="later">Later</option>
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-xs font-medium sm:col-span-2"
          aria-label="Task priority"
        >
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-xs sm:col-span-2"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-medium text-[#F5F2EB] transition-colors hover:bg-[var(--accent-primary-hover)] whitespace-nowrap shrink-0 sm:col-span-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </form>

      {/* Filter Controls */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-recessed)] p-1">
          {(
            [
              { id: 'all', label: 'All Tasks' },
              { id: 'today', label: 'Today' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'later', label: 'Later' },
              { id: 'completed', label: 'Completed' },
            ] as { id: BucketFilter; label: string }[]
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setBucketFilter(f.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                bucketFilter === f.id
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[var(--text-muted)]">Priority:</span>
          {(['all', 'high', 'medium', 'low'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriorityFilter(p)}
              className={`rounded-md px-2.5 py-1 capitalize transition-colors whitespace-nowrap shrink-0 ${
                priorityFilter === p
                  ? 'bg-[var(--accent-primary)] text-[#F5F2EB]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-recessed)]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Minimal Flat Hairline-Separated Task Ledger */}
      <div className="border-t border-[var(--border-hairline)]">
        {filteredTasks.length > 0 ? (
          <ul className="divide-y divide-[var(--border-hairline)]">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="group flex items-center justify-between gap-4 px-2 py-4 transition-colors hover:bg-[var(--bg-surface)]/70 sm:px-4"
              >
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className="flex flex-1 items-start gap-3.5 text-left"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      task.completed
                        ? 'border-[var(--accent-sage)] bg-[var(--accent-sage)] text-[#F5F2EB]'
                        : 'border-[var(--border-hairline)] bg-[var(--bg-surface)] group-hover:border-[var(--accent-primary)]'
                    }`}
                  >
                    {task.completed && <Check className="h-3 w-3" strokeWidth={2.5} />}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium sm:text-base ${
                        task.completed
                          ? 'text-[var(--text-muted)] line-through'
                          : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.notes && (
                      <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                        {task.notes}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-[var(--text-muted)] capitalize">
                      {task.bucket} · {task.category} ·{' '}
                      <span
                        className={
                          task.priority === 'high' && !task.completed
                            ? 'font-medium text-[var(--accent-clay)]'
                            : ''
                        }
                      >
                        {task.priority} priority
                      </span>
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="rounded-lg p-2 text-[var(--text-muted)] opacity-70 transition-colors hover:bg-[var(--bg-recessed)] hover:text-[var(--accent-clay)] hover:opacity-100"
                  aria-label={`Delete ${task.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-12 text-center">
            <p className="font-serif text-2xl font-medium text-[var(--text-primary)]">
              Ledger clear for this view
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Add a task above or switch filters to review remaining items.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
