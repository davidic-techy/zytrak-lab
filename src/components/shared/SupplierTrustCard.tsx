"use client";
import { Card3D } from "./Card3D";
import { TrustBadge } from "./TrustBadge";
import { StellarBadge } from "./StellarBadge";
import type { MockSupplier } from "@/lib/mock-data";
import { useSupplierStore } from "@/lib/store";

export function SupplierTrustCard({ supplier }: { supplier: MockSupplier }) {
  const { approved } = useSupplierStore();
  const approvedState = approved[supplier.id];

  // 1. STRICT MODE FIX for the Badge:
  // Only use 'verified' if it actually exists in your live Zustand store.
  // If the mock data tries to say it's verified/premium but it isn't approved yet, force it to 'pending'.
  const liveTrustLevel = approvedState 
    ? "verified" 
    : (["verified", "premium"].includes(supplier.trust_level) ? "pending" : supplier.trust_level);

  // 2. STRICT MODE FIX for the Link:
  // Completely ignore the fake hardcoded hashes in the mock data. 
  // ONLY show the on-chain badge if approvedState has a real URL from your Admin action.
  const liveExplorerUrl = approvedState?.explorerUrl || null;

  const score = supplier.performance_score;
  const colour = score >= 95 ? "#16A34A" : score >= 85 ? "#1D4ED8" : score >= 70 ? "#D97706" : "#DC2626";

  return (
    <Card3D accent="border-t-blue-600" className="hover:cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-md bg-white">
      <div className="flex items-center gap-4">

        {/* Score ring — simulated with inline SVG */}
        <div className="relative shrink-0 w-16 h-16">
          <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
            <circle cx="32" cy="32" r="26" fill="none" stroke="#E5E7EB" strokeWidth="6" />
            <circle cx="32" cy="32" r="26" fill="none"
              stroke={colour} strokeWidth="6"
              strokeDasharray={`${(score/100)*163.4} 163.4`}
              strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-black" style={{ color: colour }}>
            {score}
          </span>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-gray-900 truncate">{supplier.name}</p>
            {/* Renders the strictly live updated trust level */}
            <TrustBadge level={liveTrustLevel as any} />
          </div>
          <p className="text-xs text-gray-500">{supplier.state} · NAFDAC: <span className="font-mono">{supplier.nafdac_licence}</span></p>
          {supplier.iso_certification && (
            <p className="text-xs text-blue-700 font-semibold mt-0.5">{supplier.iso_certification}</p>
          )}
        </div>

        {/* Stellar badge — dynamically shows ONLY the real transaction hash if approved */}
        {liveExplorerUrl && (
          <div className="shrink-0">
            <StellarBadge
              explorerUrl={liveExplorerUrl}
              label="On-chain ↗"
            />
          </div>
        )}
      </div>
    </Card3D>
  );
}