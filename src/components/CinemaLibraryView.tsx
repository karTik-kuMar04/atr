import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, PauseCircle, Plus, Search, Star, X } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { MediaItem, MediaStatus, MediaType } from '../types/workspace';
import { MediaArtwork } from './MediaArtwork';

const STATUS_FILTERS: { id: 'all' | MediaStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'watching', label: 'Watching' },
  { id: 'completed', label: 'Completed' },
  { id: 'planned', label: 'Planned' },
  { id: 'dropped', label: 'Dropped' },
];

export const CinemaLibraryView: React.FC = () => {
  const { data, openMediaDetail, addMedia, markNextEpisodeWatched } = useWorkspace();

  const [statusFilter, setStatusFilter] = useState<'all' | MediaStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | MediaType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Add Media Modal State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<MediaType>('movie');
  const [newStatus, setNewStatus] = useState<MediaStatus>('planned');
  const [newYear, setNewYear] = useState('2026');
  const [newCreator, setNewCreator] = useState('');
  const [newGenres, setNewGenres] = useState('Drama, Architecture');
  const [newEpisodes, setNewEpisodes] = useState('8');
  const [newSynopsis, setNewSynopsis] = useState('');

  const featuredItem = useMemo(() => {
    const watching = data.media.filter((m) => m.status === 'watching');
    return watching.find((m) => m.featured) ?? watching[0] ?? data.media[0];
  }, [data.media]);

  const filteredMedia = useMemo(() => {
    return data.media.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${item.title} ${item.creator} ${item.genres.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [data.media, statusFilter, typeFilter, searchQuery]);

  const countsByStatus = useMemo(() => {
    const counts: Record<'all' | MediaStatus, number> = {
      all: data.media.length,
      watching: 0,
      completed: 0,
      planned: 0,
      dropped: 0,
    };
    data.media.forEach((m) => {
      counts[m.status] += 1;
    });
    return counts;
  }, [data.media]);

  const getEpisodeProgress = (item: MediaItem) => {
    if (item.type === 'movie') {
      return { watched: item.watchedMovie ? 1 : 0, total: 1, pct: item.watchedMovie ? 100 : 0 };
    }
    const eps = item.seasons?.flatMap((s) => s.episodes) ?? [];
    const watched = eps.filter((e) => e.watched).length;
    const total = eps.length;
    return {
      watched,
      total,
      pct: total > 0 ? Math.round((watched / total) * 100) : 0,
    };
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addMedia({
      title: newTitle,
      type: newType,
      status: newStatus,
      year: parseInt(newYear, 10) || 2026,
      creator: newCreator,
      genres: newGenres
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean),
      runtime: newType === 'series' ? '48m / ep' : '1h 54m',
      synopsis: newSynopsis,
      episodeCount: newType === 'series' ? parseInt(newEpisodes, 10) || 6 : undefined,
    });
    setNewTitle('');
    setNewCreator('');
    setNewSynopsis('');
    setIsAddOpen(false);
  };

  const featuredProgress = featuredItem ? getEpisodeProgress(featuredItem) : null;

  return (
    <div className="space-y-9 pb-12">
      {/* Header Row */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-hairline)] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-[var(--accent-primary)]">
            Personal Archive
          </p>
          <h1 className="mt-1 font-serif text-4xl font-medium tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Movies & Series
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-[var(--accent-primary)] px-4 py-2.5 text-xs font-medium text-[#F5F2EB] transition-colors hover:bg-[var(--accent-primary-hover)] whitespace-nowrap shrink-0 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Title
        </button>
      </div>

      {/* Featured Cinematic Backdrop Banner */}
      {featuredItem && (
        <section
          className="relative overflow-hidden border border-[var(--border-hairline)] bg-[#1A2024] shadow-[var(--shadow-ambient)]"
          style={{ borderRadius: '18px' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="relative min-h-[260px] lg:col-span-7 lg:min-h-[340px]">
              <MediaArtwork
                src={featuredItem.backdropUrl}
                alt={featuredItem.title}
                title={featuredItem.title}
                className="h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181E22] via-[#181E22]/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#181E22]/40 lg:to-[#181E22]" />
            </div>

            <div className="flex flex-col justify-between bg-[#181E22] p-6 text-[#EAE4D9] sm:p-8 lg:col-span-5">
              <div className="space-y-3">
                <p className="text-xs font-medium tracking-widest uppercase text-[#9AB3C4]">
                  Featured Watching · {featuredItem.type === 'series' ? 'Series' : 'Film'}
                </p>
                <h2 className="font-serif text-3xl font-medium leading-tight text-[#F3EFE7] sm:text-4xl">
                  {featuredItem.title}
                </h2>
                <p className="text-xs text-[#B9B5AC] tabular-nums">
                  {featuredItem.creator} · {featuredItem.year} · {featuredItem.genres.join(' / ')}
                </p>
                <p className="line-clamp-3 text-sm leading-relaxed text-[#CFCAC0]">
                  {featuredItem.synopsis}
                </p>
              </div>

              <div className="mt-6 space-y-4 border-t border-white/10 pt-5">
                {featuredItem.type === 'series' && featuredProgress && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#C4CFD7] tabular-nums">
                      <span>
                        Episode {featuredProgress.watched} of {featuredProgress.total} watched
                      </span>
                      <span>{featuredProgress.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/12">
                      <div
                        className="h-full rounded-full bg-[#8FAEC2] transition-all duration-300"
                        style={{ width: `${featuredProgress.pct}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => openMediaDetail(featuredItem.id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#EAE4D9] px-4 py-2 text-xs font-medium text-[#1D2224] transition-colors hover:bg-white whitespace-nowrap shrink-0"
                  >
                    Open Journal & Episodes <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  {featuredItem.type === 'series' &&
                    featuredProgress &&
                    featuredProgress.watched < featuredProgress.total && (
                      <button
                        type="button"
                        onClick={() => markNextEpisodeWatched(featuredItem.id)}
                        className="rounded-lg border border-white/20 px-3.5 py-2 text-xs font-medium text-[#EAE4D9] transition-colors hover:bg-white/10 whitespace-nowrap shrink-0"
                      >
                        +1 Episode
                      </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-recessed)] p-1">
          {STATUS_FILTERS.map((f) => {
            const active = statusFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                  active
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {f.label} ({countsByStatus[f.id]})
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-recessed)] p-1">
            {(['all', 'movie', 'series'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors whitespace-nowrap shrink-0 ${
                  typeFilter === t
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t === 'all' ? 'All Formats' : t === 'movie' ? 'Movies' : 'Series'}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-60 sm:flex-initial">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, director..."
              className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] py-2 pl-8 pr-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          </div>
        </div>
      </div>

      {/* Curated Poster Gallery */}
      {filteredMedia.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredMedia.map((item) => {
            const prog = getEpisodeProgress(item);
            const isDropped = item.status === 'dropped';
            const isPlanned = item.status === 'planned';
            const isCompleted = item.status === 'completed';
            const isWatching = item.status === 'watching';

            return (
              <article key={item.id} className="group flex flex-col">
                <button
                  type="button"
                  onClick={() => openMediaDetail(item.id)}
                  className="text-left focus:outline-none"
                >
                  <div
                    className={`relative aspect-[3/4] overflow-hidden border transition-all duration-200 ${
                      isDropped
                        ? 'border-[var(--border-hairline)] opacity-75 saturate-75 group-hover:opacity-95'
                        : isPlanned
                        ? 'border-dashed border-[var(--border-hairline)] opacity-90 group-hover:opacity-100'
                        : 'border-[var(--border-hairline)] shadow-[var(--shadow-poster)] group-hover:-translate-y-1'
                    }`}
                    style={{ borderRadius: '12px' }}
                  >
                    <MediaArtwork
                      src={item.posterUrl}
                      alt={`${item.title} poster`}
                      title={item.title}
                      className="h-full w-full"
                      imgClassName="transition-transform duration-300 group-hover:scale-[1.04]"
                    />
                  </div>

                  {/* Editorial Typography Below Poster — No Pill Clutter */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-xl font-medium leading-snug text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] tabular-nums">
                      {item.type === 'series' ? 'Series' : 'Film'} · {item.year} · {item.creator}
                    </p>

                    {/* Distinct Status Presentation (Never Hue-Only) */}
                    {isWatching && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-xs font-medium text-[var(--accent-primary)] tabular-nums">
                          <span>Watching</span>
                          {item.type === 'series' ? (
                            <span>
                              Ep {prog.watched}/{prog.total}
                            </span>
                          ) : (
                            <span>In progress</span>
                          )}
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--bg-recessed)]">
                          <div
                            className="h-full rounded-full bg-[var(--accent-primary)]"
                            style={{
                              width: `${item.type === 'series' ? prog.pct : 50}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {isCompleted && (
                      <div className="flex items-center justify-between pt-1 text-xs font-medium text-[var(--accent-sage)] tabular-nums">
                        <span className="inline-flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" />
                          Completed
                        </span>
                        {item.rating !== null && (
                          <span className="inline-flex items-center gap-1 text-[var(--accent-ochre)]">
                            <Star className="h-3 w-3 fill-current" />
                            {item.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    )}

                    {isPlanned && (
                      <p className="pt-1 text-xs text-[var(--text-secondary)]">
                        Planned · {item.type === 'series' ? `${prog.total} episodes` : item.runtime}
                      </p>
                    )}

                    {isDropped && (
                      <p className="inline-flex items-center gap-1 pt-1 text-xs text-[var(--accent-clay)]">
                        <PauseCircle className="h-3.5 w-3.5" />
                        Dropped
                      </p>
                    )}
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-[var(--border-hairline)] bg-[var(--bg-recessed)] px-6 py-14 text-center" style={{ borderRadius: '14px' }}>
          <p className="font-serif text-2xl font-medium text-[var(--text-primary)]">
            No matching titles in this shelf
          </p>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            Try clearing your filters or add a new film or series to your archive.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('all');
              setTypeFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-medium text-[var(--text-primary)]"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Add Media Modal */}
      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsAddOpen(false)}
        >
          <div
            className="w-full max-w-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 text-[var(--text-primary)] shadow-[var(--shadow-ambient)]"
            style={{ borderRadius: '14px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <h2 className="font-serif text-2xl font-medium">Add Film or Series</h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-recessed)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Solaris"
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2 text-sm"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                    Format
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as MediaType)}
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm"
                  >
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as MediaStatus)}
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm"
                  >
                    <option value="watching">Watching</option>
                    <option value="planned">Planned</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                    Year
                  </label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                    Director / Creator
                  </label>
                  <input
                    type="text"
                    value={newCreator}
                    onChange={(e) => setNewCreator(e.target.value)}
                    placeholder="e.g., Andrei Tarkovsky"
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm"
                  />
                </div>
                {newType === 'series' ? (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                      Episodes
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={newEpisodes}
                      onChange={(e) => setNewEpisodes(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm tabular-nums"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                      Genres
                    </label>
                    <input
                      type="text"
                      value={newGenres}
                      onChange={(e) => setNewGenres(e.target.value)}
                      className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">
                  Synopsis
                </label>
                <textarea
                  rows={3}
                  value={newSynopsis}
                  onChange={(e) => setNewSynopsis(e.target.value)}
                  placeholder="Brief note or description..."
                  className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-[var(--border-subtle)] pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-recessed)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--accent-primary)] px-5 py-2 text-xs font-medium text-[#F5F2EB] hover:bg-[var(--accent-primary-hover)]"
                >
                  Add to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
