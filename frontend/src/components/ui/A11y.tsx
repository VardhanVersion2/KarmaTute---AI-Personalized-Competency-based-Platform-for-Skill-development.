import React from 'react';

export function SkipLink({ targetId = 'main-content', text = 'Skip to main content' }: { targetId?: string; text?: string }) {
  return (
    <a
      href={'#' + targetId}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-xl focus:bg-[#00193c] focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#fea619]"
    >
      {text}
    </a>
  );
}

export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}
