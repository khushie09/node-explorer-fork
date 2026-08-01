import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

const tabCls = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative inline-flex items-center h-11 px-1 text-[13px] font-medium tracking-tight border-b-2 -mb-px transition-all duration-200 shrink-0 whitespace-nowrap',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warm rounded-sm',
    isActive
      ? 'border-foreground text-foreground'
      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
  );

const SECTIONS = [
  { to: '/', label: 'overview', end: true },
  { to: '/repos', label: 'repositories' },
  { to: '/agents', label: 'agents' },
  { to: '/peers', label: 'peers' },
  { to: '/events', label: 'events' },
  { to: '/tasks', label: 'tasks' },
  { to: '/network', label: 'network' },
  { to: '/docs', label: 'docs' },
] as const;

export function ExploreTabs() {
  return (
    <nav
      aria-label="explore"
      className="flex gap-6 border-b border-border pt-2 overflow-x-auto scrollbar-none"
    >
      {SECTIONS.map(s => (
        <NavLink key={s.to} to={s.to} end={'end' in s && s.end} className={tabCls}>
          {s.label}
        </NavLink>
      ))}
    </nav>
  );
}
