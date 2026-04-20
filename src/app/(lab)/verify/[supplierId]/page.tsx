'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, ExternalLink } from 'lucide-react';
import { MOCK_SUPPLIERS, MOCK_VERIFY_SCORES } from '@/lib/mock-data';
import { useSupplierStore } from '@/lib/store';
import { Card3D }          from '@/components/shared/Card3D';
import { TrustBadge }      from '@/components/shared/TrustBadge';
import { StellarBadge }    from '@/components/shared/StellarBadge';

export default function SupplierTrustProfilePage() {
  const { supplierId } = useParams<{ supplierId: string }>();
  const router         = useRouter();
  
  // 1. Hook into the live Zustand store
  const { approved }   = useSupplierStore();

  const supplier = MOCK_SUPPLIERS.find(s => s.id === supplierId);
  const scores   = MOCK_VERIFY_SCORES[supplierId];

  // 2. STRICT MODE: Only trust the live Zustand store. Completely ignore fake mock data.
  const approvedState  = approved[supplierId];
  const explorerUrl    = approvedState?.explorerUrl || null;
  const isOnChain      = !!explorerUrl;
  
  // Force fake "verified" mock suppliers back to "pending" if they aren't in the live store
  const liveTrustLevel = approvedState 
    ? 'verified' 
    : (['verified', 'premium'].includes(supplier?.trust_level ?? '') ? 'pending' : supplier?.trust_level);

  if (!supplier) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h2 className="text-xl font-bold text-gray-900">Supplier not found</h2>
        <button
          onClick={() => router.back()}
          className="mt-5 text-sm text-blue-600 hover:underline"
        >
          ← Go back
        </button>
      </div>
    );
  }

  const scoreColour = (n: number) =>
    n >= 95 ? 'text-blue-600' : n >= 85 ? 'text-blue-500' : n >= 70 ? 'text-amber-600' : 'text-red-600';

  const circumference = 2 * Math.PI * 28;
  const offset        = circumference * (1 - (scores?.overall ?? supplier.performance_score) / 100);

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Back */}
      <Link
        href="/verify"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Verify
      </Link>

      {/* Header card - Cohesive Blue Gradient */}
      <div className="bg-linear-to-br from-blue-600 to-blue-900 rounded-2xl p-6 text-white shadow-sm">
        <div className="flex items-start gap-5">
          {/* Big score ring */}
          <div className="relative shrink-0 w-20 h-20">
            <svg viewBox="0 0 64 64" className="w-20 h-20 -rotate-90">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
              <circle
                cx="32" cy="32" r="28"
                fill="none"
                stroke="#FCD34D" // Amber-300 for contrast on blue
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-amber-300 leading-none drop-shadow-sm">
                {scores?.overall ?? supplier.performance_score}
              </span>
              <span className="text-xs opacity-80">/100</span>
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-bold tracking-tight">{supplier.name}</h1>
              {/* Uses the strictly synced trust level */}
              <TrustBadge level={liveTrustLevel as any} />
            </div>
            <p className="text-sm text-blue-100">{supplier.state}</p>
            {supplier.iso_certification && (
              <p className="text-xs opacity-75 mt-1 font-medium">{supplier.iso_certification}</p>
            )}

            {/* On-chain status pill */}
            <div className={`
              inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide
              ${isOnChain
                ? 'bg-blue-50 text-blue-700 shadow-sm'
                : 'bg-white/10 text-white border border-white/20'}
            `}>
              <ShieldCheck size={13} />
              {isOnChain ? 'Credentials verified on Stellar blockchain' : 'Pending blockchain verification'}
            </div>
          </div>
        </div>
      </div>

      {/* Blockchain verification — the real Stellar record */}
      <Card3D accent="border-t-blue-600" className="bg-white">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="font-bold text-gray-900 text-sm">Blockchain verification record</h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Credentials hashed and written permanently to Stellar Testnet.
              Verifiable by anyone — no login required.
            </p>
          </div>
          {isOnChain && (
            <span className="shrink-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold shadow-sm">
              ✓
            </span>
          )}
        </div>

        {isOnChain && explorerUrl ? (
          <div className="space-y-4 mt-4">
            <StellarBadge
              explorerUrl={explorerUrl}
              label="View credential record on Stellar Explorer ↗"
            />
            <div className="bg-gray-50 rounded-xl px-4 py-3.5 border border-gray-100 space-y-2.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                What was recorded on-chain
              </p>
              {[
                { label: 'Supplier ID',      value: supplier.id             },
                { label: 'NAFDAC Licence',   value: supplier.nafdac_licence },
                { label: 'Approved by',      value: 'Zytrak Platform Admin' },
                { label: 'Network',          value: 'Stellar Testnet'       },
                { label: 'Method',           value: 'manageData operation'  },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">{row.label}</span>
                  <span className="font-mono font-bold text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              The SHA-256 hash of these credentials is stored in the Stellar ledger via a
              <span className="font-mono font-medium text-gray-700 bg-gray-100 px-1 py-0.5 rounded mx-1">manageData</span> 
              operation. The hash cannot be altered after submission — any change to the data would
              produce a different hash, invalidating the record.
            </p>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mt-4">
            <p className="text-sm font-bold text-amber-800">
              Pending admin approval
            </p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              This supplier has not yet been approved. Once an admin approves from the
              Admin → Suppliers page, the credentials will be written to Stellar and a
              live explorer link will appear here.
            </p>
          </div>
        )}
      </Card3D>

      {/* NAFDAC credentials */}
      <Card3D className="bg-white">
        <h2 className="font-bold text-gray-900 text-sm mb-3">Regulatory credentials</h2>
        <div className="space-y-1">
          {[
            {
              label:    'NAFDAC Distribution Licence',
              value:    supplier.nafdac_licence,
              status:   isOnChain ? 'verified' : 'pending',
              link:     'https://www.nafdac.gov.ng',
              linkText: 'Verify on NAFDAC ↗',
            },
            ...(supplier.iso_certification ? [{
              label:    'ISO Certification',
              value:    supplier.iso_certification,
              status:   'verified' as const,
              link:     null,
              linkText: null,
            }] : []),
          ].map(cred => (
            <div
              key={cred.label}
              className="flex items-start justify-between gap-3 py-3 border-b border-gray-50 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500">{cred.label}</p>
                <p className="font-mono text-sm font-bold text-gray-900 mt-1">
                  {cred.value}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <TrustBadge level={cred.status as any} />
                {cred.link && (
                  <a
                    href={cred.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 uppercase tracking-wide transition-colors"
                  >
                    {cred.linkText}
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card3D>

      {/* Performance scores */}
      {scores && (
        <Card3D className="bg-white">
          <h2 className="font-bold text-gray-900 text-sm mb-4">Performance scorecard</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'On-time delivery',    value: scores.on_time    },
              { label: 'Order fill rate',     value: scores.fill_rate  },
              { label: 'Cold chain',          value: scores.cold_chain },
              { label: 'Dispute rate',        value: 100 - scores.dispute_rate },
            ].map(s => (
              <div key={s.label} className="bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-500">{s.label}</p>
                  <p className={`text-sm font-black ${scoreColour(s.value)}`}>
                    {s.value}%
                  </p>
                </div>
                {/* Mini progress bar */}
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width:           `${s.value}%`,
                      backgroundColor: s.value >= 90 ? '#2563EB' // blue-600
                                     : s.value >= 75 ? '#60A5FA' // blue-400
                                     :                 '#D97706', // amber-600
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs font-medium text-gray-500 mt-4 text-center bg-gray-50 py-2 rounded-lg border border-gray-100">
            Based on{' '}
            <span className="font-bold text-gray-900">
              {scores.orders_completed} completed orders
            </span>{' '}
            — all verified on Stellar.
          </p>
        </Card3D>
      )}
    </div>
  );
}