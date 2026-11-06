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
    'bg-[#CE1A1E] hover:bg-[#E52226] text-white border border-[#CE1A1E] shadow-md shadow-[#CE1A1E]/30',
  secondary:
    'bg-[#223330]/60 hover:bg-[#223330] text-[#F4F6F4] border border-[#4D524B]/50 hover:border-[#CE1A1E]/60',
  outline:
    'bg-transparent hover:bg-[#223330]/40 text-[#F4F6F4] border border-[#4D524B]/60 hover:border-[#CE1A1E]',
  ghost:
    'bg-transparent hover:bg-[#223330]/40 text-[#837F78] hover:text-white border border-transparent',
  destructive:
    'bg-[#65060E]/70 text-white border border-[#CE1A1E]/60 hover:bg-[#65060E]',
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
