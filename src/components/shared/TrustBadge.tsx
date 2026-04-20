// src/components/shared/TrustBadge.tsx
// 3D trust/verification badge used across Verify, Marketplace, Finance modules
import { clsx } from "clsx";

type Level = "verified" | "pending" | "flagged" | "unverified" | "premium";

const CONFIG: Record<Level, { label: string; bg: string; text: string; icon: string; shadow: string }> = {
  verified:   { label:"NAFDAC Verified",  bg:"bg-verify",   text:"text-white",      icon:"✓",  shadow:"shadow-verify/40" },
  premium:    { label:"Premium Supplier",  bg:"bg-pay",      text:"text-white",      icon:"★",  shadow:"shadow-pay/40" },
  pending:    { label:"Under Review",      bg:"bg-amber-500",text:"text-white",      icon:"◔",  shadow:"shadow-amber-500/40" },
  flagged:    { label:"Flagged",           bg:"bg-red-600",  text:"text-white",      icon:"⚠",  shadow:"shadow-red-600/40" },
  unverified: { label:"Not Verified",      bg:"bg-gray-300", text:"text-gray-700",   icon:"?",  shadow:"shadow-gray-300/40" },
};

export function TrustBadge({ level, className }: { level: Level; className?: string }) {
  const c = CONFIG[level];
  return (
    <span className={clsx("trust-badge", c.bg, c.text, `shadow-md ${c.shadow}`, className)}>
      <span className="drop-shadow">{c.icon}</span>
      {c.label}
    </span>
  );
}
