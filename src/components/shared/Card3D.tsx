"use client";
import { clsx } from "clsx";

interface Props {
  children: React.ReactNode;
  className?: string;
  accent?: string;
  noPad?: boolean;
}

export function Card3D({ children, className, accent, noPad }: Props) {
  return (
    <div className={clsx(
      // Standard Tailwind classes guarantee this will be visible!
      "bg-white rounded-2xl shadow-md border border-gray-100/60 overflow-hidden",
      !noPad && "p-5",
      accent,
      accent && "border-t-4",
      className
    )}>
      {children}
    </div>
  );
}