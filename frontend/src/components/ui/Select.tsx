import React from 'react';
import { FormField } from './Input';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, options, placeholder, required, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const selectElement = (
      <div className="relative w-full">
        <select
          ref={ref}
          id={selectId}
          required={required}
          className={[
            'w-full appearance-none bg-white/80 border rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-[#191c1e]',
            'transition-all duration-200 outline-none backdrop-blur-sm cursor-pointer',
            'focus:bg-white focus:border-[#fea619] focus:ring-2 focus:ring-[#fea619]/20',
            'disabled:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed',
            error ? 'border-red-400 focus:border-red-500' : 'border-[#c4c6d0]',
            className,
          ].filter(Boolean).join(' ')}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#747780]">
          <ChevronDown size={16} />
        </div>
      </div>
    );

    if (label || helperText || error) {
      return (
        <FormField label={label} helperText={helperText} error={error} required={required}>
          {selectElement}
        </FormField>
      );
    }

    return selectElement;
  }
);
Select.displayName = 'Select';
