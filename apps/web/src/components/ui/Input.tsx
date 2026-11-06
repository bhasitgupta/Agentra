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
        <label className="block text-xs font-medium text-[#D4D4D8] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-[#8E8E93] pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full h-10 px-3.5 rounded-lg bg-[#0C0608] border border-[rgba(255,255,255,0.12)] text-sm text-[#FFFFFF] placeholder-[#8E8E93] transition-all duration-150',
            'focus:outline-none focus:border-[#6D001A] focus:ring-1 focus:ring-[#6D001A]/60',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            error && 'border-[#9E0D2A] focus:ring-[#9E0D2A]',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 text-[#8E8E93] flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-[#9E0D2A]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[#8E8E93]">{hint}</p>
      ) : null}
    </div>
  )
);
Input.displayName = 'Input';
