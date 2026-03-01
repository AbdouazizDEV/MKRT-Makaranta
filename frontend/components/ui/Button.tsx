/**
 * Composant Button réutilisable
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[#F4A823] text-white hover:bg-[#E0971F] focus:ring-[#F4A823]',
    secondary: 'bg-[#0D1B2A] text-white hover:bg-[#1A2B3D] focus:ring-[#0D1B2A]',
    outline: 'border-2 border-[#0D1B2A] text-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-white',
    ghost: 'text-[#0D1B2A] hover:bg-[#F5F0E8]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
