import React from 'react';

export interface LinearProgressProps {
  value?: number; // 0-100, undefined for indeterminate
  max?: number;
  label?: string;
  showPercent?: boolean;
  variant?: 'primary' | 'gold' | 'success' | 'danger';
  className?: string;
}

export function LinearProgress({
  value,
  max = 100,
  label,
  showPercent = false,
  variant = 'primary',
  className = '',
}: LinearProgressProps) {
  const isIndeterminate = value === undefined;
  const percentage = isIndeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  const variants = {
    primary: 'bg-[#00193c]',
    gold: 'bg-[#fea619]',
    success: 'bg-emerald-600',
    danger: 'bg-red-600',
  };

  return (
    <div className={['w-full flex flex-col gap-1.5', className].filter(Boolean).join(' ')}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs font-semibold text-[#44474f]">
          {label && <span>{label}</span>}
          {showPercent && !isIndeterminate && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#d8dadc]/60">
        {isIndeterminate ? (
          <div className={'h-full w-1/3 animate-pulse rounded-full ' + variants[variant]} />
        ) : (
          <div
            className={'h-full rounded-full transition-all duration-500 ease-out ' + variants[variant]}
            style={{ width: percentage + '%' }}
          />
        )}
      </div>
    </div>
  );
}

export function CircularProgress({
  value = 75,
  size = 64,
  strokeWidth = 6,
  variant = 'gold',
  label,
}: {
  value?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'primary' | 'gold' | 'success';
  label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const strokeColors = {
    primary: '#00193c',
    gold: '#fea619',
    success: '#059669',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#d8dadc"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColors[variant]}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <span className="absolute text-xs font-bold text-[#00193c]">{Math.round(value)}%</span>
      </div>
      {label && <span className="text-[10px] font-bold uppercase text-[#747780]">{label}</span>}
    </div>
  );
}

export function StepProgress({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <div className="flex items-center w-full max-w-2xl mx-auto">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={[
                  'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm',
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-[#00193c] text-white ring-4 ring-[#fea619]/40'
                    : 'bg-white border border-[#c4c6d0] text-[#747780]',
                ].join(' ')}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span
                className={[
                  'text-[10px] uppercase font-bold tracking-wider text-center line-clamp-1',
                  isCurrent ? 'text-[#00193c]' : 'text-[#747780]',
                ].join(' ')}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={[
                  'h-1 flex-1 -mt-5 transition-colors',
                  idx < currentStep ? 'bg-emerald-600' : 'bg-[#d8dadc]',
                ].join(' ')}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
