'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070F] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99] select-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[#8B5CF6] hover:bg-[#7C3AED] text-[#F1F0FF] shadow-md shadow-[#8B5CF6]/20 border border-[#A78BFA]/30',
        primary:
          'bg-[#8B5CF6] hover:bg-[#7C3AED] text-[#F1F0FF] shadow-md shadow-[#8B5CF6]/20 border border-[#A78BFA]/30',
        secondary:
          'bg-[#0E0E1A] hover:bg-[#1A1A30] text-[#F1F0FF] border border-[#1E1E3A] hover:border-[#2D2D52]',
        outline:
          'bg-transparent hover:bg-[#14142A] text-[#F1F0FF] border border-[#2D2D52] hover:border-[#8B5CF6]',
        ghost:
          'bg-transparent hover:bg-[#14142A] text-[#9B99C4] hover:text-[#F1F0FF]',
        destructive:
          'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20 hover:bg-[#F87171]/20',
        link: 'text-[#8B5CF6] underline-offset-4 hover:underline bg-transparent',
      },
      size: {
        default: 'h-10 px-4 text-sm gap-2',
        sm: 'h-8 px-3 text-xs gap-1.5',
        md: 'h-10 px-4 text-sm gap-2',
        lg: 'h-12 px-6 text-base gap-2.5',
        icon: 'w-9 h-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
