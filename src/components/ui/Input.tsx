import React from "react";
import { clsx } from "clsx";
interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string; error?: string; helper?: string;
}
export const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ label, error, helper, className, ...p }, ref) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label}{p.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input ref={ref}
        className={clsx("border rounded-lg px-3 py-2 text-sm min-h-11 focus:outline-none focus:ring-2 focus:ring-brand-teal",
          error ? "border-red-400" : "border-gray-300", className)} {...p} />
      {error  && <p className="text-xs text-red-600">{error}</p>}
      {helper && <p className="text-xs text-gray-500">{helper}</p>}
    </div>
  )
);
Input.displayName = "Input";
