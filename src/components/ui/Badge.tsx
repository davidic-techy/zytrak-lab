import { clsx } from "clsx";
type V = "success"|"warning"|"danger"|"info"|"neutral"|"stellar";
const styles: Record<V,string> = {
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
  danger:  "bg-red-100   text-red-800",
  info:    "bg-blue-100  text-blue-800",
  neutral: "bg-gray-100  text-gray-700",
  stellar: "bg-stellar-light text-stellar-dark",
};
export function Badge({ variant="neutral", children, className }:
  { variant?: V; children: React.ReactNode; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", styles[variant], className)}>
      {children}
    </span>
  );
}
