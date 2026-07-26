import { CopyButton } from '../ui/CopyButton';
import { truncateDid } from '../../lib/api';
import { useNodeStatus } from '../../hooks/useNodeStatus';

export default function Footer() {
  const { node, stats } = useNodeStatus();
  const version = node?.version ?? stats?.version;

  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 sm:px-8 lg:px-12 py-5">
        <span className="text-[11px] text-muted-foreground whitespace-nowrap flex items-center gap-2">
          <span className="font-medium text-foreground">gitlawb explorer</span>
          {version && <span className="text-dim">v{version}</span>}
          {node?.network && <span className="text-dim">· {node.network}</span>}
        </span>

        {node?.did && (
          <span className="flex items-center gap-2 min-w-0 text-[11px] text-muted-foreground">
            <span title={node.did} className="text-dim font-mono whitespace-nowrap">
              {truncateDid(node.did)}
            </span>
            <CopyButton value={node.did} label="did" />
          </span>
        )}
      </div>
    </footer>
  );
}
