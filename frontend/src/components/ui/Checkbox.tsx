import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', id, ...props }, ref) => {
    const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <label className="flex items-start gap-3 cursor-pointer select-none group">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className={[
            'h-4 w-4 mt-0.5 rounded border border-[#c4c6d0] text-[#00193c]',
            'focus:ring-2 focus:ring-[#fea619] focus:ring-offset-1 accent-[#00193c]',
            'transition-colors cursor-pointer',
            className,
          ].filter(Boolean).join(' ')}
          {...props}
        />
        {(label || description) && (
          <div className="flex flex-col text-left">
            {label && <span className="text-sm font-medium text-[#191c1e] group-hover:text-[#00193c]">{label}</span>}
            {description && <span className="text-xs text-[#747780]">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export function Switch({ label, description, checked, defaultChecked, onChange, disabled, className = '', ...props }: SwitchProps) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer select-none group w-full">
      {(label || description) && (
        <div className="flex flex-col text-left">
          {label && <span className="text-sm font-medium text-[#191c1e] group-hover:text-[#00193c]">{label}</span>}
          {description && <span className="text-xs text-[#747780]">{description}</span>}
        </div>
      )}
      <div className="relative inline-flex shrink-0 items-center">
        <input
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div className="h-6 w-11 rounded-full bg-[#d8dadc] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#00193c] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#fea619] peer-disabled:opacity-50" />
      </div>
    </label>
  );
}
