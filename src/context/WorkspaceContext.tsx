import React, { createContext, useContext, useEffect, useState } from 'react';
import { SEED_WORKSPACE } from '../data/seedData';
import {
  CalendarEvent,
  ListTone,
  MediaItem,
  MediaStatus,
  MediaType,
  NavView,
  PersonalList,
  ReminderItem,
  ShoppingCategory,
  ShoppingItem,
  TaskBucket,
  TaskItem,
  TaskPriority,
  ThemeMode,
  WorkspaceData,
} from '../types/workspace';

const STORAGE_KEY = 'atrium_workspace_v1';
const THEME_KEY = 'atrium_theme_v1';

interface WorkspaceContextValue {
  data: WorkspaceData;
  theme: ThemeMode;
  toggleTheme: () => void;
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  selectedMediaId: string | null;
  openMediaDetail: (id: string) => void;
  isQuickCaptureOpen: boolean;
  setQuickCaptureOpen: (open: boolean) => void;

  // Media actions
  addMedia: (input: {
    title: string;
    type: MediaType;
    status: MediaStatus;
    year: number;
    creator: string;
    genres: string[];
    runtime: string;
    synopsis: string;
    episodeCount?: number;
  }) => void;
  updateMediaStatus: (id: string, status: MediaStatus) => void;
  updateMediaRating: (id: string, rating: number | null) => void;
  updateMediaNotes: (id: string, notes: string) => void;
  toggleEpisode: (mediaId: string, seasonNumber: number, episodeId: string) => void;
  markNextEpisodeWatched: (mediaId: string) => void;
  toggleMovieWatched: (mediaId: string) => void;
  deleteMedia: (id: string) => void;

  // Task actions
  addTask: (input: {
    title: string;
    bucket: TaskBucket;
    priority: TaskPriority;
    category: string;
    notes?: string;
  }) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Shopping actions
  addShoppingItem: (input: {
    name: string;
    quantity: string;
    category: ShoppingCategory;
    estimatedPrice: number;
  }) => void;
  toggleShoppingItem: (id: string) => void;
  deleteShoppingItem: (id: string) => void;
  clearCheckedShopping: () => void;

  // Calendar actions
  addEvent: (input: Omit<CalendarEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;

  // List actions
  addList: (input: { title: string; subtitle: string; tone: ListTone }) => void;
  deleteList: (id: string) => void;
  addListItem: (listId: string, text: string, note?: string) => void;
  toggleListItem: (listId: string, itemId: string) => void;
  deleteListItem: (listId: string, itemId: string) => void;

  // Reminder actions
  addReminder: (input: { title: string; dueDate: string; dueTime: string }) => void;
  toggleReminder: (id: string) => void;
  snoozeReminder: (id: string) => void;
  deleteReminder: (id: string) => void;

  // Workspace reset
  resetWorkspace: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function loadInitialData(): WorkspaceData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WorkspaceData;
      if (parsed && Array.isArray(parsed.media) && Array.isArray(parsed.tasks)) {
        return parsed;
      }
    }
  } catch {
    // Fallback to seed data
  }
  return SEED_WORKSPACE;
}

function loadInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch {
    // Ignore storage error
  }
  return 'light';
}

