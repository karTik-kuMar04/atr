import React, { useState } from 'react';
import {
  Bell,
  CalendarDays,
  CheckSquare,
  Compass,
  Film,
  ListTodo,
  Menu,
  Moon,
  Plus,
  RotateCcw,
  ShoppingBag,
  Sun,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useWorkspace } from '../context/WorkspaceContext';
import { NavView } from '../types/workspace';
import { CalendarView } from './CalendarView';
import { CinemaDetailView } from './CinemaDetailView';
import { CinemaLibraryView } from './CinemaLibraryView';
import { ListsView } from './ListsView';
import { OverviewView } from './OverviewView';
import { QuickCaptureModal } from './QuickCaptureModal';
import { RemindersView } from './RemindersView';
import { ShoppingView } from './ShoppingView';
import { TasksView } from './TasksView';

interface NavItem {
  id: NavView;
  label: string;
  icon: React.FC<{ className?: string }>;
  count?: number;
}

export const AppShell: React.FC = () => {
  const {
    data,
    theme,
    toggleTheme,
    activeView,
    setActiveView,
    setQuickCaptureOpen,
    resetWorkspace,
  } = useWorkspace();

  const date = Date();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const openTasksCount = data.tasks.filter((t) => !t.completed).length;
  const openShoppingCount = data.shopping.filter((s) => !s.checked).length;
  const activeRemindersCount = data.reminders.filter((r) => !r.completed).length;
  const watchingCount = data.media.filter((m) => m.status === 'watching').length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'cinema', label: 'Movies & Series', icon: Film, count: watchingCount },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: openTasksCount },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag, count: openShoppingCount },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'lists', label: 'Lists', icon: ListTodo, count: data.lists.length },
    { id: 'reminders', label: 'Reminders', icon: Bell, count: activeRemindersCount },
  ];

  const handleNavigate = (view: NavView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView />;
      case 'cinema':
        return <CinemaLibraryView />;
      case 'cinema-detail':
        return <CinemaDetailView />;
      case 'tasks':
        return <TasksView />;
      case 'shopping':
        return <ShoppingView />;
      case 'calendar':
        return <CalendarView />;
      case 'lists':
        return <ListsView />;
      case 'reminders':
        return <RemindersView />;
      default:
        return <OverviewView />;
    }
  };

  const isCinemaSection = activeView === 'cinema' || activeView === 'cinema-detail';

  const SidebarContent = (
    <div className="flex h-full flex-col justify-between px-4 py-6">
      <div className="space-y-8">
        {/* Brand Wordmark */}
        <div className="flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => handleNavigate('overview')}
            className="font-serif text-3xl font-medium tracking-tight text-[var(--text-primary)] whitespace-nowrap shrink-0"
          >
            Atrium
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-[var(--text-secondary)] lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1" aria-label="Workspace sections">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.id === 'cinema' ? isCinemaSection : activeView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs border border-[var(--border-hairline)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]/55 hover:text-[var(--text-primary)] border border-transparent'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 ${
                      active ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'
                    }`}
                  />
                  <span>{item.label}</span>
                </span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="text-xs text-[var(--text-muted)] tabular-nums">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Controls */}
      <div className="space-y-2 border-t border-[var(--border-subtle)] pt-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] whitespace-nowrap shrink-0"
        >
          <span className="flex items-center gap-2.5">
            {theme === 'light' ? (
              <Moon className="h-3.5 w-3.5" />
            ) : (
              <Sun className="h-3.5 w-3.5" />
            )}
            <span>{theme === 'light' ? 'Dark Sanctuary' : 'Warm Stone Light'}</span>
          </span>
        </button>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Starter Data</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-1">
            <button
              type="button"
              onClick={() => {
                resetWorkspace();
                setConfirmReset(false);
              }}
              className="flex-1 rounded-md bg-[var(--accent-clay)] px-2.5 py-1.5 text-xs font-medium text-[#F5F2EB]"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="rounded-md border border-[var(--border-hairline)] px-2.5 py-1.5 text-xs text-[var(--text-secondary)]"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="paper-grain flex min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-[var(--border-hairline)] bg-[var(--bg-recessed)] lg:sticky lg:top-0 lg:block lg:h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="h-full w-68 border-r border-[var(--border-hairline)] bg-[var(--bg-recessed)]"
            onClick={(e) => e.stopPropagation()}
          >
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Clean Single-Row Top Bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]/90 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-primary)] lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span className="font-serif text-xl font-medium text-[var(--text-primary)] lg:hidden">
              Atrium
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] lg:hidden"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setQuickCaptureOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary)] px-3.5 py-2 text-xs font-medium text-[#F5F2EB] transition-colors hover:bg-[var(--accent-primary-hover)] whitespace-nowrap shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              Quick Capture
            </button>
          </div>
        </header>

        {/* Active View Content */}
        <main className="mx-auto w-full max-w-[1260px] flex-1 px-4 pt-6 sm:px-8 sm:pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeView}-${activeView === 'cinema-detail' ? 'detail' : 'view'}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <QuickCaptureModal />
    </div>
  );
};
