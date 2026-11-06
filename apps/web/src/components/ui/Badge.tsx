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
            'inline-flex items-center gap-1 font-medium rounded-full bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30',
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
          'inline-flex items-center gap-1 font-medium rounded-full bg-[#A78BFA]/10 text-[#A78BFA] border border-[#A78BFA]/30 border-dashed',
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
    default: 'bg-[#14142A] text-[#9B99C4] border border-[#1E1E3A]',
    outline: 'bg-transparent text-[#9B99C4] border border-[#2D2D52]',
    category: 'bg-[#14142A] text-[#A78BFA] border border-[#2E1065]',
    success: 'bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/30',
    failure: 'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/30',
    warning: 'bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30',
    violet: 'bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30',
    trust: 'bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/30',
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