const FALLBACK_POSTERS = [
  '/src/assets/images/poster_north_sea_1795264235725.jpg',
  '/src/assets/images/poster_kyoto_letters_1795264235384.jpg',
  '/src/assets/images/poster_glass_meridian_1795264235042.jpg',
  '/src/assets/images/poster_val_dorcia_1795264235858.jpg',
  '/src/assets/images/poster_salt_archive_1795264235870.jpg',
];

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WorkspaceData>(loadInitialData);
  const [theme, setTheme] = useState<ThemeMode>(loadInitialTheme);
  const [activeView, setActiveView] = useState<NavView>('overview');
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [isQuickCaptureOpen, setQuickCaptureOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore quota errors
    }
  }, [data]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore storage error
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const openMediaDetail = (id: string) => {
    setSelectedMediaId(id);
    setActiveView('cinema-detail');
  };

  const addMedia: WorkspaceContextValue['addMedia'] = (input) => {
    const posterIndex = data.media.length % FALLBACK_POSTERS.length;
    const posterUrl = FALLBACK_POSTERS[posterIndex];
    const epCount = input.type === 'series' ? Math.max(1, input.episodeCount ?? 6) : 0;

    const newItem: MediaItem = {
      id: makeId('media'),
      title: input.title.trim(),
      type: input.type,
      status: input.status,
      year: input.year || 2026,
      creator: input.creator.trim() || 'Independent',
      genres: input.genres.length > 0 ? input.genres : ['Drama'],
      runtime: input.runtime.trim() || (input.type === 'series' ? '45m / ep' : '1h 50m'),
      rating: null,
      posterUrl,
      backdropUrl: posterUrl,
      synopsis: input.synopsis.trim() || 'Added to your personal Atrium cinema journal.',
      personalNotes: '',
      watchedMovie: input.type === 'movie' ? input.status === 'completed' : undefined,
      seasons:
        input.type === 'series'
          ? [
              {
                seasonNumber: 1,
                title: 'Season 1',
                episodes: Array.from({ length: epCount }, (_, idx) => ({
                  id: makeId(`ep-${idx + 1}`),
                  number: idx + 1,
                  title: `Episode ${idx + 1}`,
                  duration: '45m',
                  watched: input.status === 'completed',
                })),
              },
            ]
          : undefined,
    };

    setData((prev) => ({
      ...prev,
      media: [newItem, ...prev.media],
    }));
  };

  const updateMediaStatus = (id: string, status: MediaStatus) => {
    setData((prev) => ({
      ...prev,
      media: prev.media.map((m) => (m.id === id ? { ...m, status } : m)),
    }));
  };

  const updateMediaRating = (id: string, rating: number | null) => {
    setData((prev) => ({
      ...prev,
      media: prev.media.map((m) => (m.id === id ? { ...m, rating } : m)),
    }));
  };

  const updateMediaNotes = (id: string, personalNotes: string) => {
    setData((prev) => ({
      ...prev,
      media: prev.media.map((m) => (m.id === id ? { ...m, personalNotes } : m)),
    }));
  };

  const toggleEpisode = (mediaId: string, seasonNumber: number, episodeId: string) => {
    setData((prev) => ({
      ...prev,
      media: prev.media.map((m) => {
        if (m.id !== mediaId || !m.seasons) return m;
        const seasons = m.seasons.map((s) => {
          if (s.seasonNumber !== seasonNumber) return s;
          return {
            ...s,
            episodes: s.episodes.map((ep) =>
              ep.id === episodeId ? { ...ep, watched: !ep.watched } : ep
            ),
          };
        });
        const allEps = seasons.flatMap((s) => s.episodes);
        const watchedCount = allEps.filter((e) => e.watched).length;
        let nextStatus = m.status;
        if (watchedCount === allEps.length && allEps.length > 0) {
          nextStatus = 'completed';
        } else if (watchedCount > 0 && m.status === 'planned') {
          nextStatus = 'watching';
        }
        return { ...m, seasons, status: nextStatus };
      }),
    }));
  };

  const markNextEpisodeWatched = (mediaId: string) => {
    setData((prev) => ({
      ...prev,
      media: prev.media.map((m) => {
        if (m.id !== mediaId || !m.seasons) return m;
        let marked = false;
        const seasons = m.seasons.map((s) => ({
          ...s,
          episodes: s.episodes.map((ep) => {
            if (!marked && !ep.watched) {
              marked = true;
              return { ...ep, watched: true };
            }
            return ep;
          }),
        }));
        const allEps = seasons.flatMap((s) => s.episodes);
        const watchedCount = allEps.filter((e) => e.watched).length;
        const nextStatus: MediaStatus =
          watchedCount === allEps.length && allEps.length > 0 ? 'completed' : 'watching';
        return { ...m, seasons, status: nextStatus };
      }),
    }));
  };

  const toggleMovieWatched = (mediaId: string) => {
    setData((prev) => ({
      ...prev,
      media: prev.media.map((m) => {
        if (m.id !== mediaId || m.type !== 'movie') return m;
        const watchedMovie = !m.watchedMovie;
        return {
          ...m,
          watchedMovie,
          status: watchedMovie ? 'completed' : 'watching',
        };
      }),
    }));
  };

  const deleteMedia = (id: string) => {
    setData((prev) => ({
      ...prev,
      media: prev.media.filter((m) => m.id !== id),
    }));
    if (selectedMediaId === id) {
      setSelectedMediaId(null);
      setActiveView('cinema');
    }
  };

  const addTask: WorkspaceContextValue['addTask'] = (input) => {
    const newTask: TaskItem = {
      id: makeId('task'),
      title: input.title.trim(),
      notes: input.notes?.trim() || undefined,
      bucket: input.bucket,
      priority: input.priority,
      category: input.category.trim() || 'Personal',
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  };

  const toggleTask = (id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  };

  const deleteTask = (id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  };

  const addShoppingItem: WorkspaceContextValue['addShoppingItem'] = (input) => {
    const item: ShoppingItem = {
      id: makeId('shop'),
      name: input.name.trim(),
      quantity: input.quantity.trim() || '1',
      category: input.category,
      estimatedPrice: Number.isFinite(input.estimatedPrice) ? input.estimatedPrice : 0,
      checked: false,
    };
    setData((prev) => ({ ...prev, shopping: [item, ...prev.shopping] }));
  };

  const toggleShoppingItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      shopping: prev.shopping.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)),
    }));
  };

  const deleteShoppingItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      shopping: prev.shopping.filter((s) => s.id !== id),
    }));
  };

  const clearCheckedShopping = () => {
    setData((prev) => ({
      ...prev,
      shopping: prev.shopping.filter((s) => !s.checked),
    }));
  };

  const addEvent: WorkspaceContextValue['addEvent'] = (input) => {
    const event: CalendarEvent = {
      ...input,
      id: makeId('evt'),
      title: input.title.trim(),
    };
    setData((prev) => ({
      ...prev,
      events: [...prev.events, event].sort((a, b) =>
        `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)
      ),
    }));
  };

  const deleteEvent = (id: string) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }));
  };

  const addList: WorkspaceContextValue['addList'] = (input) => {
    const list: PersonalList = {
      id: makeId('list'),
      title: input.title.trim(),
      subtitle: input.subtitle.trim() || 'Personal collection',
      tone: input.tone,
      items: [],
    };
    setData((prev) => ({ ...prev, lists: [list, ...prev.lists] }));
  };

  const deleteList = (id: string) => {
    setData((prev) => ({
      ...prev,
      lists: prev.lists.filter((l) => l.id !== id),
    }));
  };

  const addListItem = (listId: string, text: string, note?: string) => {
    if (!text.trim()) return;
    setData((prev) => ({
      ...prev,
      lists: prev.lists.map((l) =>
        l.id === listId
          ? {
              ...l,
              items: [
                ...l.items,
                { id: makeId('li'), text: text.trim(), note: note?.trim() || undefined, done: false },
              ],
            }
          : l
      ),
    }));
  };

  const toggleListItem = (listId: string, itemId: string) => {
    setData((prev) => ({
      ...prev,
      lists: prev.lists.map((l) =>
        l.id === listId
          ? {
              ...l,
              items: l.items.map((item) =>
                item.id === itemId ? { ...item, done: !item.done } : item
              ),
            }
          : l
      ),
    }));
  };

  const deleteListItem = (listId: string, itemId: string) => {
    setData((prev) => ({
      ...prev,
      lists: prev.lists.map((l) =>
        l.id === listId
          ? { ...l, items: l.items.filter((item) => item.id !== itemId) }
          : l
      ),
    }));
  };

  const addReminder: WorkspaceContextValue['addReminder'] = (input) => {
    const todayStr = '2026-11-21';
    let urgency: ReminderItem['urgency'] = 'upcoming';
    if (input.dueDate < todayStr) urgency = 'overdue';
    else if (input.dueDate === todayStr) urgency = 'today';

    const reminder: ReminderItem = {
      id: makeId('rem'),
      title: input.title.trim(),
      dueDate: input.dueDate,
      dueTime: input.dueTime || '09:00',
      urgency,
      completed: false,
    };
    setData((prev) => ({ ...prev, reminders: [reminder, ...prev.reminders] }));
  };

  const toggleReminder = (id: string) => {
    setData((prev) => ({
      ...prev,
      reminders: prev.reminders.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)),
    }));
  };

  const snoozeReminder = (id: string) => {
    setData((prev) => ({
      ...prev,
      reminders: prev.reminders.map((r) => {
        if (r.id !== id) return r;
        const base = new Date(`${r.dueDate}T12:00:00`);
        base.setDate(base.getDate() + 1);
        const nextDate = base.toISOString().slice(0, 10);
        return {
          ...r,
          dueDate: nextDate,
          urgency: nextDate === '2026-11-21' ? 'today' : 'upcoming',
        };
      }),
    }));
  };

  const deleteReminder = (id: string) => {
    setData((prev) => ({
      ...prev,
      reminders: prev.reminders.filter((r) => r.id !== id),
    }));
  };

  const resetWorkspace = () => {
    setData(SEED_WORKSPACE);
    setSelectedMediaId(null);
    setActiveView('overview');
  };

  return (
    <WorkspaceContext.Provider
      value={{
        data,
        theme,
        toggleTheme,
        activeView,
        setActiveView,
        selectedMediaId,
        openMediaDetail,
        isQuickCaptureOpen,
        setQuickCaptureOpen,
        addMedia,
        updateMediaStatus,
        updateMediaRating,
        updateMediaNotes,
        toggleEpisode,
        markNextEpisodeWatched,
        toggleMovieWatched,
        deleteMedia,
        addTask,
        toggleTask,
        deleteTask,
        addShoppingItem,
        toggleShoppingItem,
        deleteShoppingItem,
        clearCheckedShopping,
        addEvent,
        deleteEvent,
        addList,
        deleteList,
        addListItem,
        toggleListItem,
        deleteListItem,
        addReminder,
        toggleReminder,
        snoozeReminder,
        deleteReminder,
        resetWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error('useWorkspace must be used inside WorkspaceProvider');
  }
  return ctx;
}
