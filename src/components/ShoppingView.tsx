import React, { useMemo, useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ShoppingCategory } from '../types/workspace';

const CATEGORIES: ShoppingCategory[] = ['Produce & Pantry', 'Home & Studio', 'Errands'];

export const ShoppingView: React.FC = () => {
  const {
    data,
    addShoppingItem,
    toggleShoppingItem,
    deleteShoppingItem,
    clearCheckedShopping,
  } = useWorkspace();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState<ShoppingCategory>('Produce & Pantry');
  const [price, setPrice] = useState('');

  const { remainingCount, checkedCount, remainingTotal } = useMemo(() => {
    const remaining = data.shopping.filter((i) => !i.checked);
    const checked = data.shopping.filter((i) => i.checked);
    return {
      remainingCount: remaining.length,
      checkedCount: checked.length,
      remainingTotal: remaining.reduce((sum, i) => sum + i.estimatedPrice, 0),
    };
  }, [data.shopping]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addShoppingItem({
      name,
      quantity,
      category,
      estimatedPrice: parseFloat(price) || 0,
    });
    setName('');
    setQuantity('1');
    setPrice('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-hairline)] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent-sage)]">
            Tactile Checklist
          </p>
          <h1 className="mt-1 font-serif text-4xl font-medium tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Shopping
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)] tabular-nums">
          <span>{remainingCount} items remaining</span>
          <span>·</span>
          <span className="font-medium text-[var(--text-primary)]">
            Est. ${remainingTotal.toFixed(2)}
          </span>
          {checkedCount > 0 && (
            <button
              type="button"
              onClick={clearCheckedShopping}
              className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-recessed)] whitespace-nowrap shrink-0"
            >
              Clear Checked ({checkedCount})
            </button>
          )}
        </div>
      </div>

      {/* Add Item Form */}
      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 gap-3 border border-[var(--border-hairline)] bg-[var(--bg-sage-wash)] p-4 sm:grid-cols-12"
        style={{ borderRadius: '12px' }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add item (e.g., Fresh figs, linen twine)..."
          className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] sm:col-span-5"
        />
        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Qty"
          className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-2 text-xs sm:col-span-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ShoppingCategory)}
          className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-2 text-xs font-medium sm:col-span-3"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="number"
          step="0.5"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="$ Est."
          className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-2 text-xs tabular-nums sm:col-span-1"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1 rounded-lg bg-[var(--accent-sage)] px-3.5 py-2 text-xs font-medium text-[#F5F2EB] transition-opacity hover:opacity-90 whitespace-nowrap shrink-0 sm:col-span-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </form>

      {/* Three Category Columns */}
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const items = data.shopping.filter((i) => i.category === cat);
          const openItems = items.filter((i) => !i.checked).length;

          return (
            <section
              key={cat}
              className="flex flex-col border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6"
              style={{ borderRadius: '14px' }}
            >
              <div className="mb-4 flex items-baseline justify-between border-b border-dashed border-[var(--border-hairline)] pb-3">
                <h2 className="font-serif text-2xl font-medium text-[var(--text-primary)]">
                  {cat}
                </h2>
                <span className="text-xs text-[var(--text-muted)] tabular-nums">
                  {openItems} left
                </span>
              </div>

              {items.length > 0 ? (
                <ul className="divide-y divide-[var(--border-subtle)]">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="group flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"
                    >
                      <button
                        type="button"
                        onClick={() => toggleShoppingItem(item.id)}
                        className="flex flex-1 items-center gap-3 text-left min-w-0"
                      >
                        <span
                          className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-xs border transition-colors ${
                            item.checked
                              ? 'border-[var(--accent-sage)] bg-[var(--accent-sage)] text-[#F5F2EB]'
                              : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] group-hover:border-[var(--accent-sage)]'
                          }`}
                        >
                          {item.checked && <Check className="h-3 w-3" strokeWidth={2.5} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-sm ${
                              item.checked
                                ? 'text-[var(--text-muted)] line-through'
                                : 'text-[var(--text-primary)]'
                            }`}
                          >
                            {item.name}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] tabular-nums">
                            {item.quantity}
                            {item.estimatedPrice > 0 && ` · $${item.estimatedPrice.toFixed(2)}`}
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteShoppingItem(item.id)}
                        className="rounded p-1.5 text-[var(--text-muted)] opacity-60 transition-colors hover:text-[var(--accent-clay)] hover:opacity-100"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-sm italic text-[var(--text-muted)]">
                  Nothing needed in {cat}.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
