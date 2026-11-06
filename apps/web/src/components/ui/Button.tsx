'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-[#CE1A1E] hover:bg-[#65060E] text-white border border-[#CE1A1E]/60 shadow-sm shadow-[#CE1A1E]/20',
  secondary:
    'bg-[#223330] hover:bg-[#2a3a37] text-[#E8EBE4] border border-[rgba(131,127,120,0.32)] hover:border-[rgba(131,127,120,0.55)]',
  outline:
    'bg-transparent hover:bg-[#223330] text-[#E8EBE4] border border-[rgba(131,127,120,0.40)] hover:border-[#CE1A1E]/50',
  ghost:
    'bg-transparent hover:bg-[#223330] text-[#A8ADA6] hover:text-[#E8EBE4] border border-transparent',
  destructive:
    'bg-[#65060E]/20 text-[#CE1A1E] border border-[#CE1A1E]/30 hover:bg-[#65060E]/35',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, children, disabled, ...props },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CE1A1E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#081919]',
        'disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  )
);
Button.displayName = 'Button';
