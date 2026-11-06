'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, hint, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-[#9B99C4] uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#5C5A8A] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              'w-full h-10 px-3.5 rounded-lg bg-[#0E0E1A] border border-[#1E1E3A] text-sm text-[#F1F0FF] placeholder-[#5C5A8A] transition-all duration-150',
              'focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error && 'border-[#F87171] focus:border-[#F87171] focus:ring-[#F87171]',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#5C5A8A]">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-[#F87171]">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[#5C5A8A]">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
