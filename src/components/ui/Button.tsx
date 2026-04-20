"use client";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const V = {
  primary:   "bg-brand-teal text-white hover:bg-[#095e43] disabled:opacity-50",
  secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  danger:    "bg-red-600 text-white hover:bg-red-700",
  ghost:     "text-gray-600 hover:bg-gray-100",
};
const S = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-base" };

export function Button({ variant="primary", size="md", loading, children, className, disabled, ...p }: ButtonProps) {
  return (
    <button
      className={clsx("inline-flex items-center gap-2 rounded-lg font-medium transition-colors min-h-11",
        V[variant], S[size], className)}
      disabled={disabled || loading} {...p}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
