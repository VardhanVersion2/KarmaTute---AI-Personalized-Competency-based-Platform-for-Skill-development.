import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'subtle' | 'elevated';
  hoverEffect?: boolean;
}

export function Card({
  children,
  className = '',
  variant = 'glass',
  hoverEffect = false,
  ...props
}: CardProps) {
  const variants = {
    glass:
      'bg-white/75 border border-[#c4c6d0]/70 backdrop-blur-md shadow-[0_12px_40px_rgba(0,25,60,0.06)]',
    solid:
      'bg-white border border-[#c4c6d0] shadow-sm',
    subtle:
      'bg-white/40 border border-[#c4c6d0]/40 backdrop-blur-sm',
    elevated:
      'bg-white border border-[#c4c6d0]/80 shadow-[0_18px_50px_rgba(0,25,60,0.1)]',
  };

  const hoverClass = hoverEffect
    ? 'transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,25,60,0.12)] hover:border-[#fea619]/60 hover:-translate-y-0.5'
    : '';

  return (
    <div
      className={['rounded-2xl p-5 md:p-6', variants[variant], hoverClass, className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['flex flex-col gap-1.5 pb-4 border-b border-[#c4c6d0]/50 mb-4', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={['text-lg md:text-xl font-bold text-[#00193c] tracking-tight', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={['text-xs md:text-sm text-[#44474f] leading-relaxed', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['flex items-center justify-between pt-4 mt-4 border-t border-[#c4c6d0]/50', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}
