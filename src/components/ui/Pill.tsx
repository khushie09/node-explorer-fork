import type { ReactNode, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface PillProps {
  children: ReactNode;
  onClick?: MouseEventHandler;
  to?: string;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  'data-row-link'?: string;
}

const baseCls =
  'inline-flex items-center gap-1.5 h-7 px-2.5 text-[11px] font-medium ' +
  'border rounded-md select-none transition-all duration-150 whitespace-nowrap ' +
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-warm';

const restCls = 'border-border text-muted-foreground bg-transparent';
const interactiveCls = 'cursor-pointer hover:border-foreground/30 hover:text-foreground hover:bg-surface';
const activeCls = 'border-warm/50 text-warm-text bg-warm/5';

export function Pill({ children, onClick, to, active, disabled, className, ...rest }: PillProps) {
  const cls = cn(baseCls, active ? activeCls : restCls, (onClick || to) && !disabled && interactiveCls, className);

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(cls, 'disabled:opacity-30 disabled:cursor-not-allowed')}
        {...rest}
      >
        {children}
      </button>
    );
  }
  return (
    <span className={cls} {...rest}>
      {children}
    </span>
  );
}
