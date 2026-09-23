import React from 'react';
import { GlassCoreState } from '../../theme/tokens';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: GlassCoreState | 'default' | 'neutral' | 'gold' | 'navy';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center font-bold uppercase tracking-wider rounded-full border transition-colors';

  const variants: Record<string, { badge: string; dot: string }> = {
    default: {
      badge: 'bg-white/80 text-[#00193c] border-[#c4c6d0]',
      dot: 'bg-[#00193c]',
    },
    neutral: {
      badge: 'bg-gray-100 text-gray-700 border-gray-300',
      dot: 'bg-gray-500',
    },
    gold: {
      badge: 'bg-[#fea619]/15 text-[#855300] border-[#fea619]/40',
      dot: 'bg-[#fea619]',
    },
    navy: {
      badge: 'bg-[#00193c] text-white border-[#00193c]',
      dot: 'bg-white',
    },
    idle: {
      badge: 'bg-gray-100 text-gray-700 border-gray-300',
      dot: 'bg-gray-400',
    },
    loading: {
      badge: 'bg-[#00193c]/10 text-[#00193c] border-[#c4c6d0]',
      dot: 'bg-[#00193c]',
    },
    processing: {
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
    },
    success: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    },
    'review-required': {
      badge: 'bg-amber-50 text-amber-800 border-amber-300',
      dot: 'bg-amber-500',
    },
    'provider-unavailable': {
      badge: 'bg-slate-100 text-slate-700 border-slate-300',
      dot: 'bg-slate-400',
    },
    error: {
      badge: 'bg-red-50 text-red-700 border-red-200',
      dot: 'bg-red-500',
    },
  };

  const sizes = {
    sm: 'text-[9px] px-2 py-0.5 gap-1',
    md: 'text-[10px] px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3.5 py-1.5 gap-2',
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <span
      className={[baseStyles, currentVariant.badge, sizes[size], className].filter(Boolean).join(' ')}
      {...props}
    >
      {dot && (
        <span
          className={[
            'h-2 w-2 rounded-full shrink-0',
            currentVariant.dot,
            pulse ? 'animate-pulse' : '',
          ].filter(Boolean).join(' ')}
        />
      )}
      {children}
    </span>
  );
}
