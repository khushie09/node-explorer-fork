import { CopyButton } from '../ui/CopyButton';
import { MicroLabel } from '../ui/MicroLabel';

interface ClonePanelProps {
  cloneUrl: string;
  onNavigate: (tab: string) => void;
}

export function ClonePanel({ cloneUrl, onNavigate }: ClonePanelProps) {
  const cloneCommand = `git clone ${cloneUrl}`;

  return (
    <div className="space-y-3">
      {/* Clone panel */}
      <div className="border border-border rounded-lg p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <MicroLabel className="mt-px">clone command</MicroLabel>
          <CopyButton value={cloneCommand} label="copy" />
        </div>
        <code className="block text-[11px] sm:text-[12.5px] break-all leading-[1.9] text-foreground bg-surface border border-border-inner rounded px-3 py-2">
          <span className="text-dim select-none">$ </span>{cloneCommand}
        </code>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onNavigate('code')}
          className="h-10 text-[12.5px] lowercase font-bold bg-foreground text-background rounded-md
            hover:opacity-90 transition-all duration-150 active:scale-[0.98] cursor-pointer
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warm focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          browse code →
        </button>
        <button
          type="button"
          onClick={() => onNavigate('pulls')}
          className="h-10 text-[12.5px] lowercase border border-border text-muted-foreground rounded-md
            hover:text-foreground hover:border-foreground/30 transition-all duration-150 active:scale-[0.98] cursor-pointer
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warm"
        >
          pull requests →
        </button>
      </div>
    </div>
  );
}
