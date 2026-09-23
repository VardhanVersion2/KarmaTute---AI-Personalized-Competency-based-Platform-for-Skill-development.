import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  size = 'md',
}: DrawerProps) {
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
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-xl',
  };

  const posClass = position === 'right' ? 'right-0 top-0 bottom-0' : 'left-0 top-0 bottom-0';

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-[#00193c]/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={[
          'fixed z-10 w-full bg-white border-l border-[#c4c6d0] shadow-2xl p-6 flex flex-col',
          posClass,
          sizes[size],
        ].join(' ')}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#c4c6d0]">
          {title && <h3 className="text-base font-bold text-[#00193c]">{title}</h3>}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#747780] hover:bg-gray-100 hover:text-[#00193c] cursor-pointer"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="py-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
