'use client';

import { MapPin, ShieldCheck, CreditCard, Wallet } from 'lucide-react';
import Link from 'next/link';

interface SupplierProps {
  supplier: {
    id: string;
    name: string;
    state: string; // Changed from category
    country: string;
    payment_method: string;
    trust_level: string; // Used instead of verified
  };
}

export function SupplierCard({ supplier }: SupplierProps) {
  const isWeb3 = supplier.payment_method?.includes('Freighter') || false;
  const isVerified = supplier.trust_level === 'premium' || supplier.trust_level === 'verified';

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {supplier.name}
            {isVerified && (
              <span title="NAFDAC Verified on-chain">
                <ShieldCheck size={18} className="text-blue-600" />
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{supplier.state}</p>
        </div>
      </div>

      <div className="space-y-3 mt-auto pt-5 border-t border-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} className="text-gray-400" />
          <span className="font-medium">{supplier.country}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {isWeb3 ? <Wallet size={16} className="text-blue-500" /> : <CreditCard size={16} className="text-emerald-500" />}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide
            ${isWeb3 ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}
          >
            {supplier.payment_method}
          </span>
        </div>
      </div>

      <Link 
        href={`/marketplace/${supplier.id}`}
        className="w-full mt-6 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold py-2.5 rounded-xl text-sm transition-colors block text-center"
      >
        View Inventory
      </Link>
    </div>
  );
}