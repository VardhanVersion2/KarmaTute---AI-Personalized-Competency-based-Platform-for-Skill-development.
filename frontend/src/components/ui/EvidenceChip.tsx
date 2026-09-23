import React from 'react';
import { FileText, Award, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export interface EvidenceChipProps {
  label: string;
  type?: 'certificate' | 'document' | 'assessment' | 'tpac';
  confidenceScore?: number;
  verified?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

export function EvidenceChip({
  label,
  type = 'document',
  confidenceScore,
  verified = false,
  onRemove,
  onClick,
  className = '',
}: EvidenceChipProps) {
  const icons = {
    certificate: <Award size={13} className="text-[#855300]" />,
    document: <FileText size={13} className="text-[#00193c]" />,
    assessment: <CheckCircle2 size={13} className="text-emerald-700" />,
    tpac: <ShieldCheck size={13} className="text-purple-700" />,
  };

  return (
    <div
      onClick={onClick}
      className={[
        'inline-flex items-center gap-1.5 rounded-lg border border-[#c4c6d0] bg-white/85 px-2.5 py-1 text-xs font-semibold text-[#00193c] shadow-xs backdrop-blur-sm transition-all',
        onClick ? 'hover:border-[#fea619] hover:bg-white cursor-pointer' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      <span className="shrink-0">{icons[type]}</span>
      <span className="truncate max-w-[150px]">{label}</span>
      {confidenceScore !== undefined && (
        <span className="rounded-full bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
          {Math.round(confidenceScore * 100)}%
        </span>
      )}
      {verified && <span className="text-emerald-600 font-bold text-[10px]">VERIFIED</span>}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded p-0.5 text-[#747780] hover:text-red-600 hover:bg-red-50 cursor-pointer"
          aria-label="Remove item"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
