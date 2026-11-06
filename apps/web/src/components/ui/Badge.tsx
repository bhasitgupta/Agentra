import React from 'react';
import { cn } from '@/lib/utils';
import { TrustLabel } from '@/lib/types';
import { ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'trust' | 'category' | 'success' | 'failure' | 'warning' | 'violet';
  trustLabel?: TrustLabel;
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  trustLabel,
  size = 'sm',
  children,
  ...props
}: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  if (variant === 'trust' && trustLabel) {
    if (trustLabel === 'Established') {
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 font-medium rounded-full bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30',
            sizeClasses,
            className
          )}
          {...props}
        >
          <ShieldCheck className="w-3 h-3" />
          <span>Established</span>
        </span>
      );
    }
    if (trustLabel === 'Provisional') {
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1 font-medium rounded-full bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30',
            sizeClasses,
            className
          )}
          {...props}
        >
          <AlertCircle className="w-3 h-3" />
          <span>Provisional</span>
        </span>
      );
    }
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 font-medium rounded-full bg-[#CE1A1E]/15 text-[#CE1A1E] border border-[#CE1A1E]/30 border-dashed',
          sizeClasses,
          className
        )}
        {...props}
      >
        <Sparkles className="w-3 h-3" />
        <span>New</span>
      </span>
    );
  }

  const variants: Record<string, string> = {
    default: 'bg-[#223330]/60 text-[#E8EBE4] border border-[#4D524B]/40',
    outline: 'bg-transparent text-[#E8EBE4] border border-[#4D524B]/40',
    category: 'bg-[#223330]/50 text-[#CE1A1E] border border-[#4D524B]/50 font-mono',
    success: 'bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/30',
    failure: 'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/30',
    warning: 'bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30',
    violet: 'bg-[#65060E]/25 text-[#CE1A1E] border border-[#CE1A1E]/40',
    trust: 'bg-[#65060E]/25 text-[#CE1A1E] border border-[#CE1A1E]/40',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizeClasses,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}


