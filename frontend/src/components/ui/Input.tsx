import React from 'react';

export interface FormFieldProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, helperText, error, required, className = '', children }: FormFieldProps) {
  return (
    <div className={['flex flex-col gap-1.5 w-full text-left', className].filter(Boolean).join(' ')}>
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-[#00193c] flex items-center gap-1">
          {label}
          {required && <span className="text-red-500 font-normal">*</span>}
        </label>
      )}
      {children}
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
      {!error && helperText && <span className="text-xs text-[#747780]">{helperText}</span>}
    </div>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, startIcon, endIcon, required, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const inputElement = (
      <div className="relative flex items-center w-full">
        {startIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-[#747780]">
            {startIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          className={[
            'w-full bg-white/80 border rounded-xl py-2.5 text-sm text-[#191c1e] placeholder-[#747780]',
            'transition-all duration-200 outline-none backdrop-blur-sm',
            'focus:bg-white focus:border-[#fea619] focus:ring-2 focus:ring-[#fea619]/20',
            'disabled:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed',
            startIcon ? 'pl-10' : 'pl-3.5',
            endIcon ? 'pr-10' : 'pr-3.5',
            error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-[#c4c6d0]',
            className,
          ].filter(Boolean).join(' ')}
          {...props}
        />
        {endIcon && (
          <div className="absolute right-3.5 flex items-center pointer-events-none text-[#747780]">
            {endIcon}
          </div>
        )}
      </div>
    );

    if (label || helperText || error) {
      return (
        <FormField label={label} helperText={helperText} error={error} required={required}>
          {inputElement}
        </FormField>
      );
    }

    return inputElement;
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, required, className = '', id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const element = (
      <textarea
        ref={ref}
        id={textareaId}
        required={required}
        className={[
          'w-full bg-white/80 border rounded-xl p-3 text-sm text-[#191c1e] placeholder-[#747780]',
          'transition-all duration-200 outline-none backdrop-blur-sm resize-y min-h-[90px]',
          'focus:bg-white focus:border-[#fea619] focus:ring-2 focus:ring-[#fea619]/20',
          'disabled:bg-gray-100 disabled:opacity-60',
          error ? 'border-red-400 focus:border-red-500' : 'border-[#c4c6d0]',
          className,
        ].filter(Boolean).join(' ')}
        {...props}
      />
    );

    if (label || helperText || error) {
      return (
        <FormField label={label} helperText={helperText} error={error} required={required}>
          {element}
        </FormField>
      );
    }

    return element;
  }
);
Textarea.displayName = 'Textarea';
