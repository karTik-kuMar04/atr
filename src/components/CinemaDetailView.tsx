import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Star, Trash2 } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { MediaStatus } from '../types/workspace';
import { MediaArtwork } from './MediaArtwork';

const STATUS_OPTIONS: { value: MediaStatus; label: string }[] = [
  { value: 'watching', label: 'Watching' },
  { value: 'completed', label: 'Completed' },
  { value: 'planned', label: 'Planned' },
  { value: 'dropped', label: 'Dropped' },
];

export const CinemaDetailView: React.FC = () => {
  const {
    data,
    selectedMediaId,
    setActiveView,
    updateMediaStatus,
    updateMediaRating,
    updateMediaNotes,
    toggleEpisode,
    markNextEpisodeWatched,
    toggleMovieWatched,
    deleteMedia,
  } = useWorkspace();

  const media = data.media.find((m) => m.id === selectedMediaId) ?? data.media[0];
  const [notesDraft, setNotesDraft] = useState(media?.personalNotes ?? '');
  const [savedNotice, setSavedNotice] = useState(false);
  const [activeSeason, setActiveSeason] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setNotesDraft(media?.personalNotes ?? '');
    setActiveSeason(media?.seasons?.[0]?.seasonNumber ?? 1);
    setConfirmDelete(false);
  }, [media?.id]);

  if (!media) {
    return (
      <div className="py-12 text-center">
        <p className="font-serif text-2xl">Title not found.</p>
        <button
          type="button"
          onClick={() => setActiveView('cinema')}
          className="mt-4 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-medium text-[#F5F2EB]"
        >
          Return to Library
        </button>
      </div>
    );
  }

  const allEpisodes = media.seasons?.flatMap((s) => s.episodes) ?? [];
  const watchedCount = allEpisodes.filter((e) => e.watched).length;
  const totalCount = allEpisodes.length;
  const progressPct =
    media.type === 'series'
      ? totalCount > 0
        ? Math.round((watchedCount / totalCount) * 100)
        : 0
      : media.watchedMovie
      ? 100
      : 0;

  const currentSeasonObj =
    media.seasons?.find((s) => s.seasonNumber === activeSeason) ?? media.seasons?.[0];

  const handleSaveNotes = () => {
    updateMediaNotes(media.id, notesDraft);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1800);
  };

  return (
    <div className="space-y-8 pb-14">
      {/* Immersive Cinematic Backdrop Hero */}
      <section
        className="relative overflow-hidden border border-[var(--border-hairline)] bg-[#171C1F] shadow-[var(--shadow-ambient)]"
        style={{ borderRadius: '18px' }}
      >
        <div className="relative h-[280px] sm:h-[360px] lg:h-[400px]">
          <MediaArtwork
            src={media.backdropUrl}
            alt={`${media.title} backdrop`}
            title={media.title}
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15191C] via-[#15191C]/55 to-[#15191C]/20" />

          {/* Top Back Action */}
          <div className="absolute left-5 top-5 sm:left-8 sm:top-7">
            <button
              type="button"
              onClick={() => setActiveView('cinema')}
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-black/35 px-3.5 py-2 text-xs font-medium text-[#F2EEE6] backdrop-blur-md transition-colors hover:bg-black/55 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Library
            </button>
          </div>

          {/* Bottom Expressive Title Lockup */}
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
            <p className="text-xs font-medium tracking-widest uppercase text-[#B5C6D1]">
              {media.type === 'series' ? 'Series Archive' : 'Feature Film'} · {media.status}
            </p>
            <h1 className="mt-1.5 font-serif text-4xl font-medium leading-tight text-[#F6F3EC] sm:text-5xl lg:text-6xl">
              {media.title}
            </h1>
            <p className="mt-2.5 text-sm text-[#D1CCC2] tabular-nums">
              Directed by {media.creator} · {media.year} · {media.runtime} ·{' '}
              {media.genres.join(' · ')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Two-Column Editorial Details */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left 8 Cols: Synopsis, Episodes / Progress, Personal Journal */}
        <div className="space-y-8 lg:col-span-8">
          {/* Synopsis */}
          <section className="border-b border-[var(--border-hairline)] pb-7">
            <h2 className="mb-3 font-serif text-2xl font-medium text-[var(--text-primary)]">
              Synopsis
            </h2>
            <p className="max-w-prose text-base leading-relaxed text-[var(--text-secondary)]">
              {media.synopsis}
            </p>
          </section>

          {/* Progress & Episodes Section */}
          {media.type === 'series' && media.seasons && (
            <section className="space-y-5">
              <div className="flex flex-col justify-between gap-4 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-end">
                <div>
                  <h2 className="font-serif text-2xl font-medium text-[var(--text-primary)]">
                    Episodes & Progress
                  </h2>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)] tabular-nums">
                    {watchedCount} of {totalCount} episodes completed ({progressPct}%)
                  </p>
                </div>

                {watchedCount < totalCount && (
                  <button
                    type="button"
                    onClick={() => markNextEpisodeWatched(media.id)}
                    className="inline-flex items-center gap-1.5 self-start rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-medium text-[#F5F2EB] transition-colors hover:bg-[var(--accent-primary-hover)] whitespace-nowrap shrink-0 sm:self-auto"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Mark Next Watched
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-recessed)]">
                <div
                  className="h-full rounded-full bg-[var(--accent-primary)] transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              {/* Season Tabs if more than 1 */}
              {media.seasons.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {media.seasons.map((s) => (
                    <button
                      key={s.seasonNumber}
                      type="button"
                      onClick={() => setActiveSeason(s.seasonNumber)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        activeSeason === s.seasonNumber
                          ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-hairline)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-recessed)]'
                      }`}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Episode List */}
              {currentSeasonObj && (
                <div className="overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-surface)]" style={{ borderRadius: '14px' }}>
                  <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-recessed)] px-5 py-3 text-xs font-medium text-[var(--text-secondary)]">
                    {currentSeasonObj.title}
                  </div>
                  <ul className="divide-y divide-[var(--border-subtle)]">
                    {currentSeasonObj.episodes.map((ep) => (
                      <li key={ep.id}>
                        <button
                          type="button"
                          onClick={() =>
                            toggleEpisode(media.id, currentSeasonObj.seasonNumber, ep.id)
                          }
                          className="group flex w-full items-center justify-between gap-4 px-5 py-3.5 text-left transition-colors hover:bg-[var(--bg-surface-hover)]"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                                ep.watched
                                  ? 'border-[var(--accent-sage)] bg-[var(--accent-sage)] text-[#F5F2EB]'
                                  : 'border-[var(--border-hairline)] bg-[var(--bg-canvas)] group-hover:border-[var(--accent-primary)]'
                              }`}
                            >
                              {ep.watched && <Check className="h-3 w-3" strokeWidth={2.5} />}
                            </span>
                            <span className="w-8 shrink-0 text-xs font-medium text-[var(--text-muted)] tabular-nums">
                              {String(ep.number).padStart(2, '0')}
                            </span>
                            <span
                              className={`truncate text-sm font-medium ${
                                ep.watched
                                  ? 'text-[var(--text-muted)] line-through'
                                  : 'text-[var(--text-primary)]'
                              }`}
                            >
                              {ep.title}
                            </span>
                          </div>
                          <span className="shrink-0 text-xs text-[var(--text-muted)] tabular-nums">
                            {ep.duration}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {media.type === 'movie' && (
            <section
              className="flex flex-col justify-between gap-4 border border-[var(--border-hairline)] bg-[var(--bg-recessed)] p-6 sm:flex-row sm:items-center"
              style={{ borderRadius: '14px' }}
            >
              <div>
                <h2 className="font-serif text-2xl font-medium text-[var(--text-primary)]">
                  Viewing Status
                </h2>
                <p className="mt-1 text-xs text-[var(--text-secondary)] tabular-nums">
                  Runtime {media.runtime} ·{' '}
                  {media.watchedMovie ? 'Marked as watched' : 'Currently in your queue'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleMovieWatched(media.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  media.watchedMovie
                    ? 'bg-[var(--accent-sage)] text-[#F5F2EB]'
                    : 'bg-[var(--accent-primary)] text-[#F5F2EB] hover:bg-[var(--accent-primary-hover)]'
                }`}
              >
                <Check className="h-4 w-4" />
                {media.watchedMovie ? 'Watched' : 'Mark Film Watched'}
              </button>
            </section>
          )}

          {/* Personal Notes / Journal */}
          <section className="space-y-3">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-serif text-2xl font-medium text-[var(--text-primary)]">
                Viewing Journal & Reflections
              </h2>
              {savedNotice && (
                <span className="text-xs font-medium text-[var(--accent-sage)]">
                  Saved to archive
                </span>
              )}
            </div>
            <textarea
              rows={4}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              onBlur={handleSaveNotes}
              placeholder="Write down scenes, cinematography notes, or personal impressions..."
              className="w-full rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-4 text-sm leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-recessed)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface)] whitespace-nowrap shrink-0"
              >
                Save Journal Entry
              </button>
            </div>
          </section>
        </div>

        {/* Right 4 Cols: Refined Info Panel, Poster & Rating */}
        <aside className="space-y-6 lg:col-span-4">
          <div
            className="border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-6 space-y-6"
            style={{ borderRadius: '16px' }}
          >
            {/* Poster Frame */}
            <div className="mx-auto max-w-[240px] lg:max-w-none">
              <MediaArtwork
                src={media.posterUrl}
                alt={media.title}
                title={media.title}
                className="aspect-[3/4] w-full rounded-xl border border-[var(--border-hairline)] shadow-[var(--shadow-poster)]"
              />
            </div>

            {/* Status Switcher */}
            <div>
              <p className="mb-2 text-xs font-medium text-[var(--text-secondary)]">
                Archive Status
              </p>
              <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-[var(--bg-recessed)] p-1">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateMediaStatus(media.id, opt.value)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      media.status === opt.value
                        ? 'bg-[var(--accent-primary)] text-[#F5F2EB]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Editorial Star Rating */}
            <div className="border-t border-[var(--border-subtle)] pt-5">
              <div className="mb-2 flex items-baseline justify-between">
                <p className="text-xs font-medium text-[var(--text-secondary)]">
                  Personal Rating
                </p>
                <span className="text-xs font-medium text-[var(--text-primary)] tabular-nums">
                  {media.rating !== null ? `${media.rating.toFixed(1)} / 5.0` : 'Unrated'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = (media.rating ?? 0) >= star;
                    const halfFilled = !filled && (media.rating ?? 0) >= star - 0.5;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          updateMediaRating(
                            media.id,
                            media.rating === star ? star - 0.5 : star
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--accent-ochre)] transition-transform hover:scale-105"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            filled
                              ? 'fill-current'
                              : halfFilled
                              ? 'fill-current opacity-50'
                              : 'text-[var(--text-muted)]'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                {media.rating !== null && (
                  <button
                    type="button"
                    onClick={() => updateMediaRating(media.id, null)}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Editorial Metadata Definition List */}
            <dl className="divide-y divide-[var(--border-subtle)] border-t border-[var(--border-subtle)] pt-2 text-xs">
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-[var(--text-muted)]">Director / Creator</dt>
                <dd className="font-medium text-right text-[var(--text-primary)]">
                  {media.creator}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-[var(--text-muted)]">Release Year</dt>
                <dd className="font-medium text-[var(--text-primary)] tabular-nums">
                  {media.year}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-[var(--text-muted)]">Runtime</dt>
                <dd className="font-medium text-[var(--text-primary)] tabular-nums">
                  {media.runtime}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2.5">
                <dt className="text-[var(--text-muted)]">Genres</dt>
                <dd className="font-medium text-right text-[var(--text-primary)]">
                  {media.genres.join(', ')}
                </dd>
              </div>
            </dl>

            {/* Delete Confirmation */}
            <div className="border-t border-[var(--border-subtle)] pt-4">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-clay)] hover:text-[var(--accent-clay)]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove from Library
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteMedia(media.id)}
                    className="flex-1 rounded-lg bg-[var(--accent-clay)] px-3 py-2 text-xs font-medium text-[#F5F2EB]"
                  >
                    Confirm Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-lg border border-[var(--border-hairline)] px-3 py-2 text-xs text-[var(--text-secondary)]"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
