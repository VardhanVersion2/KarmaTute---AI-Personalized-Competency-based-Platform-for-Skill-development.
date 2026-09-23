import React from 'react';
import { GlassCoreState } from '../../theme/tokens';
import { Badge } from '../ui/Badge';
import { AlertTriangle, CheckCircle2, Clock, CloudOff, Loader2, Target, Users, LayoutDashboard, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

export type CoreState = GlassCoreState;
export type GlassState = GlassCoreState;

export interface GlassCoreProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: GlassCoreState;
  stateMessage?: string;
  errorMessage?: string;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  onRetry?: () => void;
  children?: React.ReactNode;
}

export function GlassCore({
  state = 'idle',
  stateMessage,
  errorMessage,
  title,
  subtitle,
  headerAction,
  onRetry,
  children,
  className = '',
  ...props
}: GlassCoreProps) {
  const resolvedMessage = stateMessage ?? errorMessage;

  const pipeline = [
    { id: 'profile', label: 'Identity', icon: <Users size={14} /> },
    { id: 'evidence', label: 'Evidence', icon: <FileText size={14} /> },
    { id: 'competency', label: 'Competency', icon: <ShieldCheck size={14} /> },
    { id: 'gap', label: 'Gap Math', icon: <Target size={14} /> },
    { id: 'match', label: 'Resolution', icon: <LayoutDashboard size={14} /> },
  ];

  // Determine which step in the pipeline is currently "active" based on the state
  const getActiveStepIndex = () => {
    switch (state) {
      case 'idle': return 0;
      case 'loading': return 1;
      case 'processing': return 3;
      case 'review-required': return 2;
      case 'success': return 4;
      case 'error':
      case 'provider-unavailable': return -1;
      default: return 0;
    }
  };

  const activeIndex = getActiveStepIndex();

  const stateConfigs = {
    idle: {
      statusText: 'SYSTEM OPERATIONAL',
      bgClass: 'bg-gov-surface',
      borderClass: 'border-gov-border',
      textClass: 'text-gov-text-secondary',
      icon: <Clock size={16} />
    },
    loading: {
      statusText: 'FETCHING EVIDENCE',
      bgClass: 'bg-gov-info-bg',
      borderClass: 'border-gov-info-border',
      textClass: 'text-gov-info',
      icon: <Loader2 size={16} className="animate-spin" />
    },
    processing: {
      statusText: 'INTELLIGENCE SYNTHESIS',
      bgClass: 'bg-gov-info-bg',
      borderClass: 'border-gov-info-border',
      textClass: 'text-gov-info',
      icon: <Loader2 size={16} className="animate-spin" />
    },
    success: {
      statusText: 'COMPETENCY TRACE COMPLETE',
      bgClass: 'bg-gov-success-bg',
      borderClass: 'border-gov-success-border',
      textClass: 'text-gov-success',
      icon: <CheckCircle2 size={16} />
    },
    'review-required': {
      statusText: 'HUMAN REVIEW REQUIRED',
      bgClass: 'bg-gov-warning-bg',
      borderClass: 'border-gov-warning-border',
      textClass: 'text-gov-warning',
      icon: <AlertTriangle size={16} />
    },
    'provider-unavailable': {
      statusText: 'PROVIDER UNAVAILABLE',
      bgClass: 'bg-gov-surface-muted',
      borderClass: 'border-gov-border',
      textClass: 'text-gov-text-muted',
      icon: <CloudOff size={16} />
    },
    error: {
      statusText: 'INTELLIGENCE ERROR',
      bgClass: 'bg-gov-danger-bg',
      borderClass: 'border-gov-danger-border',
      textClass: 'text-gov-danger',
      icon: <AlertTriangle size={16} />
    },
  };

  const config = stateConfigs[state];

  return (
    <div
      className={['bg-gov-surface border border-gov-border rounded-sm shadow-sm flex flex-col overflow-hidden', className].filter(Boolean).join(' ')}
      {...props}
    >
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-gov-border flex justify-between items-center bg-gov-surface-muted">
        <div className="flex flex-col">
          {title && <h3 className="text-sm font-bold text-gov-primary tracking-wide uppercase">{title}</h3>}
          {subtitle && <span className="text-xs text-gov-text-secondary mt-0.5 font-medium">{subtitle}</span>}
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[10px] font-bold uppercase tracking-widest ${config.bgClass} ${config.borderClass} ${config.textClass}`}>
          {config.icon}
          <span>{resolvedMessage || config.statusText}</span>
        </div>
      </div>

      {/* PIPELINE TRACE VISUALIZATION */}
      <div className="px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
        {/* Connecting Line background */}
        <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gov-border -translate-y-1/2 z-0" />
        
        {pipeline.map((step, idx) => {
          const isCompleted = activeIndex > idx || state === 'success';
          const isActive = activeIndex === idx;
          const isError = (state === 'error' || state === 'provider-unavailable') && activeIndex === -1;
          
          let circleClass = 'bg-gov-surface border-gov-border text-gov-text-muted';
          if (isCompleted) circleClass = 'bg-gov-success text-white border-gov-success';
          if (isActive) circleClass = 'bg-gov-primary text-white border-gov-primary shadow-[0_0_0_4px_rgba(0,51,102,0.1)]';
          if (isError) circleClass = 'bg-gov-surface border-gov-border text-gov-text-muted opacity-50';

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3 w-24">
              <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${circleClass}`}>
                {isCompleted && !isActive ? <CheckCircle2 size={16} /> : step.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest text-center transition-colors ${
                isActive ? 'text-gov-primary' : isCompleted ? 'text-gov-success' : 'text-gov-text-muted'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {children != null && <div className="p-6 border-t border-gov-border">{children}</div>}
    </div>
  );
}
