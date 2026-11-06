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
    'bg-[#6D001A] hover:bg-[#8B0024] text-white border border-[#9E0D2A]/60 shadow-md shadow-[#6D001A]/30',
  secondary:
    'bg-[#0C0608] hover:bg-[#160B0F] text-[#FFFFFF] border border-[rgba(255,255,255,0.12)] hover:border-[#6D001A]/70',
  outline:
    'bg-transparent hover:bg-[#0C0608] text-[#FFFFFF] border border-[rgba(255,255,255,0.20)] hover:border-[#6D001A]',
  ghost:
    'bg-transparent hover:bg-[#160B0F] text-[#D4D4D8] hover:text-white border border-transparent',
  destructive:
    'bg-[#460010]/50 text-[#FFFFFF] border border-[#9E0D2A]/50 hover:bg-[#6D001A]/50',
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
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D001A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]',
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
