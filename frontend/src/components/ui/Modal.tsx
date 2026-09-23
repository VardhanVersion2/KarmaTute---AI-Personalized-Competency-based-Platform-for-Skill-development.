import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#00193c]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={[
          'relative w-full rounded-2xl bg-white border border-[#c4c6d0]',
          'p-6 shadow-2xl transition-all z-10 max-h-[90vh] flex flex-col',
          sizes[size],
        ].join(' ')}
      >
        <div className="flex items-start justify-between pb-3 border-b border-[#c4c6d0]/60">
          <div>
            {title && <h3 id="modal-title" className="text-lg font-bold text-[#00193c]">{title}</h3>}
            {description && <p className="text-xs text-[#747780] mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#747780] hover:bg-gray-100 hover:text-[#00193c] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="py-4 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="pt-3 border-t border-[#c4c6d0]/60 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
