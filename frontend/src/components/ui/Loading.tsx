import React from 'react';
import { Loader2 } from 'lucide-react';

export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  };
  return <Loader2 className={['animate-spin text-[#00193c]', sizes[size], className].filter(Boolean).join(' ')} />;
}

export function Skeleton({
  variant = 'text',
  className = '',
}: {
  variant?: 'text' | 'card' | 'circle' | 'button';
  className?: string;
}) {
  const base = 'animate-pulse bg-[#c4c6d0]/40';
  const variants = {
    text: 'h-4 w-full rounded-md',
    card: 'h-32 w-full rounded-2xl',
    circle: 'h-12 w-12 rounded-full',
    button: 'h-10 w-28 rounded-xl',
  };
  return <div className={[base, variants[variant], className].filter(Boolean).join(' ')} />;
}

export function LoadingOverlay({ message = 'Processing...' }: { message?: string }) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl">
      <Spinner size="lg" />
      <span className="text-xs font-bold uppercase tracking-widest text-[#00193c]">{message}</span>
    </div>
  );
}
