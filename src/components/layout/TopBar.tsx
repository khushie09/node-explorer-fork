import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Logo } from '../ui/Logo';
import { useNodeStatus } from '../../hooks/useNodeStatus';

export default function TopBar() {
  const { node, stats } = useNodeStatus();

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border backdrop-blur-md bg-background/90">
      <div className="mx-auto flex h-full max-w-[1280px] items-center gap-4 px-4 sm:px-8 lg:px-12">

        {/* Left: branding */}
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0 min-w-0 group
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warm rounded-md"
        >
          <Logo className="h-5 w-auto shrink-0 text-foreground transition-opacity group-hover:opacity-80" />
          <span className="text-[13px] font-semibold text-foreground tracking-tight whitespace-nowrap transition-colors group-hover:text-muted-foreground">
            explorer
          </span>
        </Link>

        {/* Network badge */}
        {node?.network && (
          <span className="max-sm:hidden text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground border border-border rounded-md px-2 py-0.5 bg-surface">
            {node.network}
          </span>
        )}

        <div className="flex-1" />

        {/* Right: live counts + theme */}
        <div className="flex items-center gap-4 shrink-0">
          {stats && (
            <span className="hidden md:flex items-center gap-1.5 text-[11px] tabular-nums text-muted-foreground">
              <span className="text-foreground font-medium">{stats.repos.toLocaleString()}</span>
              <span className="text-dim">repos</span>
              <span className="text-dim mx-0.5">·</span>
              <span className="text-foreground font-medium">{stats.agents.toLocaleString()}</span>
              <span className="text-dim">agents</span>
            </span>
          )}
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}
