import { cn } from '../../lib/utils';
import { Pill } from '../ui/Pill';
import { MicroLabel } from '../ui/MicroLabel';
import { Skeleton } from '../ui/Skeleton';

interface RepoHeroProps {
  totalCount: number;
  page: number;
  perPage: number;
  windowStart: number;
  windowEnd: number;
  refreshing: boolean;
  onRefresh: () => void;
  title?: string;
  indexLabel?: string;
  description?: React.ReactNode;
  countNoun?: string;
  statLabel?: string;
  cells?: { label: string; value: string }[];
}

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"
      className={spinning ? 'animate-spin-icon' : ''}>
      <path d="M10.5 6A4.5 4.5 0 1 1 6 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10.5 1.5v4H6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCell({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn('px-5 py-5 bg-surface/40', className)}>
      <MicroLabel className="block mb-3">{label}</MicroLabel>
      {value === '—' || value === '' ? (
        <Skeleton className="h-6 w-14" />
      ) : (
        <p className="text-[26px] font-bold leading-none tabular-nums text-foreground tracking-tight">
          {value}
        </p>
      )}
    </div>
  );
}

export function RepoHero({
  totalCount,
  page,
  perPage,
  windowStart,
  windowEnd,
  refreshing,
  onRefresh,
  title = 'repositories.',
  indexLabel = 'repo index',
  description,
  countNoun = 'repos',
  statLabel = 'visible repos',
  cells,
}: RepoHeroProps) {
  const statCells = cells ?? [
    { label: statLabel, value: totalCount > 0 ? totalCount.toLocaleString() : '—' },
    { label: 'page', value: String(page) },
    { label: 'per page', value: String(perPage) },
    {
      label: 'window',
      value: totalCount > 0 ? `${windowStart.toLocaleString()}–${windowEnd.toLocaleString()}` : '—',
    },
  ];

  return (
    <section className="mt-8 border border-border rounded-xl overflow-hidden grid-lines">

      {/* Top strip */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 h-11 border-b border-border bg-surface/60">
        <MicroLabel>{indexLabel}</MicroLabel>
        <div className="flex items-center gap-2.5">
          <span className="text-[12px] tabular-nums text-muted-foreground font-mono" aria-live="polite">
            {totalCount > 0 ? `${totalCount.toLocaleString()} ${countNoun}` : '—'}
          </span>
          <Pill onClick={onRefresh} disabled={refreshing} aria-label="refresh list">
            <RefreshIcon spinning={refreshing} />
            {refreshing ? 'refreshing' : 'refresh'}
          </Pill>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-10 px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex-1 min-w-0">
          <h1 className="text-[44px] sm:text-[60px] font-bold leading-[0.95] tracking-tighter text-foreground mb-5">
            {title}
          </h1>
          <div className="text-[13.5px] leading-[1.75] text-muted-foreground max-w-[520px]">
            {description ?? (
              <p className="m-0">
                Browse live repositories hosted on this gitlawb node. Clone them over{' '}
                <code className="text-warm-text font-mono text-[12px]">gitlawb://</code>, inspect ownership,
                check star counts, and jump directly into the full repo surface.
              </p>
            )}
          </div>
        </div>

        {/* 2×2 stats */}
        <div className="grid grid-cols-2 border border-border rounded-lg overflow-hidden shrink-0 w-full sm:w-[400px]">
          {statCells.slice(0, 4).map((cell, i) => (
            <StatCell
              key={cell.label}
              label={cell.label}
              value={cell.value}
              className={cn(
                i % 2 === 1 && 'border-l border-border',
                i >= 2 && 'border-t border-border',
              )}
            />
          ))}
        </div>
      </div>

    </section>
  );
}
