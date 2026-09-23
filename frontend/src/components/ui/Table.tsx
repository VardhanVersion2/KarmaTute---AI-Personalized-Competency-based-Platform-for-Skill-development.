import React from 'react';
import { Spinner } from './Loading';

export function Table({
  children,
  className = '',
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#c4c6d0]/70 bg-white/70 backdrop-blur-sm shadow-sm">
      <table className={['w-full text-left text-sm text-[#191c1e]', className].filter(Boolean).join(' ')}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="bg-[#00193c]/5 border-b border-[#c4c6d0] text-xs uppercase font-bold text-[#00193c]">{children}</thead>;
}

export function TableBody({ children, isLoading = false }: { children: React.ReactNode; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <tbody>
        <tr>
          <td colSpan={10} className="py-12 text-center">
            <div className="flex justify-center items-center gap-2 text-xs text-[#747780]">
              <Spinner size="sm" />
              <span>Loading records...</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }
  return <tbody className="divide-y divide-[#c4c6d0]/50">{children}</tbody>;
}

export function TableRow({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={['transition-colors hover:bg-[#00193c]/[0.02]', onClick ? 'cursor-pointer' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={['px-4 py-3 font-bold tracking-wider', className].filter(Boolean).join(' ')}>{children}</th>;
}

export function TableCell({ children, className = '' }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={['px-4 py-3.5 text-xs md:text-sm', className].filter(Boolean).join(' ')}>{children}</td>;
}
