import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow, parseISO, differenceInDays } from "date-fns";

export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export function formatCurrency(ngn: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", minimumFractionDigits: 0
  }).format(ngn);
}

export const formatDate = (iso: string) => format(parseISO(iso), "dd MMM yyyy");
export const formatDateRelative = (iso: string) => formatDistanceToNow(parseISO(iso), { addSuffix: true });

export function getExpiryAlertLevel(expiry: string): "critical"|"warning"|"info"|"ok" {
  const d = differenceInDays(parseISO(expiry), new Date());
  if (d <= 7)  return "critical";
  if (d <= 30) return "warning";
  if (d <= 90) return "info";
  return "ok";
}

export const EXPIRY_COLOURS = {
  critical: "text-red-700 bg-red-50 border border-red-200",
  warning:  "text-amber-700 bg-amber-50 border border-amber-200",
  info:     "text-yellow-700 bg-yellow-50 border border-yellow-200",
  ok:       "text-green-700 bg-green-50 border border-green-200",
} as const;
