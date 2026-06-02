import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...rest }, ref) {
    return (
      <input
        ref={ref}
        {...rest}
        className={`block w-full px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${className}`}
      />
    );
  },
);
