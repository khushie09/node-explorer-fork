import { Link } from 'react-router-dom';
import type { Repository } from '../../types/repo';
import { shortDid } from '../../lib/api';
import { usePrefetchRepo } from '../../hooks/usePrefetch';
import { useRepoActivity } from '../../hooks/useRepoActivity';
import { Pill } from '../ui/Pill';
import { CopyButton } from '../ui/CopyButton';
import { Sparkline } from './Sparkline';

interface RepoRowProps {
  repo: Repository;
  index: number;
}

export function RepoRow({ repo, index }: RepoRowProps) {
  const prefetch = usePrefetchRepo(repo.owner, repo.name);
  const { ref, activity } = useRepoActivity(repo.owner, repo.name);

  return (
    <li
      ref={ref}
      {...prefetch}
      className="group relative grid grid-cols-[14px_minmax(0,1fr)_auto] md:grid-cols-[20px_minmax(0,1fr)_130px_100px]
        items-start gap-x-3 md:gap-x-4 px-4 sm:px-5 py-4 md:py-4
        hover:bg-hover transition-colors duration-100 animate-fade-up motion-reduce:animate-none"
      style={{ animationDelay: `${index * 14}ms` }}
    >
      {/* Status dot */}
      <span aria-hidden="true" className="pt-[5px] text-[7px] leading-none text-status-dot group-hover:text-warm transition-colors select-none">
        ◆
      </span>

      {/* Identity + description */}
      <div className="min-w-0">
        <div className="flex items-center gap-x-2.5 gap-y-1.5 flex-wrap">
          <Link
            to={`/repos/${repo.owner}/${repo.name}`}
            data-row-link
            className="text-[13.5px] leading-snug outline-none min-w-0 font-medium
              after:absolute after:inset-0 after:content-['']
              focus-visible:after:ring-1 focus-visible:after:ring-warm focus-visible:after:ring-inset"
          >
            <span className="text-dim font-mono text-[12px]">{shortDid(repo.owner)}/</span>
            <span className="text-foreground break-all sm:break-normal">{repo.name}</span>
          </Link>

          <div className="relative z-10 flex items-center gap-1.5 flex-wrap">
            <Pill>{repo.branch}</Pill>
            <Pill>{repo.visibility}</Pill>
            <CopyButton value={`git clone ${repo.cloneUrl}`} label="clone" />
            {repo.isMirror && (
              <span className="text-[10px] text-dim tracking-wide">fork</span>
            )}
          </div>
        </div>

        {repo.description && (
          <p className="m-0 mt-1 text-[12px] leading-relaxed text-muted-foreground line-clamp-2 md:line-clamp-1">
            {repo.description}
          </p>
        )}
      </div>

      {/* Sparkline */}
      <div className="hidden md:flex justify-end self-center">
        <Sparkline data={activity} />
      </div>

      {/* Updated + stars */}
      <div className="pt-[2px] text-right whitespace-nowrap">
        <span className="block text-[11px] tabular-nums text-dim font-mono">
          {repo.updatedAt}
        </span>
        {repo.stars > 0 && (
          <span className="block mt-1 text-[11px] tabular-nums text-warm-text">★ {repo.stars}</span>
        )}
      </div>
    </li>
  );
}
