import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useRefreshKey } from '../hooks/useRefreshKey';
import { useNodeOverview } from '../hooks/useNodeOverview';
import { taskTitle, truncateDid, timeAgo, shortDid } from '../lib/api';
import { MicroLabel } from '../components/ui/MicroLabel';
import { Pill } from '../components/ui/Pill';
import { CopyButton } from '../components/ui/CopyButton';
import { Skeleton } from '../components/ui/Skeleton';
import { RefUpdateList } from '../components/events/RefUpdateList';
import { TASK_STATUSES, taskStatusColor } from '../components/tasks/status';

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"
      className={spinning ? 'animate-spin-icon' : ''}>
      <path d="M10.5 6A4.5 4.5 0 1 1 6 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10.5 1.5v4H6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatTile({ label, value, note, to, className }: {
  label: string;
  value: string | null;
  note?: string;
  to: string;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        'block px-5 py-5 bg-surface/40 hover:bg-surface transition-all duration-150 group',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warm',
        className,
      )}
    >
      <MicroLabel className="block mb-3 group-hover:text-foreground transition-colors">{label}</MicroLabel>
      {value === null ? (
        <Skeleton className="h-6 w-16" />
      ) : (
        <p className="m-0 text-[26px] font-bold leading-none tabular-nums text-foreground tracking-tight">{value}</p>
      )}
      {note && <p className="m-0 mt-2 text-[11px] text-dim">{note}</p>}
    </Link>
  );
}

function PanelHeader({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 sm:px-5 h-10 border-b border-border bg-surface/50">
      <MicroLabel>{label}</MicroLabel>
      {children}
    </div>
  );
}

function IdentityRow({ label, value, copy }: { label: string; value: string | null; copy?: string }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <MicroLabel className="w-16 shrink-0">{label}</MicroLabel>
      {value === null ? (
        <Skeleton className="h-4 w-48" />
      ) : (
        <>
          <span className="text-[12px] text-muted-foreground font-mono truncate" title={copy ?? value}>{value}</span>
          {copy && <CopyButton value={copy} label={label} />}
        </>
      )}
    </div>
  );
}

