import { cn } from '../../lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-md bg-muted relative overflow-hidden',
        'after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-foreground/[0.04] after:to-transparent',
        'after:animate-[shimmer_2s_linear_infinite] after:bg-[length:200%_100%]',
        className,
      )}
    />
  );
}
