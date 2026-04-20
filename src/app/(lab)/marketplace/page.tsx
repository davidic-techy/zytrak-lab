'use client';

import { useState } from 'react';
import { Search, MapPin, Globe2, Layers } from 'lucide-react';
import { MOCK_SUPPLIERS } from '@/lib/mock-data';
import { SupplierCard } from '@/components/marketplace/SupplierCard';

type FilterType = 'all' | 'local' | 'international';

export default function MarketplacePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery]   = useState('');

  const filteredSuppliers = MOCK_SUPPLIERS.filter(supplier => {
    const matchesFilter = activeFilter === 'all' || supplier.type === activeFilter;
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          supplier.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    // FIXED: Added px-4 sm:px-6 for mobile safe zones
    <div className="w-full max-w-6xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Verified Marketplace</h1>
        <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base max-w-2xl">
          Procure medical supplies and diagnostic equipment from NAFDAC-verified suppliers globally. Pay instantly using local fiat or cross-border USDC.
        </p>

        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-gray-50 p-2 rounded-2xl border border-gray-100">
          
          {/* FIXED: Tabs now stack vertically on very small screens (sm) and align side-by-side on larger screens */}
          <div className="flex flex-col sm:flex-row w-full lg:w-auto bg-gray-100/50 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeFilter === 'all' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Layers size={16} /> All
            </button>
            <button
              onClick={() => setActiveFilter('local')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeFilter === 'local' ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MapPin size={16} /> Local
            </button>
            <button
              onClick={() => setActiveFilter('international')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeFilter === 'international' ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-100' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Globe2 size={16} /> International
            </button>
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-sm outline-none"
            />
          </div>

        </div>
      </div>

      {filteredSuppliers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredSuppliers.map(supplier => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-gray-100">
          <p className="text-4xl mb-4">🔍</p>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No suppliers found</h3>
        </div>
      )}

    </div>
  );
}