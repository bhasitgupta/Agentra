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
  ({ className, type = 'text', label, error, hint, leftIcon, rightIcon, ...props }, ref) => (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-[#A8ADA6] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-[#837F78] pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full h-10 px-3.5 rounded-lg bg-[#223330] border border-[rgba(131,127,120,0.32)] text-sm text-[#E8EBE4] placeholder-[#837F78] transition-all duration-150',
            'focus:outline-none focus:border-[#CE1A1E] focus:ring-1 focus:ring-[#CE1A1E]/50',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            error && 'border-[#CE1A1E] focus:ring-[#CE1A1E]',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-[#837F78] flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-[#CE1A1E]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[#837F78]">{hint}</p>
      ) : null}
    </div>
  )
);
Input.displayName = 'Input';
