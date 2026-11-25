export type NavView =
  | 'overview'
  | 'cinema'
  | 'cinema-detail'
  | 'tasks'
  | 'shopping'
  | 'calendar'
  | 'lists'
  | 'reminders';

export type ThemeMode = 'light' | 'dark';

export type MediaType = 'movie' | 'series';

export type MediaStatus = 'watching' | 'completed' | 'planned' | 'dropped';

export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: string;
  watched: boolean;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  status: MediaStatus;
  year: number;
  creator: string;
  genres: string[];
  runtime: string;
  rating: number | null;
  posterUrl: string;
  backdropUrl: string;
  synopsis: string;
  personalNotes: string;
  featured?: boolean;
  seasons?: Season[];
  watchedMovie?: boolean;
}

export type TaskBucket = 'today' | 'upcoming' | 'later';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface TaskItem {
  id: string;
  title: string;
  notes?: string;
  bucket: TaskBucket;
  priority: TaskPriority;
  category: string;
  completed: boolean;
  createdAt: string;
}

export type ShoppingCategory = 'Produce & Pantry' | 'Home & Studio' | 'Errands';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: ShoppingCategory;
  estimatedPrice: number;
  checked: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  location?: string;
  category: 'Focus' | 'Personal' | 'Gathering' | 'Errand';
  notes?: string;
}

export type ListTone = 'dusty-blue' | 'sage' | 'clay' | 'stone';

export interface PersonalListItem {
  id: string;
  text: string;
  note?: string;
  done: boolean;
}

export interface PersonalList {
  id: string;
  title: string;
  subtitle: string;
  tone: ListTone;
  pinned?: boolean;
  items: PersonalListItem[];
}

export type ReminderUrgency = 'overdue' | 'today' | 'upcoming';

export interface ReminderItem {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string;
  urgency: ReminderUrgency;
  completed: boolean;
}

export interface WorkspaceData {
  userName: string;
  media: MediaItem[];
  tasks: TaskItem[];
  shopping: ShoppingItem[];
  events: CalendarEvent[];
  lists: PersonalList[];
  reminders: ReminderItem[];
}
