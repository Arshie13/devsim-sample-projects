import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-warm-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-5 py-3 border rounded-xl transition-all duration-200
            bg-white text-warm-800 placeholder-warm-400
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
            disabled:bg-warm-50 disabled:text-warm-400 disabled:cursor-not-allowed
            hover:border-warm-400
            ${error ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-warm-200'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-2 text-sm text-red-600 flex items-center gap-1">{error}</p>}
        {helperText && !error && (
          <p className="mt-2 text-sm text-warm-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
