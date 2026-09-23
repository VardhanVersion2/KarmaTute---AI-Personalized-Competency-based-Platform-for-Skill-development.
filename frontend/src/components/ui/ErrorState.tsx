import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  variant?: 'card' | 'banner' | 'inline';
}

export function ErrorState({
  title = 'An error occurred',
  message,
  onRetry,
  variant = 'card',
}: ErrorStateProps) {
  if (variant === 'banner') {
    return (
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-800 text-xs md:text-sm">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{message}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="font-bold underline uppercase text-xs text-red-900 hover:text-red-700 cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-red-600">
        <AlertTriangle size={14} />
        {message}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 md:p-8 rounded-2xl border border-red-200 bg-red-50/70 backdrop-blur-sm">
      <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
        <AlertTriangle size={24} />
      </div>
      <h4 className="text-sm md:text-base font-bold text-red-900 mb-1">{title}</h4>
      <p className="text-xs text-red-700 max-w-sm mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" leftIcon={<RefreshCw size={14} />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
