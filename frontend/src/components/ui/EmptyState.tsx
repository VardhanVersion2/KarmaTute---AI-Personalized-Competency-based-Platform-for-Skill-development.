import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = <Inbox size={36} className="text-[#855300]" />,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={['flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl border-2 border-dashed border-[#c4c6d0] bg-white/40 backdrop-blur-sm', className].filter(Boolean).join(' ')}>
      <div className="h-16 w-16 rounded-2xl bg-[#fea619]/15 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="text-base md:text-lg font-bold text-[#00193c] mb-1">{title}</h4>
      {description && <p className="text-xs md:text-sm text-[#747780] max-w-sm mb-5 leading-relaxed">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