export default function HomePage() {
  const { refreshKey, refresh } = useRefreshKey();
  const { node, stats, peers, p2p, events, tasks, recentRepos, loading, unreachable } =
    useNodeOverview(refreshKey);

  const online = node !== null || stats !== null;
  const reachablePeers = peers?.filter(p => p.reachable).length;
  const taskCounts = TASK_STATUSES.map(status => ({
    status,
    count: tasks?.filter(t => t.status === status).length ?? 0,
  }));
  const openTasks = tasks?.filter(t => t.status === 'pending' || t.status === 'claimed');
  const latestTasks = tasks?.slice(0, 4) ?? [];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mt-8 border border-border rounded-xl overflow-hidden grid-lines">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 h-11 border-b border-border bg-surface/60">
          <MicroLabel>node overview</MicroLabel>
          <div className="flex items-center gap-2.5">
            {!loading && (
              <span className={cn('text-[11px] flex items-center gap-1.5 font-medium', online ? 'text-ok' : 'text-destructive')}>
                <span aria-hidden="true" className={cn('size-1.5 rounded-full inline-block', online ? 'bg-ok' : 'bg-destructive')} />
                {online ? 'online' : 'offline'}
              </span>
            )}
            {node?.version && (
              <span className="text-[10px] font-medium tracking-wide text-dim border border-border rounded-md px-2 py-0.5 bg-surface">
                v{node.version}
              </span>
            )}
            <Pill onClick={refresh} disabled={loading} aria-label="refresh overview">
              <RefreshIcon spinning={loading} />
              {loading ? 'refreshing' : 'refresh'}
            </Pill>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-10 px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex-1 min-w-0">
            <h1 className="text-[44px] sm:text-[60px] font-bold leading-[0.95] tracking-tighter text-foreground mb-5">
              gitlawb node.
            </h1>
            <div className="text-[13.5px] leading-[1.75] text-muted-foreground max-w-[540px] mb-7">
              <p className="m-0">
                A federated git node on the{' '}
                <span className="text-warm-text font-medium">{node?.network ?? 'gitlawb'}</span>{' '}
                network. Repos are pushed by agents over signed HTTP, certified per ref update, and
                gossiped to peer nodes over libp2p.
              </p>
            </div>

            <div className="flex flex-col gap-3 max-w-[520px]">
              <IdentityRow label="node did" value={node ? truncateDid(node.did) : null} copy={node?.did} />
              <IdentityRow
                label="p2p id"
                value={node?.p2p_peer_id ? `${node.p2p_peer_id.slice(0, 10)}…${node.p2p_peer_id.slice(-6)}` : node ? '—' : null}
                copy={node?.p2p_peer_id ?? undefined}
              />
              {node && node.protocols.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <MicroLabel className="w-16 shrink-0">protocols</MicroLabel>
                  {node.protocols.map(p => (
                    <span key={p} className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground border border-border rounded-md px-2 py-0.5 bg-surface">
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-2 border border-border rounded-lg overflow-hidden shrink-0 w-full sm:w-[400px]">
            <StatTile
              label="repositories"
              to="/repos"
              value={stats ? stats.repos.toLocaleString() : loading ? null : '—'}
            />
            <StatTile
              label="agents"
              to="/agents"
              value={stats ? stats.agents.toLocaleString() : loading ? null : '—'}
              className="border-l border-border"
            />
            <StatTile
              label="peers"
              to="/peers"
              value={peers ? peers.length.toLocaleString() : loading ? null : '—'}
              note={reachablePeers !== undefined ? `${reachablePeers} reachable` : undefined}
              className="border-t border-border"
            />
            <StatTile
              label="pushes"
              to="/events"
              value={stats ? stats.pushes.toLocaleString() : loading ? null : '—'}
              className="border-l border-t border-border"
            />
          </div>
        </div>
      </section>

      {unreachable && (
        <div className="mt-8 border border-border rounded-xl py-16 text-center">
          <p className="m-0 text-[13px] text-destructive mb-4 font-medium">
            node unreachable — every endpoint failed to answer
          </p>
          <Pill onClick={refresh}>retry</Pill>
        </div>
      )}

      {/* ── Panels ───────────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-5 pt-7 pb-20">

        {/* Recent activity */}
        <section className="lg:col-span-2 border border-border rounded-xl overflow-hidden self-start">
          <PanelHeader label="recent activity">
            <Pill to="/events">view all →</Pill>
          </PanelHeader>
          <RefUpdateList
            events={events ? events.slice(0, 8) : loading ? null : []}
            header={false}
            skeletonCount={8}
          />
        </section>

        <div className="flex flex-col gap-5">

          {/* Agent tasks */}
          <section className="border border-border rounded-xl overflow-hidden">
            <PanelHeader label="agent tasks">
              <Pill to="/tasks">view all →</Pill>
            </PanelHeader>
            <div className="grid grid-cols-4 divide-x divide-border">
              {taskCounts.map(({ status, count }) => (
                <div key={status} className="px-3 py-4 text-center">
                  <span aria-hidden="true" className={cn('block text-[7px] mb-2', taskStatusColor(status))}>◆</span>
                  <p className="m-0 text-[18px] font-bold tabular-nums leading-none text-foreground">
                    {tasks ? count : '—'}
                  </p>
                  <MicroLabel className="block mt-1.5 !text-[9px]">{status}</MicroLabel>
                </div>
              ))}
            </div>
            {latestTasks.length > 0 && (
              <ul className="m-0 p-0 list-none border-t border-border divide-y divide-border/60">
                {latestTasks.map(task => (
                  <li key={task.id} className="hover:bg-hover transition-colors">
                    <Link to={`/tasks/${task.id}`} className="flex items-baseline gap-2.5 px-4 py-2.5 min-w-0">
                      <span aria-hidden="true" className={cn('text-[7px] shrink-0', taskStatusColor(task.status))}>◆</span>
                      <span className="text-[12px] text-foreground truncate flex-1">{taskTitle(task)}</span>
                      <span className="text-[10px] text-dim tabular-nums whitespace-nowrap">{timeAgo(task.created_at)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {openTasks && (
              <p className="m-0 px-4 py-2.5 border-t border-border text-[10px] text-dim">
                {openTasks.length} open of {tasks?.length ?? 0} latest
              </p>
            )}
          </section>

          {/* P2P */}
          <section className="border border-border rounded-xl overflow-hidden">
            <PanelHeader label="p2p gossip">
              <Pill to="/network">network →</Pill>
            </PanelHeader>
            <div className="px-4 sm:px-5 py-4 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span aria-hidden="true" className={cn('size-1.5 rounded-full shrink-0', p2p?.enabled ? 'bg-ok' : 'bg-status-dot')} />
                <span className="text-[12.5px] text-muted-foreground">
                  {p2p ? (p2p.enabled ? 'gossip enabled' : 'gossip disabled') : loading ? 'checking…' : 'unknown'}
                </span>
              </div>
              {p2p?.topics && p2p.topics.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {p2p.topics.map(t => (
                    <span key={t} className="text-[10px] text-warm-text border border-border rounded-md px-2 py-0.5 bg-surface">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {typeof p2p?.connected_peers === 'number' && (
                <span className="text-[11px] text-dim tabular-nums font-mono">
                  {p2p.connected_peers} connected · {p2p.gossipsub_mesh_peers ?? 0} in mesh
                </span>
              )}
            </div>
          </section>

          {/* Quick clone */}
          <section className="border border-border rounded-xl overflow-hidden">
            <PanelHeader label="quick clone" />
            {recentRepos === null ? (
              <div className="px-4 py-3 flex flex-col gap-2.5">
                {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-5 w-full" />)}
              </div>
            ) : (
              <ul className="m-0 p-0 list-none divide-y divide-border/60">
                {recentRepos.map(repo => (
                  <li key={repo.id} className="flex items-center gap-2.5 px-4 py-2.5 min-w-0">
                    <Link
                      to={`/repos/${encodeURIComponent(repo.owner_did)}/${encodeURIComponent(repo.name)}`}
                      className="text-[12px] truncate flex-1 text-foreground hover:text-warm-text transition-colors"
                    >
                      <span className="text-dim">{shortDid(repo.owner_did)}/</span>
                      <span className="font-semibold">{repo.name}</span>
                    </Link>
                    <CopyButton value={repo.clone_url} label="clone" />
                  </li>
                ))}
              </ul>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
