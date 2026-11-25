import React, { useState } from 'react';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ListTone } from '../types/workspace';

const TONE_SURFACE: Record<ListTone, string> = {
  'dusty-blue': 'bg-[var(--bg-blue-wash)]',
  sage: 'bg-[var(--bg-sage-wash)]',
  clay: 'bg-[var(--bg-clay-wash)]',
  stone: 'bg-[var(--bg-surface)]',
};

export const ListsView: React.FC = () => {
  const { data, addList, deleteList, addListItem, toggleListItem, deleteListItem } =
    useWorkspace();

  const [itemDrafts, setItemDrafts] = useState<Record<string, string>>({});
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newTone, setNewTone] = useState<ListTone>('dusty-blue');

  const handleAddItem = (e: React.FormEvent, listId: string) => {
    e.preventDefault();
    const val = itemDrafts[listId] ?? '';
    if (!val.trim()) return;
    addListItem(listId, val);
    setItemDrafts((prev) => ({ ...prev, [listId]: '' }));
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addList({ title: newTitle, subtitle: newSubtitle, tone: newTone });
    setNewTitle('');
    setNewSubtitle('');
    setIsNewOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-hairline)] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent-primary)]">
            Personal Collections
          </p>
          <h1 className="mt-1 font-serif text-4xl font-medium tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Lists & Notes
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setIsNewOpen(true)}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-xs font-medium text-[#F5F2EB] transition-colors hover:bg-[var(--accent-primary-hover)] whitespace-nowrap shrink-0 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          New Collection
        </button>
      </div>

      {/* Expressive Multi-Tone Collection Grid */}
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        {data.lists.map((list) => {
          const completed = list.items.filter((i) => i.done).length;
          return (
            <section
              key={list.id}
              className={`flex flex-col justify-between border border-[var(--border-hairline)] p-6 sm:p-7 ${TONE_SURFACE[list.tone]}`}
              style={{ borderRadius: '16px' }}
            >
              <div>
                <div className="mb-4 flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
                  <div>
                    <h2 className="font-serif text-3xl font-medium leading-tight text-[var(--text-primary)]">
                      {list.title}
                    </h2>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {list.subtitle} ·{' '}
                      <span className="tabular-nums">
                        {completed}/{list.items.length} checked
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteList(list.id)}
                    className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--accent-clay)]"
                    aria-label={`Delete ${list.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <ul className="divide-y divide-[var(--border-subtle)]">
                  {list.items.map((item) => (
                    <li
                      key={item.id}
                      className="group flex items-start justify-between gap-3 py-3 first:pt-1"
                    >
                      <button
                        type="button"
                        onClick={() => toggleListItem(list.id, item.id)}
                        className="flex flex-1 items-start gap-3 text-left"
                      >
                        <span
                          className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                            item.done
                              ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[#F5F2EB]'
                              : 'border-[var(--border-hairline)] bg-[var(--bg-surface)]'
                          }`}
                        >
                          {item.done && <Check className="h-2.5 w-2.5" strokeWidth={2.5} />}
                        </span>
                        <div className="min-w-0">
                          <p
                            className={`text-sm ${
                              item.done
                                ? 'text-[var(--text-muted)] line-through'
                                : 'text-[var(--text-primary)]'
                            }`}
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

                      <button
                        type="button"
                        onClick={() => deleteListItem(list.id, item.id)}
                        className="rounded p-1 text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100 hover:text-[var(--accent-clay)]"
                        aria-label={`Remove ${item.text}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                  {list.items.length === 0 && (
                    <li className="py-5 text-sm italic text-[var(--text-muted)]">
                      No entries yet—add your first item below.
                    </li>
                  )}
                </ul>
              </div>

              <form
                onSubmit={(e) => handleAddItem(e, list.id)}
                className="mt-5 flex items-center gap-2 border-t border-[var(--border-subtle)] pt-4"
              >
                <input
                  type="text"
                  value={itemDrafts[list.id] ?? ''}
                  onChange={(e) =>
                    setItemDrafts((prev) => ({ ...prev, [list.id]: e.target.value }))
                  }
                  placeholder="Add an entry..."
                  className="flex-1 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-2 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                />
                <button
                  type="submit"
                  className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-recessed)] whitespace-nowrap shrink-0"
                >
                  Add
                </button>
              </form>
            </section>
          );
        })}
      </div>

      {/* Create New List Modal */}
      {isNewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsNewOpen(false)}
        >
          <div
            className="w-full max-w-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 text-[var(--text-primary)] shadow-[var(--shadow-ambient)]"
            style={{ borderRadius: '14px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h2 className="font-serif text-2xl font-medium">New Collection</h2>
              <button
                type="button"
                onClick={() => setIsNewOpen(false)}
                className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-recessed)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateList} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                  Collection Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Autumn Film Festival Picks"
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2 text-sm"
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                  Subtitle / Note
                </label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="e.g., Screening notes and recommendations"
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">
                  Surface Tone
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'dusty-blue', label: 'Dusty Blue' },
                      { id: 'sage', label: 'Sage' },
                      { id: 'clay', label: 'Clay' },
                      { id: 'stone', label: 'Stone' },
                    ] as { id: ListTone; label: string }[]
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewTone(t.id)}
                      className={`rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors ${
                        newTone === t.id
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[#F5F2EB]'
                          : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-recessed)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-medium text-[#F5F2EB]"
                >
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
