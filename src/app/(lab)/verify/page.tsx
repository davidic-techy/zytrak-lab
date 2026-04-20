'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Search } from 'lucide-react';
import { MOCK_SUPPLIERS } from '@/lib/mock-data';
import { useSupplierStore } from '@/lib/store';
import { ModuleHeader }       from '@/components/shared/ModuleHeader';
import { Card3D }             from '@/components/shared/Card3D';
import { SupplierTrustCard }  from '@/components/shared/SupplierTrustCard';

export default function VerifyPage() {
  const [search, setSearch] = useState('');
  
  // 1. Hook into the live store to get the exact real-time verification numbers
  const { approved } = useSupplierStore();

  const filtered = MOCK_SUPPLIERS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.nafdac_licence.toLowerCase().includes(search.toLowerCase())
  );

  // 2. Calculate the live count of verified suppliers
  const verifiedCount = MOCK_SUPPLIERS.filter(s => !!approved[s.id]).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Upgraded Cohesive Blue Header */}
      <ModuleHeader
        icon={<ShieldCheck size={28} className="text-white drop-shadow-sm" />}
        title="Zytrak Verify"
        tagline="Blockchain-verified supplier credentials — Stellar Testnet"
        gradient="bg-gradient-to-br from-blue-600 to-blue-900"
        stats={[
          { label: 'Verified',    value: String(verifiedCount) },
          { label: 'On-chain',    value: String(verifiedCount) }, // 1:1 mapped to verified in this demo
          { label: 'Avg score',   value: '94' },
        ]}
      />

      {/* Upgraded Search */}
      <Card3D noPad className="overflow-hidden bg-white shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 px-5 py-4 focus-within:bg-blue-50/30 transition-colors">
          <Search size={20} className="text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by supplier name or NAFDAC licence..."
            className="w-full border-0 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>
      </Card3D>

      {/* Notice — styled to match the blue theme */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 shadow-sm">
        <span className="text-xl shrink-0 mt-0.5">🔗</span>
        <div>
          <p className="text-sm font-bold text-blue-800">
            All verifications are real Stellar transactions
          </p>
          <p className="text-xs text-gray-600 mt-1 font-medium leading-relaxed">
            Every "Verified" badge links to a live transaction on Stellar Testnet.
            Click any badge to verify independently — no Zytrak login required.
          </p>
        </div>
      </div>

      {/* Supplier list */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block shadow-sm" />
          Verified supplier network
          <span className="text-gray-500 font-medium ml-1">
            ({filtered.length} supplier{filtered.length !== 1 ? 's' : ''})
          </span>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {filtered.map(s => (
            <Link key={s.id} href={`/verify/${s.id}`}>
              <div className="transition-transform hover:-translate-y-0.5 rounded-2xl">
                <SupplierTrustCard supplier={s} />
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm font-medium bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
              No suppliers match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}